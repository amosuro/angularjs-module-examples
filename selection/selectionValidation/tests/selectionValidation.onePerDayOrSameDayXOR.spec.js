'use strict';

describe('SelectionValidation:onePerDayOrSameDayXOR is a method that:\n', function () {
    var SelectionValidation;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;
        }));

    it('returns true if only start times match', function () {
        spyOn(SelectionValidation, 'onePerDay').and.callFake( () => true);
        spyOn(SelectionValidation, 'sameDay').and.callFake( () => false);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.onePerDayOrSameDayXOR(obj, arr)).toBe(true);
        expect(SelectionValidation.onePerDay).toHaveBeenCalledWith(obj, arr);
        expect(SelectionValidation.sameDay).toHaveBeenCalledWith(obj, arr);
    });

    it('returns true if only dates match', function () {
        spyOn(SelectionValidation, 'onePerDay').and.callFake( () => false);
        spyOn(SelectionValidation, 'sameDay').and.callFake( () => true);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.onePerDayOrSameDayXOR(obj, arr)).toBe(true);
        expect(SelectionValidation.onePerDay).toHaveBeenCalledWith(obj, arr);
        expect(SelectionValidation.sameDay).toHaveBeenCalledWith(obj, arr);
    });

    it('returns false if both match', function () {
        spyOn(SelectionValidation, 'onePerDay').and.callFake( () => true);
        spyOn(SelectionValidation, 'sameDay').and.callFake( () => true);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.onePerDayOrSameDayXOR(obj, arr)).toBe(false);
        expect(SelectionValidation.onePerDay).toHaveBeenCalledWith(obj, arr);
        expect(SelectionValidation.sameDay).toHaveBeenCalledWith(obj, arr);
    });

    it('returns false if none match', function () {
        spyOn(SelectionValidation, 'onePerDay').and.callFake( () => false);
        spyOn(SelectionValidation, 'sameDay').and.callFake( () => false);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.onePerDayOrSameDayXOR(obj, arr)).toBe(false);
        expect(SelectionValidation.onePerDay).toHaveBeenCalledWith(obj, arr);
        expect(SelectionValidation.sameDay).toHaveBeenCalledWith(obj, arr);
    });


});