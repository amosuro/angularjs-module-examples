'use strict';

describe('SelectionPaste:resolveNegativeBreakTvrs is a method that:\n', function () {
    var $q,
        Clipboard,
        SelectionPaste,
        SelectionBreakPaste,
        SelectionSlotPaste,
        EditDefinitions,
        EditManager,
        EditPending,
        $rootScope,
        SelectionPaste,
        SELECTION_TYPES,
        BreaksManager;

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
        function (_$q_,
                  _SelectionPaste_,
                  _Clipboard_,
                  _EditManager_,
                  _EditDefinitions_,
                  _EditPending_,
                  _$rootScope_,
                  _SELECTION_TYPES_,
                  _BreaksManager_) {
            $q = _$q_;
            SelectionPaste = _SelectionPaste_;
            Clipboard = _Clipboard_;
            EditDefinitions = _EditDefinitions_;
            EditManager = _EditManager_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SelectionPaste = _SelectionPaste_;
            SELECTION_TYPES = _SELECTION_TYPES_
            BreaksManager = _BreaksManager_;
        }));

    describe('Checks for negative tvrs and corrests them', () => {
        beforeEach(() => {
        });

        it('queries breaks with correct params for IE (men affecting women)', () => {
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: []}))
            var dummyPendingEdit = 'pendingEdit';
            spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);
            var targetData = [ {
                data: {
                    context : {
                        region: 'IE',
                        scenarioId : '123'
                    }
                }
             }];

            SelectionPaste.resolveNegativeBreakTvrs(targetData, 20160505, 20160505, 600, 601);
            var expectedRequestParams = {
                dateFrom: 20160505,
                dateTo: 20160505,
                timeFrom: 600,
                timeTo: 601,
                area: 'IE',
                demographic: 'MEN',
                weekDays: '1,2,3,4,5,6,7',
                pendingEdit: dummyPendingEdit
            };
            expect(BreaksManager.getBreaks).toHaveBeenCalledWith(expectedRequestParams, '123');
        });

         it('queries breaks with correct params for I$ (men affecting women)', () => {
                spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: []}))
                var dummyPendingEdit = 'pendingEdit';
                spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);
                var targetData = [ {
                    data: {
                        context : {
                            region: 'I4',
                            scenarioId : '123'
                        }
                    }
                 }];

                SelectionPaste.resolveNegativeBreakTvrs(targetData, 20160505, 20160505, 600, 601);
                var expectedRequestParams = {
                    dateFrom: 20160505,
                    dateTo: 20160505,
                    timeFrom: 600,
                    timeTo: 601,
                    area: 'I4',
                    demographic: 'WOMEN',
                    weekDays: '1,2,3,4,5,6,7',
                    pendingEdit: dummyPendingEdit
                };
                expect(BreaksManager.getBreaks).toHaveBeenCalledWith(expectedRequestParams, '123');
            });

            it('generates correct transformation for negative tvr on IE (MEN affecting WOMEN)', () => {

                // return a break with negative tvr for me
                var theBreak = {
                    ratings: { 'MEN': -0.1},
                    date: 20160505,
                    time: 600,
                    nominalEndTime: 601
                };
                spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: [theBreak]}))

                // dont really care about pending edit here
                var dummyPendingEdit = 'pendingEdit';
                spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);

                // locked currency
                spyOn(Clipboard, 'getCalculatedCurrency').and.returnValue('share');

                spyOn(EditDefinitions, 'createTransformation').and.returnValue('transformation');
                spyOn(EditPending, 'addTransformation').and.returnValue();

                var targetData = [ {
                    data: {
                        context : {
                            region: 'IE',
                            scenarioId : '123'
                        }
                    }
                 }];

                SelectionPaste.resolveNegativeBreakTvrs(targetData, 20160505, 20160505, 600, 601);

                var expectedTimings = {
                    date: theBreak.date,
                    time: theBreak.time,
                    endTime: theBreak.nominalEndTime
                };

                $rootScope.$digest();

                expect(EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, 'tvr', 'MEN', 'WOMEN', '0', 'share', 'IE');
                expect(EditPending.addTransformation).toHaveBeenCalledWith('transformation');
            });

        it('generates correct transformation for negative tvr on I4 (WOMEN affecting MEN)', () => {

            // return a break with negative tvr for me
            var theBreak = {
                ratings: { 'WOMEN': -0.1},
                date: 20160505,
                time: 600,
                nominalEndTime: 601
            };
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: [theBreak]}))

            // dont really care about pending edit here
            var dummyPendingEdit = 'pendingEdit';
            spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);

            // locked currency
            spyOn(Clipboard, 'getCalculatedCurrency').and.returnValue('share');

            spyOn(EditDefinitions, 'createTransformation').and.returnValue('transformation');
            spyOn(EditPending, 'addTransformation').and.returnValue();

            var targetData = [ {
                data: {
                    context : {
                        region: 'I4',
                        scenarioId : '123'
                    }
                }
             }];

            SelectionPaste.resolveNegativeBreakTvrs(targetData, 20160505, 20160505, 600, 601);

            var expectedTimings = {
                date: theBreak.date,
                time: theBreak.time,
                endTime: theBreak.nominalEndTime
            };

            $rootScope.$digest();

            expect(EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, 'tvr', 'WOMEN', 'MEN', '0', 'share', 'I4');
            expect(EditPending.addTransformation).toHaveBeenCalledWith('transformation');
        });


         it('doesnt transform tvr if it was nonnegative', () => {

            // return a break with negative tvr for me
            var theBreak = {
                ratings: { 'WOMEN': 0.1},
                date: 20160505,
                time: 600,
                nominalEndTime: 601
            };
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: [theBreak]}))

            // dont really care about pending edit here
            var dummyPendingEdit = 'pendingEdit';
            spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);

            // locked currency
            spyOn(Clipboard, 'getCalculatedCurrency').and.returnValue('share');

            spyOn(EditDefinitions, 'createTransformation').and.returnValue('transformation');
            spyOn(EditPending, 'addTransformation').and.returnValue();

            var targetData = [ {
                data: {
                    context : {
                        region: 'I4',
                        scenarioId : '123'
                    }
                }
             }];

            SelectionPaste.resolveNegativeBreakTvrs(targetData, 20160505, 20160505, 600, 601);

            $rootScope.$digest();

            expect(EditDefinitions.createTransformation).not.toHaveBeenCalled();
            expect(EditPending.addTransformation).not.toHaveBeenCalled();
        });


    });
});
