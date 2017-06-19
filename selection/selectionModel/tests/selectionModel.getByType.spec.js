'use strict';

describe('SelectionModel:getByType is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));

    it('should return only selected properties of the given dataType', () => {
        const element1 = {data: 1, type: 'programme-demo'},
            element2 = {data: 2, type: 'break-demo'},
            element3 = {data: 3, type: 'programme-demo'},
            element4 = {data: 4, type: 'break-demo'};
        
        SelectionModel.selectedElements = [element1, element2, element3, element4];
        
        expect(SelectionModel.getByType('programme-demo')).toEqual([element1.data, element3.data]);
    });
    
    it('should return empty array if the given dataType does not exist', () => {
        const element1 = {data: 1, type: 'programme-demo'},
            element2 = {data: 2, type: 'break-demo'};
        
        SelectionModel.selectedElements = [element1];
        
        expect(SelectionModel.getByType('programme-foo')).toEqual([]);
    });
});
