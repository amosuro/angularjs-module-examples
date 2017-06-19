'use strict';

describe('Selection:getDOMElementType is a method that:\n', function () {
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

    it('should return a svg value if attribute value is svg', () => {
        const element = {
            getAttribute: () => 'svg'
        };

        expect(Selection.getDOMElementType(element)).toEqual('svg');
    });

    it('should return a html value if attribute value is html', () => {
        const element = {
            getAttribute: () => 'html'
        };

        expect(Selection.getDOMElementType(element)).toEqual('html');
    });

    it('should return a html value if get attribute is null', () => {
        const element = {
            getAttribute: () => null
        };

        expect(Selection.getDOMElementType(element)).toEqual('html');
    });
});
