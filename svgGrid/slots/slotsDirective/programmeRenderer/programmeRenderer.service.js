(function () {
    'use strict';

    function ProgrammeRenderer($rootScope, SELECTION_TYPES, TimeUtils, SvgGrid, UtilsService, ScheduleDataParser, SelectionModel) {
        this.$rootScope = $rootScope;
        this.SELECTION_TYPES = SELECTION_TYPES;
        this.TimeUtils = TimeUtils;
        this.SvgGrid = SvgGrid;
        this.UtilsService = UtilsService;
        this.ScheduleDataParser = ScheduleDataParser;
        this.SelectionModel = SelectionModel;
        this.programmeData = [];
        this.programmeGroups = null;
        this.scenarioChunks = [];
    }

    ProgrammeRenderer.prototype.processData = function (scenarioChunks) {
        this.scenarioChunks = scenarioChunks;
        this.programmeData.length = 0;

        // TODO: should be calculated on the scenarioChunk.
        let newPixelsPerMinute = this.scenarioChunks.length ? this.SvgGrid.pixelsPerMinuteFor(this.scenarioChunks[0].context.granularity) : 0;

        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                // TODO: should be calculated on the scenarioChunk.
                scenarioChunk.pixelsPerMinute = newPixelsPerMinute;
                let scenarioChunkContext = angular.copy(scenarioChunk.context),
                    programmeOffset = 0;
                this.programmeData = this.programmeData.concat(scenarioChunk.programmes.map((programmeObject, index) => {
                    programmeObject.regionCode = scenarioChunk.regionCode;
                    programmeObject.decimalPlaces = scenarioChunk.decimalPlaces;
                    programmeObject.scenarioChunkContext = scenarioChunkContext;
                    programmeObject.col = column;
                    programmeObject.topPosition = programmeOffset;
                    programmeObject.height = programmeObject.displayDuration * scenarioChunk.pixelsPerMinute;
                    programmeObject.slotsId = `${column}_${index}`;
                    programmeOffset += programmeObject.height;
                    return programmeObject;
                }));
            }
        );
    };

    ProgrammeRenderer.prototype.repaintProgrammes = function(programmes, granularity, currency, programmeeditactive, TABLE_LAYOUT, slotsNodeName) {
        programmes.selectAll('.programme-group').remove();
        if (granularity !== 'DAY') {
            this.programmeGroups = programmes.selectAll('g')
                .data(this.programmeData, programme => programme.startTime + ':' + programme.col)
                .enter()
                .append('g')
                .attr('class','programme-group')
                .attr('id', d => d.slotsId)
                .attr('data-selectable', d => d.isLocked ? null : 'programme-schedule')
                .attr('data-selectable-type', d => d.isLocked ? null : 'svg');

            programmes.selectAll('g').data(this.programmeData, programme => programme.startTime + ':' + programme.col).exit().remove();
            this.programmeGroups.append('title').text(programme => {
                let linkedScenarioString = '';
                const programmeInfo = `Desc: ${programme.description} \nStart time: ${programme.startTime} \nEnd time: ${programme.endTime}`;

                if (programme.linkedScenarioInfo) {
                    const linkedScenarioInfo = programme.linkedScenarioInfo.map(scenario => `(${scenario.name}, ${scenario.station})`).join(',');
                    linkedScenarioString = `\nLinked to \n${linkedScenarioInfo}`;
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

            this.repaintProgrammeContent(programmes, currency, programmeeditactive, TABLE_LAYOUT, slotsNodeName);
        }
    };

    ProgrammeRenderer.prototype.setupProgrammeClick = function(programmes, isreadonly) {
        programmes.on('contextmenu', null);
        if(!isreadonly) {
            programmes.on('contextmenu', () => {
                const programme = d3.event.srcElement.__data__;

                d3.event.preventDefault();
                this.programmeClick();
            });
        }
    };

    ProgrammeRenderer.prototype.programmeClick = function() {
        d3.event.stopPropagation();
        const _root = this,
              programmes = _root.SelectionModel.isTypeEmpty(this.SELECTION_TYPES.SCHEDULE_PROGRAMME) ?  [d3.event.srcElement.__data__] : _root.SelectionModel.getByType(this.SELECTION_TYPES.SCHEDULE_PROGRAMME);
        _root.$rootScope.$broadcast('slotsRightClick', {
            context: 'programme',
            affectedObject: programmes,
            event: d3.event,
            scenarioChunk: programmes.map(programme => _root.findScenarioChunkFrom(programme.scenarioChunkContext))
        });
    };

    ProgrammeRenderer.prototype.findScenarioChunkFrom = function (scenarioChunkContext) {
        return _.find(this.scenarioChunks, scenarioChunk => {
            return _.isEqual(scenarioChunk.context, scenarioChunkContext);
        });
    };

    ProgrammeRenderer.prototype.repaintProgrammeContent = function (programmes, currency, programmeeditactive, TABLE_LAYOUT, slotsNodeName) {
        TABLE_LAYOUT.PROGRAMME.WIDE_WIDTH = programmeeditactive ? 160 : 24;

        programmes.selectAll('g').selectAll('.programme--svg').attr('width', TABLE_LAYOUT.PROGRAMME.WIDE_WIDTH);

        let programmeGrps = d3.selectAll('.programme-group');
        programmeGrps.selectAll('text').remove();
        if(programmeeditactive) {
            this.showLargeProgrammeLabels(programmes, currency, TABLE_LAYOUT, slotsNodeName);
        }
        else{
            this.showSmallProgrammeLabels(programmes, TABLE_LAYOUT);
        }
    };

    ProgrammeRenderer.prototype.showSmallProgrammeLabels = function (programmes, TABLE_LAYOUT){
        programmes.selectAll('g').append('text')
            .attr('class', 'programme__label--svg')
            .attr('transform', d => {
                let xPosition = d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 13,
                    yPosition = (d.isShared || d.isLocked) ? d.topPosition + 20 : d.topPosition + 5;
                return 'translate(' + xPosition + ',' + yPosition + ') rotate(-90)';
            })
            .text(d => d.description).each(this.truncateProgrammeText);

        programmes.selectAll('g').filter(d => d.isShared || d.isLocked).append('text')
            .attr('transform', d => {
                let xPosition = d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 10,
                    yPosition = d.topPosition + 15;
                return 'translate(' + xPosition + ',' + yPosition + ')';
            })
            .classed({
                'programme-group__icon': true,
                'programme-group__icon--shared': d => d.isShared,
                'programme-group__icon--locked': d => d.isLocked
            })
            .text(d => d.isShared ? '\uf0c1' : '\uf023');
    };

    ProgrammeRenderer.prototype.truncateProgrammeText = function (d) {
        let self = d3.select(this), // jshint ignore:line
            textLength = self.node().getComputedTextLength(),
            text = self.text(),
            leftPadding = 7;

        while (textLength > (d.height - leftPadding) && text.length > 0) {
            text = text.slice(0, -1);
            self.text(text + '...');
            textLength = self.node().getComputedTextLength();
        }
    };

    ProgrammeRenderer.prototype.showLargeProgrammeLabels = function (programmes, currency, TABLE_LAYOUT, slotsNodeName) {
        let _root = this;

        programmes.selectAll('g').append('text').text(function (d) {
            return d.description;
        }).each(wrapProgrammeName)
            .attr('transform', d => {
                let xPosition = d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 7,
                    yPosition = d.topPosition + 17;
                return 'translate(' + xPosition + ',' + yPosition + ')';
            });

        programmes.selectAll('g').filter(d => d.isShared || d.isLocked).append('text')
            .attr('transform', d => {
                let xPosition = d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 105,
                    yPosition = d.topPosition + 15;
                return 'translate(' + xPosition + ',' + yPosition + ')';
            })
            .classed({
                'programme-group__icon': true,
                'programme-group__icon--shared': d => d.isShared,
                'programme-group__icon--locked': d => d.isLocked
            })
            .text(d => d.isShared ? '\uf0c1' : '\uf023');

        function wrapProgrammeName (d) {
            let currentNode = this, // jshint ignore:line
                width = (d.isShared || d.isLocked) ? 95 : 160,
                text = d3.select(currentNode),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
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

            text.append('tspan')
                .attr('class', 'programme__average--svg')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy',  lineHeight + 'em')
                .attr('data-timeslot-text', d => slotsNodeName)
                .text(_root.UtilsService.activeCurrencyValueFor(d, currency, d.decimalPlaces));

            let fromTo = d.startTime +'-'+ d.endTime,
                programmeDuration = ' (' + d.duration + 'min)';

            text.append('tspan')
                .attr('class', 'programme__airtime--svg')
                .attr('x', 0)
                .attr('y', y)
                .attr('dy',  lineHeight + 'em')
                .text(fromTo +programmeDuration);
        }
    };

    ProgrammeRenderer.prototype.changeCurrency = function (currency, nodeName) {
        d3.selectAll(`[data-timeslot-text=${nodeName}]`).text(timeSlot => this.UtilsService.activeCurrencyValueFor(timeSlot, currency, timeSlot.decimalPlaces));       
    };

    angular.module('slots').service('ProgrammeRenderer', ProgrammeRenderer);
})();
