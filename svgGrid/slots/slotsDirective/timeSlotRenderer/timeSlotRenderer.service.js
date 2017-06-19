(function () {
    'use strict';

    function TimeSlotRenderer(EditManager, EditPending, SvgGrid, UtilsService, KEY_DICTIONARY) {
        this.currency = {};
        this.EditManager = EditManager;
        this.EditPending = EditPending;
        this.SvgGrid = SvgGrid;
        this.UtilsService = UtilsService;
        this.KEY_DICTIONARY = KEY_DICTIONARY;
        this.timeSlotsData = [];
    }

    TimeSlotRenderer.prototype.processData = function (scenarioChunks) {
        this.scenarioChunks = scenarioChunks;
        this.timeSlotsData.length = 0;

        // TODO: should be calculated on the scenarioChunk.
        let firstScenarioChunk = _.head(this.scenarioChunks),
            newPixelsPerMinute = firstScenarioChunk ? this.SvgGrid.pixelsPerMinuteFor(firstScenarioChunk.context.granularity) : 0;

        scenarioChunks.forEach(
            (scenarioChunk, column) => {
                //for demographics we skip the last timeslots, which is the individuals demo
                let timeslotsSource = scenarioChunk.timeslots;
                // TODO: should be calculated on the scenarioChunk.
                scenarioChunk.pixelsPerMinute = newPixelsPerMinute;
                this.timeSlotsData = this.timeSlotsData.concat(timeslotsSource.map((timeSlot, row) => {

                    timeSlot.regionCode = scenarioChunk.regionCode;
                    timeSlot.decimalPlaces = scenarioChunk.decimalPlaces;
                    timeSlot.row = row;
                    timeSlot.col = column;
                    if (scenarioChunk.meta && scenarioChunk.meta.breakObject) {
                        timeSlot.breakObject = scenarioChunk.meta.breakObject;
                        timeSlot.context = scenarioChunk.context;
                    }
                    if (scenarioChunk.timeslotsDifference[row]) {
                        timeSlot.difference = scenarioChunk.timeslotsDifference[row];
                    }
                    return timeSlot;
                }));
            }
        );
    };

    TimeSlotRenderer.prototype.repaintTimeSlots = function (slotsNodeName, programmeeditactive, granularity, currency, TABLE_LAYOUT, isReadonly, kpi) {
        let _root = this,
            group,
            svg,
            timeSlots,
            timeSlotDataSelection;

        var timeSlotGroupId = `${slotsNodeName}__timeSlots`;

        svg = d3.select(slotsNodeName).select('svg');
        timeSlots = svg.select('#' + timeSlotGroupId);
        timeSlots.selectAll('.time-slot-group').on('click', null);
        timeSlots.remove(); // for performance reasons we reduce the dom size here
        timeSlots = svg.insert('g', `#${slotsNodeName}__programmes`).attr('id', timeSlotGroupId);
        timeSlotDataSelection =
            timeSlots.selectAll('g')
                .data(programmeeditactive ? [] : this.timeSlotsData, d => d.row + ':' + d.col);
        group = timeSlotDataSelection
            .enter()
            .append('g')
            .attr('class', 'time-slot-group');

        if (!isReadonly) {
            group.on('click', function (timeSlots) {
                const timeslot = d3.event.srcElement.__data__;

                if (!timeslot.isLocked) {
                    d3.event.preventDefault();
                    _root.timeSlotClick(timeSlots, _root, this, currency, TABLE_LAYOUT, granularity);
                }
            });
        }

        timeSlotDataSelection.exit().remove();

        group.append('text')
            .attr('x', d => (d.col + 0.5) * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => (d.row + 0.5) * TABLE_LAYOUT.CELL.HEIGHT)
            .attr('class', 'data-grid__cell-content')
            .attr('id', a => 'id' + a.row + '_' + a.col)
            .attr('data-timeslot-text', a => slotsNodeName)
            .text(d => this.UtilsService.activeCurrencyValueFor(d, currency, d.decimalPlaces));

        group.append('rect')
            .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH)
            .attr('y', d => d.row * TABLE_LAYOUT.CELL.HEIGHT)
            .attr('class', d => {
                let className = 'data-grid__cell data-grid__cell--wide';
                let difference = d.difference ? this.UtilsService.activeCurrencyValueFor(d.difference, kpi, d.decimalPlaces) : 0;
                if (difference > 0) {
                    className = className + ' data-grid__cell--increased';
                }
                if (difference < 0) {
                    className = className + ' data-grid__cell--decreased';
                }
                if (d.breakObject && currency.id !== 'tvr') {
                    className = className + ' data-grid__cell--disabled';
                }
                return className;
            })
            .classed('data-grid__cell--disabled', d => d.isLocked);
    };

    TimeSlotRenderer.prototype.timeSlotClick = function (timeSlot, _root, currentElem, currency, TABLE_LAYOUT, granularity) {
        if (timeSlot.breakObject && currency.id !== 'tvr') {
            return false;
        }
        let current = d3.select(currentElem);
        if (current.select('foreignObject').empty()) {

            var initialValue = angular.copy(current.select('text').text());
            let inputElem = current
                .append('foreignObject')
                .attr('height', TABLE_LAYOUT.HEIGHT)
                .attr('x', d => d.col * TABLE_LAYOUT.CELL.WIDE_WIDTH + 16)
                .attr('y', d => d.row * TABLE_LAYOUT.CELL.HEIGHT)
                .append('xhtml:body')
                .append('input')
                .attr('type', 'text')
                .classed({
                    'edit-cell__input': true,
                    'data-grid__cell--wide': true
                })
                .attr('value', initialValue);

            inputElem.node().focus();
            inputElem.node().setSelectionRange(0, initialValue.length);

            inputElem.on('blur', () => {
                _root.timeSlotBlur(timeSlot, _root, current, initialValue, inputElem, currency, granularity);
            });

            inputElem.on('keydown', () => {
                if (_root.KEY_DICTIONARY[d3.event.which] === 'escape') {
                    removeInput(inputElem);
                }
                if (_root.KEY_DICTIONARY[d3.event.which] === 'enter') {
                    $('.edit-cell__input').blur();
                }
            });
        }
    };

    TimeSlotRenderer.prototype.timeSlotBlur = function (timeSlot, _root, current, initialValue, inputElem, currency, granularity) {
        let inputValue = current.select('input').node().value;
        let isAStringValue = !!inputValue && (typeof inputValue === 'string');
        let doesNotStartOrEndWithDecimalMark = inputValue.indexOf('.') !== 0 && inputValue.indexOf('.') !== inputValue.length - 1;
        let isValidNumberOrExpression = _root.isValidNumberOrExpression(inputValue, currency);
        let valueHasChanged = inputValue !== initialValue;
        let isValidChange = isAStringValue && valueHasChanged && doesNotStartOrEndWithDecimalMark && isValidNumberOrExpression;

        if (isValidChange) {
            _root.EditManager.previewEditResult(angular.copy(timeSlot), currency.id, inputValue, timeSlot.regionCode)// piglet ask ashley
                .catch(() => {
                    _root.EditPending.undo();
                    current.select('text').text(initialValue);
                })
                .finally(() => {
                    removeInput(inputElem);
                });
        } else {
            removeInput(inputElem);
        }
    };

    function removeInput(inputElem) {
        inputElem.on('blur', null);
        inputElem.on('keydown', null);
        d3.select('foreignObject').remove();
    }

    TimeSlotRenderer.prototype.changeCurrency = function (currency, nodeName) {
        d3.selectAll(`[data-timeslot-text=${nodeName}]`).text(timeSlot => this.UtilsService.activeCurrencyValueFor(timeSlot, currency, timeSlot.decimalPlaces));      
    };

    TimeSlotRenderer.prototype.isValidNumberOrExpression = function (expression, currency) {
        if (isNaN(Number(expression))) {
            return true;
        }
        switch (currency.id) {
            case 'tvr':
                return expression >= 0 && expression <= 100;
            case 'share':
                return expression >= 0 && expression <= 1.0;
            case 'totalTvr':
                return expression >= 0 && expression <= 100;
        }
    };

    angular.module('slots').service('TimeSlotRenderer', TimeSlotRenderer);
})();
