'use strict';

describe('SelectionModel:remove is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));
    
    it('should set the isSelected property to false and remove the object from selectedElements array', () => {
        let data = {'example data': 'foo', isSelected: true};
            
        SelectionModel.remove(data);
        
        expect(data.isSelected).toEqual(false);
        expect(SelectionModel.selectedElements).toEqual([]);
    });
});
