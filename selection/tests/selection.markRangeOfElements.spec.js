'use strict';

describe('Selection:markRangeOfElements is a method that:\n', function () {
    let Selection, SelectionModel;
    let currency;

    beforeEach(module('selection'));
    beforeEach(inject(
        function(_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_Selection_, _SelectionModel_) {
            Selection = _Selection_;
            SelectionModel = _SelectionModel_;

            currency = {name: 'example currency'};

            SelectionModel.selectedElements = [];
        }));

    it('should call SelectionModel add for all scenario chunks between the previously selected data range and currently selected data range', () => {
        spyOn(SelectionModel, 'add');

        Selection.elementsPreviouslySelected = [{isSelected: 'programme-demo'}];
        const data = {context: {dateFrom: 20160101, timeFrom: 730}};
        const dataWrapped = {data: data, type: 'programme-demo'};

        const previouslySelectedData = [{context: {dateFrom: 20160101, timeFrom: 600}}];

        const scenarioChunks = [
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 700}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 730}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 800}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160102, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160102, timeFrom: 800}}
        ];

        const expectedArray = [
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 700}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 730}}
        ];

        spyOn(Selection, 'findDataSource').and.returnValue({data: scenarioChunks, type: 'scenarioChunk'});
        Selection.markRangeOfElements(data, previouslySelectedData, dataWrapped.data.type, currency);

        expectedArray.forEach((sourceItem) => {
            expect(SelectionModel.add).toHaveBeenCalledWith(sourceItem, dataWrapped.data.type, currency);
        });
    });

    it('should add correct number of scenarioChunks to SelectionModel.selectedElements', () => {
        spyOn(SelectionModel, 'add').and.callThrough();

        Selection.elementsPreviouslySelected = [{isSelected: 'programme-demo'}];
        const data = {context: {dateFrom: 20160101, timeFrom: 730}};
        const dataWrapped = {data: data, type: 'programme-demo'};

        const previouslySelectedData = [{context: {dateFrom: 20160101, timeFrom: 600}}];

        const scenarioChunks = [
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 730}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160101, timeFrom: 800}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160102, timeFrom: 600}},
            {meta: {positionInProgramme: 'P'}, context: {dateFrom: 20160102, timeFrom: 800}}
        ];

        spyOn(Selection, 'findDataSource').and.returnValue({data: scenarioChunks, type: 'scenarioChunk'});
        Selection.markRangeOfElements(data, previouslySelectedData, dataWrapped.data.type, currency);

        expect(SelectionModel.selectedElements.length).toEqual(2);
    });

    it('should call SelectionModel add for all comp items between the previously selected data range and currently selected data range', () => {
        spyOn(SelectionModel, 'add');

        Selection.elementsPreviouslySelected = [{isSelected: 'programme-demo'}];
        const data = {url: 'url5', type: 'P'};
        const dataWrapped = {data: data, type: 'programme-demo'};

        const previouslySelectedData = [{url: 'url2', type: 'P'}];

        const compItems = [
            { url: 'url1', type: 'P' },
            { url: 'url2', type: 'P' },
            { url: 'url3', type: 'P' },
            { url: 'url4', type: 'P' },
            { url: 'url5', type: 'P' },
            { url: 'url6', type: 'P' }
        ];

        const expectedArray = [
            { url: 'url2', type: 'P' },
            { url: 'url3', type: 'P' },
            { url: 'url4', type: 'P' },
            { url: 'url5', type: 'P' }
        ];

        spyOn(Selection, 'findDataSource').and.returnValue({data: compItems, type: 'compItem'});
        Selection.markRangeOfElements(data, previouslySelectedData, dataWrapped.data.type, currency);

        expectedArray.forEach((sourceItem) => {
            expect(SelectionModel.add).toHaveBeenCalledWith(sourceItem, dataWrapped.data.type, currency);
        });
    });

    it('should add correct number of models to SelectionModel.selectedElements', () => {
        spyOn(SelectionModel, 'add').and.callThrough();

        Selection.elementsPreviouslySelected = [{isSelected: 'programme-demo'}];
        const data = {url: 'url5', type: 'P'};
        const dataWrapped = {data: data, type: 'programme-demo'};

        const previouslySelectedData = [{url: 'url2', type: 'P'}];

        const compItems = [
            { url: 'url1', type: 'P' },
            { url: 'url2', type: 'P' },
            { url: 'url3', type: 'P' },
            { url: 'url4', type: 'P' },
            { url: 'url5', type: 'P' },
            { url: 'url6', type: 'P' }
        ];

        spyOn(Selection, 'findDataSource').and.returnValue({data: compItems, type: 'compItem'});
        Selection.markRangeOfElements(data, previouslySelectedData, dataWrapped.data.type, currency);

        expect(SelectionModel.selectedElements.length).toEqual(3);
    });

    it('should call SelectionModel add for all comp items between the previously data range and filter out types that do not match', () => {
        spyOn(SelectionModel, 'add');

        Selection.elementsPreviouslySelected = [{isSelected: 'programme-demo'}];
        const data = {url: 'url6', type: 'P'};
        const dataWrapped = {data: data, type: 'programme-demo'};

        const previouslySelectedData = [{url: 'url1', type: 'P'}];

        const compItems = [
            { url: 'url1', type: 'P' },
            { url: 'url2', type: 'C' },
            { url: 'url3', type: 'C' },
            { url: 'url4', type: 'C' },
            { url: 'url5', type: 'P' },
            { url: 'url6', type: 'P' }
        ];

        const expectedArray = [
            { url: 'url1', type: 'P' },
            { url: 'url5', type: 'P' },
            { url: 'url6', type: 'P' }
        ];

        spyOn(Selection, 'findDataSource').and.returnValue({data: compItems, type: 'compItem'});
        Selection.markRangeOfElements(data, previouslySelectedData, dataWrapped.data.type, currency);

        expectedArray.forEach((sourceItem) => {
            expect(SelectionModel.add).toHaveBeenCalledWith(sourceItem, dataWrapped.data.type, currency);
        });
    });
});
