'use strict';

describe('SelectionPaste:handlePaste is a method that:\n', function () {
    let SelectionPaste, $rootScope;
    let targetData, targetDataType, targetCurrency, clipboardItems;

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
        function (_SelectionPaste_, _$rootScope_) {
            SelectionPaste = _SelectionPaste_;
            $rootScope = _$rootScope_;

            spyOn(SelectionPaste.EditManager.EditModel, 'getContextRanges').and.returnValue([20160101,20160101,600,2959]);

            SelectionPaste.EditPending.costaReloadNeeded = false;

            targetData = {
                id: 'mock data'
            };

            targetDataType = 'totaltvr-schedule';

            targetCurrency = {
                id: 'tvr'
            };

            clipboardItems = [
                {
                    timeslots: []
                }
            ];
        }));


    it('does do anything if it is an invalid paste', () => {
        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(true);
        spyOn(SelectionPaste, 'handleTotalTvrPaste');
        spyOn(SelectionPaste, 'handleProgrammePaste');
        spyOn(SelectionPaste, 'handleDayPaste');
        spyOn(SelectionPaste, 'handleRowPaste');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        expect(SelectionPaste.handleTotalTvrPaste).not.toHaveBeenCalled();
        expect(SelectionPaste.handleProgrammePaste).not.toHaveBeenCalled();
        expect(SelectionPaste.handleDayPaste).not.toHaveBeenCalled();
        expect(SelectionPaste.handleRowPaste).not.toHaveBeenCalled();
    });

    it('calls handleTotalTvrPaste if targetDataType equals SELECTION_TYPES.TOTALTVR', () => {
        targetDataType = 'totaltvr-schedule';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleTotalTvrPaste');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        expect(SelectionPaste.handleTotalTvrPaste).toHaveBeenCalledWith(clipboardItems[0], targetCurrency);
        expect(SelectionPaste.EditPending.costaReloadNeeded).toEqual(true);
    });

    it('calls handleProgrammePaste if targetDataType equals SELECTION_TYPES.SCHEDULE_PROGRAMME', () => {
        targetDataType = 'programme-schedule';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleProgrammePaste');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        expect(SelectionPaste.handleProgrammePaste).toHaveBeenCalledWith(clipboardItems[0], targetData, targetCurrency, [], []);
        expect(SelectionPaste.EditPending.costaReloadNeeded).toEqual(true);
    });

    it('calls handleDayPaste if targetDataType equals SELECTION_TYPES.SCHEDULE_DAY', () => {
        targetDataType = 'schedule-day';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleDayPaste');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        expect(SelectionPaste.handleDayPaste).toHaveBeenCalledWith(clipboardItems[0], targetData, targetCurrency, [], []);
        expect(SelectionPaste.EditPending.costaReloadNeeded).toEqual(true);
    });

    it('calls handleRowPaste if targetDataType equals anything other than TOTALTVR, SCHEDULE_PROGRAMME or SCHEDULE_DAY', () => {
        targetDataType = 'programme-demo';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleRowPaste');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        expect(SelectionPaste.handleRowPaste).toHaveBeenCalledWith(clipboardItems[0], targetData, targetCurrency, clipboardItems[0].timeslots, targetDataType, [], []);
        expect(SelectionPaste.EditPending.costaReloadNeeded).toEqual(true);
    });

    it('reloads the schedule if targetDataType equals SCHEDULE_PROGRAMME', () => {
        targetDataType = 'programme-schedule';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleProgrammePaste').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.CollectiveProcess, 'execute').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.EditManager, 'reloadSchedule');
        spyOn(SelectionPaste.EditPending, 'cascadeEdits');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        $rootScope.$digest();

        expect(SelectionPaste.EditManager.EditModel.getContextRanges).toHaveBeenCalledWith([]);
        expect(SelectionPaste.EditManager.reloadSchedule).toHaveBeenCalledWith(20160101,20160101,600,2959);
        expect(SelectionPaste.EditPending.cascadeEdits).toHaveBeenCalledWith(0);
    });

    it('reloads the schedule if targetDataType equals SCHEDULE_DAY', () => {
        targetDataType = 'schedule-day';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleDayPaste').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.CollectiveProcess, 'execute').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.EditManager, 'reloadSchedule');
        spyOn(SelectionPaste.EditPending, 'cascadeEdits');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        $rootScope.$digest();

        expect(SelectionPaste.EditManager.EditModel.getContextRanges).toHaveBeenCalledWith([]);
        expect(SelectionPaste.EditManager.reloadSchedule).toHaveBeenCalledWith(20160101,20160101,600,2959);
        expect(SelectionPaste.EditPending.cascadeEdits).toHaveBeenCalledWith(0);
    });

    it('reloads the schedule with additional filters if targetDataType does not equal SCHEDULE_DAY or SCHEDULE_PROGRAMME', () => {
        targetDataType = 'programme-demo';

        spyOn(SelectionPaste, 'isInvalidPaste').and.returnValue(false);
        spyOn(SelectionPaste.Clipboard, 'paste').and.returnValue(clipboardItems);
        spyOn(SelectionPaste, 'handleRowPaste').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.CollectiveProcess, 'execute').and.returnValue(SelectionPaste.$q.when());
        spyOn(SelectionPaste.EditManager, 'reloadSchedule');
        spyOn(SelectionPaste.EditPending, 'cascadeEdits');
        spyOn(SelectionPaste, 'resolveNegativeBreakTvrs');
        spyOn(SelectionPaste, 'resolveNegativeProgrammeTvrs');

        SelectionPaste.handlePaste(targetData, targetDataType, targetCurrency);

        $rootScope.$digest();

        expect(SelectionPaste.EditManager.EditModel.getContextRanges).toHaveBeenCalledWith([]);
        expect(SelectionPaste.EditManager.reloadSchedule).toHaveBeenCalledWith(20160101,20160101,600,2959, {dateFrom: 20160101, dateTo: 20160101});
        expect(SelectionPaste.EditPending.cascadeEdits).toHaveBeenCalledWith(0);
        expect(SelectionPaste.resolveNegativeBreakTvrs).toHaveBeenCalledWith(targetData, 20160101,20160101,600,2959);
        expect(SelectionPaste.resolveNegativeProgrammeTvrs).toHaveBeenCalledWith(targetData, 20160101,20160101,600,2959);
    });
});
