'use strict';

describe('InlineEditTypehead:isSet is a method that:\n', function () {
    var InlineEditTypehead;

    beforeEach(module('schedule'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_InlineEditTypehead_) {
            InlineEditTypehead = _InlineEditTypehead_;
        }));

    it('Should return true when all needed fields are set', function () {
        InlineEditTypehead.editedData = {
            description: {
                value: 'set',
                disabled: false
            }
        };


        expect(InlineEditTypehead.isSet()).toEqual(true);

    });

    it('Should return false when description not set', function () {
        InlineEditTypehead.editedData = {
            description: {
                value: null,
                disabled: false
            },
            categories: {value: 'set'},
            shortName: {value: 'set'}
        };


        expect(InlineEditTypehead.isSet()).toEqual(false);
    });

});
