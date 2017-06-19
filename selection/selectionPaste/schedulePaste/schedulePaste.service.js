(function () {
    'use strict';

    function SchedulePaste(EditPending, EditDefinitions, TimeUtils, ProgrammeDetails, EditModel, EditFilters, EditLock, TimeslotsRest, GRANULARITY, $q, RestApi, Demographics, BreaksManager, CollectiveProcess, Clipboard, BreakDetails, Stations, BreakMove, FEATURE_TOGGLES) {
        this.EditPending = EditPending;
        this.EditDefinitions = EditDefinitions;
        this.TimeUtils = TimeUtils;
        this.ProgrammeDetails = ProgrammeDetails;
        this.EditModel = EditModel;
        this.EditFilters = EditFilters;
        this.EditLock = EditLock;
        this.TimeslotsRest = TimeslotsRest;
        this.GRANULARITY = GRANULARITY;
        this.Demographics = Demographics;
        this.BreaksManager = BreaksManager;
        this.$q = $q;
        this.RestApi = RestApi;
        this.CollectiveProcess = CollectiveProcess;
        this.Clipboard = Clipboard;
        this.BreakDetails = BreakDetails;
        this.Stations = Stations;
        this.BreakMove = BreakMove;
        this.FEATURE_TOGGLES = FEATURE_TOGGLES;
    }

    SchedulePaste.prototype.handleScheduleProgrammePaste = function (originalSourceData, originalTargets, targetCurrency) {
        var targets = [];
        var sourceData = originalSourceData;
        originalTargets.forEach(target => {
            var data = target.data;
            if (data.col === undefined) {
                data = {
                    date: data.context.dateFrom,
                    startTime: data.context.timeFrom,
                    regionCode: data.context.region
                };
            }

            targets.push({data: data});
        });

        let editsAtStart = this.EditPending.auditTrail.length;

        let currencySource = targetCurrency.id === 'totalTvr' ? 'TOTALTV' : 'ITV';


        var sourceScenarioChunk = sourceData.col >= 0 ? this.EditModel.scenarioChunks[sourceData.col] : sourceData;

        if (sourceScenarioChunk === sourceData) {

            sourceData = {
                date: sourceData.context.dateFrom,
                startTime: sourceData.context.timeFrom,
                endTime: sourceData.context.timeTo,
                duration: this.TimeUtils.differenceInMinutes(sourceData.context.timeFrom, sourceData.context.timeTo)
            };

        }

        var requestParams = sourceScenarioChunk.getRequestParams();
        var deferred = this.$q.defer();

        this.CollectiveProcess.executeSingle(this.adjustOriginalBreaks(sourceData, sourceScenarioChunk, requestParams.scenarioId), 'edit').then(() => {
            //part of new way of pasting - do not remove
            var promises = [];

            targets.forEach(targetRow => {
                var targetData = targetRow.data;
                let targetEndTime = this.TimeUtils.addMinutes(targetData.startTime, sourceData.duration - 1);
                let targetTimings = {
                    date: targetData.date,
                    endDate: targetData.date,
                    time: targetData.startTime,
                    endTime: targetEndTime < targetData.startTime ? this.TimeUtils.TIMERANGE.MAX : targetEndTime
                };

                let calcCurrency = 'share';
                if (this.EditLock.selected.id === 'share') {
                    calcCurrency = targetCurrency.id === 'tvr' ? 'totalTvr' : 'tvr';
                }

                promises.push(this.createTimeslotTransformations(targetTimings, currencySource, calcCurrency, targetCurrency, requestParams.area, sourceData));
                this.createScheduleReference(sourceData, targetData);
            });

            this.CollectiveProcess.execute(promises, 'edit').then(() => {
                deferred.resolve();
            });
        });

        return deferred.promise;
    };

    SchedulePaste.prototype.createTimeslotTransformations = function (timings, currencySource, calcCurrency, targetCurrency, area, sourceData) {
        var transformation = this.EditDefinitions.createTransformation(timings,
            targetCurrency.id,
            'ANY',
            null,
            '[' + this.TimeUtils.dateAsIntToExpressionFormat(sourceData.date) + ' ' + sourceData.startTime + ' s]',
            calcCurrency,
            area
        );
        transformation.appliesToAllRegions = true;
        this.EditPending.addTransformation(transformation);
    };

    SchedulePaste.prototype.createScheduleReference = function (sourceData, targetData) {
        var minutesShift = this.TimeUtils.differenceInMinutes(sourceData.startTime, targetData.startTime);
        let targetEndTime = this.TimeUtils.addMinutes(sourceData.endTime, minutesShift);

        var scheduleReference = {
            sourceDate: sourceData.date,
            targetDate: targetData.date,
            startTime: parseInt(targetData.startTime),
            endTime: minutesShift > 0 && targetEndTime < sourceData.endTime ? this.TimeUtils.TIMERANGE.MAX : targetEndTime,
            region: targetData.regionCode,
            minuteShift: minutesShift
        };
        this.EditPending.addScheduleReference(scheduleReference);
    };


    SchedulePaste.prototype.adjustOriginalBreaks = function (sourceData, sourceScenarioChunk, scenarioId) {

        var deferred = this.$q.defer();


        const requestParams = {
            date: sourceData.date,
            startTime: sourceData.startTime,
            endTime: sourceData.endTime,
            region: sourceScenarioChunk.regionCode,
            scenarioId: scenarioId

        };
        this.BreakMove.alignBreaks(requestParams).then(() => {
            deferred.resolve();
        }).catch(() => deferred.reject());
        return deferred.promise;


    };

    SchedulePaste.prototype.schedulePasteRest = function (sourceData, requestParams) {

        var parameters = {
            date: requestParams.dateFrom,
            timeFrom: sourceData.startTime,
            timeTo: sourceData.endTime,
            demographic: requestParams.demographic,
            area: requestParams.area,
            channels: requestParams.channels
        };

        return this.RestApi.post('/schedulePaste/' + requestParams.scenarioId, this.EditPending.get(), parameters);
    };

    SchedulePaste.prototype.deleteOriginalBreaks = function (response, targetData, scenarioId, sourceData) {

        var deferred = this.$q.defer();
        this.EditPending.costaReloadNeeded = false;

        var targetRegion = targetData.regionCode;
        var subRegions = this.Stations.flatten(targetRegion);
        subRegions.push(targetRegion);

        var requestParams = {
            dateFrom: targetData.date,
            dateTo: targetData.date,
            timeFrom: targetData.startTime,
            timeTo: this.TimeUtils.addMinutes(targetData.startTime, sourceData.duration - 1),
            demographic: this.Demographics.demographics.filter(d => d.traded).map(d => d.abbreviation).join(','),
            area: _(subRegions).join(','),
            pendingEdit: this.EditPending.get(),
            shouldShowRegionalBreakDifferences: false

        };
        var breaksResponse = this.BreaksManager.getBreaks(requestParams, scenarioId, undefined, true);
        breaksResponse.then(breaks => {
            breaks.breaks.forEach(toDelete => {
                if (toDelete.time >= targetData.startTime) {
                    toDelete.status = 'DELETED';
                    this.EditPending.addBreak(toDelete);
                }
            });
            deferred.resolve();
        });

        return deferred.promise;
    };


    SchedulePaste.prototype.insertNewBreaks = function (sourceData, targetData, scenarioId, destinationScenarioChunk, breaks) {

        var minutesShift = this.TimeUtils.differenceInMinutes(sourceData.startTime, targetData.startTime);
        var deferred = this.$q.defer();

        breaks.forEach(breakToMap => {

            var newBreak = {
                area: breakToMap.area,
                date: targetData.date,
                duration: breakToMap.duration,
                isEdited: true,
                positionInProgramme: breakToMap.positionInProgramme,
                status: 'ADDED',
                time: this.TimeUtils.addMinutes(breakToMap.time, minutesShift),
                actualTime: this.TimeUtils.addMinutes(breakToMap.time, minutesShift),
                ratingStatus: breakToMap.ratingStatus
            };

            this.EditPending.addBreak(newBreak);

        });
        deferred.resolve();

        return deferred.promise;
    };

    angular.module('selection').service('SchedulePaste', SchedulePaste);
})();