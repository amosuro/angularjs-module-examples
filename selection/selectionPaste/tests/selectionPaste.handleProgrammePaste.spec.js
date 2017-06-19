'use strict';

describe('SelectionPaste:handleProgrammePaste is a method that:\n', function () {
    let SelectionPaste;
    let source, targetData, targetCurrency, contexts, promises;

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
        function (_SelectionPaste_) {
            SelectionPaste = _SelectionPaste_;

            source = {
                scenarioChunkContext: 'source context 1'
            };

            targetData = [
                {
                    data: {
                        scenarioChunkContext: 'targetData context 1'
                    }
                },
                {
                    data: {
                        scenarioChunkContext: 'targetData context 2'
                    }
                }
            ];

            targetCurrency = { id : 'tvr' };

            contexts = [];
            promises = [];

            spyOn(SelectionPaste.SchedulePaste, 'handleScheduleProgrammePaste').and.returnValue('handleScheduleProgrammePaste promise mock')
        }));

    it('pushes source.scenarioChunkContext and the scenarioChunkContext for each targetData item to the contexts array', () => {
        SelectionPaste.handleProgrammePaste(source, targetData, targetCurrency, contexts, promises);

        expect(contexts).toEqual(['targetData context 1', 'targetData context 2', 'source context 1']);
    });

    it('pushes source.scenarioChunkContext and the scenarioChunkContext for each targetData item to the contexts array', () => {
        SelectionPaste.handleProgrammePaste(source, targetData, targetCurrency, contexts, promises);

        expect(promises).toEqual(['handleScheduleProgrammePaste promise mock']);
        expect(SelectionPaste.SchedulePaste.handleScheduleProgrammePaste).toHaveBeenCalledWith(source, targetData, targetCurrency);
    });
});
