 (function () {
    'use strict';

    function BreakRenderer($rootScope, TimeUtils) {
        this.$rootScope = $rootScope;
        this.TimeUtils = TimeUtils;
        this.breakData = [];
        this.scenarioChunks = [];
        this.activeBreak = null;
    }

    BreakRenderer.prototype.processData = function(scenarioChunks) {
        this.scenarioChunks = scenarioChunks;
        this.breakData.length = 0;
        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                let scenarioChunkContext = scenarioChunk.context;
                this.breakData = this.breakData.concat(scenarioChunk.breaks.map(breakObject => this.decorateBreak(breakObject, scenarioChunkContext, column, scenarioChunk.decimalPlaces)));
            }
        );
    };

    BreakRenderer.prototype.repaintBreaks = function(breaks, breaksdisplayactive, granularity, TABLE_LAYOUT) {
        breaks.selectAll('.break-group').remove();

        if (granularity === 'MIN5') {
            let breakGroups = breaks.selectAll('g')
                .data(this.breakData)
                .enter()
                .append('g')
                .classed({
                    'break-group': true,
                    'break-group--center': d => d.positionInProgramme === 'C',
                    'break-group--end': d => d.positionInProgramme !== 'C',
                    'break-group--locked': d => d.isLocked
                })
                .attr('id', this.breakIdFor)
                .attr('data-selectable', d => d.isLocked ? null : 'break-schedule')
                .attr('data-selectable-type', d => d.isLocked ? null : 'svg');

            breakGroups.append('title').text(abreak => {
                return this.buildTooltip(abreak);
            });

            this.setBreakGroupContainer(breakGroups, TABLE_LAYOUT);
            this.repaintBreakContent(breaks, breaksdisplayactive, TABLE_LAYOUT);
        }
    };

     BreakRenderer.prototype.buildTooltip = function(abreak) {
         let tooltip = `${abreak.date} ${abreak.positionInProgramme} break` +
             `\nNom start time: ${abreak.time}` +
             `\nAct start time: ${abreak.actualTime}`;
         let linkedScenarioString = '';

         if (abreak.linkedScenarioInfo) {
             const linkedScenarioInfo = abreak.linkedScenarioInfo.map(scenario => `${scenario.name} in ${scenario.station}`).join(',');
             linkedScenarioString = `\nLinked to:\n\n${linkedScenarioInfo}`;
         }

         if (abreak.isRegionalDifferenceMarker) {
             tooltip += `\n\nBreak has regional differences`;
         } else {
             tooltip += `\nDuration: ${this.TimeUtils.secondsToTimestring(abreak.duration)}` + `\nTVR: ${abreak.tvr}`;
         }

         if (abreak.narrative) {
             tooltip += `\nNarrative: ${abreak.narrative}`;
         }

         return `${tooltip}${linkedScenarioString}`;
     };

    BreakRenderer.prototype.setupBreakClick = function(breaks, isreadonly) {
        breaks.on('contextmenu', null);

        if(!isreadonly) {
            breaks.on('contextmenu', () => {
                const abreak = d3.event.srcElement.__data__;

                if (!abreak.isLocked) {
                    d3.event.preventDefault();
                    this.breakClick();
                }
            });
        }
    };

    BreakRenderer.prototype.breakClick = function() {
        d3.event.stopPropagation();
        let abreak = d3.event.srcElement.__data__;
        this.activeBreak = abreak;
        this.$rootScope.$broadcast('slotsRightClick', {
            context: 'break',
            affectedObject: abreak,
            event: d3.event,
            scenarioChunk: this.findScenarioChunkFrom(abreak.scenarioChunkContext)
        });
    };

    BreakRenderer.prototype.decorateBreak = function(breakObject, scenarioChunkContext, column, decimalPlaces) {
        breakObject.scenarioChunkContext = scenarioChunkContext;
        breakObject.col = column;
        breakObject.timeIndex = breakObject.time;
        breakObject.decimalPlaces = decimalPlaces;
        return breakObject;
    };

    BreakRenderer.prototype.repaintBreakContent = function(breaks, breaksdisplayactive, TABLE_LAYOUT) {
        let breakWidth = TABLE_LAYOUT.BREAK.WIDE_WIDTH;
        if (breaks) {
            breakWidth = breaksdisplayactive ? 160 : 16;
            breaks.selectAll('.break-group__container').attr('width', breakWidth);

            let breakGroups = d3.selectAll('.break-group');
            let narrativeBreakGroups = d3.selectAll('.break-group').filter((d) => !!d.narrative).filter((d) => !d.isRegionalDifferenceMarker);

            breakGroups.selectAll('text').remove();
            breakGroups.selectAll('rect:not(.break-group__container)').remove();

            if (breaksdisplayactive) {
                this.showLargeBreakLabels(breakGroups, narrativeBreakGroups, TABLE_LAYOUT);
            } else {
                this.showSmallBreakLabels(breakGroups, TABLE_LAYOUT);
            }
        }
    };

    BreakRenderer.prototype.repaintSingleBreak = function(breaks, abreak, breaksdisplayactive, TABLE_LAYOUT) {
        var breakId = `${this.breakIdFor(abreak)}`;

        let breakGroup = breaks.selectAll('#' + breakId);

        if(breakGroup[0].length === 0) {
            breaks
                .append('g')
                .classed({
                    'break-group': true,
                    'break-group--center': abreak.positionInProgramme === 'C',
                    'break-group--end': abreak.positionInProgramme !== 'C',
                    'break-group--locked': abreak.isLocked
                })
                .attr('id', breakId)
                .attr('data-selectable', abreak.isLocked ? null : 'break-schedule')
                .attr('data-selectable-type', abreak.isLocked ? null : 'svg');

            breakGroup = breaks.selectAll('#' + breakId);
            breakGroup.data([abreak]).enter();
            this.setBreakGroupContainer(breakGroup, TABLE_LAYOUT);
        }
        else {
            breakGroup.data([abreak]).enter();
        }

        breakGroup.select('.break-group__container').attr('width', d => !d.isEdited && !breaksdisplayactive ? 16: 160);


        breakGroup.selectAll(`*:not(.break-group__container)`).remove();
        breakGroup.selectAll(`.break-group__container`).attr('y', d => d.position).classed('break-group__container--edited', abreak.isEdited);

        let narrativeBreakGroups = breakGroup.filter((d) => !!d.narrative).filter((d) => !d.isRegionalDifferenceMarker);

        if(abreak.isEdited) {
            this.showEditBreakLabels(breakGroup, TABLE_LAYOUT);
        } else if(breaksdisplayactive) {
            this.showLargeBreakLabels(breakGroup, narrativeBreakGroups, TABLE_LAYOUT);
        } else {
            this.showSmallBreakLabels(breakGroup, narrativeBreakGroups, TABLE_LAYOUT);
        }
    };

    BreakRenderer.prototype.breakIdFor = function(abreak) {
        return `break-${abreak.date}-${abreak.timeIndex}-${abreak.scenarioChunkContext.region}-${abreak.scenarioChunkContext.demographic}-${abreak.status}`;
    };

    BreakRenderer.prototype.setBreakGroupContainer = function (breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('rect')
            .classed('break-group__container', true)
            .classed('difference-marker',  d => d.isRegionalDifferenceMarker || false)
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position);
    };

    BreakRenderer.prototype.findScenarioChunkFrom = function (scenarioChunkContext) {
        return _.find(this.scenarioChunks, scenarioChunk => {
            return _.isEqual(scenarioChunk.context, scenarioChunkContext);
        });
    };

    BreakRenderer.prototype.paintPositionInBreak = function(breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('text')
            .attr('class', 'break-group__position-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 8 + ',' + 8 + ')')
            .text(d => d.isRegionalDifferenceMarker ? '\uf0e7' : d.positionInProgramme)
            .classed('difference-marker', d => d.isRegionalDifferenceMarker);
    };

    BreakRenderer.prototype.showSmallBreakLabels = function(breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('rect')
            .classed('break-group__position-shape', true)
            .classed('break__position--full', true)
            .classed('difference-marker', d => d.isRegionalDifferenceMarker)
            .classed('break__position--center', d => d.positionInProgramme === 'C')
            .classed('break__position--end', d => d.positionInProgramme !== 'C')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 0 + ',' + 0 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        this.paintPositionInBreak(breakGroups, TABLE_LAYOUT);
    };

    BreakRenderer.prototype.showLargeBreakLabels = function(breakGroups, narrativeBreakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('rect')
            .classed('break-group__position-shape', true)
            .classed('break__position--center', d => d.positionInProgramme === 'C')
            .classed('break__position--end', d => d.positionInProgramme !== 'C')
            .classed('difference-marker', d => d.isRegionalDifferenceMarker)
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__duration')
            .attr('x', d => d.col* TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 115 + ',' + 8 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__time')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 48 + ',' + 8 + ')')
            .text(d => this.TimeUtils.getFormattedTime(d.time));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('rect')
            .classed('difference-marker', d => d.isRegionalDifferenceMarker)
            .attr('class', 'break-group__tvr-shape')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 128 + ',' + 2 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__tvr-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 143 + ',' + 8 + ')')
            .text(d => d.tvr || d.tvr === 0 ? d.tvr.toFixed(d.decimalPlaces) : '');

        narrativeBreakGroups
            .append('rect')
            .attr('class', function(d) {
                let breakClass = 'break-group__position-shape ';
                if(d.positionInProgramme === 'C') {
                    breakClass += 'break__position--center';
                } else {
                    breakClass += 'break__position--end';
                }
                return breakClass;
            })
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 46 + ',' + 0 + ')')
            .text(d => 'Narrative');

        narrativeBreakGroups
            .append('text')
            .attr('class', 'break-group__position-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 54 + ',' + 7 + ')')
            .text(d => 'N');

        this.paintPositionInBreak(breakGroups, TABLE_LAYOUT);
    };

    BreakRenderer.prototype.showEditBreakLabels = function(breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('text')
            .attr('class', 'break-group__duration')
            .attr('x', d => d.col* TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 64 + ',' + 8 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups
            .append('text')
            .attr('class', 'break-group__icon')
            .attr('x', d => d.col* TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 37 + ',' + 13 + ')')
            .text('\uf07e');

        breakGroups
            .append('text')
            .attr('class', 'break-group__time')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 93 + ',' + 8 + ')')
            .text(d => `at ${d.time}`);

        breakGroups
            .append('text')
            .attr('class', 'break-group__icon')
            .attr('x', d => d.col* TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.position)
            .attr('transform', () => 'translate(' + 112 + ',' + 13 + ')')
            .text('\uf07d');
    };

    BreakRenderer.prototype.insertBreak = function(abreak, scenarioChunk) {
        let column = this.scenarioChunks.indexOf(scenarioChunk);
        let decoratedBreak = this.decorateBreak(abreak, scenarioChunk.context, column);
        this.activeBreak = decoratedBreak;
        this.breakData.push(decoratedBreak);
    };

    angular.module('slots').service('BreakRenderer', BreakRenderer);
})();
