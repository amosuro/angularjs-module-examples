'use strict';

describe('Selection:findDataSource is a method that:\n', function () {
    let Selection;

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
        function (_Selection_) {
            Selection = _Selection_;

            Selection.EditManager.EditModel.scenarioChunks = [
                {context: 'an object'},
                {context: 'another object'}
            ];

            Selection.ComparisonModel.models = [
                {url: 'a url'},
                {url: 'another url'}
            ];
        }));

    it('should return scenarioChunks if data is a scenarioChunk object', () => {
        const data = { context: 'an object' };

        expect(Selection.findDataSource(data)).toEqual({data: Selection.EditManager.EditModel.scenarioChunks, type: 'scenarioChunk'});
    });

    it('should return comparison models if data is a comparison model object', () => {
        const data = { url: 'a url' };

        expect(Selection.findDataSource(data)).toEqual({data: Selection.ComparisonModel.models, type: 'compItem'});
    });
});
