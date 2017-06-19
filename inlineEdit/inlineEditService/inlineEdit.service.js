(function () {
    'use strict';

    function InlineEdit($location, EditManager, EditPending, EditProgramme, ScheduleModel, TimeUtils, InlineEditTypehead, TIMERANGE) {
        this.$location = $location;
        this.EditManager = EditManager;
        this.EditPending = EditPending;
        this.EditProgramme = EditProgramme;
        this.ScheduleModel = ScheduleModel;
        this.TimeUtils = TimeUtils;
        this.InlineEditTypehead = InlineEditTypehead;
        this.TIMERANGE = TIMERANGE;
    }

    InlineEdit.prototype.applyChange = function (scenarioChunk, newValue, originalValue, changeType) {
        const validDescriptionChange = changeType === 'description' &&
            this.InlineEditTypehead.isSet() &&
            this.InlineEditTypehead.editedData.description.value !== originalValue;

        if (newValue !== originalValue || validDescriptionChange) {
            if (scenarioChunk.meta.isBreak) {
                this.applyBreakChange(scenarioChunk, newValue, changeType);
            } else {
                this.applyProgrammeChange(scenarioChunk, newValue, changeType);
            }
        } else {
            this.InlineEditTypehead.reset();
        }
    };

    InlineEdit.prototype.applyBreakChange = function (scenarioChunk, newValue, changeType) {
        const newBreak = angular.copy(scenarioChunk.meta.breakObject);
        switch (changeType) {
            case 'startTime':
                newBreak.time = parseInt(newValue);
                newBreak.originalTime = scenarioChunk.meta.breakObject.time;
                newBreak.originalDuration = scenarioChunk.meta.breakObject.duration;
                break;
            case 'breakType':
                newBreak.positionInProgramme = newValue;
                break;
            case 'duration':
                if (newValue.indexOf(':') > 0) {
                    var split = newValue.split(':');
                    newBreak.duration = parseInt(split[0]) * 60 + parseInt(split[1]);
                } else {
                    newBreak.duration = parseInt(newValue) * 60;
                }
                break;
            default:
                break;
        }


        this.EditManager.moveOrModifyBreakInListView(scenarioChunk.meta.breakObject, newBreak, scenarioChunk, changeType);
    };
    InlineEdit.prototype.applyProgrammeChange = function (scenarioChunk, newValue, changeType) {
        const editsAtStart = this.EditPending.auditTrail.length;
        const routeParams = angular.copy(this.$location.search());

        let requestParams = {
            dateFrom: scenarioChunk.context.dateFrom,
            dateTo: scenarioChunk.context.dateFrom,
            timeFrom: scenarioChunk.context.timeFrom === this.TIMERANGE.MIN ? this.TIMERANGE.MIN : this.TimeUtils.addMinutes(scenarioChunk.context.timeFrom, -1),
            timeTo: scenarioChunk.context.timeTo === this.TIMERANGE.MAX ? this.TIMERANGE.MAX : this.TimeUtils.addMinutes(scenarioChunk.context.timeTo, 1),
            area: routeParams.editStation,
            demographic: routeParams.editDemo,
            weekDays: routeParams.editWeekDays,
            pendingEdit: this.EditPending.get()
        };

        this.ScheduleModel.getSchedule(requestParams, routeParams.editScenario, true)
            .then(response => {
                var programme = response.scheduleItems.find(item => item.startTime === scenarioChunk.context.timeFrom);
                var indexOfProgramme = response.scheduleItems.indexOf(programme);

                programme.previousProgramme = response.scheduleItems[indexOfProgramme - 1];
                programme.nextProgramme = response.scheduleItems[indexOfProgramme + 1];

                let newProgramme = angular.copy(programme);


                switch (changeType) {
                    case 'startTime':
                        let difference = this.TimeUtils.differenceInMinutes(programme.startTime, programme.endTime);
                        newProgramme.startTime = parseInt(newValue);
                        newProgramme.endTime = this.TimeUtils.addMinutes(newProgramme.startTime, difference);
                        break;
                    case 'duration':
                        if (newValue.indexOf(':') > 0) {
                            var split = newValue.split(':');
                            newProgramme.endTime = this.TimeUtils.addMinutes(newProgramme.startTime, parseInt(split[0]) - 1);
                        } else {
                            newProgramme.endTime = this.TimeUtils.addMinutes(newProgramme.startTime, parseInt(newValue) - 1);
                        }
                        break;
                    case 'description':
                        newProgramme.description = this.InlineEditTypehead.editedData.description.value;
                        newProgramme.shortName = this.InlineEditTypehead.editedData.shortName.value;
                        newProgramme.categories = this.InlineEditTypehead.editedData.categories.value;

                        this.InlineEditTypehead.reset();
                        break;
                    default:
                        break;
                }

                this.EditProgramme.addScheduleItemChanges(programme, newProgramme, programme.region);
                this.EditPending.cascadeEdits(this.EditPending.auditTrail.length - editsAtStart);
                this.EditManager.EditModel.updateScenarioChunks();
            });
    };

    InlineEdit.prototype.getDuration = function (scenarioChunk) {
        return !!scenarioChunk.meta.isDurationAggregatedAcrossSubRegions ? ' - ' : this.TimeUtils.secondsToTimestring(scenarioChunk.meta.duration);
    };

    angular.module('utils').service('InlineEdit', InlineEdit);
})();
