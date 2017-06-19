'use strict';

describe('SelectionModel:add is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));
    
    it('should add an isSelected property to the data object with true value', () => {
        let data = {'example data': 'foo'},
            dataType = {'example type': 'bar'},
            currency = {'example currency': 'woo'}
            
        SelectionModel.add(data, dataType, currency);
        
        expect(SelectionModel.selectedElements[0].data.isSelected).toEqual(dataType);
    });
        
    it('should push data, dataType and currency to selectedElements array', () => {
        let data = {'example data': 'foo'},
            dataType = {'example type': 'bar'},
            currency = {'example currency': 'woo'}
            
        SelectionModel.add(data, dataType, currency);
        
        expect(SelectionModel.selectedElements).toEqual([{data: data, type: dataType, currency: currency}]);
    });
});
