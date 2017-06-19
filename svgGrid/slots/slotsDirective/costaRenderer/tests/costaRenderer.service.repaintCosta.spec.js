'use strict';

describe('CostaRenderer:repaintCosta is a method that:\n', () => {
    let CostaRenderer;
    let costaHours, granularity, currency, TABLE_LAYOUT;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {
        _AuthorisedUser_.user = { username: 'CA Test User' };
    }));
    beforeEach(inject(function(_CostaRenderer_, _TABLE_LAYOUT_) {
        CostaRenderer = _CostaRenderer_;
        TABLE_LAYOUT = _TABLE_LAYOUT_;

        renderSvg();
        costaHours = appendCostaHour();

        granularity = 'HOUR';
        currency = {};

        CostaRenderer.costaData = [
            { result: 'UNDER' }
        ];
    }));

    afterEach(function() {
        removeSvg();
    });
    
    it('sets costaGroups to the costa D3 elements', () => {
        CostaRenderer.repaintCosta(costaHours, granularity, currency, TABLE_LAYOUT);

        expect(CostaRenderer.costaGroups.length).toEqual(1);
    });
});
