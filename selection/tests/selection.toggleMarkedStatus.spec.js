'use strict';

describe('Selection:toggleMarkedStatus is a method that:\n', function () {
    let Selection, SelectionModel, SELECTION_TYPES, KeyControl;
    
    let programmeByDemoHeader,
        programmeByDemoCell,
        programmeData,
        programmeDataWrapped,
        breakDemoHeader, 
        breakDemoCell,
        breakData,
        breakDataWrapped,
        previouslySelectedDemoHeader, 
        previouslySelectedDemoCell,
        previouslySelectedData,
        previouslySelectedDataWrapped,
        currency;
        
    let wrapper;

    const SELECTED_CLASS = 'is-selected',
        SELECTABLE_ATTRIBUTE = 'data-selectable';
        
    function appendElementsToDocument(elements) {
        elements.forEach(element => {
            wrapper.appendChild(element);
        });
    }

    beforeEach(module('selection'));
    beforeEach(inject(
        function(_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        })); 
    beforeEach(inject(
        function (_Selection_, _SelectionModel_, _SELECTION_TYPES_, _KeyControl_) {
            Selection = _Selection_;
            SelectionModel = _SelectionModel_;
            SELECTION_TYPES = _SELECTION_TYPES_;
            KeyControl = _KeyControl_;
        }));

    beforeEach(() => {
        // SETUP
        // the wrapper contains all the test dom elements we apply in the tests
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        
        // PROGRAMME DOM ELEMENTS
        programmeByDemoHeader = document.createElement('div');
        programmeByDemoHeader.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        programmeByDemoHeader.setAttribute('data-selectable-row', 'editProgrammeMode_0');
        programmeByDemoCell = document.createElement('span');
        programmeByDemoCell.setAttribute('data-selectable-row', 'editProgrammeMode_0');

        // PROGRAMME DATA
        programmeData = {timeslots: []};
        programmeDataWrapped = {data: programmeData, type: SELECTION_TYPES.PROGRAMME_DEMO, currency: currency};

        //BREAK DOM ELEMENTS
        breakDemoHeader = document.createElement('div');
        breakDemoHeader.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.BREAK_DEMO);
        breakDemoHeader.setAttribute('data-selectable-row', 'editProgrammeMode_1');
        breakDemoCell = document.createElement('span');
        breakDemoCell.setAttribute('data-selectable-row', 'editProgrammeMode_1');

        // BREAK DATA
        breakData = {timeslots: []};
        breakDataWrapped = {data: breakData, type: SELECTION_TYPES.BREAK_DEMO, currency: currency};

        //PREVIOUSLY SELECTED DOM ELEMENTS 
        previouslySelectedDemoHeader = document.createElement('div');
        previouslySelectedDemoHeader.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        previouslySelectedDemoHeader.setAttribute('data-selectable-row', 'editProgrammeMode_2');
        previouslySelectedDemoHeader.classList.add(SELECTED_CLASS);
        previouslySelectedDemoCell = document.createElement('span');
        previouslySelectedDemoCell.setAttribute('data-selectable-row', 'editProgrammeMode_2');
        previouslySelectedDemoCell.classList.add(SELECTED_CLASS);

        // PREVIOUSLY SELECTED DATA
        previouslySelectedData = {timeslots: []};
        previouslySelectedDataWrapped = {data: previouslySelectedData, type: SELECTION_TYPES.PROGRAMME_DEMO, currency: currency};
        
        // Set currently selected currency
        currency = {name: 'example currency'};
        spyOn(Selection, 'getSelectedCurrency').and.returnValue(currency);
    });
    
    afterEach(() => {
        // the wrapper contains all the test dom elements we apply in the tests, so we need to reset it after every test
        document.body.removeChild(wrapper);
    });
        
    it('If the selected element is already selected and command key is not pressed, it keeps it selected', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];
        
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => false);
        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(previouslySelectedDemoHeader, previouslySelectedData, [previouslySelectedData], previouslySelectedDataWrapped.type, previouslySelectedDataWrapped.type);
        
        expect(previouslySelectedDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(true);
        expect(SelectionModel.selectedElements).toEqual([previouslySelectedDataWrapped]);
    });

    it('If the selected element is already selected and command key is pressed, it unselects it', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];
        
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(previouslySelectedDemoHeader, previouslySelectedData, [previouslySelectedData], previouslySelectedDataWrapped.type, previouslySelectedDataWrapped.type);

        expect(previouslySelectedDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(false);
        expect(SelectionModel.selectedElements).toEqual([]);
    });

    it('If the selected element is not selected yet and command key is not pressed, it selects it', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell, programmeByDemoHeader, programmeByDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];
        
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => false);
        spyOn(Selection, 'getElementData').and.callFake(() => {});
        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(programmeByDemoHeader, programmeData, [previouslySelectedData], programmeDataWrapped.type, previouslySelectedDataWrapped.type);

        expect(programmeByDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(true);
        expect(previouslySelectedDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(false);
        expect(SelectionModel.selectedElements).toEqual([{data: {timeslots: [], isSelected: programmeDataWrapped.type}, type: SELECTION_TYPES.PROGRAMME_DEMO, currency: currency}]);
    });

    it('If the selected element is not selected yet and command key is pressed, it selects it and keeps all previously selected as selected', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell, programmeByDemoHeader, programmeByDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];
        
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);

        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(programmeByDemoHeader, programmeData, [previouslySelectedData], programmeDataWrapped.type, previouslySelectedDataWrapped.type);
        expect(programmeByDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(true);
        expect(previouslySelectedDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(true);
        expect(SelectionModel.selectedElements).toEqual([previouslySelectedDataWrapped, programmeDataWrapped]);
    });
    
    it('If the selected element is not selected yet, command key is pressed and selection type does not match previously selected elements, it does nothing', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell, breakDemoHeader, breakDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];

        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(breakDemoHeader, breakData, [previouslySelectedData], breakDataWrapped.type, previouslySelectedDataWrapped.type);

        expect(breakDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(false);
        expect(previouslySelectedDemoHeader.classList.contains(SELECTED_CLASS)).toEqual(true);
        expect(SelectionModel.selectedElements).toEqual([previouslySelectedDataWrapped]);
    });

    it('If the selected data is locked, it should not add to the selectedElements array', () => {
        const breakDataLocked = { isLocked: true };
        SelectionModel.selectedElements = [];

        Selection.toggleMarkedStatus(breakDemoHeader, breakDataLocked, [], breakDataWrapped.type);

        expect(SelectionModel.selectedElements).toEqual([]);
    });

    it('If the selected element is not selected yet and shift key is pressed, it selects it and keeps all previously selected as selected', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell, programmeByDemoHeader, programmeByDemoCell]);
        SelectionModel.selectedElements = [previouslySelectedDataWrapped];

        spyOn(KeyControl, 'isShiftKeyPressed').and.callFake(() => true);
        spyOn(Selection, 'markRangeOfElements');

        Selection.elementsPreviouslySelected = [previouslySelectedDemoHeader];

        Selection.toggleMarkedStatus(programmeByDemoHeader, programmeData, [previouslySelectedData], programmeDataWrapped.type, previouslySelectedDataWrapped.type);
        expect(Selection.markRangeOfElements).toHaveBeenCalledWith(programmeData, [previouslySelectedData], programmeDataWrapped.type, currency);
    });
});
