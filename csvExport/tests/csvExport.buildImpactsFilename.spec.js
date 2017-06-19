'use strict';

describe('CsvExport:buildComparisonFilename is a method that:\n', function () {
    var CsvExport, TimeUtils, AdminImpacts;

    beforeEach(module('utils'));
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
        function (_CsvExport_, _TimeUtils_, _AdminImpacts_) {
            CsvExport = _CsvExport_;
            TimeUtils = _TimeUtils_;
            AdminImpacts = _AdminImpacts_;

            AdminImpacts.StationSelector = {
                stations: {
                    selected: {
                        name: 'ITV1'
                    }
                }
            };
            CsvExport.AdminImpacts.yearSelector = {
                selected: '2015'
            };
        }));

    it('Returns the filename containing selected year, selected station and current time', function () {
        const now = 'Tuesday';

        spyOn(TimeUtils, 'now').and.callFake(function() {return now;});

        const expected = _.kebabCase('ca-impacts-2015-itv-1-' + now)+ '.csv';

        expect(CsvExport.buildImpactsFilename()).toEqual(expected)
    });


});
