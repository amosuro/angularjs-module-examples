'use strict';

describe('SelectionPaste:handleRowPaste is a method that:\n', function () {
    let SelectionPaste;
    let source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises;

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
                context: 'source context 1'
            };

            targetData = [
                {
                    data: {
                        context: 'targetData context 1',
                        isBreakScenarioChunk: () => true,
                        meta: {
                            breakObject: 'mock breakObject 1'
                        }
                    }
                },
                {
                    data: {
                        context: 'targetData context 2',
                        isBreakScenarioChunk: () => true,
                        meta: {
                            breakObject: 'mock breakObject 2'
                        }
                    }
                }
            ];

            targetCurrency = { id : 'tvr' };

            newTimeslots = ['mock timeslot'];
            targetDataType = 'programme-demo';

            contexts = [];
            promises = [];

            spyOn(SelectionPaste.SelectionBreakPaste, 'handleBreakPaste').and.returnValue('handleBreakPaste promise mock');
            spyOn(SelectionPaste.SelectionSlotPaste, 'handleSlotPaste').and.returnValue('handleSlotPaste promise mock');
            spyOn(SelectionPaste.TimeslotsDataProcessing, 'extractCurrency').and.returnValue('extract currency mock');
        }));

    it('does not push to promises array if targetCurrency is totalTvr and isBreakScenarioChunk equals true', () => {
        targetCurrency = { id : 'totalTvr' };

        SelectionPaste.handleRowPaste(source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises);

        expect(SelectionPaste.TimeslotsDataProcessing.extractCurrency).toHaveBeenCalledWith(newTimeslots, targetCurrency);
        expect(SelectionPaste.SelectionBreakPaste.handleBreakPaste).not.toHaveBeenCalled();
        expect(SelectionPaste.SelectionSlotPaste.handleSlotPaste).not.toHaveBeenCalled();
        expect(promises).toEqual([]);
    });

    it('pushes SelectionBreakPaste.handleBreakPaste promise to promises array', () => {
        SelectionPaste.handleRowPaste(source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises);

        expect(SelectionPaste.TimeslotsDataProcessing.extractCurrency).toHaveBeenCalledWith(newTimeslots, targetCurrency);
        expect(SelectionPaste.SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(targetData[0].data, 'extract currency mock', targetCurrency, targetData[0].data.meta.breakObject);
        expect(promises).toEqual(['handleBreakPaste promise mock', 'handleBreakPaste promise mock']);
    });

    it('pushes SelectionBreakPaste.handleSlotPaste promise to promises array', () => {
        targetData[0].data.isBreakScenarioChunk = () => false;
        targetData[1].data.isBreakScenarioChunk = () => false;
        targetData[0].data.isProgrammeScenarioChunk = () => true;
        targetData[1].data.isProgrammeScenarioChunk = () => true;

        SelectionPaste.handleRowPaste(source, targetData, targetCurrency, newTimeslots, targetDataType, contexts, promises);

        expect(SelectionPaste.TimeslotsDataProcessing.extractCurrency).toHaveBeenCalledWith(newTimeslots, targetCurrency);
        expect(SelectionPaste.SelectionSlotPaste.handleSlotPaste).toHaveBeenCalledWith(targetDataType, source, targetData[0].data, 'extract currency mock', targetCurrency);
        expect(promises).toEqual(['handleSlotPaste promise mock', 'handleSlotPaste promise mock']);
    });
});
