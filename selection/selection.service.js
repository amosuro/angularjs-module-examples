(function () {
    'use strict';

    const DOM_CHECK_DEPTH = 4,
        SELECTED_CLASS = 'is-selected',
        SELECTABLE_ATTRIBUTE = 'data-selectable',
        SELECTABLE_DOM_TYPE = 'data-selectable-type'; // This is used to identify whether we need to use the SVG vs HTML approach for selection. Takes 'svg' or 'html'.

    function Selection($q,
                       $rootScope,
                       BreaksManager,
                       Clipboard,
                       CollectiveProcess,
                       ComparisonGridModel,
                       ComparisonModel,
                       CopyPasteUtils,
                       Demographics,
                       EditDefinitions,
                       EditManager,
                       EditPending,
                       KeyControl,
                       MessagePanelState,
                       ProgrammeDetails,
                       SELECTION_TYPES,
                       ScheduleModel,
                       SelectionModel,
                       SelectionPaste,
                       SelectionValidation,
                       TimeslotsDataProcessing,
                       TimeUtils,
                       UtilsService) {

        this.$q = $q;
        this.$rootScope = $rootScope;
        this.BreaksManager = BreaksManager;
        this.Clipboard = Clipboard;
        this.CollectiveProcess = CollectiveProcess;
        this.ComparisonGridModel = ComparisonGridModel;
        this.ComparisonModel = ComparisonModel;
        this.CopyPasteUtils = CopyPasteUtils;
        this.Demographics = Demographics;
        this.EditDefinitions = EditDefinitions;
        this.EditManager = EditManager;
        this.EditPending = EditPending;
        this.KeyControl = KeyControl;
        this.MessagePanelState = MessagePanelState;
        this.ProgrammeDetails = ProgrammeDetails;
        this.SELECTION_TYPES = SELECTION_TYPES;
        this.ScheduleModel = ScheduleModel;
        this.SelectionModel = SelectionModel;
        this.SelectionPaste = SelectionPaste;
        this.SelectionValidation = SelectionValidation;
        this.TimeslotsDataProcessing = TimeslotsDataProcessing;
        this.TimeUtils = TimeUtils;
        this.UtilsService = UtilsService;

        this.elementsPreviouslySelected = [];
    }

    Selection.prototype.isInListView = function (selectableElement, SELECTION_TYPES) {
        return selectableElement.getAttribute(SELECTABLE_ATTRIBUTE) !== SELECTION_TYPES.SCHEDULE_PROGRAMME &&
            selectableElement.getAttribute(SELECTABLE_ATTRIBUTE) !== SELECTION_TYPES.SCHEDULE_BREAK &&
            selectableElement.getAttribute(SELECTABLE_ATTRIBUTE) !== SELECTION_TYPES.TOTALTVR;
    };

    Selection.prototype.isRenderedWithD3 = function (selectableElement) {
        return this.getDOMElementType(selectableElement) === 'svg';
    };

    Selection.prototype.handleClick = function (event) {
        let element = event.target,
            selectableElement = this.UtilsService.findSelectableAncestor(element, DOM_CHECK_DEPTH, SELECTABLE_ATTRIBUTE);

        if (selectableElement) {
            const selectionData = this.getElementData(selectableElement);
            const selectionType = this.getSelectionContext(selectableElement);

            let previouslySelectedData = this.elementsPreviouslySelected,
                previouslySelectedType = this.elementsPreviouslySelected
                    .filter(element => element.isSelected === selectionType)
                    .map((element) => element.isSelected);

            this.toggleMarkedStatus(selectableElement, selectionData, previouslySelectedData, selectionType, previouslySelectedType);

            if (this.elementsPreviouslySelected.indexOf(selectionData) < 0) {
                this.elementsPreviouslySelected.push(selectionData);
            }
        } else {
            this.unselectPreviousElements();
        }

        this.elementsPreviouslySelected = this.elementsPreviouslySelected.filter(e => !!e.isSelected);
    };

    Selection.prototype.handleCopyPaste = function () {
        let data = this.SelectionModel.get();

        if (data.length < 1) {
            return;
        }

        if (this.KeyControl.isCommandKeyPressed() && this.KeyControl.isCopyKeyPressed()) {
            this.MessagePanelState.showSuccessMessage('Copied.', '');
            this.KeyControl.keydown.copy = false;
            this.KeyControl.keydown.command = false;
            this.Clipboard.add(data);
        }

        if (this.KeyControl.isCommandKeyPressed() && this.KeyControl.isPasteKeyPressed()) {
            let dataType = this.SelectionModel.getType(),
                currency = this.SelectionModel.getCurrency();

            this.KeyControl.keydown.paste = false;
            this.KeyControl.keydown.command = false;
            this.MessagePanelState.showInfoMessage('Pasting...', '');
            this.SelectionPaste.handlePaste(data, dataType, currency);
        }
    };

    Selection.prototype.getElementData = function (selectableElement) {
        if (selectableElement.getAttribute(SELECTABLE_ATTRIBUTE) === this.SELECTION_TYPES.TOTALTVR) {
            return {totalTvr: true};
        } else if (this.isInListView(selectableElement, this.SELECTION_TYPES)) {
            return angular.element(selectableElement).scope().scenarioChunk || angular.element(selectableElement).scope().aggregation || angular.element(selectableElement).scope().model || angular.element(selectableElement).scope().compItemSubRegion || angular.element(selectableElement).scope().compItem;
        } else {
            return d3.select(selectableElement).data()[0];
        }
    };

    Selection.prototype.getSelectionContext = function (element) {
        return element.isSelected && element.isSelected.length > 0? element.isSelected : element.getAttribute(SELECTABLE_ATTRIBUTE);
    };

    Selection.prototype.getDOMElementType = function (element) {
        return !!element.getAttribute(SELECTABLE_DOM_TYPE) ? element.getAttribute(SELECTABLE_DOM_TYPE) : 'html';
    };

    Selection.prototype.toggleMarkedStatus = function (selectableElement, selectionData, previouslySelectedData, selectionType, previouslySelectedType) {
        let elements = [selectableElement];
        let currency = this.getSelectedCurrency(selectionData);

        if (selectionData.isLocked) {
            return;
        }

        if (this.isInListView(selectableElement, this.SELECTION_TYPES) && this.isRenderedWithD3(selectableElement)) {
            elements = Array.apply(this, document.querySelectorAll(`[data-selectable-row="${selectableElement.getAttribute('data-selectable-row')}"]`));
        }

        if (this.KeyControl.isCommandKeyPressed() && (previouslySelectedType.indexOf(selectionType) === -1)) {
            // Do nothing, invalid selection
        } else if (selectableElement.classList.contains(SELECTED_CLASS)) {
            if (this.KeyControl.isCommandKeyPressed()) {
                this.unmarkElements(elements, selectionData);
            } else {
                // Do nothing, it's already marked
                // TODO: currently we're not emptying the selectedElements array
                // When user single click an element that has not previously been selected
            }
        } else {
            if (!this.KeyControl.isCommandKeyPressed() && !this.KeyControl.isShiftKeyPressed()) {
                this.unselectPreviousElements();
                this.markElements(elements, selectionData, selectionType, currency);
            } else if (this.KeyControl.isCommandKeyPressed() && (previouslySelectedData.length === 0 || this.SelectionValidation.isValidSelection(selectionData, previouslySelectedData, selectionType))) {
                this.markElements(elements, selectionData, selectionType, currency);
            } else if (this.KeyControl.isShiftKeyPressed() && (selectionType === this.SELECTION_TYPES.BREAK_DEMO || selectionType === this.SELECTION_TYPES.PROGRAMME_DEMO)) {
                this.markRangeOfElements(selectionData, previouslySelectedData, selectionType, currency);
            }
        }
    };


    Selection.prototype.getSelectedCurrency = function (selectionData) {
        if (selectionData.scenario || selectionData.totalTvr) {
            return this.ComparisonGridModel.viewOptions.selected;
        } else {
            return this.EditManager.currency.selected;
        }
    };

    Selection.prototype.unmarkElements = function (elements, data) {
        elements.forEach((element) => {
            element.classList.remove(SELECTED_CLASS);
        });

        this.SelectionModel.remove(data);
    };

    Selection.prototype.markRangeOfElements = function (data, previouslySelectedData, type, currency) {
        if (previouslySelectedData.length > 1) {
            this.SelectionModel.empty();
        } else {
            const source = this.findDataSource(previouslySelectedData[0]);
            const validateSourceType = (source) => {
                const selectionType = this.elementsPreviouslySelected[0].isSelected.indexOf('programme') !== -1 ? 'P' : 'C E';

                if (source.context) {
                    const type = source.meta.positionInProgramme ? source.meta.positionInProgramme : 'P';
                    return selectionType.indexOf(type) !== -1;
                } else if (source.url) {
                    return selectionType.indexOf(source.type) !== -1;
                }
            };

            let selectFromIndex;
            let selectToIndex;

            if (source.type === 'scenarioChunk') {
                selectFromIndex = source.data.findIndex((source) => source.context.dateFrom === previouslySelectedData[0].context.dateFrom && source.context.timeFrom === previouslySelectedData[0].context.timeFrom);
                selectToIndex = source.data.findIndex((source) => source.context.dateFrom === data.context.dateFrom && source.context.timeFrom === data.context.timeFrom);
            } else if (source.type === 'compItem') {
                selectFromIndex = source.data.findIndex((source) => source.url === previouslySelectedData[0].url);
                selectToIndex = source.data.findIndex((source) => source.url === data.url);
            }

            source.data
                .filter((source, index) => {
                    let from = selectFromIndex;
                    let to = selectToIndex;

                    if (selectFromIndex > selectToIndex) {
                        from = selectToIndex;
                        to = selectFromIndex;
                    }

                    return index >= from && index <= to;
                })
                .filter((source) => this.SelectionValidation.isValidSelection(source, previouslySelectedData, type))
                .filter((source) => validateSourceType(source))
                .forEach((source) => {
                    this.SelectionModel.add(source, type, currency);
                });

            this.SelectionModel.selectedElements.splice(0, 1);
        }
    };

    Selection.prototype.findDataSource = function (data) {
        if (data.context) {
            return { data: this.EditManager.EditModel.scenarioChunks, type: 'scenarioChunk'};
        } else if (data.url) {
            return { data: this.ComparisonModel.models, type: 'compItem'};
        }
    };

    Selection.prototype.markElements = function (elements, data, type, currency) {
        elements.forEach((element) => {
            element.classList.add(SELECTED_CLASS);
        });

        this.SelectionModel.add(data, type, currency);
    };

    Selection.prototype.unselectPreviousElements = function () {
        // We set the dom elements here to ensure SVG elements have their classes removed as well as
        // HTML elements.

        if (this.elementsPreviouslySelected) {
            const domElements = Array.apply(this, document.querySelectorAll('.' + SELECTED_CLASS));

            domElements.forEach((element) => {
                element.classList.remove(SELECTED_CLASS);
            });

            var selectedElementsToRemove = domElements.map(ele => this.getElementData(ele));

            selectedElementsToRemove.forEach(elementToRemove => this.elementsPreviouslySelected
                .splice(this.elementsPreviouslySelected.indexOf(elementToRemove, 1))
            );
            this.SelectionModel.empty();
        }
    };

    //TODO: Move to new service? Also, unit test rather than test all in one go
    Selection.prototype.scheduleParams = function (scenarioChunkContext) {
        return {
            dateFrom: scenarioChunkContext.dateFrom,
            dateTo: scenarioChunkContext.dateTo,
            timeFrom: scenarioChunkContext.timeFrom,
            timeTo: this.TimeUtils.addMinutes(scenarioChunkContext.timeFrom, 1),
            demographic: scenarioChunkContext.demographic,
            area: scenarioChunkContext.region,
            weekDays: '1,2,3,4,5,6,7',
            pendingEdit: this.EditPending.get()
        };
    };


    angular.module('selection').service('Selection', Selection);
})
();
