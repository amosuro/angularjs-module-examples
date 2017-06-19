'use strict';

describe('Selection:isRenderedWithD3 is a method that:\n', function () {
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

    it('should return true if element has type of svg', () => {
        spyOn(Selection, 'getDOMElementType').and.returnValue('svg');

        const selectableElement = {};

        expect(Selection.isRenderedWithD3(selectableElement)).toEqual(true);
    });

    it('should return false if element has type of svg', () => {
        spyOn(Selection, 'getDOMElementType').and.returnValue('html');

        const selectableElement = {};

        expect(Selection.isRenderedWithD3(selectableElement)).toEqual(false);
    });
});
