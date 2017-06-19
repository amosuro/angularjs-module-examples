'use strict';

describe('SelectionTransformationPaste:applyTransformations is a method that:\n', function () {
    let SelectionTransformationPaste;
    let transformations, scenarioChunk, callStack;

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

            transformations = [
                'firstTransformation',
                'secondTransformation'
            ];

            scenarioChunk = {
                context: {}
            };

            callStack = {};
        }));


    it('returns scenarioChunk context with correct demographic string', () => {
        spyOn(SelectionTransformationPaste.EditPending, 'addTransformation');
        spyOn(SelectionTransformationPaste.Demographics, 'getTradedDemos').and.returnValue([
            { abbreviation: 'AD' },
            { abbreviation: 'W3' }
        ]);

        expect(SelectionTransformationPaste.applyTransformations(transformations, scenarioChunk, callStack)).toEqual({demographic: 'AD,W3'});
    });

    it('calls EditPending.addTransformation with first transformation and auditTrail transformation', () => {
        spyOn(SelectionTransformationPaste.EditPending, 'addTransformation');
        spyOn(SelectionTransformationPaste.Demographics, 'getTradedDemos').and.returnValue([
            { abbreviation: 'AD' },
            { abbreviation: 'W3' }
        ]);

        SelectionTransformationPaste.EditPending.AuditTrailEntry.transformationEntry = 'transformation entry';

        SelectionTransformationPaste.applyTransformations(transformations, scenarioChunk, callStack);

        expect(SelectionTransformationPaste.EditPending.addTransformation).toHaveBeenCalledWith('firstTransformation', 'transformation entry');
    });

    it('calls EditPending.addTransformation with first transformation only', () => {
        spyOn(SelectionTransformationPaste.EditPending, 'addTransformation');
        spyOn(SelectionTransformationPaste.Demographics, 'getTradedDemos').and.returnValue([
            { abbreviation: 'AD' },
            { abbreviation: 'W3' }
        ]);

        SelectionTransformationPaste.applyTransformations(transformations, scenarioChunk);

        expect(SelectionTransformationPaste.EditPending.addTransformation).toHaveBeenCalledWith('firstTransformation');
    });
});
