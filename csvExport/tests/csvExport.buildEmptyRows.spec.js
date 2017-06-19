'use strict';

describe('CsvExport:buildEmptyRows is a method that generates csv string:\n', function () {
    let CsvExport;
    let expectedResult;

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
        }));

    it('should return the correct number of rows and columns', function () {
        expectedResult = ' , \n';
        expect(CsvExport.buildEmptyRows(1,2)).toEqual(expectedResult);

        expectedResult = ' , , , ' + '\n' + ' , , , ' + '\n' + ' , , , ' + '\n' + ' , , , \n';
        expect(CsvExport.buildEmptyRows(4,4)).toEqual(expectedResult);
    });
});