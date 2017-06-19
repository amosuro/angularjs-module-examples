'use strict';

describe('The slots directive\n', () => {
    var programmeClickSpy;
    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) { _AuthorisedUser_.user = { username: 'CA Test User' }; }));
    beforeEach(inject(function($location) { $location.search('editMode', 'slots'); }));
    beforeEach(inject(function($rootScope, $compile, _BreakRenderer_, _ProgrammeRenderer_, _CostaRenderer_) {
                rootScope = $rootScope;
                compile = $compile;
                $scope = $rootScope.$new();
                $scope.BreakRenderer = _BreakRenderer_;
                $scope.ProgrammeRenderer = _ProgrammeRenderer_;
                $scope.CostaRenderer = _CostaRenderer_;

                programmeClickSpy = spyOn($scope.ProgrammeRenderer,'programmeClick').and.callThrough();

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
            }));
    beforeEach(function() { cleanDom(); });

    it('in readonly mode don\'t allow editing programmes', () => {
        createDirective('MIN5', true);
        var programmeElement = d3.select('slots').selectAll('#slots__programmes');
        programmeElement.data([programme1]);
        fireEventOnElement('contextmenu', programmeElement);
        expect(programmeClickSpy).not.toHaveBeenCalled();
    });

    it('in edit mode allow editing programmes', () => {
        createDirective('MIN5', false);
        var programmeElement = d3.select('slots').selectAll('#slots__programmes');
        programmeElement.data([programme1]);
        fireEventOnElement('contextmenu', programmeElement);
        expect(programmeClickSpy).toHaveBeenCalled();
    });

    it('shows the programme context menu when clicking on a programme', () => {
        createDirective('MIN5', false);
        var broadcastSpy = spyOn(rootScope, '$broadcast');

        var programmeElement = d3.select('slots').selectAll('#slots__programmes');
        programmeElement.data([programme1]);
        let event = fireEventOnElement('contextmenu', programmeElement);

        var eventData = {
            context: 'programme',
            affectedObject: [programme1],
            event: event,
            scenarioChunk: [$scope.scenarioChunks[0]]
        };
        expect(broadcastSpy).toHaveBeenCalledWith('slotsRightClick', eventData);
    });

    it('on setting programmeeditactive mode to true show expanded programme view with average and airtime', () => {
        createDirective('MIN5', true);
        $scope.programmeeditactive = true;
        $scope.$digest();

        var programmeElement = d3.select('slots').selectAll('.programme-group:first-child');

        expect(programmeElement.selectAll('.programme__average--svg').empty()).toBeFalsy();
        expect(programmeElement.selectAll('.programme__airtime--svg').empty()).toBeFalsy();

        $scope.programmeeditactive = false;
        $scope.$digest();

        expect(programmeElement.selectAll('.programme__average--svg').empty()).toBeTruthy();
        expect(programmeElement.selectAll('.programme__airtime--svg').empty()).toBeTruthy();
    });

    it('don\'t show programmes when granularity is DAY', () => {
        createDirective('DAY', false);

        $scope.programmeeditactive = true;
        $scope.$digest();

        var programmeElement = d3.select('slots').selectAll('.programme-group:first-child');

        expect(programmeElement.empty()).toBeTruthy();
    });

    it('show tvr as slot average by default', () => {
        createDirective();
        $scope.programmeeditactive = true;
        $scope.$digest();

        let programmeElement = d3.select('slots').selectAll('.programme-group:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.ITV.TVR.toFixed(3));
    });

    it('show tvr as slot average when currency is set tot tvr', () => {
        createDirective();
        $scope.programmeeditactive = true;
        $scope.currency = { id : 'tvr'};
        $scope.$digest();

        let programmeElement = d3.select('slots').selectAll('.programme-group:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.ITV.TVR.toFixed(3));
    });

    it('show share as slot average when currency is set tot share', () => {
        createDirective();
        $scope.programmeeditactive = true;
        $scope.currency = { id : 'share'};
        $scope.$digest();

        let programmeElement = d3.select('slots').selectAll('.programme-group:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.ITV.SHARE.toFixed(2));
    });

    it('show totalTvr as slot average when currency is set tot totalTvr', () => {
        createDirective();
        $scope.programmeeditactive = true;
        $scope.currency = { id : 'totalTvr'};
        $scope.$digest();

        let programmeElement = d3.select('slots').selectAll('.programme-group:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.TOTALTV.TVR.toFixed(3));
    });
});
