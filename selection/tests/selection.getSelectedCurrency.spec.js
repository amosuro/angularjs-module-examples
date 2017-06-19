'use strict';

describe('Selection:getSelectedCurrency is a method that:\n', function () {
    let Selection, ComparisonGridModel, EditManager;

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
        function (_Selection_, _ComparisonGridModel_, _EditManager_) {
            Selection = _Selection_;
            ComparisonGridModel = _ComparisonGridModel_;
            EditManager = _EditManager_;
        }));
        
    it('should return the selected model in comparison if scenario exists', () => {
        let dataWithScenario = {id: 1, scenario: {}}; 
        let selectedComparisonCurrency = ComparisonGridModel.viewOptions.selected = {bar: 'foo'};
        
        expect(Selection.getSelectedCurrency(dataWithScenario)).toEqual(selectedComparisonCurrency);
    });

    it('should return the selected model in comparison if TotalTVR copy', () => {
        let dataWithScenario = {totalTvr: true};
        let selectedComparisonCurrency = ComparisonGridModel.viewOptions.selected = {bar: 'foo'};

        expect(Selection.getSelectedCurrency(dataWithScenario)).toEqual(selectedComparisonCurrency);
    });

    it('should return the selected model in edit if scenario does not exist', () => {
        let dataWithoutScenario = {id: 1}; 
        let selectedEditCurrency = EditManager.currency.selected = {foo: 'bar'};
        
        expect(Selection.getSelectedCurrency(dataWithoutScenario)).toEqual(selectedEditCurrency);
    });
    
});
