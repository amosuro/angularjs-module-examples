'use strict';

describe('BreakRenderer:repaintSingleBreak is a method that:\n', function() {
    let BreakRenderer;
    let breaks, abreak, breaksdisplayactive, TABLE_LAYOUT;

    beforeEach(module('slots'));
    beforeEach(inject(
        function(_BreakRenderer_, _TABLE_LAYOUT_) {
            BreakRenderer = _BreakRenderer_;
            TABLE_LAYOUT = _TABLE_LAYOUT_;

            renderSvg();
            breaks = appendBreak();

            abreak = {
                positionInProgramme: 'C',
                isLocked: false,
                isEdited: false
            };

            breaksdisplayactive = false;
        }));

    afterEach(function() {
        removeSvg();
    });

    it('calls showEditBreakLabels if break has been edited', function() {
        spyOn(BreakRenderer, 'showEditBreakLabels');
        spyOn(BreakRenderer, 'breakIdFor').and.returnValue('test_break');

        abreak.isEdited = true;

        BreakRenderer.repaintSingleBreak(breaks, abreak, false, TABLE_LAYOUT);

        expect(BreakRenderer.showEditBreakLabels).toHaveBeenCalled();
    });

    it('calls showLargeBreakLabels if breaksdisplayactive is true', function() {
        spyOn(BreakRenderer, 'showLargeBreakLabels');
        spyOn(BreakRenderer, 'breakIdFor').and.returnValue('test_break');

        BreakRenderer.repaintSingleBreak(breaks, abreak, true, TABLE_LAYOUT);

        expect(BreakRenderer.showLargeBreakLabels).toHaveBeenCalled();
    });

    it('calls showSmallBreakLabels if break has not been edited and breaksdisplayactive is false', function() {
        spyOn(BreakRenderer, 'showSmallBreakLabels');
        spyOn(BreakRenderer, 'breakIdFor').and.returnValue('test_break');

        BreakRenderer.repaintSingleBreak(breaks, abreak, false, TABLE_LAYOUT);

        expect(BreakRenderer.showSmallBreakLabels).toHaveBeenCalled();
    });
});