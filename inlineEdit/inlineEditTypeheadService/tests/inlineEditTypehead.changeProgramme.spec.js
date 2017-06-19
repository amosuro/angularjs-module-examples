'use strict';

describe('InlineEditTypehead:changeProgrammeName is a method that:\n', function () {
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

    it('Takes a search string and saves its results', function () {
        var programme = {
            name: 'Doctor Who',
            shortName: 'Doctor Wh',
            category: 'AWESOME',
            duration: 90,
            durationSeconds: 90 * 60
        };

        InlineEditTypehead.programmeSearchResults = ['a', 'b', 'c'];
        InlineEditTypehead.categoryDisabled = false;

        InlineEditTypehead.changeProgrammeName(programme);

        expect(InlineEditTypehead.editedData.description.value).toEqual(programme.name);
        expect(InlineEditTypehead.editedData.shortName.value).toEqual(programme.shortName);
        expect(InlineEditTypehead.editedData.categories.value).toEqual(programme.category);
        expect(InlineEditTypehead.programmeSearchResults).toEqual([]);
        expect(InlineEditTypehead.categoryDisabled).toEqual(true);
    });
});
