'use strict';

describe('Selection:isInListView is a method that:\n', function () {
    let Selection;

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
        function (_Selection_) {
            Selection = _Selection_;
        }));

    it('should return true if element is connected to other DOM elements', () => {
        let selectableElement = {
            getAttribute: () => 'programme-demo'
        };

        expect(Selection.isInListView(selectableElement, Selection.SELECTION_TYPES)).toEqual(true);

        selectableElement = {
            getAttribute: () => 'break-demo'
        };

        expect(Selection.isInListView(selectableElement, Selection.SELECTION_TYPES)).toEqual(true);
    });

    it('should return false if element is not connected to other DOM elements', () => {
        let selectableElement = {
            getAttribute: () => 'programme-schedule'
        };

        expect(Selection.isInListView(selectableElement, Selection.SELECTION_TYPES)).toEqual(false);

        selectableElement = {
            getAttribute: () => 'totaltvr-schedule'
        };

        expect(Selection.isInListView(selectableElement, Selection.SELECTION_TYPES)).toEqual(false);
    });

    it('should return false if element is not connected to other DOM elements', () => {
        let selectableElement = {
            getAttribute: () => 'break-schedule'
        };

        expect(Selection.isInListView(selectableElement, Selection.SELECTION_TYPES)).toEqual(false);
    });
});
