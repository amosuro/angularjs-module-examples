'use strict';
describe('The slots directive\n', () => {

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));
    beforeEach(inject(function($location) {
        $location.search('editMode', 'slots');
    }));

    beforeEach(inject(function($rootScope, $compile, _BreakRenderer_, _ProgrammeRenderer_, _CostaRenderer_, _TimeUtils_) {
                rootScope = $rootScope;
                compile = $compile;
                $scope = $rootScope.$new();
                $scope.BreakRenderer = _BreakRenderer_;
                $scope.ProgrammeRenderer = _ProgrammeRenderer_;
                $scope.CostaRenderer = _CostaRenderer_;
                $scope.TimeUtils = _TimeUtils_;

                scenarioChunk1 = { context: { granularity: 'MIN5'} };
                scenarioChunk1.timeslots = [];
                scenarioChunk1.timeslotsDifference = [];
                scenarioChunk1.programmes = [];
                scenarioChunk1.breaks = [];
                scenarioChunk1.costa = { hour: {} };
                scenarioChunk1.regionCode = 'LO';

                $scope.scenarioChunks = [scenarioChunk1];
                $scope.currency = { label : 'TVR', id : 'tvr'};
                $scope.programmeeditactive = false;
                $scope.breaksdisplayactive =  false;
                
                spyOn($scope.CostaRenderer, 'repaintCosta');
                spyOn($scope.CostaRenderer, 'processData');
                spyOn($scope.TimeUtils, 'getFormattedTime').and.returnValue('12:00');
            }
        )
    );

    beforeEach(function() { cleanDom(); });

    it('shows the break context menu when clicking on a break', () => {
        createDirective('MIN5', false);
        var broadcastSpy = spyOn(rootScope, '$broadcast');

        var breaksElement = d3.select('slots').selectAll('#slots__breaks');
        breaksElement.data([break1]);
        let event = fireEventOnElement('contextmenu', breaksElement);

        var eventData = {
            context: 'break',
            affectedObject: break1,
            event: event,
            scenarioChunk: scenarioChunk1
        };
        expect(broadcastSpy).toHaveBeenCalledWith('slotsRightClick', eventData);
    });

    it('on setting breaksdisplayactive mode to true show expanded break view', () => {
        createDirective('MIN5', false);
        $scope.breaksdisplayactive = true;
        $scope.$digest();

        var breakElement = d3.select('slots').selectAll('.break-group:first-child');

        expect(breakElement.selectAll('.break-group__duration').empty()).toBeFalsy();
        expect(breakElement.selectAll('.break-group__tvr-shape').empty()).toBeFalsy();
        expect(breakElement.selectAll('.break-group__tvr-text').empty()).toBeFalsy();

        $scope.breaksdisplayactive = false;
        $scope.$digest();

        expect(breakElement.selectAll('.break-group__duration').empty()).toBeTruthy();
        expect(breakElement.selectAll('.break-group__tvr-shape').empty()).toBeTruthy();
        expect(breakElement.selectAll('.break-group__tvr-text').empty()).toBeTruthy();
    });

    it('insert a new break and paint it correctly in edit mode(blue)', () => {
        createDirective('MIN5', false);
        spyOn($scope.BreakRenderer, 'repaintSingleBreak');

        let newBreak = { id : 'hi', created : new Date(), isEdited : true, region:'LO', scenarioChunkContext: { region : 'LO' }};
        $scope.BreakRenderer.insertBreak(newBreak, {});
        $scope.$digest();

        expect($scope.BreakRenderer.repaintSingleBreak).toHaveBeenCalled();
    });

    it('repaint single break and show LargeBreakLabels when breaksdisplayactive is true', () => {
        createDirective('MIN5', false);
        $scope.breaksdisplayactive = true;
        $scope.$digest();

        var newBreak = {positionInProgramme: 'C', isEdited: false, date: 20151228};
        $scope.BreakRenderer.insertBreak(newBreak, $scope.scenarioChunks[0]);

        var newBreakElement = d3.select('slots').selectAll('.break-group:last-child');

        expect(newBreakElement.selectAll('.break-group__duration').empty()).toBeFalsy();
        expect(newBreakElement.selectAll('.break-group__tvr-shape').empty()).toBeFalsy();
        expect(newBreakElement.selectAll('.break-group__tvr-text').empty()).toBeFalsy();
    });
});
