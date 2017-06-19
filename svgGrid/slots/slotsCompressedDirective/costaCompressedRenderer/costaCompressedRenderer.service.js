(function () {
    'use strict';

    function CostaCompressedRenderer(SvgGrid, DaypartsSelector, TimeUtils, $location, EditModel, TABLE_LAYOUT) {
        this.SvgGrid = SvgGrid;
        this.DaypartsSelector = DaypartsSelector.new();
        this.TimeUtils = TimeUtils;
        this.costaData = [];
        this.costaGroups = null;
        this.scenarioChunks = [];
        this.$location = $location;
        this.EditModel = EditModel;
        this.TABLE_LAYOUT = TABLE_LAYOUT;
    }

    CostaCompressedRenderer.prototype.processData = function (scenarioChunks) {
        this.scenarioChunks = scenarioChunks;
        this.costaData.length = 0;

        const dayPartStartTime = parseInt(this.$location.search().editTimeFrom);
        const dayPartEndTime = parseInt(this.$location.search().editTimeTo);

        this.scenarioChunks.forEach(
            (scenarioChunk, column) => {
                if (scenarioChunk.costa.hourly) {
                    const scenarioChunkContext = angular.copy(scenarioChunk.context);
                    const costaHours = this.filterCostaHours(scenarioChunk, dayPartStartTime, dayPartEndTime);

                    if (costaHours.length) {
                        let hourOffset = 0;

                        this.costaData = this.costaData.concat(costaHours.map(hour => {
                            hour.scenarioChunkContext = scenarioChunkContext;
                            hour.topPosition = hourOffset;
                            hour.height = this.setCostaHourHeight(hour);
                            hour.col = column;
                            hourOffset += hour.height;

                            return hour;
                        }));
                    }
                }
            }
        );
    };

    CostaCompressedRenderer.prototype.filterCostaHours = function (scenarioChunk, dayPartStartTime, dayPartEndTime) {
        const headers = this.EditModel.headers.yCompressed.map(timeString => parseInt(timeString.replace(':', '')));

        return Object.keys(scenarioChunk.costa.hourly)
            .map(hour => scenarioChunk.costa.hourly[hour])
            .filter((hour) => (hour.startTime >= (dayPartStartTime - (dayPartStartTime % 100)) && hour.endTime <= (dayPartEndTime - (dayPartEndTime % 100) + 100)))
            .filter((hour) => headers.some((time) => hour.startTime <= time && time <= hour.endTime));
    };

    CostaCompressedRenderer.prototype.setCostaHourHeight = function (hour) {
        const startTime = this.TimeUtils.getFormattedTime(hour.startTime);

        return this.EditModel.headers.yCompressed.filter((time) => time.split(':')[0] === startTime.split(':')[0]).length * 20;
    };

    CostaCompressedRenderer.prototype.repaintCosta = function(costaHours, granularity, currency, TABLE_LAYOUT) {
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

    CostaCompressedRenderer.prototype.colorForCostaResult = function (result) {
        return result.toLowerCase();
    };

    angular.module('slots').service('CostaCompressedRenderer', CostaCompressedRenderer);
})();
