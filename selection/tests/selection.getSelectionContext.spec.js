'use strict';

describe('Selection:getSelectionContext is a method that:\n', function () {
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
        
    it('should return the selected context when present', () => {
        const element = {
            isSelected: 'Spoderman',
            getAttribute: () => 'Super Spoderman'
        };

        expect(Selection.getSelectionContext(element)).toEqual('Spoderman');
    });


    it('should return the selected attribute when selected not available', () => {
        const element = {
            getAttribute: () => 'Super Spoderman'
        };

        expect(Selection.getSelectionContext(element)).toEqual('Super Spoderman');
    });


});
