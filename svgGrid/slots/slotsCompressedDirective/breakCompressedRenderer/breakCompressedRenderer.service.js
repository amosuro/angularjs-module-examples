 (function () {
    'use strict';

    function BreakCompressedRenderer($rootScope, TimeUtils) {
        this.$rootScope = $rootScope;
        this.TimeUtils = TimeUtils;
        this.breakData = [];
        this.scenarioChunks = [];
        this.activeBreak = null;
    }

    BreakCompressedRenderer.prototype.processData = function(scenarioChunks, rowHeaders, TABLE_LAYOUT) {
        this.scenarioChunks = scenarioChunks;
        this.breakData.length = 0;
        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                let scenarioChunkContext = scenarioChunk.context;
                this.breakData = this.breakData.concat(scenarioChunk.breaks.map(breakObject => this.decorateBreak(breakObject, scenarioChunkContext, column, scenarioChunk.decimalPlaces, rowHeaders, TABLE_LAYOUT)));
            }
        );
    };

    BreakCompressedRenderer.prototype.repaintBreaks = function(breaks, TABLE_LAYOUT) {
        breaks.selectAll('.break-group').remove();

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
            .attr('id', this.breakIdFor);

        breakGroups.append('title').text(abreak => {
            let linkedScenarioString = '';

            if (abreak.linkedScenarioInfo) {
                const linkedScenarioInfo = abreak.linkedScenarioInfo.map(scenario => `${scenario.name} in ${scenario.station}`).join(',');
                linkedScenarioString = `Linked to \n\n${linkedScenarioInfo}`;
            }

            let tooltip = `${abreak.date} ${abreak.positionInProgramme} break` +
                `\nNom start time: ${abreak.time}` +
                `\nAct start time: ${abreak.actualTime}`;


            if(!abreak.isRegionalDifferenceMarker) {
                tooltip +=
                    `\nDuration: ${this.TimeUtils.secondsToTimestring(abreak.duration)}` +
                    `\nTVR: ${abreak.tvr}`;
            }

            if (abreak.narrative) {
                tooltip += `\nNarrative: ${abreak.narrative}`;
            }

            return `${tooltip}${linkedScenarioString}`;
        });

        this.setBreakGroupContainer(breakGroups, TABLE_LAYOUT);

        this.repaintBreakContent(breaks, TABLE_LAYOUT);
    };
    
    BreakCompressedRenderer.prototype.decorateBreak = function(breakObject, scenarioChunkContext, column, decimalPlaces, rowHeaders, TABLE_LAYOUT) {
        breakObject.scenarioChunkContext = scenarioChunkContext;
        breakObject.col = column;
        breakObject.timeIndex = breakObject.time;
        breakObject.decimalPlaces = decimalPlaces;
        breakObject.compressedPosition = this.calculateBreakCompressedPosition(breakObject, rowHeaders, TABLE_LAYOUT);
        return breakObject;
    };
    
    BreakCompressedRenderer.prototype.calculateBreakCompressedPosition = function(breakObject, rowHeaders, TABLE_LAYOUT) {
        return rowHeaders.indexOf(breakObject.time) * TABLE_LAYOUT.CELL.NARROW_HEIGHT;
    };
    
    BreakCompressedRenderer.prototype.repaintBreakContent = function(breaks, TABLE_LAYOUT) {
        let breakWidth = TABLE_LAYOUT.BREAK.WIDE_WIDTH;
        if (breaks) {
            breaks.selectAll('.break-group__container').attr('width', TABLE_LAYOUT.BREAK.WIDE_WIDTH);

            let breakGroups = d3.selectAll('.break-group');
            let narrativeBreakGroups = d3.selectAll('.break-group').filter((d) => !!d.narrative).filter((d) => !d.isRegionalDifferenceMarker);
            
            breakGroups.selectAll('text').remove();
            breakGroups.selectAll('rect:not(.break-group__container)').remove();

            this.showLargeBreakLabels(breakGroups, narrativeBreakGroups, TABLE_LAYOUT);
        }
    };

    BreakCompressedRenderer.prototype.breakIdFor = function(abreak) {
        return `break-${abreak.date}-${abreak.timeIndex}-${abreak.scenarioChunkContext.region}-${abreak.scenarioChunkContext.demographic}-${abreak.status}`;
    };

    BreakCompressedRenderer.prototype.setBreakGroupContainer = function (breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('rect')
            .classed('break-group__container', true)
            .classed('difference-marker',  d => d.isRegionalDifferenceMarker || false)
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition);
    };

    BreakCompressedRenderer.prototype.paintPositionInBreak = function(breakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('text')
            .attr('class', 'break-group__position-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 7 + ',' + 7 + ')')
            .text(d => d.isRegionalDifferenceMarker ? '\uf0e7' : d.positionInProgramme)
            .classed('difference-marker', d => d.isRegionalDifferenceMarker);
    };

    BreakCompressedRenderer.prototype.showLargeBreakLabels = function(breakGroups, narrativeBreakGroups, TABLE_LAYOUT) {
        breakGroups
            .append('rect')
            .classed('break-group__position-shape', true)
            .classed('break__position--center', d => d.positionInProgramme === 'C')
            .classed('break__position--end', d => d.positionInProgramme !== 'C')
            .classed('difference-marker', d => d.isRegionalDifferenceMarker)
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__duration')
            .attr('x', d => d.col* TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 112 + ',' + 7 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__time')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 86 + ',' + 7 + ')')
            .text(d => this.TimeUtils.getFormattedTime(d.time));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('rect')
            .attr('class', 'break-group__tvr-shape')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 128 + ',' + 2 + ')')
            .text(d => this.TimeUtils.secondsToTimestring(d.duration));

        breakGroups.filter(d => !d.isRegionalDifferenceMarker)
            .append('text')
            .attr('class', 'break-group__tvr-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 143 + ',' + 7 + ')')
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
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 86 + ',' + 0 + ')')
            .text(d => 'Narrative');
                
        narrativeBreakGroups
            .append('text')
            .attr('class', 'break-group__position-text')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.compressedPosition)
            .attr('transform', () => 'translate(' + 93 + ',' + 7 + ')')
            .text(d => 'N');
            
        this.paintPositionInBreak(breakGroups, TABLE_LAYOUT);
    };

    angular.module('slots').service('BreakCompressedRenderer', BreakCompressedRenderer);
})();
