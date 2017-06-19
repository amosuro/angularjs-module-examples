'use strict';

describe('CsvExport:buildComparisonFilename is a method that:\n', function () {
    var $location, CsvExport, TimeUtils;

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
        function (_$location_, _CsvExport_, _TimeUtils_) {
            $location = _$location_;
            CsvExport = _CsvExport_;
            TimeUtils = _TimeUtils_;
        }));

    it('Returns the filename containing date ranges, demographic and weekday selection', function () {
        var now = new Date();

        spyOn(TimeUtils, 'now').and.callFake(function() {return now;});

        $location.search({editDateFrom: '2015-02-03', editDateTo: '2015-02-15', editGran: 'MIN5',  editDemo: 'WOMEN', editWeekDays: '3'});
        var filename = CsvExport.buildComparisonFilename();
        var expected = _.kebabCase('ca-comparison-' + now)+ '.csv';
        expect(filename).toEqual(expected)
    });


});
