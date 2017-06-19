'use strict';

describe('Selection:handleClick is a method that:\n', function () {
    let Selection, SELECTION_TYPES;

    const domElementMock = document.createElement('div');
    const SELECTED_CLASS = 'is-selected',
        SELECTABLE_ATTRIBUTE = 'data-selectable';
    const eventMock = {
        target: domElementMock
    };
    const elementData = {timeslots: [], isSelected : true};
    
    let previouslySelectedDemoHeader,
        previouslySelectedDemoCell,
        wrapper;
    
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
        function (_Selection_, _SELECTION_TYPES_) {
            Selection = _Selection_;
            SELECTION_TYPES = _SELECTION_TYPES_;
        }));
        
    beforeEach(() => {
        wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        
        //PREVIOUSLY SELECTED DOM ELEMENTS 
        previouslySelectedDemoHeader = document.createElement('div');
        previouslySelectedDemoHeader.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        previouslySelectedDemoHeader.setAttribute('data-row', 'editProgrammeMode_2');
        previouslySelectedDemoHeader.classList.add(SELECTED_CLASS);
        previouslySelectedDemoCell = document.createElement('span');
        previouslySelectedDemoCell.setAttribute('data-row', 'editProgrammeMode_2');
        previouslySelectedDemoCell.classList.add(SELECTED_CLASS);
    });
    
    afterEach(() => {
        document.body.removeChild(wrapper);
    });
        
    it('Unmarks all the previously selected elements if the clicked element is not selectable', () => {
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        spyOn(Selection, 'unselectPreviousElements');
        
        Selection.handleClick(eventMock);
        expect(Selection.unselectPreviousElements).toHaveBeenCalled();
    });
    
    it('Toggles the the marked status of elements if the clicked element is selectable', () => {
        domElementMock.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        spyOn(Selection, 'toggleMarkedStatus');
        spyOn(Selection, 'getElementData').and.callFake(() => elementData);

        const selectedElement = domElementMock;
        const selectedElementData = elementData;
        const previouslySelectedElementsData = [elementData];
        const selectedElementType = SELECTION_TYPES.PROGRAMME_DEMO;

        Selection.handleClick(eventMock);

        expect(Selection.toggleMarkedStatus).toHaveBeenCalledWith(selectedElement, selectedElementData, previouslySelectedElementsData, selectedElementType, []);
    });

    it('does not duplicate previously selected elements', () => {
        domElementMock.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        spyOn(Selection, 'toggleMarkedStatus');
        spyOn(Selection, 'getElementData').and.callFake(() => elementData);

        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);

        expect(Selection.elementsPreviouslySelected.length).toEqual(1)
    });

    it('clears up elements that have selected flag set to false', () => {
        let isSelected = false;
        let count = 0;

        domElementMock.setAttribute(SELECTABLE_ATTRIBUTE, SELECTION_TYPES.PROGRAMME_DEMO);
        appendElementsToDocument([previouslySelectedDemoHeader, previouslySelectedDemoCell]);
        spyOn(Selection, 'toggleMarkedStatus');
        spyOn(Selection, 'getElementData').and.callFake(() => {
            let ret = angular.copy(elementData);
            isSelected = !isSelected;

            ret.isSelected = isSelected;
            ret.timeslots.push(count++);

            return ret;
        });

        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);
        Selection.handleClick(eventMock);

        expect(Selection.elementsPreviouslySelected.length).toEqual(2)
    });

});
