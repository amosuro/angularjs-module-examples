'use strict';

describe('SelectionValidation:sameDay is a method that:\n', function () {
    var SelectionValidation;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;
        }));

    it('returns true if all objects have same start time', function () {
        let obj = {
            date: 20140101
        };

        let objArr = [
            {
                date: 20140101
            }, {
                date: 20140101
            }
        ];

        expect(SelectionValidation.sameDay(obj, objArr)).toBe(true);
    });

    it('returns false if all objects dont have same start time', function () {
        let obj = {
            date: 20140102
        };

        let objArr = [
            {
                date: 20140101
            }, {
                date: 20140101
            }
        ];

        expect(SelectionValidation.sameDay(obj, objArr)).toBe(false);
    });

});