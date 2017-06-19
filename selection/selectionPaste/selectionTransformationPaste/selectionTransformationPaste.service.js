(function () {
    'use strict';

    function SelectionTransformationPaste(Demographics, EditPending, EditDefinitions, TimeUtils, Clipboard) {
        this.Demographics = Demographics;
        this.EditPending = EditPending;
        this.EditDefinitions = EditDefinitions;
        this.TimeUtils = TimeUtils;
        this.Clipboard= Clipboard;
    }

    SelectionTransformationPaste.prototype.createTransformation = function (demoExpressionPair, scenarioChunk, breakObject) {
        let timings;

        if (breakObject) {
            timings = {
                date: scenarioChunk.context.dateFrom,
                time: breakObject.time,
                endTime: this.TimeUtils.addMinutes(breakObject.time, 4.5)
            };
        } else {
            timings = {
                date: scenarioChunk.context.dateFrom,
                time: scenarioChunk.context.timeFrom,
                endTime: scenarioChunk.isBreakScenarioChunk() ? this.TimeUtils.addMinutes(scenarioChunk.meta.breakObject.nominalEndTime, -1) : this.TimeUtils.addMinutes(scenarioChunk.context.timeTo, 1)
            };
        }
        return this.EditDefinitions.createTransformation(timings, this.Clipboard.getEditedCurrency(), demoExpressionPair.editDemo, demoExpressionPair.calculateDemo, demoExpressionPair.expression, this.Clipboard.getCalculatedCurrency(), scenarioChunk.context.region);
    };

    SelectionTransformationPaste.prototype.applyTransformations = function (transformations, scenarioChunk, callStack) {
        const firstTransformation = transformations.shift();

        if (callStack) {
            this.EditPending.addTransformation(firstTransformation, this.EditPending.AuditTrailEntry.transformationEntry);
        } else {
            this.EditPending.addTransformation(firstTransformation);
        }

        scenarioChunk.context.demographic = _.map(this.Demographics.getTradedDemos(), 'abbreviation').join(',');

        return scenarioChunk.context;
    };

    angular.module('selection').service('SelectionTransformationPaste', SelectionTransformationPaste);
})();
