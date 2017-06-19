'use strict';

describe('SelectionValidation:validateBreak is a method that:\n', function () {
    let SelectionValidation;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;
        }));

    it('returns true if startTime and positionInProgramme for all items match', function(){
        const selectedData = {time: 900, positionInProgramme: 'C'};
        const previouslySelectedData = [{time: 900, positionInProgramme: 'C'}, {time: 900, positionInProgramme: 'C'}, {time: 900, positionInProgramme: 'C'}];

        expect(SelectionValidation.validateBreak(selectedData, previouslySelectedData)).toEqual(true);
    });

    it('returns false if there is a unique startTime within the items', function(){
        const selectedData = {time: 900, positionInProgramme: 'C'};
        const previouslySelectedData = [{time: 1000, positionInProgramme: 'C'}, {time: 900, positionInProgramme: 'C'}, {time: 900, positionInProgramme: 'C'}];

        expect(SelectionValidation.validateBreak(selectedData, previouslySelectedData)).toEqual(false);
    });

    it('returns false if there is a unique positionInProgramme within the items', function(){
        const selectedData = {time: 900, positionInProgramme: 'C'};
        const previouslySelectedData = [{time: 900, positionInProgramme: 'C'}, {time: 900, positionInProgramme: 'P'}, {time: 900, positionInProgramme: 'C'}];

        expect(SelectionValidation.validateBreak(selectedData, previouslySelectedData)).toEqual(false);
    });
});
