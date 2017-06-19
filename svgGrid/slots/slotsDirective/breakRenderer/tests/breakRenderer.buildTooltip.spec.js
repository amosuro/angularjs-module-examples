'use strict';

describe('BreakRenderer:buildTooltip is a method that:\n', function() {
    let BreakRenderer;
    let aBreak;

    beforeEach(module('slots'));
    beforeEach(inject(
        function(_BreakRenderer_) {
            BreakRenderer = _BreakRenderer_;

            aBreak = {
                date: 20160101,
                positionInProgramme: 'C',
                time: 1800,
                actualTime: 1801,
                duration: 210,
                tvr: 1
            };
        }));

    it('returns a tooltip for a break which is part of a linked scenario', function() {
        const expectedTooltip = `20160101 C break\nNom start time: 1800\nAct start time: 1801\nDuration: 3:30\nTVR: 1\nLinked to:\n\nwoo in ITV1`;

        aBreak.linkedScenarioInfo = [
            {
                name: 'woo',
                station: 'ITV1'
            }
        ];

        expect(BreakRenderer.buildTooltip(aBreak)).toEqual(expectedTooltip);
    });

    it('returns a tooltip for a break which has regional break differences', function() {
        const expectedTooltip = `20160101 C break\nNom start time: 1800\nAct start time: 1801\n\nBreak has regional differences`;

        aBreak.isRegionalDifferenceMarker = true;

        expect(BreakRenderer.buildTooltip(aBreak)).toEqual(expectedTooltip);
    });

    it('returns a tooltip for a break which has a narrative', function() {
        const expectedTooltip = `20160101 C break\nNom start time: 1800\nAct start time: 1801\nDuration: 3:30\nTVR: 1\nNarrative: hey look at me!`;

        aBreak.narrative = 'hey look at me!';

        expect(BreakRenderer.buildTooltip(aBreak)).toEqual(expectedTooltip);
    });
});