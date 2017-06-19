'use strict';

describe('SelectionTransformationPaste:createTransformation is a method that:\n', function () {
    let SelectionTransformationPaste;
    let demoExpressionPair, scenarioChunk, breakObject;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_SelectionTransformationPaste_) {
            SelectionTransformationPaste = _SelectionTransformationPaste_;

            demoExpressionPair = {
                editDemo: 'edit',
                calculateDemo: 'calculate',
                expression: 'x*woo'
            };

            scenarioChunk = {
                context: {
                    dateFrom: 20160101,
                    dateTo: 20160102,
                    timeTo: 1800,
                    timeFrom: 1700,
                    region: 'ITV'
                },
                meta: {
                    breakObject: {
                        nominalEndTime: 1759
                    }
                },
                isBreakScenarioChunk: () => true
            };

            breakObject = {
                time: 1800
            };
        }));


    it('calls EditDefinitions.createTransformation with correct timings when breakObject exists', () => {
        const expectedTimings = {
            date: 20160101,
            time: 1800,
            endTime: 1804
        };

        spyOn(SelectionTransformationPaste.EditDefinitions, 'createTransformation');

        SelectionTransformationPaste.createTransformation(demoExpressionPair, scenarioChunk, breakObject);

        expect(SelectionTransformationPaste.EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, SelectionTransformationPaste.Clipboard.getEditedCurrency(), 'edit', 'calculate', 'x*woo', SelectionTransformationPaste.Clipboard.getCalculatedCurrency(), 'ITV');
    });

    it('calls EditDefinitions.createTransformation with correct timings when breakObject does not exist', () => {
        const expectedTimings = {
            date: 20160101,
            time: 1700,
            endTime: 1758
        };

        spyOn(SelectionTransformationPaste.EditDefinitions, 'createTransformation');

        SelectionTransformationPaste.createTransformation(demoExpressionPair, scenarioChunk);

        expect(SelectionTransformationPaste.EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, SelectionTransformationPaste.Clipboard.getEditedCurrency(), 'edit', 'calculate', 'x*woo', SelectionTransformationPaste.Clipboard.getCalculatedCurrency(), 'ITV');
    });

    it('calls EditDefinitions.createTransformation with correct timings when breakObject does not exist and it is a programme scenario chunk', () => {
        const expectedTimings = {
            date: 20160101,
            time: 1700,
            endTime: 1801
        };

        scenarioChunk.isBreakScenarioChunk = () => false;

        spyOn(SelectionTransformationPaste.EditDefinitions, 'createTransformation');

        SelectionTransformationPaste.createTransformation(demoExpressionPair, scenarioChunk);

        expect(SelectionTransformationPaste.EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, SelectionTransformationPaste.Clipboard.getEditedCurrency(), 'edit', 'calculate', 'x*woo', SelectionTransformationPaste.Clipboard.getCalculatedCurrency(), 'ITV');
    });
});
