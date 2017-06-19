'use strict';

describe('Selection:unselectPreviousElements is a method that:\n', function () {
    let Selection, SelectionModel;

    const SELECTED_CLASS = 'is-selected';
    const selectionModel = [{data: {}, type: 'programme-demo'}, {data: {}, type: 'programme-demo'}, {data: {}, type: 'programme-demo'}];

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
        function (_Selection_, _SelectionModel_) {
            Selection = _Selection_;
            SelectionModel = _SelectionModel_;
        }));
        
    it('Removes the selected class on all of the provided DOM elements and empties the selection model', () => {
        spyOn(Selection, 'getElementData').and.callFake(() => {});

        const domElement1 = document.createElement('div');
        const domElement2 = document.createElement('div');
        const domElement3 = document.createElement('div');

        domElement1.classList.add(SELECTED_CLASS);
        domElement2.classList.add(SELECTED_CLASS);
        domElement3.classList.add(SELECTED_CLASS);

        document.body.appendChild(domElement1);
        document.body.appendChild(domElement2);
        document.body.appendChild(domElement3);

        SelectionModel.selectedElements = selectionModel;

        Selection.unselectPreviousElements();

        expect(SelectionModel.get()).toEqual([]);
        expect(domElement1.classList.contains(SELECTED_CLASS)).toBe(false);
        expect(domElement2.classList.contains(SELECTED_CLASS)).toBe(false);
        expect(domElement3.classList.contains(SELECTED_CLASS)).toBe(false);
    });

    it('Dose not clear the selection if called with empty array', () => {
        SelectionModel.selectedElements = selectionModel;

        Selection.unselectPreviousElements();

        expect(SelectionModel.get()).toEqual(selectionModel);
    });

    it('Removes elements from the previously selected collection', () => {
        const domElement1 = document.createElement('div');
        const domElement2 = document.createElement('div');
        const domElement3 = document.createElement('div');

        domElement1.classList.add(SELECTED_CLASS);
        domElement2.classList.add(SELECTED_CLASS);
        domElement3.classList.add(SELECTED_CLASS);

        document.body.appendChild(domElement1);
        document.body.appendChild(domElement2);
        document.body.appendChild(domElement3);

        SelectionModel.selectedElements = selectionModel;

        const obj1 = {1:'1'};
        const obj2 = {2:'2'};
        const obj3 = {3:'3'};

        Selection.elementsPreviouslySelected = [obj1, obj2, obj3];
        let elementData = [obj1, obj2, obj3];

        spyOn(Selection, 'getElementData').and.callFake(() => elementData.pop());

        Selection.unselectPreviousElements();

        expect(Selection.elementsPreviouslySelected).toEqual([]);
    });


});
