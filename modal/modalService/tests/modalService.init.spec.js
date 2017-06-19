'use strict';

describe('ModalService:init()() is a function that:\n', function() {
    var ModalService;

    beforeEach(module('modal'));
    beforeEach(inject(
        function(_ModalService_) {
            ModalService = _ModalService_;

            ModalService.isVisible = false;
        }));

    it('Sets the inner tamplate, populates the options and shows the modal', function() {
        var template = 'some/template.tpl.html';
        var options = [{a:'b'}, {c:'d'}];
        var optionsSpy = spyOn(ModalService, 'setOptions');

        ModalService.init(template, options);

        expect(ModalService.isVisible).toBe(true);
        expect(ModalService.contentTemplate).toBe(template);
        expect(optionsSpy).toHaveBeenCalledWith(options);
    });

});