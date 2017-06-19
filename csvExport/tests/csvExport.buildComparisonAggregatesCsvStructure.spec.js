'use strict';

describe('CsvExport:buildComparisonAggregatesCsvStructure is a method that generates csv string:\n', function () {
    let CsvExport;

    let aggregateGroups, demoHeaders;

    beforeEach(module('utils'));
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
        function (_CsvExport_) {
            CsvExport = _CsvExport_;

            aggregateGroups = [
                [
                    { type: 'P',  compItems: [{ name: 'woo1'}], timeslots: [{ ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }]},
                    { type: 'E',  compItems: [{ name: 'woo2'}], timeslots: [{ ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }]},
                    { type: 'C',  compItems: [{ name: 'woo3'}], timeslots: [{ ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }]}
                ],
                [
                    { type: 'C',  compItems: [{ name: 'woo4'}], timeslots: [{ ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }, { ITV: { TVR: 1 } }]}
                ]
            ];


            demoHeaders = ['A5', 'HW', 'HC', 'H5', 'HA', 'AD', 'A2', 'A3', 'AA', 'ME', 'M3', 'MA', 'WO', 'W3', 'WA', 'CH', 'C9'];

            CsvExport.ComparisonGridModel.viewOptions = { selected: { id: 'tvr' } };

            spyOn(CsvExport.ComparisonAggregates, 'calculateTotalDuration').and.returnValue('3:00');
        }));

    it('returns the aggregate group rows for each group passed through', function () {
        const expectedCsv = 'Name,Source,Status,Type,Day,Date from,Start time,Duration,Area,A5,HW,HC,H5,HA,AD,A2,A3,AA,ME,M3,MA,WO,W3,WA,CH,C9\n' +
            '[P] woo1,,,,,,,3:00,,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000\n' +
            '[E] woo2,,,,,,,3:00,,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000\n' +
            '[C] woo3,,,,,,,3:00,,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000\n' +
            ' , , , , , , , , , , , , , , , , , , , , , , , , , \n\n' +
            '[C] woo4,,,,,,,3:00,,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000,1.000\n' +
            ' , , , , , , , , , , , , , , , , , , , , , , , , , \n';

        expect(CsvExport.buildComparisonAggregateCsvStructure(demoHeaders, aggregateGroups)).toEqual(expectedCsv);
    });
});