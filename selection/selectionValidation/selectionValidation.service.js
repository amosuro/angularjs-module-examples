(function () {
    'use strict';

    function SelectionValidation(EditSettings, SELECTION_TYPES) {
        this.EditSettings = EditSettings;
        this.SELECTION_TYPES = SELECTION_TYPES;
    }

    SelectionValidation.prototype.validateProgramme = function (selectionData, previouslySelectedData) {
        if (this.EditSettings.isInRegionalMode()) {
            return this.sameRegion(selectionData, previouslySelectedData);
        } else {
            return this.onePerDayOrSameDayXOR(selectionData, previouslySelectedData);
        }
    };

    SelectionValidation.prototype.validateBreak = function (selectionData, previouslySelectedData) {
        const allSelectedData = [...[selectionData], ...previouslySelectedData];

        const startTimeIsSame = _(allSelectedData.map(selectedData => selectedData.time)).uniqBy().value().length === 1;
        const positionInProgrammeIsSame = _(allSelectedData.map(selectedData => selectedData.positionInProgramme)).uniqBy().value().length === 1;

        return startTimeIsSame && positionInProgrammeIsSame;
    };

    SelectionValidation.prototype.onePerDay = function (selectionData, previouslySelectedData) {
        const allSelectedData = previouslySelectedData;
        allSelectedData.push(selectionData);
        const areDaysUnique = _(allSelectedData.map(selectedData => selectedData.date)).uniqBy().value().length === allSelectedData.length;
        const isStartTimeTheSame = _(allSelectedData.map(selectedData => selectedData.startTime)).uniqBy().value().length === 1;
        return areDaysUnique && isStartTimeTheSame;
    };

    SelectionValidation.prototype.sameDay = function (selectionData, previouslySelectedData) {
        let startTimes = _(previouslySelectedData.map(selectedData => selectedData.date)).uniqBy().value();
        return startTimes.length === 1 && startTimes[0] === selectionData.date;
    };

    SelectionValidation.prototype.sameRegion = function (selectionData, previouslySelectedData) {
        let startTimes = _(previouslySelectedData.map(selectedData => selectedData.regionCode)).uniqBy().value();
        return startTimes.length === 1 && startTimes[0] === selectionData.regionCode;
    };

    SelectionValidation.prototype.onePerDayOrSameDayXOR = function (selectionData, previouslySelectedData) {
        var timesMatch = this.onePerDay(selectionData, previouslySelectedData);
        var datesMatch = this.sameDay(selectionData, previouslySelectedData);

        return (timesMatch || datesMatch) && !(timesMatch && datesMatch);
    };

    SelectionValidation.prototype.isValidSelection = function (selectionData, previouslySelectedData, selectionType) {
        if (selectionType === this.SELECTION_TYPES.SCHEDULE_PROGRAMME) {
            return this.validateProgramme(selectionData, previouslySelectedData);
        } else if (selectionType === this.SELECTION_TYPES.SCHEDULE_BREAK) {
            return this.validateBreak(selectionData, previouslySelectedData);
        } else {
            return true;
        }
    };

    angular.module('selection').service('SelectionValidation', SelectionValidation);
})();
