'use strict';

describe('CostaCompressedRenderer:colorForCostaResult is a method that:\n', () => {
    let CostaCompressedRenderer;

    beforeEach(module('slots'));
    beforeEach(inject((_AuthorisedUser_) => _AuthorisedUser_.user = { username: 'CA Test User' }));
    beforeEach(inject((_CostaCompressedRenderer_) => {
        CostaCompressedRenderer = _CostaCompressedRenderer_;
    }));

    it('returns an uppercase string to lowercase', () => {
        expect(CostaCompressedRenderer.colorForCostaResult('UNDER')).toEqual('under');
    });
});
