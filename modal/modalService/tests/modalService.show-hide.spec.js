'use strict';

describe('ModalService has show and hide methods where:\n', function() {
    var ModalService;

    beforeEach(module('modal'));
    beforeEach(inject(
        function(_ModalService_) {
            ModalService = _ModalService_;
        }));

    it('The show method triggers the visibility on', function() {
        ModalService.isVisible = false;
        ModalService.show();
        expect(ModalService.isVisible).toBe(true);
    });

});