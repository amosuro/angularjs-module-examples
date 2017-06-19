'use strict';

describe('SelectionValidation:onePerDay is a method that:\n', function () {
    var SelectionValidation;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;
        }));

    it('returns true if all objects have different dates but the same start time', function () {
        let obj = {
            date: 20140101,
            description: 'Poirot',
            startTime: 1800
        };

        let objArr = [
            {
                date: 20140102,
                description: 'Poirot 1',
                startTime: 1800
            }, {
                date: 20140103,
                description: 'Poirot 2',
                startTime: 1800
            }
        ];

        expect(SelectionValidation.onePerDay(obj, objArr)).toBe(true);
    });

    it('returns false if all objects dont have unique dates', function () {
        let obj = {
            date: 20140101,
            description: 'Poirot',
            startTime: 1800
        };

        let objArr = [
            {
                date: 20140101,
                description: 'Poirot 1',
                startTime: 1800
            }, {
                date: 20140102,
                description: 'Poirot 2',
                startTime: 1800
            }
        ];

        expect(SelectionValidation.onePerDay(obj, objArr)).toBe(false);
    });

    it('returns false if all the objects dont have the same start time', function () {
        let obj = {
            date: 20140101,
            description: 'Poirot',
            startTime: 1900
        };

        let objArr = [
            {
                date: 20140102,
                description: 'Poirot 1',
                startTime: 1800
            }, {
                date: 20140103,
                description: 'Poirot 2',
                startTime: 1800
            }
        ];

        expect(SelectionValidation.onePerDay(obj, objArr)).toBe(false);
    });

});
