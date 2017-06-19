'use strict';

describe('SelectionModel:getType is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));

    it('Returns the type of the selected elements assuming that all elements have the same type as the first one', () => {
        const element1 = {data: 1, type: 'programme-demo'},
            element2 = {data: 2, type: 'break-demo'},
            element3 = {data: 3, type: 'programme-demo'},
            element4 = {data: 4, type: 'break-demo'};
        
        SelectionModel.selectedElements = [element1, element2, element3, element4];
        
        expect(SelectionModel.getType()).toEqual('programme-demo');
    });
    
    it('Returns undefined for an empty selection', () => {
        SelectionModel.selectedElements = [];
        
        expect(SelectionModel.getType()).not.toBeDefined();
    });
});
