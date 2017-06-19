(function () {
    'use strict';

    function SelectionBreakPaste(CollectiveProcess, Demographics, BreaksManager, BreakMove, EditPending, EditSettings, EditDefinitions, EditModel, TimeslotsDataProcessing, TimeUtils, Clipboard, $q, SelectionTransformationPaste) {
        this.CollectiveProcess = CollectiveProcess;
        this.Demographics = Demographics;
        this.BreaksManager = BreaksManager;
        this.BreakMove = BreakMove;
        this.EditPending = EditPending;
        this.EditSettings = EditSettings;
        this.EditDefinitions = EditDefinitions;
        this.EditModel = EditModel;
        this.TimeslotsDataProcessing = TimeslotsDataProcessing;
        this.TimeUtils = TimeUtils;
        this.Clipboard = Clipboard;
        this.$q = $q;
        this.SelectionTransformationPaste = SelectionTransformationPaste;
    }

    SelectionBreakPaste.prototype.handleBreakPaste = function (destinationScenarioChunk, newRatings, currency, updatedBreak) {

        if (updatedBreak) {
            let deferred = this.$q.defer();
            let newBreak = angular.copy(updatedBreak);
            this.BreakMove.moveBreak(updatedBreak, newBreak, destinationScenarioChunk).then(() => {
                destinationScenarioChunk.loadBreaksByDemo(destinationScenarioChunk.getRequestParams()).then((breaksByDemo) => {
                    const originalRatings = breaksByDemo.map((breakDemo) => breakDemo.tvr);

                    const generateTransformations = (scenarioChunk, oldRatings, newRatings) => {
                        var demoPairs = this.TimeslotsDataProcessing.markDemosForTimeslots(oldRatings, newRatings, scenarioChunk.regionCode);
                        return demoPairs.map(p => this.SelectionTransformationPaste.createTransformation(p, scenarioChunk, newBreak));
                    };

                    const transformations = generateTransformations(destinationScenarioChunk, originalRatings, newRatings);
                    this.applyBreak(transformations, destinationScenarioChunk.regionCode);

                    return deferred.resolve();
                });
            });

            return deferred.promise;
        } else {
            const generateTransformations = (scenarioChunk, oldRatings, newRatings) => {
                var demoPairs = this.TimeslotsDataProcessing.markDemosForTimeslots(oldRatings, newRatings, scenarioChunk.regionCode);
                return demoPairs.map(p => this.SelectionTransformationPaste.createTransformation(p, scenarioChunk));
            };

            let deferred = this.$q.defer();
            var actualTimeslots = destinationScenarioChunk.getActualTimeslots();

            actualTimeslots.then(oldTimeslots => {
                var transformations = generateTransformations(destinationScenarioChunk, this.TimeslotsDataProcessing.extractCurrency(oldTimeslots, currency), newRatings);
                this.applyBreak(transformations, destinationScenarioChunk.regionCode);
                deferred.resolve();
            });

            return deferred.promise;
        }
    };

    SelectionBreakPaste.prototype.applyBreak = function (transformations, regionCode) {
        const inverseTransformation = (transformation, editDemo, calculateDemo) => {

            if (this.EditDefinitions.isFactorExpression(transformation.expression)) {
                let inverseTransformation = angular.copy(transformation);
                inverseTransformation.editDemo = editDemo;
                inverseTransformation.calculateDemo = calculateDemo;
                inverseTransformation.expression = this.EditDefinitions.inverseExpression(transformation.expression);

                this.EditPending.addTransformation(inverseTransformation);
            }
        };

        transformations.forEach(transformation => {
            this.EditPending.addTransformation(transformation);
            if (transformation.editDemo === 'CHILDS') {
                inverseTransformation(transformation, 'CHIL49', 'CHIL1015');
            } else if (transformation.editDemo === 'ADULTS') {
                inverseTransformation(transformation, 'AD1654', 'AD55PL');
                inverseTransformation(transformation, 'HWIVES', 'NOTHW');
                inverseTransformation(transformation, 'AD1624', 'AD25PL');
                inverseTransformation(transformation, 'AD1634', 'AD35PL');
                inverseTransformation(transformation, 'ADABC1', 'ADC2DE');

                if (regionCode === 'I4') {
                    inverseTransformation(transformation, 'MEN', 'WOMEN');
                } else {
                    inverseTransformation(transformation, 'WOMEN', 'MEN');
                }
            } else if (transformation.editDemo === 'HWIVES') {
                inverseTransformation(transformation, 'HWSCHD', 'HWNCH');
                inverseTransformation(transformation, 'HW1654', 'HW55PL');
                inverseTransformation(transformation, 'HWABC1', 'HWC2DE');
            } else if (transformation.editDemo === 'ADABC1') {
                inverseTransformation(transformation, 'WOABC1', undefined);
                inverseTransformation(transformation, 'MEABC1', undefined);
            } else if (transformation.editDemo === 'AD1634') {
                inverseTransformation(transformation, 'WO1634', undefined);
                inverseTransformation(transformation, 'ME1634', undefined);
            }
        });
    };

    angular.module('selection').service('SelectionBreakPaste', SelectionBreakPaste);
})();
