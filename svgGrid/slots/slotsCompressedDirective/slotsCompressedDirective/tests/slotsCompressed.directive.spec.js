'use strict';

describe('The slots directive\n', () => {
    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));

    beforeEach(inject(function ($rootScope, $compile) {
                compile = $compile;
                $scope = $rootScope.$new();
                scenarioChunk1 = { context: { granularity: 'MIN5'}, timeslotsDifference: [] };
                $scope.scenarioChunks = [scenarioChunk1];
                $scope.currency = { label : 'TVR', id : 'tvr'};
            }
        )
    );

    it('Has an SVG element rendered inside', () => {
        createDirective();
        expect($(compiledElement).children('svg'))
            .toBeDefined();
    });
});
