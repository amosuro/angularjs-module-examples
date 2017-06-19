'use strict';

describe('CostaCompressedRenderer:repaintCosta is a method that:\n', () => {
    let CostaCompressedRenderer;
    let costaHours, granularity, currency, TABLE_LAYOUT;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {
        _AuthorisedUser_.user = { username: 'CA Test User' };
    }));
    beforeEach(inject(function(_CostaCompressedRenderer_, _TABLE_LAYOUT_) {
        CostaCompressedRenderer = _CostaCompressedRenderer_;
        TABLE_LAYOUT = _TABLE_LAYOUT_;

        renderSvg();
        costaHours = appendCostaHour();

        granularity = 'HOUR';
        currency = {};

        CostaCompressedRenderer.costaData = [
            { result: 'UNDER' }
        ];
    }));

    afterEach(function() {
        removeSvg();
    });
    
    it('sets costaGroups to the costa D3 elements', () => {
        CostaCompressedRenderer.repaintCosta(costaHours, granularity, currency, TABLE_LAYOUT);

        expect(CostaCompressedRenderer.costaGroups.length).toEqual(1);
    });
});
