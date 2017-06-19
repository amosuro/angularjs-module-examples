'use strict';

describe('CsvExport:exportComparison is a method that:\n', function () {
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


    var filename = 'filename.csv';
    var csv = 'Comparison list csv';
    var csvAggregates = 'Aggregates csv';
    var csvEmpty = 'Nothing to see here';

    it('downloads a file', function () {
        var headers = ['1'];
        var rows = [{some: 'data'}];
        var aggregateGroups = [{some: 'aggregateData'}];
        var blob = {'some': 'object'};

        spyOn(CsvExport, 'buildComparisonCsvStructure').and.callFake(function() { return csv;});
        spyOn(CsvExport, 'buildComparisonAggregateCsvStructure').and.callFake(function() { return csvAggregates;});
        spyOn(CsvExport, 'buildEmptyRows').and.returnValue(csvEmpty);
        spyOn(CsvExport, 'buildComparisonFilename').and.callFake(function() { return filename;});
        spyOn(window, 'saveAs');
        spyOn(window, 'Blob').and.callFake(function() { return blob;});

        CsvExport.exportComparison(headers, rows, aggregateGroups);

        expect(CsvExport.buildComparisonCsvStructure).toHaveBeenCalledWith(headers, rows);
        expect(CsvExport.buildComparisonAggregateCsvStructure).toHaveBeenCalledWith(headers, aggregateGroups);


        expect(window.Blob).toHaveBeenCalledWith([csv, csvEmpty, csvAggregates], {type: 'data:text/csv;charset=utf-8'});
        expect(CsvExport.buildComparisonFilename).toHaveBeenCalled();
        expect(window.saveAs).toHaveBeenCalledWith(blob, filename);
    });

});