'use strict';

describe('SelectionValidation:validateProgramme is a method that:\n', function () {
    var SelectionValidation, EditSettings;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_, _EditSettings_) {
            SelectionValidation = _SelectionValidation_;
            EditSettings = _EditSettings_;
        }));

    it('returns true if in regional view and selection is in same region', function(){
        spyOn(EditSettings, 'isInRegionalMode').and.callFake(() => true);
        spyOn(SelectionValidation, 'sameRegion').and.callFake( () => true);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.validateProgramme(obj, arr)).toBe(true);
        expect(SelectionValidation.sameRegion).toHaveBeenCalledWith(obj, arr);
    });

    it('returns false if in regional view and selection is not in same region', function(){
        spyOn(EditSettings, 'isInRegionalMode').and.callFake(() => true);
        spyOn(SelectionValidation, 'sameRegion').and.callFake( () => false);

        expect(SelectionValidation.validateProgramme({}, [])).toBe(false);
    });
    
    it('returns true if selection type is schedule and selection is one per day or same day', function(){
        spyOn(SelectionValidation, 'onePerDayOrSameDayXOR').and.callFake( () => true);

        var obj = {};
        var arr = [];

        expect(SelectionValidation.validateProgramme(obj, arr)).toBe(true);
        expect(SelectionValidation.onePerDayOrSameDayXOR).toHaveBeenCalledWith(obj, arr);
    });

    it('returns false if selection type is schedule and selection is not one per day or same day', function(){
        spyOn(SelectionValidation, 'onePerDayOrSameDayXOR').and.callFake( () => false);

        expect(SelectionValidation.validateProgramme({}, [])).toBe(false);
    });
});
