'use strict';

describe('ModalService:cancel is a function that:\n', function() {
    var ModalService;

    beforeEach(module('modal'));
    beforeEach(inject(
        function(_ModalService_) {
            ModalService = _ModalService_;
        }));

    it('Closes the modal', function() {
        ModalService.isVisible = true;
        ModalService.cancel();
        expect(ModalService.isVisible).toBe(false);
    });

});