'use strict';

describe('CsvExport:buildCsvStructure is a method that generates csv string:\n', function () {
    var CsvExport;

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
        function (_CsvExport_) {
            CsvExport = _CsvExport_;
        }));

    it('for single day with single timeslot', function () {
        var singleDaySingleTimeslotData = [[{
            "date": "2012-01-01",
            "time": "0600",
            "ITV": {
                "TVR": 0.032,
                "SHARE": 0.1
            },
            "TOTALTV": {
                "TVR": 15.6
            }
        }]];

        var expected =
            'Date,'       + 'Time,'     + 'TVR,'   + 'SHARE,' + 'TotalTV TVR\n' +
            '2012-01-01,' + '06:00:00,' + '0.032,' + '0.1,'   + '15.6';

        expect(CsvExport.buildCsvStructure(singleDaySingleTimeslotData)).toEqual(expected);
    });

    it('for multiple days with single timeslot', function () {
        var multiDaySingleTimeslotData = [[{
            "date": "2014-02-03",
            "time": "0600",
            "ITV": {
                "TVR": 5,
                "SHARE": 8
            },
            "TOTALTV": {
                "TVR": 0.34
            }
        }, {
            "date": "2014-02-04",
            "time": "0600",
            "ITV": {
                "TVR": 123,
                "SHARE": 456
            },
            "TOTALTV": {
                "TVR": 789
            }
        }]];

        var expected =
            'Date,'       + 'Time,'     + 'TVR,' + 'SHARE,' + 'TotalTV TVR\n' +
            '2014-02-03,' + '06:00:00,' + '5,'   + '8,'     + '0.34\n' +
            '2014-02-04,' + '06:00:00,' + '123,' + '456,'   + '789';

        expect(CsvExport.buildCsvStructure(multiDaySingleTimeslotData)).toEqual(expected);
    });

    it('for multiple days with single timeslot', function () {
        var singleDayMultiTimeslotData = [[{
            "date": "2014-02-03",
            "time": "0600",
            "ITV": {
                "TVR": 5,
                "SHARE": 8
            },
            "TOTALTV": {
                "TVR": 0.34
            }
        }],[{
            "date": "2014-02-03",
            "time": "0835",
            "ITV": {
                "TVR": 6,
                "SHARE": 9
            },
            "TOTALTV": {
                "TVR": 3.1415
            }
        }]];

        var expected =
            'Date,'       + 'Time,'     + 'TVR,' + 'SHARE,' + 'TotalTV TVR\n' +
            '2014-02-03,' + '06:00:00,' + '5,'   + '8,'     + '0.34\n' +
            '2014-02-03,' + '08:35:00,' + '6,'   + '9,'     + '3.1415';

        expect(CsvExport.buildCsvStructure(singleDayMultiTimeslotData)).toEqual(expected);
    });

    it('for multiple days with multiple timeslots', function () {
        var multiDayMultiTimeslotData = [[{
            "date": "2014-02-03",
            "time": "0600",
            "ITV": {
                "TVR": 1,
                "SHARE": 2
            },
            "TOTALTV": {
                "TVR": 3
            }
        }, {
            "date": "2014-02-04",
            "time": "0600",
            "ITV": {
                "TVR": 7,
                "SHARE": 8
            },
            "TOTALTV": {
                "TVR": 9
            }
        }], [{
            "date": "2014-02-03",
            "time": "0835",
            "ITV": {
                "TVR": 4,
                "SHARE": 5
            },
            "TOTALTV": {
                "TVR": 6
            }
        }, {
            "date": "2014-02-04",
            "time": "0835",
            "ITV": {
                "TVR": 10,
                "SHARE": 11
            },
            "TOTALTV": {
                "TVR": 12
            }
        }]];

        var expected =
            'Date,'       + 'Time,'     + 'TVR,' + 'SHARE,' + 'TotalTV TVR\n' +
            '2014-02-03,' + '06:00:00,' + '1,'   + '2,'     + '3\n' +
            '2014-02-03,' + '08:35:00,' + '4,'   + '5,'     + '6\n' +
            '2014-02-04,' + '06:00:00,' + '7,'   + '8,'     + '9\n' +
            '2014-02-04,' + '08:35:00,' + '10,'  + '11,'    + '12';

        expect(CsvExport.buildCsvStructure(multiDayMultiTimeslotData)).toEqual(expected);
    });


});