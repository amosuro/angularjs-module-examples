'use strict';

describe('SvgGrid:pixelsPerMinuteFor is a method that:\n', function() {
    var SvgGrid;

    beforeEach(module('svgGrid'));
    beforeEach(inject(
        function(_SvgGrid_) {
            SvgGrid = _SvgGrid_;
        }));

    it('calculates the pixel per minute ratio for each granularity', function() {
        expect(SvgGrid.pixelsPerMinuteFor('MIN')).toBe(30);
        expect(SvgGrid.pixelsPerMinuteFor('MIN5')).toBe(6);
        expect(SvgGrid.pixelsPerMinuteFor('MIN15')).toBe(2);
        expect(SvgGrid.pixelsPerMinuteFor('MIN30')).toBe(1);
        expect(SvgGrid.pixelsPerMinuteFor('HOUR')).toBe(0.5);
        expect(SvgGrid.pixelsPerMinuteFor(undefined)).toBe(30);
    });


});