'use strict';

describe('BreakRenderer:insertBreak is a method that:\n', () => {
    let BreakRenderer;

    beforeEach(module('slots'));
     beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));
    beforeEach(inject(function(_BreakRenderer_) { BreakRenderer = _BreakRenderer_; }));

    beforeEach(inject(function($rootScope)  {
        $scope = $rootScope.$new();
    }));


    it('that inserts a break in the edit view', () => {
        var abreak = { id : 'hi', created : new Date(), isEdited : true };

        expect(BreakRenderer.breakData.length).toBe(0);
        BreakRenderer.insertBreak(abreak, {});
        $scope.$digest();

        expect(BreakRenderer.breakData.length).toBe(1);
        expect(BreakRenderer.activeBreak.id).toBe('hi');
    });
});