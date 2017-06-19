(function () {
    'use strict';

    function SlotsLink($scope, $element) {
        let slotsNode = _.head($element),
            slots = d3.select(slotsNode),
            slotsNodeName = slotsNode.localName,
            svg = slots.append('svg'),
            programmes = svg.append('g').attr('id', `${slotsNodeName}__programmes`),
            breaks = svg.append('g').attr('id', `${slotsNodeName}__breaks`),
            costaHours = svg.append('g').attr('id', `${slotsNodeName}__costa`).attr('class', `${slotsNodeName}__costa`);

        $scope.renderEventEmitter = $scope.Analytics.editRender(slotsNodeName);

        $scope.ProgrammeRenderer.setupProgrammeClick(programmes, $scope.isreadonly);
        $scope.BreakRenderer.setupBreakClick(breaks, $scope.isreadonly);

        $scope.$watch('isreadonly', function(newVal, oldVal){
            if (!_.isUndefined(oldVal) && newVal !== oldVal) {
                $scope.TimeSlotRenderer.isreadonly = newVal;
                $scope.ProgrammeRenderer.setupProgrammeClick(programmes, newVal);
                $scope.BreakRenderer.setupBreakClick(breaks, newVal);
            }
        });

        $scope.$on('svgDataUpdated', (event, args) => {
            let searchObject = $scope.$location.search();
            let isVisible = searchObject.editMode === 'slots';

            if(isVisible && (args.reason === 'reloadAllScenarioChunks' || args.reason === 'resetDifferencesForAllScenarioChunks')) {
                resizeSvg();
                $scope.TimeSlotRenderer.processData($scope.scenarioChunks);
                $scope.TimeSlotRenderer.repaintTimeSlots(slotsNodeName, $scope.programmeeditactive, $scope.granularity, $scope.currency, $scope.TABLE_LAYOUT, $scope.isreadonly, $scope.kpi);

                $scope.ProgrammeRenderer.processData($scope.scenarioChunks);
                $scope.ProgrammeRenderer.repaintProgrammes(programmes, $scope.granularity, $scope.currency, $scope.programmeeditactive, $scope.TABLE_LAYOUT, slotsNodeName);

                $scope.CostaRenderer.processData($scope.scenarioChunks, $scope.TABLE_LAYOUT);
                $scope.CostaRenderer.repaintCosta(costaHours, $scope.granularity, $scope.currency, $scope.TABLE_LAYOUT);
                
                $scope.BreakRenderer.processData($scope.scenarioChunks);
                $scope.BreakRenderer.repaintBreaks(breaks, $scope.breaksdisplayactive, $scope.granularity, $scope.TABLE_LAYOUT);
            }
        });

        $scope.$watch('currency', (newVal, oldVal) => {
            if (oldVal && newVal.id !== oldVal.id) {
                $scope.TimeSlotRenderer.changeCurrency(newVal, slotsNodeName);
                $scope.ProgrammeRenderer.changeCurrency(newVal, slotsNodeName);
            }
        });

        $scope.$watch('kpi', (newVal, oldVal) => {
            if (oldVal && newVal.id !== oldVal.id) {
                $scope.TimeSlotRenderer.repaintTimeSlots(slotsNodeName, $scope.programmeeditactive, $scope.granularity, $scope.currency, $scope.TABLE_LAYOUT, $scope.isreadonly, $scope.kpi);
            }
        });

        $scope.$watch('programmeeditactive', (newVal, oldVal) => {
            if (!_.isUndefined(oldVal) && newVal !== oldVal) {
                $scope.TimeSlotRenderer.repaintTimeSlots(slotsNodeName, newVal, $scope.granularity, $scope.currency, $scope.TABLE_LAYOUT, $scope.isreadonly, $scope.kpi);
                $scope.ProgrammeRenderer.repaintProgrammeContent(programmes, $scope.currency, $scope.programmeeditactive, $scope.TABLE_LAYOUT, slotsNodeName);
            }
        });

        $scope.$watch('breaksdisplayactive', (newVal, oldVal) => {
            if (!_.isUndefined(oldVal) && newVal !== oldVal) {
                $scope.BreakRenderer.repaintBreakContent(breaks, newVal, $scope.TABLE_LAYOUT);
            }
        });

        $scope.$watch('BreakRenderer.activeBreak', (changedBreak, oldBreak) => {
            if((changedBreak && changedBreak.isEdited) || (oldBreak && oldBreak.isEdited && !changedBreak.isEdited)) {
                $scope.BreakRenderer.repaintSingleBreak(breaks, changedBreak, $scope.breaksdisplayactive, $scope.TABLE_LAYOUT);
            }
        }, true);

        function resizeSvg() {
            const firstChunk = _.head($scope.scenarioChunks),
                  height = firstChunk ? firstChunk.timeslots.length * $scope.TABLE_LAYOUT.CELL.HEIGHT : 0;
            svg.attr('width', $scope.scenarioChunks.length * $scope.TABLE_LAYOUT.CELL.WIDE_WIDTH).attr('height', height);
        }
    }

    function SlotsDirectiveController($scope, $location, ScheduleDataParser, TimeSlotRenderer, ProgrammeRenderer, BreakRenderer, CostaRenderer, Analytics, TABLE_LAYOUT) {
        $scope.TimeSlotRenderer = TimeSlotRenderer;
        $scope.ProgrammeRenderer = ProgrammeRenderer;
        $scope.BreakRenderer = BreakRenderer;
        $scope.CostaRenderer = CostaRenderer;
        $scope.ScheduleDataParser = ScheduleDataParser;
        $scope.Analytics = Analytics;
        $scope.$location = $location;
        $scope.TABLE_LAYOUT = TABLE_LAYOUT;
    }

    function SlotsDirective() {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: SlotsLink,
            controller: SlotsDirectiveController,
            scope: {
                scenarioChunks: '=ngModel',
                currency: '=currency',
                kpi: '=kpi',
                programmeeditactive: '=programmeeditactive',
                breaksdisplayactive: '=breaksdisplayactive',
                granularity: '=',
                isreadonly: '=',
                costamodeactive: '=costamodeactive'
            }
        };
    }

    angular.module('slots').directive('slots', SlotsDirective);
    angular.module('slots').controller('SlotsDirectiveController', SlotsDirectiveController);
})();
