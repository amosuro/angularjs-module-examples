'use strict';

describe('CsvExport:buildComparisonCsvStructure is a method that generates csv string:\n', function () {
    let CsvExport, TimeUtils;

    let programmeModels, timeslotModels, demoHeaders;

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
        function (_CsvExport_, _TimeUtils_) {
            CsvExport = _CsvExport_;
            TimeUtils = _TimeUtils_;

            programmeModels = [
                {
                    name: 'Jeremy Kyle',
                    scenario: {name: 'master'},
                    status: 'C',
                    type: 'P',
                    weekDay: 'Mon',
                    date: 20160101,
                    dateTo: 20160101,
                    timeFrom: 900,
                    formattedDuration: '30:00',
                    area: 'ITV1',
                    granularity: 'PROGS',
                    timeslots: [{ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}]
                },
                {
                    name: 'Moar Jeremy',
                    scenario: {name: 'master'},
                    status: 'C',
                    type: 'P',
                    weekDay: 'Mon',
                    date: 20160101,
                    dateTo: 20160101,
                    timeFrom: 1000,
                    formattedDuration: '60:00',
                    area: 'ITV1',
                    granularity: 'PROGS',
                    timeslots: [{ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}]
                }
            ];

            timeslotModels = [
                {
                    name: 'Jeremy Kyle',
                    scenario: {name: 'master'},
                    status: 'C',
                    type: 'T',
                    weekDay: 'Tues',
                    date: 20160101,
                    dateTo: 20160101,
                    timeFrom: 900,
                    timeTo: 959,
                    formattedDuration: '30:00',
                    area: 'ITV1',
                    granularity: 'MIN5',
                    timeslots: [{ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}]
                },
                {
                    name: 'Moar Jeremy',
                    scenario: {name: 'master'},
                    status: 'C',
                    type: 'T',
                    weekDay: 'Tues',
                    date: 20160101,
                    dateTo: 20160101,
                    timeFrom: 1000,
                    timeTo: 1059,
                    formattedDuration: '60:00',
                    area: 'ITV1',
                    granularity: 'MIN5',
                    timeslots: [{ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}, {ITV: {TVR: 1}}]
                }
            ];

            demoHeaders = ['A5', 'HW', 'HC', 'H5', 'HA', 'AD', 'A2', 'A3', 'AA', 'ME', 'M3', 'MA', 'WO', 'W3', 'WA', 'CH', 'C9'];

            CsvExport.ComparisonGridModel.viewOptions = {selected: {scenario: {name: 'tvr'}}};
        }));

    it('returns row of comparison programme model headers and data in CSV', function () {
        const expectedCsv = `Name,Source,Status,Type,Day,Date from,Start time,Duration,Area,A5,HW,HC,H5,HA,AD,A2,A3,AA,ME,M3,MA,WO,W3,WA,CH,C9\n${programmeModels[0].name},${programmeModels[0].scenario.name},${programmeModels[0].status},${programmeModels[0].type},${programmeModels[0].weekDay},01-01-16,${programmeModels[0].timeFrom},${programmeModels[0].formattedDuration},${programmeModels[0].area},1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00\n${programmeModels[1].name},${programmeModels[1].scenario.name},${programmeModels[0].status},${programmeModels[1].type},${programmeModels[1].weekDay},01-01-16,${programmeModels[1].timeFrom},${programmeModels[1].formattedDuration},${programmeModels[1].area},1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00\n\n\n\n`;

        expect(CsvExport.buildComparisonCsvStructure(demoHeaders, programmeModels)).toEqual(expectedCsv);
    });

    it('returns row of comparison timeslot model headers and data in CSV', function () {
        const expectedCsv = `Name,Source,Status,Day,Date from,Date to,Start time,End time,Area,A5,HW,HC,H5,HA,AD,A2,A3,AA,ME,M3,MA,WO,W3,WA,CH,C9\n${timeslotModels[0].granularity},${timeslotModels[0].scenario.name},${timeslotModels[0].status},${timeslotModels[0].weekDay},01-01-16,01-01-16,${timeslotModels[0].timeFrom},${timeslotModels[0].timeTo},${timeslotModels[0].area},1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00\n${timeslotModels[1].granularity},${timeslotModels[1].scenario.name},${programmeModels[0].status},${timeslotModels[1].weekDay},01-01-16,01-01-16,${timeslotModels[1].timeFrom},${timeslotModels[1].timeTo},${timeslotModels[1].area},1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00,1.00\n\n\n\n`;

        expect(CsvExport.buildComparisonCsvStructure(demoHeaders, timeslotModels)).toEqual(expectedCsv);
    });
});