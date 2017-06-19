'use strict';

describe('SelectionValidation:isValidSelection is a method that:\n', function () {
    let SelectionValidation;
    let selectionData, previouslySelectedData;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionValidation_) {
            SelectionValidation = _SelectionValidation_;

            selectionData = 'mock selectionData';
            previouslySelectedData = 'mock previouslySelectedData';
        }));

    it('calls validateProgramme method if selection type equals SCHEDULE_PROGRAMME', function(){
        const selectionType = SelectionValidation.SELECTION_TYPES.SCHEDULE_PROGRAMME;
        spyOn(SelectionValidation, 'validateProgramme');

        SelectionValidation.isValidSelection(selectionData, previouslySelectedData, selectionType);

        expect(SelectionValidation.validateProgramme).toHaveBeenCalledWith(selectionData, previouslySelectedData);
    });

    it('calls validateBreak method if selection type is equal to SCHEDULE_BREAK', function(){
        const selectionType = SelectionValidation.SELECTION_TYPES.SCHEDULE_BREAK;
        spyOn(SelectionValidation, 'validateBreak');

        SelectionValidation.isValidSelection(selectionData, previouslySelectedData, selectionType);

        expect(SelectionValidation.validateBreak).toHaveBeenCalledWith(selectionData, previouslySelectedData);
    });

    it('calls does not call validateBreak or validateProgramme if selection type is not SCHEDULE_BREAK or SCHEDULE_PROGRAMME', function(){
        const selectionType = 'something-else';
        spyOn(SelectionValidation, 'validateBreak');
        spyOn(SelectionValidation, 'validateProgramme');

        SelectionValidation.isValidSelection(selectionData, previouslySelectedData, selectionType);

        expect(SelectionValidation.validateBreak).not.toHaveBeenCalled();
        expect(SelectionValidation.validateProgramme).not.toHaveBeenCalled();
        expect(SelectionValidation.isValidSelection(selectionData, previouslySelectedData, selectionType)).toEqual(true);
    });
});
