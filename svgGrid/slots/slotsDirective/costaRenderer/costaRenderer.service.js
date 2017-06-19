(function () {
    'use strict';

    function CostaRenderer(SvgGrid, DaypartsSelector, TimeUtils, $location) {
        this.SvgGrid = SvgGrid;
        this.DaypartsSelector = DaypartsSelector.new();
        this.TimeUtils = TimeUtils;
        this.costaData = [];
        this.costaGroups = null;
        this.scenarioChunks = [];
        this.$location = $location;
    }

    CostaRenderer.prototype.processData = function (scenarioChunks, TABLE_LAYOUT) {
        this.scenarioChunks = scenarioChunks;
        this.costaData.length = 0;

        // TODO: should be calculated on the scenarioChunk.
        const newPixelsPerMinute = this.scenarioChunks.length ? this.SvgGrid.pixelsPerMinuteFor(this.scenarioChunks[0].context.granularity) : 0;
        const dayPartStartTime = parseInt(this.$location.search().editTimeFrom);
        const dayPartEndTime = parseInt(this.$location.search().editTimeTo);

        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                if (scenarioChunk.costa.hourly) {
                    // TODO: should be calculated on the scenarioChunk.
                    scenarioChunk.pixelsPerMinute = newPixelsPerMinute;
                    let scenarioChunkContext = angular.copy(scenarioChunk.context),
                        costaHours = Object.keys(scenarioChunk.costa.hourly)
                                           .map(hour => scenarioChunk.costa.hourly[hour])
                                           .filter((hour) => (hour.startTime >= (dayPartStartTime - (dayPartStartTime % 100)) && hour.endTime <= (dayPartEndTime - (dayPartEndTime % 100) + 100)));
                    if (costaHours.length) {
                        let hourOffset = this.setCostaHourOffset(costaHours[0].startTime, dayPartStartTime, newPixelsPerMinute);
                        this.costaData = this.costaData.concat(costaHours.map(hour => {
                            hour.scenarioChunkContext = scenarioChunkContext;
                            hour.topPosition = hourOffset;
                            hour.height = hour.duration * scenarioChunk.pixelsPerMinute;
                            hourOffset += hour.height; // Update offset so next hour has correct offset
                            hour.col = column;
                            return hour;
                        }));
                    }
                }
            }
        );
    };

    CostaRenderer.prototype.setCostaHourOffset = function (startTime, dayPartStartTime, pixelsPerMinute) {
        if (dayPartStartTime < startTime) {
            let difference = this.TimeUtils.numberOfMinutes(startTime - dayPartStartTime);
            return difference * pixelsPerMinute;
        }

        return 0;
    };

    CostaRenderer.prototype.repaintCosta = function(costaHours, granularity, currency, TABLE_LAYOUT) {
        const svgClasses = {
            group: 'costa-group',
            rect: 'costa-group__rect',
            line: 'costa-group__line',
            text: 'costa-group__text'
        };
    
        costaHours.selectAll(`.${svgClasses.group}`).remove();
        
        if (granularity !== 'DAY') {
            this.costaGroups = costaHours.selectAll('g')
                .data(this.costaData.filter((hour) => hour.result !== 'EMPTY'), hour => hour.startTime + ':' + hour.col)
                .enter()
                .append('g')
                    .attr('class', `${svgClasses.group}`);

            costaHours.selectAll('g').data(this.costaData, hour => hour.startTime + ':' + hour.col).exit().remove();
            this.costaGroups.append('rect')
                    .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
                    .attr('y', d => d.topPosition)
                    .attr('height', d => d.height)
                    .attr('width', TABLE_LAYOUT.COSTA.NARROW_WIDTH)
                    .attr('class', d => `${svgClasses.rect} ${svgClasses.rect}--${this.colorForCostaResult(d.result)}`);
            this.costaGroups.append('rect')
                    .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + TABLE_LAYOUT.COSTA.NARROW_WIDTH)
                    .attr('y', d => d.topPosition + (d.height - 16))
                    .attr('height', d => TABLE_LAYOUT.COSTA.HEIGHT)
                    .attr('width', TABLE_LAYOUT.COSTA.WIDTH)
                    .attr('class', d => `${svgClasses.rect} ${svgClasses.rect}--${this.colorForCostaResult(d.result)}`);
            this.costaGroups.append('text')
                .attr('class', d => `${svgClasses.text} ${svgClasses.text}--${this.colorForCostaResult(d.result)}`)
                .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
                .attr('y', d => d.topPosition + (d.height - 16))
                .attr('transform', () => 'translate(' + 18 + ',' + 7 + ')')
                .text(d => d.subregionalDiff ? '--' : d.diff);

        }
    };

    CostaRenderer.prototype.colorForCostaResult = function (result) {
        return result.toLowerCase();
    };

    angular.module('slots').service('CostaRenderer', CostaRenderer);
})();
