(function () {
    'use strict';
    /* global saveAs */

    function CsvExport($location, EditFilters, TimeUtils, AdminImpacts, UtilsService, ComparisonGridModel, ComparisonAggregates) {
        this.$location = $location;
        this.EditFilters = EditFilters;
        this.TimeUtils = TimeUtils;
        this.AdminImpacts = AdminImpacts;
        this.UtilsService = UtilsService;
        this.ComparisonGridModel = ComparisonGridModel;
        this.ComparisonAggregates = ComparisonAggregates;
    }

    CsvExport.prototype.export = function (timeslots) {
        const blob = new Blob([this.buildCsvStructure(timeslots)], {type: 'data:text/csv;charset=utf-8'});

        saveAs(blob, this.buildFilename());
    };

    CsvExport.prototype.exportComparison = function (headers, rows, aggregateGroups) {
        const blob = new Blob(
            [
                this.buildComparisonCsvStructure(headers, rows),
                this.buildEmptyRows(2, 27),
                this.buildComparisonAggregateCsvStructure(headers, aggregateGroups)
            ],
            {type: 'data:text/csv;charset=utf-8'}
        );

        saveAs(blob, this.buildComparisonFilename());
    };

    CsvExport.prototype.exportImpacts = function () {
        const blob = new Blob([this.buildImpactsCsvStructure()], {type: 'data:text/csv;charset=utf-8'});

        saveAs(blob, this.buildImpactsFilename());
    };

    CsvExport.prototype.buildComparisonCsvStructure = function (demoHeaders, rows) {
        const rowsArray = [];
        const xHeaders = ['Name', 'Source', 'Status', 'Type', 'Day', 'Date from', 'Start time', 'Duration', 'Area'].concat(demoHeaders);
        const isTimeSlotGranularity = (row) => row.type === 'T';
        const typePosition = xHeaders.indexOf('Type');

        if (isTimeSlotGranularity(rows[0])) {
            xHeaders.splice(typePosition, 4, 'Day', 'Date from', 'Date to', 'Start time', 'End time');
            xHeaders.splice(xHeaders.indexOf('Duration'), 1);
        }

        rows.forEach((row) => {
            const rowName = isTimeSlotGranularity(row) ? row.granularity : row.name;
            const yHeaders = [rowName, row.scenario.name, row.status, row.type, row.weekDay, this.TimeUtils.dateAsIntToExpressionFormat(row.date), row.timeFrom, row.formattedDuration, row.area];
            const timeSlots = demoHeaders.map((header, idx) => this.UtilsService.activeCurrencyValueFor(row.timeslots[idx], this.ComparisonGridModel.viewOptions.selected));
            const dataRow = yHeaders.concat(timeSlots);

            if (isTimeSlotGranularity(row)) {
                dataRow.splice(typePosition, 4, row.weekDay, this.TimeUtils.dateAsIntToExpressionFormat(row.date), this.TimeUtils.dateAsIntToExpressionFormat(row.dateTo), row.timeFrom, row.timeTo);
                dataRow.splice(dataRow.indexOf(row.formattedDuration), 1);
            }

            rowsArray.push(dataRow.join(','));
        });

        return xHeaders.join(',') + '\n' + rowsArray.join('\n') + '\n\n\n\n';
    };

    CsvExport.prototype.buildComparisonAggregateCsvStructure = function (demoHeaders, groups) {
        if (!groups.length) {
            return '';
        }

        const rowsArray = [];
        const xHeaders = ['Name', 'Source', 'Status', 'Type', 'Day', 'Date from', 'Start time', 'Duration', 'Area'].concat(demoHeaders);

        groups.forEach((rows) => {
            const isTimeSlotGranularity = (row) => row.type === 'T';
            const startTimePosition = xHeaders.indexOf('Start time');

            if (isTimeSlotGranularity(rows[0])) {
                xHeaders.splice(startTimePosition + 1, 0, 'End time');
            }

            rows.forEach((row) => {
                const yHeaders = [`[${row.type}] ${row.compItems[0].name}`, '', '', '', '', '', '', this.ComparisonAggregates.calculateTotalDuration(row), ''];
                const timeSlots = demoHeaders.map((header, idx) => this.UtilsService.activeCurrencyValueFor(row.timeslots[idx], this.ComparisonGridModel.viewOptions.selected));
                const dataRow = yHeaders.concat(timeSlots);

                rowsArray.push(dataRow.join(','));
            });

            rowsArray.push(this.buildEmptyRows(1, xHeaders.length));
        });

        return xHeaders.join(',') + '\n' + rowsArray.join('\n');
    };

    CsvExport.prototype.buildEmptyRows = function (rowCount, columnCount) {
        let rows = [];
        let columns = [];

        for (let i = 0; i < rowCount; i++) {

            if (!columns.length) {
                for (let j = 0; j < columnCount; j++) {
                    columns.push(' ');
                }
            }

            rows.push(columns.join(','));
        }
        return rows.join('\n') + '\n';
    };

    CsvExport.prototype.buildImpactsCsvStructure = function () {
        const impacts = this.AdminImpacts.impacts;
        const headers = this.AdminImpacts.headers;
        const months = this.AdminImpacts.months;
        const station = this.AdminImpacts.StationSelector.stations.selected.name;
        const year = this.AdminImpacts.yearSelector.selected;

        const csvXHeaders = headers.x.map((header) => header.code).join(',');
        const csvContent = [];
        const csvYHeaders = [{
            'fieldName': 'total',
            'headerText': 'Total broadcast'
        }, {
            'fieldName': 'other',
            'headerText': 'Other commercial'
        }, {
            'fieldName': 'otherAsSoci',
            'headerText': 'As SOCI'
        }, {
            'fieldName': 'totalITV',
            'headerText': 'All ITV'
        }, {
            'fieldName': 'totalITVAsSoci',
            'headerText': 'As SOCI'
        }, {
            'fieldName': 'selected',
            'headerText': 'Selected'
        }, {
            'fieldName': 'selectedAsSoci',
            'headerText': 'As SOCI'
        }];

        function buildMonthHeaders(month) {
            return month.name + ',' + `${csvXHeaders}`;
        }

        function buildMonthTable(month) {
            const monthTable = [];
            const impactRow = [];

            csvYHeaders.forEach((header) => {
                const headerText = header.fieldName === 'selected' ? station : header.headerText;

                impactRow.push(headerText + ',' + month[header.fieldName].join(','));
            });

            monthTable.push(impactRow.join('\n'));

            return monthTable.join(',');
        }

        function buildTotalHeaders() {
            return year + ',' + `${csvXHeaders}`;
        }

        function buildTotalTable() {
            const yearTable = [];
            const impactRow = [];

            csvYHeaders.forEach((header) => {
                const headerText = header.fieldName === 'selected' ? station : header.headerText;

                impactRow.push(headerText + ',' + impacts.annual[header.fieldName].join(','));
            });

            yearTable.push(impactRow.join('\n'));

            return yearTable.join(',');
        }

        csvContent.push(station);
        csvContent.push(buildTotalHeaders());
        csvContent.push(buildTotalTable());

        months.forEach((month) => {
            csvContent.push(buildMonthHeaders(month));
            csvContent.push(buildMonthTable(impacts[month.name.toUpperCase()]));
        });

        return csvContent.join('\n');
    };


    CsvExport.prototype.buildCsvStructure = function (timeslots) {
        const exportDefinitions = [{
            'fieldName': 'date',
            'headerText': 'Date'
        }, {
            'fieldName': 'time',
            'headerText': 'Time'
        }, {
            'fieldName': 'ITV.TVR',
            'headerText': 'TVR'
        }, {
            'fieldName': 'ITV.SHARE',
            'headerText': 'SHARE'
        }, {
            'fieldName': 'TOTALTV.TVR',
            'headerText': 'TotalTV TVR'
        }];


        function buildCsvDataRow(singleTimeslot) {
            const csvDataRow = [];

            exportDefinitions.forEach((definition) => {
                if (definition.headerText === 'Time') {
                    csvDataRow.push(buildTimeRow(definition));
                } else {
                    csvDataRow.push(extractFieldData(definition, singleTimeslot));
                }
            });

            function buildTimeRow(definition) {
                return singleTimeslot[definition.fieldName].substr(0, 2) + ':' + singleTimeslot[definition.fieldName].substr(2) + ':00';
            }

            // Resolve locating export definition data with dot notation support, without utilising eval which is inefficient (and evil).
            function extractFieldData(definition, singleTimeslot) {
                let currentData = singleTimeslot;

                definition.fieldName.split('.').forEach((level) => {
                    currentData = currentData[level];
                });
                return currentData;
            }

            return csvDataRow.join(',');
        }

        const csvHeaders = exportDefinitions.map((definition) => {
            return definition.headerText;
        }).join(',');

        const csvContent = [csvHeaders];

        for (var day = 0; day < timeslots[0].length; day++) {
            for (var time = 0; time < timeslots.length; time++) {
                csvContent.push(buildCsvDataRow(timeslots[time][day]));
            }
        }

        return csvContent.join('\n');
    };

    CsvExport.prototype.buildComparisonFilename = function () {
        const string = 'CA-Comparison-' + this.TimeUtils.now();

        return _.kebabCase(string) + '.csv';
    };

    CsvExport.prototype.buildImpactsFilename = function () {
        const string = 'CA-Impacts-' + this.AdminImpacts.yearSelector.selected + this.AdminImpacts.StationSelector.stations.selected.name + this.TimeUtils.now();

        return _.kebabCase(string) + '.csv';
    };

    CsvExport.prototype.buildFilename = function () {
        const locationParams = this.$location.search();
        const dateFrom = locationParams.editTimeFrom;
        const dateTo = locationParams.editTimeTo;
        let fileNameBase = `CA- ${locationParams.editDateFrom.replace(/-/g, '')} - ${locationParams.editDateTo.replace(/-/g, '')} - ${locationParams.editDemo} - ${locationParams.editGran}`;

        if (dateFrom && dateTo) {
            const dayPart = _.find(this.EditFilters.dayparts.options, (daypart) => {
                return daypart.timeFrom === dateFrom && daypart.timeTo === dateTo;
            });

            fileNameBase += dayPart ? '-' + dayPart.name : '-' + dateFrom + '-' + dateTo;
        }

        return fileNameBase.replace(/ /g, '-') + '.csv';

    };

    angular.module('utils').service('CsvExport', CsvExport);
})();