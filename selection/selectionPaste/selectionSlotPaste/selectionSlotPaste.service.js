(function () {
    'use strict';

    function SelectionSlotPaste(CollectiveProcess, Demographics, BreaksManager, EditPending, EditSettings, EditDefinitions, CopyPasteUtils, TimeslotsDataProcessing, TimeUtils, Clipboard, $q, SelectionTransformationPaste, SelectionBreakPaste, ProgrammeDetails, DEMOPAIRS, ComparisonAggregates) {
        this.CollectiveProcess = CollectiveProcess;
        this.Demographics = Demographics;
        this.BreaksManager = BreaksManager;
        this.EditPending = EditPending;
        this.EditSettings = EditSettings;
        this.EditDefinitions = EditDefinitions;
        this.TimeslotsDataProcessing = TimeslotsDataProcessing;
        this.CopyPasteUtils = CopyPasteUtils;
        this.TimeUtils = TimeUtils;
        this.Clipboard = Clipboard;
        this.$q = $q;
        this.SelectionTransformationPaste = SelectionTransformationPaste;
        this.SelectionBreakPaste = SelectionBreakPaste;
        this.ProgrammeDetails = ProgrammeDetails;
        this.DEMOPAIRS = DEMOPAIRS;
        this.ComparisonAggregates = ComparisonAggregates;
    }


    SelectionSlotPaste.prototype.handleSlotPaste = function (dataType, sources, destinationScenarioChunk, newRatings, currency) {
        var _root = this;
        let deferred = this.$q.defer();
        var destinationSlot = asSlot(destinationScenarioChunk);
        var isTVRCurrency = currency.id === 'tvr';

        var sourceSlot = asSlot(sources);
        var editsAtStart = this.EditPending.auditTrail.length;

        const breaks = isTVRCurrency ? this.pasteComparisonBreaks(sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk, newRatings) : this.$q.when();

        breaks.then(breaks => {
            var transformations = getTransformations(destinationScenarioChunk, destinationSlot, newRatings, currency, breaks);
            transformations.forEach(trans => this.EditPending.addTransformation(trans));

            this.Clipboard.empty(dataType);
            this.EditPending.cascadeEdits(this.EditPending.auditTrail.length - editsAtStart);

            deferred.resolve();

        });

        function asSlot(chunkOrSource) {
            return {
                date: !!chunkOrSource.context ? chunkOrSource.context.dateFrom : chunkOrSource.date,
                startTime: !!chunkOrSource.context ? chunkOrSource.context.timeFrom : chunkOrSource.timeFrom,
                endTime: !!chunkOrSource.context ? chunkOrSource.context.timeTo : chunkOrSource.timeTo
            };
        }

        function getTransformations(scenarioChunk, destinationSlot, newRatings, currency, reloadedBreaks) {
            reloadedBreaks = reloadedBreaks || [];
            var currencyToEdit = currency.id === 'totalTvr' ? 'TOTALTV,TVR' : 'ITV,TVR';
            var demoPairs = scenarioChunk.regionCode !== 'I4' ? _root.DEMOPAIRS.defaultOrderedDemoPairsForSlots : _root.DEMOPAIRS.alternativeOrderedDemoPairsForSlots;

            var reloadedBreakChunksInSlot = _root.ProgrammeDetails.getBreakScenarioChunksInProgramme(destinationSlot);

            return demoPairs.map(p => {
                var index = _root.Demographics.demographics.filter(d => d.traded).findIndex(d => d.abbreviation === p[0]);
                destinationSlot.requestedAverage = newRatings[index];

                var breaks = reloadedBreaks.length ? _(reloadedBreakChunksInSlot).map(chunk => {
                    var theBreak = chunk.meta.breakObject;
                    theBreak.fullMinuteAverage = reloadedBreaks.find(b => b.time === chunk.context.timeFrom).fullMinuteAverages[p[0]];
                    return theBreak;
                }).value() : [];

                var ratingsWithoutBreaks = _root.CopyPasteUtils.calculateSlotAverageExcludingBreaks(destinationSlot, breaks);

                return _root.EditDefinitions.createFlattenSlotTransformation(ratingsWithoutBreaks,
                    p[0],
                    p[1],
                    currencyToEdit,
                    'ITV,SHARE',
                    scenarioChunk.context.region,
                    destinationSlot,
                    breaks);

            });
        }

        return deferred.promise;
    };

    SelectionSlotPaste.prototype.pasteComparisonBreaks = function (sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk, newSlotRatings) {
        var _root = this;

        const sourceBreakScenarioChunks = this.ProgrammeDetails.getBreakScenarioChunksInProgramme(sourceSlot),
            targetBreakScenarioChunks = this.ProgrammeDetails.getBreakScenarioChunksInProgramme(destinationSlot),
            targetEndAndCentreScenarioChunks = _(targetBreakScenarioChunks).partition(sc => sc.meta.breakObject.positionInProgramme === 'E').value(),
            sourceEndAndCentreScenarioChunks = _(sourceBreakScenarioChunks).partition(sc => sc.meta.breakObject.positionInProgramme === 'E').value(),
            demographicsInOrder = this.Demographics.demographics.filter(d => d.traded);

        // centre
        var targetCentreBreakChunks = targetEndAndCentreScenarioChunks[1];
        var sourceCentreBreakChunks = sourceEndAndCentreScenarioChunks[1];
        var centreBreakAvgRatings = !!sources.centreBreakAvgRatings ? sources.centreBreakAvgRatings : {};
        var centrePromises = pasteBreaksWithNewRatings(sources, sourceCentreBreakChunks, targetCentreBreakChunks, centreBreakAvgRatings, 'C', currency);

        // end
        var targetEndBreakChunks = targetEndAndCentreScenarioChunks[0];
        var sourceEndBreakChunks = sourceEndAndCentreScenarioChunks[0];
        var endBreakRatings = !!sources.endBreakRatings ? sources.endBreakRatings : {};

        var endPromises = pasteBreaksWithNewRatings(sources, sourceEndBreakChunks, targetEndBreakChunks, endBreakRatings, 'E', currency);

        var deferred = this.$q.defer();
        this.$q.all(centrePromises.concat(endPromises)).then(p => {
            var requestParams = {
                dateFrom: destinationSlot.date,
                dateTo: destinationSlot.date,
                timeFrom: destinationSlot.startTime,
                timeTo: destinationSlot.endTime,
                demographic: this.Demographics.demographics.filter(d => d.traded).map(d => d.abbreviation).join(','),
                area: destinationScenarioChunk.context.region,
                pendingEdit: this.EditPending.get()
            };

            this.BreaksManager.getBreaks(requestParams, destinationScenarioChunk.context.scenarioId).then(response => deferred.resolve(response.breaks));
        });

        return deferred.promise;

        function pasteBreaksWithNewRatings(sources, sourceBreakChunks, destinationBreakChunks, averageBreakRatings, breakType, currency) {
            var breakRatingsInOrder;
            if (!!Object.keys(averageBreakRatings).length) {
                breakRatingsInOrder = _(demographicsInOrder).map(d => averageBreakRatings[d.abbreviation]).value();
            } else if (sources.aggregationGroupId) {
                var aggregationGroup = _root.ComparisonAggregates.aggregateGroups.find(group => !!group.find(aggregation => aggregation.aggregationGroupId === sources.aggregationGroupId));
                var matching = aggregationGroup.filter(a => a.type === breakType);
                if (matching.length > 0) {
                    breakRatingsInOrder = matching[0].timeslots.map(t => t.ITV[currency.label]).filter(t => !isNaN(t));
                }
                else {
                    breakRatingsInOrder = adjustedBreaksToMaintainOriginalBreakFactor(destinationScenarioChunk, destinationSlot, currency, destinationBreakChunks);
                }
            }
            else if (sourceCentreBreakChunks.length > 0) {
                breakRatingsInOrder = averageTimeslots(sourceBreakChunks);
            }
            else {
                breakRatingsInOrder = adjustedBreaksToMaintainOriginalBreakFactor(destinationScenarioChunk, destinationSlot, currency, destinationBreakChunks);
            }
            var breakPromises = !!breakRatingsInOrder.length ? _(destinationBreakChunks).map(sc => _root.SelectionBreakPaste.handleBreakPaste(sc, breakRatingsInOrder, currency, false)).value() : [];
            return breakPromises;
        }

        function averageTimeslots(chunks) {
            if (!!!chunks.length) {
                return [];
            }

            return chunks[0].timeslots.map(t => {
                var index = (chunks[0].timeslots.indexOf(t));
                return chunks.map(c => c.timeslots[index].ITV.TVR)
                        .reduce((a, b) => a + b, 0) / chunks.length;
            });
        }

        function adjustedBreaksToMaintainOriginalBreakFactor(destinationScenarioChunk, destinationSlot, currency, destinationBreakChunks) {
            var originalBreakFactors = computeBreakFactor(destinationScenarioChunk, destinationSlot, currency, destinationBreakChunks);
            return _(newSlotRatings).zipWith(originalBreakFactors, function (slotRating, breakFactor) {
                return slotRating * breakFactor;
            }).value();
        }

        function computeBreakFactor(destinationScenarioChunk, destinationSlot, currency, breakChunks) {
            if (breakChunks.length === 0) {
                return [];
            }

            var timeslots = _(breakChunks).map(chunk => _root.TimeslotsDataProcessing.extractCurrency(chunk.timeslots, currency)).value();

            var summedTimeslots = _(timeslots).reduce(function (acc, a) {
                return _(acc).zipWith(a, function (a,b) {
                    return a+b ;
                }).value(); }, new Array(timeslots[0].length).fill(0)
            );

            var averageBreakTimeslots = _(summedTimeslots).map(t => t / timeslots.length).value();

            var slotTimeslots = _root.TimeslotsDataProcessing.extractCurrency(destinationScenarioChunk.timeslots, currency);

            return _(slotTimeslots).zipWith(averageBreakTimeslots, function (slotValue, breakValue) {
                if (slotValue === 0) { return 0; }
                else { return breakValue / slotValue; }
            }).value();
        }

    };

    angular.module('selection').service('SelectionSlotPaste', SelectionSlotPaste);
})();
