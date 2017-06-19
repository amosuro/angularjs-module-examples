'use strict';

describe('CostaCompressedRenderer:setCostaHourHeight is a method that:\n', () => {
    let CostaCompressedRenderer;
    let hour;

    beforeEach(module('slots'));
    beforeEach(inject((_AuthorisedUser_) => _AuthorisedUser_.user = { username: 'CA Test User' }));
    beforeEach(inject((_CostaCompressedRenderer_) => {
        CostaCompressedRenderer = _CostaCompressedRenderer_;

        CostaCompressedRenderer.EditModel.headers.yCompressed = ['9:33', '9:40', '9:59'];
    }));

    it('returns correct height for costa hour', () => {
        hour = { startTime: 900 };
        expect(CostaCompressedRenderer.setCostaHourHeight(hour)).toEqual(60);

        hour = { startTime: 800 };
        expect(CostaCompressedRenderer.setCostaHourHeight(hour)).toEqual(0);

        hour = { startTime: 1800 };
        CostaCompressedRenderer.EditModel.headers.yCompressed = ['18:02', '18:23', '18:26', '18:40', '19:23'];
        expect(CostaCompressedRenderer.setCostaHourHeight(hour)).toEqual(80);

        hour = { startTime: 1900 };
        CostaCompressedRenderer.EditModel.headers.yCompressed = [];
        expect(CostaCompressedRenderer.setCostaHourHeight(hour)).toEqual(0);
    });
});
