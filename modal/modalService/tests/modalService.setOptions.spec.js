'use strict';

describe('ModalService:setOptions() is a function that:\n', function() {
    var ModalService;

    var option1 = {
        label: 'label1',
        action: function() {}
    };

    var option2 = {
        label: 'label2',
        action: function() {}
    };

    beforeEach(module('modal'));
    beforeEach(inject(
        function(_ModalService_) {
            ModalService = _ModalService_;
        }));

    it('Sets the available button options, appending cancel to the positive option', function() {
        var options = [option1, option2];
        ModalService.setOptions(options);


        expect(ModalService.options.positive.label).toBe(option1.label);
        expect(ModalService.options.negative).toBe(option2);


        var spy = spyOn(ModalService, 'cancel');
        ModalService.options.positive.action();
        expect(spy).toHaveBeenCalled();


    });

    it('Sets the negative option if not defined', function() {
        ModalService.options.negative = undefined;
        var options = [option1];

        ModalService.setOptions(options);

        expect(ModalService.options.negative).toBe(ModalService.defaults.negative);
    });

});