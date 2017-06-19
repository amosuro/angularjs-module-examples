'use strict';

describe('SelectionPaste:resolveNegativeProgrammeTvrs is a method that:\n', function () {
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
        ScheduleRest;

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
                  _ScheduleRest_) {
            $q = _$q_;
            SelectionPaste = _SelectionPaste_;
            Clipboard = _Clipboard_;
            EditDefinitions = _EditDefinitions_;
            EditManager = _EditManager_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SelectionPaste = _SelectionPaste_;
            SELECTION_TYPES = _SELECTION_TYPES_
            ScheduleRest = _ScheduleRest_;

            spyOn(SelectionPaste.EditSettings, 'isInProgrammeMode').and.returnValue(true);
        }));

    describe('Checks for negative tvrs and corrests them', () => {
        beforeEach(() => {
        });

        it('queries schedule items with correct params for IE (men affecting women)', () => {
            spyOn(ScheduleRest, 'getForScenario').and.returnValue($q.when({scheduleItems: []}))
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

            SelectionPaste.resolveNegativeProgrammeTvrs(targetData, 20160505, 20160505, 600, 659);
            var expectedRequestParams = {
                area: 'IE',
                dateFrom: 20160505,
                dateTo: 20160505,
                timeFrom: 600,
                timeTo: 659,
                demographics: 'MEN',
                granularity: 'DEMOGRAPHIC',
                weekDays: '1,2,3,4,5,6,7',
                channels : { ITV: ['TVR'] }
            };
            expect(ScheduleRest.getForScenario).toHaveBeenCalledWith(expectedRequestParams, 'pendingEdit', '123', true);
        });
         it('queries schedule items with correct params for I4 (women affecting men)', () => {
            spyOn(ScheduleRest, 'getForScenario').and.returnValue($q.when({scheduleItems: []}))
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

            SelectionPaste.resolveNegativeProgrammeTvrs(targetData, 20160505, 20160505, 600, 659);
            var expectedRequestParams = {
                area: 'I4',
                dateFrom: 20160505,
                dateTo: 20160505,
                timeFrom: 600,
                timeTo: 659,
                demographics: 'WOMEN',
                granularity: 'DEMOGRAPHIC',
                weekDays: '1,2,3,4,5,6,7',
                channels : { ITV: ['TVR'] }
            };
            expect(ScheduleRest.getForScenario).toHaveBeenCalledWith(expectedRequestParams, 'pendingEdit', '123', true);
        });
        it('generates correct transformation for IE with negative male tvr', () => {
            spyOn(Clipboard, 'getCalculatedCurrency').and.returnValue('share');
            spyOn(EditDefinitions, 'createTransformation').and.returnValue('transformation');
            var scheduleItem = {
                date: 20160505,
                startTime: 600,
                endTime: 659,
                'MEN': {
                    'ITV' : {
                        'TVR': -1
                    }
                }

            };
            spyOn(ScheduleRest, 'getForScenario').and.returnValue($q.when({scheduleItems: [scheduleItem]}))
            var dummyPendingEdit = 'pendingEdit';
            spyOn(EditPending, 'get').and.returnValue(dummyPendingEdit);
            spyOn(EditPending, 'addTransformation');
            var targetData = [ {
                data: {
                    context : {
                        region: 'IE',
                        scenarioId : '123'
                    }
                }
             }];

            SelectionPaste.resolveNegativeProgrammeTvrs(targetData, 20160505, 20160505, 600, 659);

            var expectedTimings = {
                        date: scheduleItem.date,
                        time: scheduleItem.startTime,
                        endTime: scheduleItem.endTime
                    };

            $rootScope.$digest();

            expect(EditDefinitions.createTransformation).toHaveBeenCalledWith(expectedTimings, 'tvr', 'MEN', 'WOMEN', '0', 'share', 'IE');
            expect(EditPending.addTransformation).toHaveBeenCalledWith('transformation');

        });



    });
});
