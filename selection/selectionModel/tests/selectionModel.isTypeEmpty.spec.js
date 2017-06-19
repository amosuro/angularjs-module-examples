'use strict';

describe('SelectionModel:isTypeEmpty is a method that:\n', function () {
    var SelectionModel;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_SelectionModel_) {
            SelectionModel = _SelectionModel_;
        }));

    it('should return true if dataType is empty', () => {
        const element1 = {data: 1, type: 'programme-demo'};
        
        SelectionModel.selectedElements = [element1];
        
        expect(SelectionModel.isTypeEmpty('programme-demo')).toBe(false);
        expect(SelectionModel.isTypeEmpty('break-demo')).toBe(true);
    });
});
