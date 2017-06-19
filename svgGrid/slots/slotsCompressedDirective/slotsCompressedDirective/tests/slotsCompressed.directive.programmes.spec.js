'use strict';

describe('The slots directive\n', () => {
    var programmeClickSpy;
    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) { _AuthorisedUser_.user = { username: 'CA Test User' }; }));
    beforeEach(inject(function($location) { $location.search('editMode', 'slotsCompressed') }));
    beforeEach(inject(function($rootScope, $compile, _ProgrammeRenderer_, _TimeUtils_) {
                rootScope = $rootScope;
                compile = $compile;
                $scope = $rootScope.$new();
                $scope.ProgrammeRenderer = _ProgrammeRenderer_;
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
                $scope.programmecompressedactive = true;
                
                $scope.rowHeaders = {
                    yCompressed: [
                        '18:00',
                        '19:00',
                        '20:00',
                        '21:00'
                    ],
                    yCompressedUnformatted: [
                        1800,
                        1900,
                        2000,
                        2100
                    ]
                };

                spyOn($scope.TimeUtils, 'getFormattedTime').and.returnValue('12:00');
                
            }));
    beforeEach(function() { cleanDom(); });

    it('show tvr as slot average by default', () => {
        createDirectiveCompressedSlots();
        $scope.programmecompressedactive = true;
        $scope.$digest();

        let programmeElement = d3.select('slots-compressed').selectAll('.programme-group--compressed:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.ITV.TVR.toFixed(3));
    });

    it('show tvr as slot average when currency is set to tvr', () => {
        createDirectiveCompressedSlots();
        $scope.programmecompressedactive = true;
        $scope.currency = { id : 'tvr'};
        $scope.$digest();

        let programmeElement = d3.select('slots-compressed').selectAll('.programme-group--compressed:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.ITV.TVR.toFixed(3));
    });

    it('show share as slot average when currency is set to share', () => {
        createDirectiveCompressedSlots();
        $scope.programmecompressedactive = true;
        $scope.currency = { id : 'share' };
        $scope.$digest();

        let programmeElement = d3.select('slots-compressed').selectAll('.programme-group--compressed:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        
        expect(slotAverage).toEqual(programme1.ITV.SHARE.toFixed(2));
    });

    it('show totalTvr as slot average when currency is set to totalTvr', () => {
        createDirectiveCompressedSlots();
        $scope.programmecompressedactive = true;
        $scope.currency = { id : 'totalTvr'};
        $scope.$digest();

        let programmeElement = d3.select('slots-compressed').selectAll('.programme-group--compressed:first-child');
        let slotAverage = programmeElement.selectAll('.programme__average--svg').html();
        expect(slotAverage).toEqual(programme1.TOTALTV.TVR.toFixed(3));
    });
});
