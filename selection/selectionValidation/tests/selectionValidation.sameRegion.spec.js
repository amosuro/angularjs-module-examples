'use strict';

describe('SelectionValidation:sameRegion is a method that:\n', function () {
    var SelectionValidation;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;
        }));

    it('returns true if all objects have same region code', function () {
        let obj = {
            regionCode: 'LO'
        };

        let objArr = [
            {
                regionCode: 'LO'
            }, {
                regionCode: 'LO'
            }
        ];

        expect(SelectionValidation.sameRegion(obj, objArr)).toBe(true);
    });

    it('returns false if all objects dont have same region code', function () {
        let obj = {
            regionCode: 'NO'
        };

        let objArr = [
            {
                regionCode: 'LO'
            }, {
                regionCode: 'LO'
            }
        ];

        expect(SelectionValidation.sameRegion(obj, objArr)).toBe(false);
    });

});