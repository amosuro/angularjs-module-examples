'use strict';

describe('InlineEditTypehead:reset is a method that:\n', function () {
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

    it('Resets all editedData properties and empties programme search results', function () {
        var programme = {
            name: 'Doctor Who',
            shortName: 'Doctor Wh',
            category: 'AWESOME',
            duration: 90,
            durationSeconds: 90 * 60
        };

        InlineEditTypehead.programmeSearchResults = ['a', 'b', 'c'];
        InlineEditTypehead.editedData.description.value = programme.name;
        InlineEditTypehead.editedData.shortName.value = programme.shortName;
        InlineEditTypehead.editedData.categories.value = programme.categories;

        InlineEditTypehead.reset();

        expect(InlineEditTypehead.editedData.description.value).toEqual('');
        expect(InlineEditTypehead.editedData.shortName.value).toEqual('');
        expect(InlineEditTypehead.editedData.categories.value).toEqual('');
        expect(InlineEditTypehead.programmeSearchResults).toEqual([]);
    });
});
