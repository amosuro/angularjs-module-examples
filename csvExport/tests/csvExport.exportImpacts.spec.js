'use strict';

describe('CsvExport:exportImpacts is a method that:\n', function () {
    var CsvExport;

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


    const filename = 'filename.csv';
    const csv = 'Date,Time,TVR,SHARE,TotalTV TVR';

    it('downloads a file', function () {
        const headers = ['1'];
        const months = ['april'];
        const rows = [{some: 'data'}];
        const blob = {'some': 'object'};

        spyOn(CsvExport, 'buildImpactsCsvStructure').and.callFake(function() { return csv;});
        spyOn(CsvExport, 'buildImpactsFilename').and.callFake(function() { return filename;});

        spyOn(window, 'saveAs');
        spyOn(window, 'Blob').and.callFake(function() { return blob});

        CsvExport.exportImpacts();

        expect(CsvExport.buildImpactsCsvStructure).toHaveBeenCalled();
        expect(window.Blob).toHaveBeenCalledWith([csv], {type: 'data:text/csv;charset=utf-8'});
        expect(window.saveAs).toHaveBeenCalledWith(blob, filename);
        expect(CsvExport.buildImpactsFilename).toHaveBeenCalled();
    });

});