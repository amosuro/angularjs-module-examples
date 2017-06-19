(function () {
    'use strict';

    function SlotsCompressedLink($scope, $element) {
        let slotsNode = _.head($element),
            slots = d3.select(slotsNode),
            slotsNodeName = slotsNode.localName,
            svg = slots.append('svg'),
            programmes = svg.append('g').attr('id', `${slotsNodeName}__programmes`),
            breaks = svg.append('g').attr('id', `${slotsNodeName}__breaks`),
            costaHours = svg.append('g').attr('id', `${slotsNodeName}__costa`).attr('class', `${slotsNodeName}__costa`);

        $scope.$on('svgDataUpdated', (event, args) => {
            let searchObject = $scope.$location.search();
            let isVisible = searchObject.editMode === 'slotsCompressed';
            
            if (isVisible && (args.reason === 'reloadAllScenarioChunks' || args.reason === 'toggleCompressedDisplay' || args.reason === 'resetDifferencesForAllScenarioChunks')) {
                resizeSvg();
                $scope.ProgrammeCompressedRenderer.processData($scope.scenarioChunks);
                $scope.ProgrammeCompressedRenderer.repaintProgrammes(programmes, $scope.currency, $scope.programmecompressedactive, $scope.TABLE_LAYOUT, slotsNodeName);

                $scope.CostaCompressedRenderer.processData($scope.scenarioChunks);
                $scope.CostaCompressedRenderer.repaintCosta(costaHours, $scope.granularity, $scope.currency, $scope.TABLE_LAYOUT);

                $scope.BreakCompressedRenderer.processData($scope.scenarioChunks, $scope.rowHeaders.yCompressedUnformatted, $scope.TABLE_LAYOUT);
                $scope.BreakCompressedRenderer.repaintBreaks(breaks, $scope.TABLE_LAYOUT);
            }
        });

        $scope.$watch('currency', (newVal, oldVal) => {
           if (oldVal && newVal.id !== oldVal.id) {
               $scope.ProgrammeCompressedRenderer.changeCurrency(newVal, slotsNodeName);
           }
        });
        

        $scope.$watch('programmecompressedactive', (newVal, oldVal) => {
           if (!_.isUndefined(oldVal) && newVal !== oldVal) {
               $scope.ProgrammeCompressedRenderer.repaintProgrammeContent(programmes, $scope.currency, $scope.programmecompressedactive, $scope.TABLE_LAYOUT, slotsNodeName);
           }
        });

        function resizeSvg() {
            const height = $scope.rowHeaders.yCompressed ? $scope.rowHeaders.yCompressed.length * $scope.TABLE_LAYOUT.CELL.NARROW_HEIGHT : 0;
            svg.attr('width', $scope.scenarioChunks.length * $scope.TABLE_LAYOUT.CELL.WIDE_WIDTH).attr('height', height);
        }
    }

    function SlotsCompressedDirectiveController($scope, $location, ScheduleDataParser, ProgrammeCompressedRenderer, BreakCompressedRenderer, CostaCompressedRenderer, TABLE_LAYOUT) {
        $scope.ProgrammeCompressedRenderer = ProgrammeCompressedRenderer;
        $scope.BreakCompressedRenderer = BreakCompressedRenderer;
        $scope.CostaCompressedRenderer = CostaCompressedRenderer;
        $scope.ScheduleDataParser = ScheduleDataParser;
        $scope.$location = $location;
        $scope.TABLE_LAYOUT = TABLE_LAYOUT;
    }

    function SlotsCompressedDirective() {
        return {
            restrict: 'E',
            require: 'ngModel',
            link: SlotsCompressedLink,
            controller: SlotsCompressedDirectiveController,
            scope: {
                scenarioChunks: '=ngModel',
                currency: '=currency',
                kpi: '=kpi',
                programmecompressedactive: '=programmecompressedactive',
                costamodeactive: '=costamodeactive',
                isreadonly: '=',
                rowHeaders: '=rowHeaders'
            }
        };
    }

    angular.module('slots').directive('slotsCompressed', SlotsCompressedDirective);
    angular.module('slots').controller('SlotsCompressedDirectiveController', SlotsCompressedDirectiveController);
})();
