'use strict';

describe('InlineEdit:getDuration is a method that:\n', function () {
    var InlineEdit, AuthorisedUser;

    beforeEach(module('utils'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_InlineEdit_) {
            InlineEdit = _InlineEdit_;
        }));

    it('returns the formattedDuration if isDurationAggregatedAcrossSubRegions is false', function () {
        const scenarioChunk = {
            meta: {
                duration: 1200,
                isDurationAggregatedAcrossSubRegions: false
            }
        };

        expect(InlineEdit.getDuration(scenarioChunk)).toEqual('20:00');
    });

    it('returns the duration if isDurationAggregatedAcrossSubRegions is undefined', function () {
        const scenarioChunk = {
            meta: {
                duration: 1800
            }
        };

        expect(InlineEdit.getDuration(scenarioChunk)).toEqual('30:00');
    });

    it('returns a dash if isDurationAggregatedAcrossSubRegions is true', function () {
        const scenarioChunk = {
            meta: {
                duration: 1800,
                isDurationAggregatedAcrossSubRegions: true
            }
        };

        expect(InlineEdit.getDuration(scenarioChunk)).toEqual(' - ');
    });
});
