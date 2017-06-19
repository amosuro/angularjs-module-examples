'use strict';

describe('SelectionModel:getCurrency is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));

    it('Returns the currency of the selected elements assuming that all elements have the same currency as the first one', () => {
        const element1 = {data: 1, currency: 'tvr'},
            element2 = {data: 2, currency: 'share'},
            element3 = {data: 3, currency: 'tvr'},
            element4 = {data: 4, currency: 'share'};
        
        SelectionModel.selectedElements = [element1, element2, element3, element4];
        
        expect(SelectionModel.getCurrency()).toEqual('tvr');
    });
    
    it('Returns undefined for an empty selection', () => {
        SelectionModel.selectedElements = [];
        
        expect(SelectionModel.getCurrency()).not.toBeDefined();
    });
});
