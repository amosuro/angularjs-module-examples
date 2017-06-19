(function () {
    'use strict';

    function SelectionPaste(SELECTION_TYPES, Demographics, BreaksManager, EditPending, EditSettings, EditManager, EditDefinitions, TimeslotsDataProcessing, TimeUtils, Clipboard, $q, SelectionBreakPaste, SelectionSlotPaste, SchedulePaste, CollectiveProcess, ScheduleRest) {
        this.SELECTION_TYPES = SELECTION_TYPES;
        this.Demographics = Demographics;
        this.BreaksManager = BreaksManager;
        this.EditPending = EditPending;
        this.EditSettings = EditSettings;
        this.EditManager = EditManager;
        this.EditDefinitions = EditDefinitions;
        this.TimeslotsDataProcessing = TimeslotsDataProcessing;
        this.TimeUtils = TimeUtils;
        this.Clipboard = Clipboard;
        this.$q = $q;
        this.SelectionBreakPaste = SelectionBreakPaste;
        this.SelectionSlotPaste = SelectionSlotPaste;
        this.SchedulePaste = SchedulePaste;
        this.CollectiveProcess = CollectiveProcess;
        this.ScheduleRest = ScheduleRest;
    }


    SelectionPaste.prototype.handlePaste = function (targetData, targetDataType, targetCurrency) {
        const clipboardItems = this.Clipboard.paste(targetDataType === this.SELECTION_TYPES.TOTALTVR ? this.SELECTION_TYPES.TIMERANGE_AGGREGATE : targetDataType, targetCurrency);

        if (!this.isInvalidPaste(targetData, clipboardItems, targetCurrency)) {
            const promises = [];
            const contexts = [];
            const source = clipboardItems[0];
            const newTimeslots = source.timeslots;
            const editsAtStart = this.EditPending.auditTrail.length;

            if (targetDataType === this.SELECTION_TYPES.TOTALTVR) {
                this.handleTotalTvrPaste(source, targetCurrency);
            } else if (targetDataType === this.SELECTION_TYPES.SCHEDULE_PROGRAMME) {
                this.handleProgrammePaste(source, targetData, targetCurrency, contexts, promises);
            } else if (targetDataType === this.SELECTION_TYPES.SCHEDULE_DAY) {
                this.handleDayPaste(source, targetData, targetCurrency, contexts, promises);
            } else {
                this.handleRowPaste(source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises);
            }

            this.EditPending.costaReloadNeeded = true;

            this.CollectiveProcess.execute(promises, 'edit').then(() => {
                const [earliestDate, latestDate, earliestTime, latestTime] = this.EditManager.EditModel.getContextRanges(contexts);

                if (targetDataType === this.SELECTION_TYPES.SCHEDULE_PROGRAMME || targetDataType === this.SELECTION_TYPES.SCHEDULE_DAY) {
                    this.EditManager.reloadSchedule(earliestDate, latestDate, earliestTime, latestTime);
                    this.EditPending.cascadeEdits(this.EditPending.auditTrail.length - editsAtStart);
                } else {
                    const fixingNegativesPromises = [];

                    fixingNegativesPromises.push(this.resolveNegativeBreakTvrs(targetData, earliestDate, latestDate, earliestTime, latestTime));
                    fixingNegativesPromises.push(this.resolveNegativeProgrammeTvrs(targetData, earliestDate, latestDate, earliestTime, latestTime));

                    this.CollectiveProcess.execute(fixingNegativesPromises, 'edit').then(() => {
                        this.EditManager.reloadSchedule(earliestDate, latestDate, earliestTime, latestTime, {
                            dateFrom: earliestDate,
                            dateTo: latestDate
                        });

                        this.EditPending.cascadeEdits(this.EditPending.auditTrail.length - editsAtStart);
                    });
                }
            });
        }
    };

    SelectionPaste.prototype.isInvalidPaste = function (targetData, clipboardItems, targetCurrency) {
        return !targetData.length || !clipboardItems.length || targetCurrency.id !== 'totalTvr' && targetCurrency.id !== 'tvr';
    };

    SelectionPaste.prototype.handleTotalTvrPaste = function (source, targetCurrency) {
        if (targetCurrency.id === 'totalTvr') {
            this.EditManager.copyTotalTvr(source.compItems);
        }
    };

    SelectionPaste.prototype.handleProgrammePaste = function (source, targetData, targetCurrency, contexts, promises) {
        targetData.forEach(targetRow => contexts.push(targetRow.data.scenarioChunkContext));
        contexts.push(source.scenarioChunkContext); // in case we have to move source breaks
        promises.push(this.SchedulePaste.handleScheduleProgrammePaste(source, targetData, targetCurrency));
    };

    SelectionPaste.prototype.handleDayPaste = function (source, targetData, targetCurrency, contexts, promises) {
        targetData.forEach(targetRow => contexts.push(targetRow.data.context));
        contexts.push(source.context); // in case we have to move source breaks
        promises.push(this.SchedulePaste.handleScheduleProgrammePaste(source, targetData, targetCurrency));
    };

    SelectionPaste.prototype.handleRowPaste = function (source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises) {
        targetData.forEach(targetRow => {
            const scenarioChunk = targetRow.data;
            const newRatings = this.TimeslotsDataProcessing.extractCurrency(newTimeslots, targetCurrency);

            contexts.push(scenarioChunk.context);

            if (targetCurrency.id === 'totalTvr' && scenarioChunk.isBreakScenarioChunk()) {
                return;
            }

            if (scenarioChunk.isBreakScenarioChunk()) {
                promises.push(this.SelectionBreakPaste.handleBreakPaste(scenarioChunk, newRatings, targetCurrency, scenarioChunk.meta.breakObject));
            } else if (scenarioChunk.isProgrammeScenarioChunk()) {
                promises.push(this.SelectionSlotPaste.handleSlotPaste(targetDataType, source, scenarioChunk, newRatings, targetCurrency));
            }
        });
    };

    SelectionPaste.prototype.resolveNegativeBreakTvrs = function (targetData, earliestDate, latestDate, earliestTime, latestTime) {

        var chunk = targetData[0].data;

        var calculatedDemo = chunk.context.region === 'I4' ? 'WOMEN' : 'MEN';
        var affectedDemo = chunk.context.region === 'I4' ? 'MEN' : 'WOMEN';

        var defer = this.$q.defer();

        const requestParams = {
            dateFrom: earliestDate,
            dateTo: latestDate,
            timeFrom: earliestTime,
            timeTo: latestTime,
            area: chunk.context.region,
            demographic: calculatedDemo,
            weekDays: '1,2,3,4,5,6,7',
            pendingEdit: this.EditPending.get()
        };

        this.BreaksManager.getBreaks(requestParams, chunk.context.scenarioId).then(response => {
            response.breaks.forEach(theBreak => {
                if (theBreak.ratings[calculatedDemo] < 0) {
                    var timings = {
                        date: theBreak.date,
                        time: theBreak.time,
                        endTime: theBreak.nominalEndTime
                    };

                    var editedCurrency = 'tvr';
                    var lockedCurrency = this.Clipboard.getCalculatedCurrency();

                    var transformation = this.EditDefinitions.createTransformation(timings, editedCurrency, calculatedDemo, affectedDemo, '0', lockedCurrency, chunk.context.region);
                    this.EditPending.addTransformation(transformation);
                }
            });

            defer.resolve();
        });

        return defer.promise;
    };

    SelectionPaste.prototype.resolveNegativeProgrammeTvrs = function (targetData, earliestDate, latestDate, earliestTime, latestTime) {

        var chunk = targetData[0].data;
        var calculatedDemo = chunk.context.region === 'I4' ? 'WOMEN' : 'MEN';
        var affectedDemo = chunk.context.region === 'I4' ? 'MEN' : 'WOMEN';

        var requestParams = {
            area: chunk.context.region,
            dateFrom: earliestDate,
            dateTo: latestDate,
            timeFrom: earliestTime,
            timeTo: latestTime,
            demographics: calculatedDemo,
            granularity: 'DEMOGRAPHIC',
            weekDays: '1,2,3,4,5,6,7',
            channels: {
                ITV: ['TVR']
            }
        };

        var defer = this.$q.defer();
        const returnRegions = this.EditSettings.isInProgrammeMode();

        this.ScheduleRest.getForScenario(requestParams, this.EditPending.get(), chunk.context.scenarioId, returnRegions).then(response => {
            response.scheduleItems.forEach(item => {
                if (item[calculatedDemo].ITV.TVR < 0) {
                    var timings = {
                        date: item.date,
                        time: item.startTime,
                        endTime: item.endTime
                    };

                    var editedCurrency = 'tvr';
                    var lockedCurrency = this.Clipboard.getCalculatedCurrency();

                    var transformation = this.EditDefinitions.createTransformation(timings, editedCurrency, calculatedDemo, affectedDemo, '0', lockedCurrency, chunk.context.region);
                    this.EditPending.addTransformation(transformation);
                }
            });
            defer.resolve();
        });
        return defer.promise;
    };

    angular.module('selection').service('SelectionPaste', SelectionPaste);
})();
