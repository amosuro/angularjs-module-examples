'use strict';

describe('CsvExport:buildImpactsCsvStructure is a method that generates csv string:\n', function () {
    var CsvExport, StationSelector, AdminImpacts;

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
        function (_CsvExport_, _StationSelector_, _AdminImpacts_) {
            CsvExport = _CsvExport_;
            StationSelector = _StationSelector_;
            AdminImpacts = _AdminImpacts_;

            AdminImpacts.StationSelector = {
                stations: {
                    selected: {
                        name: 'ITV1'
                    }
                }
            };

            CsvExport.AdminImpacts.months = [
                { code: '04', name: 'April'}
            ];
            CsvExport.AdminImpacts.headers = {
                x: [{"code":"A5","locked":false,"active":false,"demo":{"abbreviation":"AD1654","code":"A5","label":"16-54 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD55PL","code":"","label":"Adults 55+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:227"},{"code":"HW","locked":false,"active":false,"demo":{"abbreviation":"HWIVES","code":"HW","label":"All Housewives","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"NOTHW","code":"","label":"Not Housewives"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:228"},{"code":"HC","locked":false,"active":false,"demo":{"abbreviation":"HWSCHD","code":"HC","label":"Housewives with Children","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HWNCH","code":"","label":"Housewives without Children"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},"$$hashKey":"object:229"},{"code":"H5","locked":false,"active":false,"demo":{"abbreviation":"HW1654","code":"H5","label":"Housewives 16-54","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HW55PL","code":"","label":"Housewives 55+"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},"$$hashKey":"object:230"},{"code":"HA","locked":false,"active":false,"demo":{"abbreviation":"HWABC1","code":"HA","label":"ABC1 Housewives","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HWC2DE","code":"","label":"C2DE Housewives"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},"$$hashKey":"object:231"},{"code":"AD","locked":false,"active":false,"demo":{"abbreviation":"ADULTS","code":"AD","label":"Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"CHILDS","code":"CH","label":"Children"},{"abbreviation":"INDVLS","code":"","label":"All Individuals"}]},"$$hashKey":"object:232"},{"code":"A2","locked":false,"active":false,"demo":{"abbreviation":"AD1624","code":"A2","label":"16-24 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD25PL","code":"","label":"Adults 25+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:233"},{"code":"A3","locked":false,"active":false,"demo":{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD35PL","code":"","label":"Adults 35+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:234"},{"code":"AA","locked":false,"active":false,"demo":{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ADC2DE","code":"","label":"C2DE Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:235"},{"code":"ME","locked":false,"active":false,"demo":{"abbreviation":"MEN","code":"ME","label":"Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WOMEN","code":"WO","label":"Women"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:236"},{"code":"M3","locked":false,"active":false,"demo":{"abbreviation":"ME1634","code":"M3","label":"16-34 Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WO1634","code":"W3","label":"16-34 Women"},{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults"}]},"$$hashKey":"object:237"},{"code":"MA","locked":false,"active":false,"demo":{"abbreviation":"MEABC1","code":"MA","label":"ABC1 Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WOABC1","code":"WA","label":"ABC1 Women"},{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults"}]},"$$hashKey":"object:238"},{"code":"WO","locked":false,"active":false,"demo":{"abbreviation":"WOMEN","code":"WO","label":"Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"MEN","code":"ME","label":"Men"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},"$$hashKey":"object:239"},{"code":"W3","locked":false,"active":false,"demo":{"abbreviation":"WO1634","code":"W3","label":"16-34 Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ME1634","code":"M3","label":"16-34 Men"},{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults"}]},"$$hashKey":"object:240"},{"code":"WA","locked":false,"active":false,"demo":{"abbreviation":"WOABC1","code":"WA","label":"ABC1 Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"MEABC1","code":"MA","label":"ABC1 Men"},{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults"}]},"$$hashKey":"object:241"},{"code":"CH","locked":false,"active":false,"demo":{"abbreviation":"CHILDS","code":"CH","label":"Children","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ADULTS","code":"AD","label":"Adults"},{"abbreviation":"INDVLS","code":"","label":"All Individuals"}]},"$$hashKey":"object:242"}]
            };
            CsvExport.AdminImpacts.yearSelector = {
                selected: '2015'
            };
        }));

    it('returns impacts for 2015 and April month in string format for CSV', function () {
        CsvExport.AdminImpacts.impacts = {
            "APRIL": {
                "total": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "other": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "otherAsSoci": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "totalITV": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "totalITVAsSoci": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "selected": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "selectedAsSoci": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]
            },
            "annual": {
                "total":[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "other":[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "otherAsSoci":[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "totalITV":[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "totalITVAsSoci":[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "selected": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ],
                "selectedAsSoci": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16
                ]
            }
        };

        var expected =
            'ITV1\n' +
            '2015,'                  + 'A5,' + 'HW,' + 'HC,' + 'H5,' + 'HA,' + 'AD,' + 'A2,' + 'A3,' + 'AA,' + 'ME,' + 'M3,' + 'MA,' + 'WO,' + 'W3,' + 'WA,' + 'CH\n' +
            'Total broadcast,'       + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'Other commercial,'      + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'All ITV,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'ITV1,'                  + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +

            'April,'                 + 'A5,' + 'HW,' + 'HC,' + 'H5,' + 'HA,' + 'AD,' + 'A2,' + 'A3,' + 'AA,' + 'ME,' + 'M3,' + 'MA,' + 'WO,' + 'W3,' + 'WA,' + 'CH\n' +
            'Total broadcast,'       + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'Other commercial,'      + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'All ITV,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'ITV1,'                  + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16\n' +
            'As SOCI,'               + '1,' + '2,' + '3,'  + '4,' + '5,' + '6,' + '7,' + '8,' + '9,' + '10,' + '11,' + '12,' + '13,' + '14,' + '15,' + '16';


        expect(CsvExport.buildImpactsCsvStructure()).toEqual(expected);
    });


});