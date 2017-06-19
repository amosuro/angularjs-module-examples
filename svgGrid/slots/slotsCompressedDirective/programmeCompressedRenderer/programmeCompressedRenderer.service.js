(function () {
    'use strict';

    function ProgrammeCompressedRenderer($rootScope, TimeUtils, UtilsService, ScheduleDataParser) {
        this.$rootScope = $rootScope;
        this.TimeUtils = TimeUtils;
        this.UtilsService = UtilsService;
        this.ScheduleDataParser = ScheduleDataParser;
        this.programmeData = [];
        this.programmeGroups = null;
        this.scenarioChunks = [];
    }

    ProgrammeCompressedRenderer.prototype.processData = function (scenarioChunks) {
        this.scenarioChunks = scenarioChunks;
        this.programmeData.length = 0;

        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                let scenarioChunkContext = angular.copy(scenarioChunk.context),
                    programmeOffset = 0;
                this.programmeData = this.programmeData.concat(scenarioChunk.programmes.map(programmeObject => {
                    programmeObject.regionCode = scenarioChunk.regionCode;
                    programmeObject.decimalPlaces = scenarioChunk.decimalPlaces;
                    programmeObject.scenarioChunkContext = scenarioChunkContext;
                    programmeObject.col = column;
                    programmeObject.topPosition = programmeOffset;
                    programmeObject.height = programmeObject.compressedHeight * 20;
                    programmeOffset += programmeObject.height;
                    return programmeObject;
                }));
            }
        );
    };

    ProgrammeCompressedRenderer.prototype.repaintProgrammes = function(programmes, currency, programmecompressedactive, TABLE_LAYOUT, slotsNodeName) {
        programmes.selectAll('.programme-group--compressed').remove();
        this.programmeGroups = programmes.selectAll('g')
            .data(this.programmeData, programme => programme.startTime + ':' + programme.col)
            .enter()
            .append('g')
            .attr('class','programme-group--compressed');
            
        programmes.selectAll('g').data(this.programmeData, programme => programme.startTime + ':' + programme.col).exit().remove();
        this.programmeGroups.append('title').text(programme => {
            let linkedScenarioString = '';
            const programmeInfo = `Desc: ${programme.description} \nStart time: ${programme.startTime} \nEnd time: ${programme.endTime}`;

            if (programme.linkedScenarioInfo) {
                const linkedScenarioInfo = programme.linkedScenarioInfo.map(scenario => `${scenario.name} in ${scenario.station}`).join(',');
                linkedScenarioString = `Linked to \n\n${linkedScenarioInfo}`;
            }

            return `${programmeInfo}${linkedScenarioString}`;
        });
        this.programmeGroups.append('rect')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.topPosition)
            .attr('height', d => d.height)
            .attr('width', TABLE_LAYOUT.PROGRAMME.WIDE_WIDTH)
            .attr('class', d => 'programme--svg ' + this.ScheduleDataParser.colorForCategory(d.categories))
            .classed({
                'programme--svg--locked': d => d.isLocked,
                'programme--svg--shared': d => d.isShared
            });

        this.repaintProgrammeContent(programmes, currency, programmecompressedactive, TABLE_LAYOUT, slotsNodeName);
    };

    ProgrammeCompressedRenderer.prototype.repaintProgrammeContent = function (programmes, currency, programmecompressedactive, TABLE_LAYOUT, slotsNodeName) {
        programmes.selectAll('g').selectAll('.programme--svg').attr('width', TABLE_LAYOUT.PROGRAMME.WIDE_WIDTH);

        let programmeGrps = d3.selectAll('.programme-group--compressed');
        programmeGrps.selectAll('text').remove();

        this.showLargeProgrammeLabels(programmes, currency, TABLE_LAYOUT, slotsNodeName);

    };

    ProgrammeCompressedRenderer.prototype.showLargeProgrammeLabels = function (programmes, currency, TABLE_LAYOUT, slotsNodeName) {
        const LABELS = {
            TVR: {
                WIDE_WIDTH: 30
            }
        };

        programmes.selectAll('g')
            .append('text')
            .text(d => d.description)
            .each(wrapProgrammeName)
            .attr('transform', d => {
                let xPosition = d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 7,
                    yPosition = d.topPosition + 13;
                return 'translate(' + xPosition + ',' + yPosition + ')';
            });
        
        programmes.selectAll('g')
            .append('rect')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.topPosition)
            .attr('height', d => 15)
            .attr('width', TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('transform', () => `translate(${TABLE_LAYOUT.CELL.WIDE_WIDTH - LABELS.TVR.WIDE_WIDTH}, 0)`)
            .attr('class', d => 'programme--tvr-rect ');
        
        programmes.selectAll('g')
            .append('text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.topPosition + 12)
            .attr('class', 'programme__average--svg')
            .attr('data-timeslot-text', d => slotsNodeName)
            .attr('transform', (d) => `translate(${(TABLE_LAYOUT.CELL.WIDE_WIDTH - LABELS.TVR.WIDE_WIDTH) + 4}, 0)`)
            .text(programme => this.UtilsService.activeCurrencyValueFor(programme, currency, programme.decimalPlaces));

        function wrapProgrammeName (d) {
            let currentNode = this, // jshint ignore:line
                width = 120,
                text = d3.select(currentNode),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr('y'),
                tspan = text.text(null).append('tspan').attr('class', 'programme__name--svg').attr('x', 0).attr('y', y).attr('dy', 0 + 'em');
            while ((word = words.pop())!== undefined) {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('class', 'programme__name--svg').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + 'em').text(word);
                }
            }
        }
    };

    ProgrammeCompressedRenderer.prototype.changeCurrency = function (currency, nodeName) {
        d3.selectAll(`[data-timeslot-text=${nodeName}]`).text(timeSlot => this.UtilsService.activeCurrencyValueFor(timeSlot, currency, timeSlot.decimalPlaces));       
    };

    angular.module('slots').service('ProgrammeCompressedRenderer', ProgrammeCompressedRenderer);
})();
