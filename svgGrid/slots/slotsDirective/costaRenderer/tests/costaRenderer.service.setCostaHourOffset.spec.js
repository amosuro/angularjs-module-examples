'use strict';

describe('CostaRenderer:setCostaHourOffset is a method that:\n', () => {
    let CostaRenderer;

    beforeEach(module('slots'));
    beforeEach(inject((_AuthorisedUser_) => _AuthorisedUser_.user = { username: 'CA Test User' }));
    beforeEach(inject((_CostaRenderer_) => {
        CostaRenderer = _CostaRenderer_;
    }));

    it('should return 0 if the dayPartStartTime is greater than the given startTime', () => {
        const startTime = 900;
        const dayPartStartTime = 1100;
        const pixelsPerMinute = 6;

        expect(CostaRenderer.setCostaHourOffset(startTime, dayPartStartTime, pixelsPerMinute)).toBe(0);
    });

    it('should return the pixel per minute offset based on the first costa hour', () => {
        const startTime = 900;
        const dayPartStartTime = 800;
        const pixelsPerMinute = 6;

        expect(CostaRenderer.setCostaHourOffset(startTime, dayPartStartTime, pixelsPerMinute)).toBe(360);
    });
});
