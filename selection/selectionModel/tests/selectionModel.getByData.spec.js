'use strict';

describe('SelectionModel:find is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));

    it('returns the given object if found in selected elements', () => {
        const element1 = {data: {id: 1}, type: 'programme-demo'},
            element2 = {data: {id: 2}, type: 'break-demo'};
        
        SelectionModel.selectedElements = [element1, element2];
        
        expect(SelectionModel.find(element1.data)).toEqual(element1);
    });
    
    it('returns undefined if the object is not found in selected elements', () => {
        const element1 = {data: {id: 1}, type: 'programme-demo'},
            element2 = {data: {id: 2}, type: 'break-demo'};
        
        SelectionModel.selectedElements = [element2];
        
        expect(SelectionModel.find(element1.data)).toEqual(undefined);
    });
});
