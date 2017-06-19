'use strict';

describe('SelectionSlotPaste:handleSlotPaste is a method that:\n', function () {
    var $q,
        $rootScope,
        $httpBackend,
        Selection,
        Clipboard,
        CopyPasteUtils,
        KeyControl,
        SelectionModel,
        SelectionBreakPaste,
        SelectionSlotPaste,
        SelectionTransformationPaste,
        EditManager,
        EditDefinitions,
        Demographics,
        CONFIGURATION,
        DEMOPAIRS,
        ProgrammeDetails,
        BreaksManager,
        sources,
        breakPasteSpy,
        destinationScenarioChunk,
        centreBreakSc1,
        centreBreakSc2,
        endBreakSc1,
        EditPending,
        breakContext1,
        breakContext2,
        breakContext3,
        pasteBreakResponse1,
        pasteBreakResponse2,
        pasteBreakResponse3;


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
        function (_$q_, _$rootScope_, _$httpBackend_, _EditDefinitions_, _DEMOPAIRS_, _Selection_, _SelectionBreakPaste_, _Clipboard_, _KeyControl_, _SelectionModel_, _EditManager_, _Demographics_, _CONFIGURATION_, _BreaksManager_, _SelectionTransformationPaste_, _ProgrammeDetails_, _SelectionSlotPaste_, _CopyPasteUtils_, _EditPending_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            EditDefinitions = _EditDefinitions_;
            DEMOPAIRS = _DEMOPAIRS_;
            CopyPasteUtils = _CopyPasteUtils_;
            Selection = _Selection_;
            SelectionBreakPaste = _SelectionBreakPaste_;
            Clipboard = _Clipboard_;
            KeyControl = _KeyControl_;
            SelectionModel = _SelectionModel_;
            EditManager = _EditManager_;
            Demographics = _Demographics_;
            CONFIGURATION = _CONFIGURATION_;
            BreaksManager = _BreaksManager_;
            ProgrammeDetails = _ProgrammeDetails_;
            SelectionTransformationPaste = _SelectionTransformationPaste_;
            SelectionSlotPaste = _SelectionSlotPaste_;
            EditPending = _EditPending_;
        }));


    describe('Handles pasting of a selected element and:', () => {
        beforeEach(() => {
            spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
            spyOn(KeyControl, 'isPasteKeyPressed').and.callFake(() => true);
            spyOn(SelectionBreakPaste, 'handleBreakPaste').and.returnValue($q.when());

            breakContext1 = {timeFrom: 930};
            breakContext2 = {timeFrom: 1030};
            breakContext3 = {timeFrom: 1130};
            pasteBreakResponse1 = {time: 930, fullMinuteAverages: {ADULTS: 5.001}};
            pasteBreakResponse2 = {time: 1030, fullMinuteAverages: {ADULTS: 6.001}};
            pasteBreakResponse3 = {time: 1130, fullMinuteAverages: {ADULTS: 7.001}};

            centreBreakSc1 = {
                meta: {breakObject: {positionInProgramme: 'C'}},
                fullMinuteAverages: [5.001],
                context: breakContext1
            };
            centreBreakSc2 = {
                meta: {breakObject: {positionInProgramme: 'C'}},
                fullMinuteAverages: [6.001],
                context: breakContext2
            };
            endBreakSc1 = {
                meta: {breakObject: {positionInProgramme: 'E'}},
                fullMinuteAverages: [7.001],
                context: breakContext3
            };


            spyOn(ProgrammeDetails, 'getBreakScenarioChunksInProgramme').and.returnValue([centreBreakSc1, centreBreakSc2, endBreakSc1]);
            spyOn(CopyPasteUtils, 'calculateSlotAverageExcludingBreaks').and.returnValue([8.133]);
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: [pasteBreakResponse1, pasteBreakResponse2, pasteBreakResponse3]}));
            spyOn(EditDefinitions, 'createFlattenSlotTransformation').and.returnValue({
                calculateDemo: "ADULTS"
            });
            spyOn(EditManager, 'reloadSchedule').and.returnValue($q.when());

            DEMOPAIRS.defaultOrderedDemoPairsForSlots = [['ADULTS', undefined]];
            Demographics.demographics = [{abbreviation: "ADULTS", traded: true}];

            sources = {
                centreBreakAvgRatings: {"ADULTS": 2.001},
                endBreakRatings: {"ADULTS": 2.003}
            };

            destinationScenarioChunk = {
                context: {
                    region: "NO",
                    scenarioId: "rahatsScenario"
                },
                regionCode: "NO",
                date: 20170201,
                timeFrom: 1000,
                timeTo: 1030
            };
        });

        it('should return a promise', () => {
            let currency = {'id': 'tvr'};
            EditPending.auditTrail = ['blah'];

            spyOn(EditPending, 'cascadeEdits');
            spyOn(EditPending, 'addTransformation');
            spyOn(SelectionSlotPaste, 'pasteComparisonBreaks').and.callFake(() => {
                EditPending.auditTrail.push('blah');
                EditPending.auditTrail.push('blah');
                EditPending.auditTrail.push('blah');

                return $q.when([pasteBreakResponse1, pasteBreakResponse2, pasteBreakResponse3]);
            });
            var response = SelectionSlotPaste.handleSlotPaste("dataType", sources, destinationScenarioChunk, [], currency);

            expect(response.then instanceof Function).toEqual(true);
        });

        it('should call cascade edits with the right number of edits', () => {
            let currency = {'id': 'tvr'};
            EditPending.auditTrail = ['blah'];

            spyOn(EditPending, 'cascadeEdits');
            spyOn(SelectionSlotPaste, 'pasteComparisonBreaks').and.callFake(() => {
                EditPending.auditTrail.push('blah');
                EditPending.auditTrail.push('blah');
                EditPending.auditTrail.push('blah');

                return $q.when([pasteBreakResponse1, pasteBreakResponse2, pasteBreakResponse3]);
            });
            spyOn(EditPending, 'addTransformation').and.callFake(() => EditPending.auditTrail.push('slot'));


            SelectionSlotPaste.handleSlotPaste("dataType", sources, destinationScenarioChunk, [], currency);
            $rootScope.$digest();

            expect(EditPending.cascadeEdits).toHaveBeenCalledWith(4);
        });

        it('should call handleBreakPaste for every break chunk in current slot if currency is TVR', () => {
            var currency = {'id': 'tvr'};
            SelectionSlotPaste.handleSlotPaste("dataType", sources, destinationScenarioChunk, [], currency);
            $rootScope.$digest();

            expect(SelectionBreakPaste.handleBreakPaste.calls.count()).toBe(3);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc1, [2.001], currency, false);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc2, [2.001], currency, false);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(endBreakSc1, [2.003], currency, false);
        });

        it('should not call handleBreakPaste if currency is not TVR', () => {
            var currency = {'id': 'totalTvr'};
            SelectionSlotPaste.handleSlotPaste("dataType", sources, destinationScenarioChunk, [], currency);
            $rootScope.$digest();
            expect(SelectionBreakPaste.handleBreakPaste).not.toHaveBeenCalled();
        });

        it('should pass through empty array of breaks if currency is totalTvr', () => {
            var currency = {'id': 'totalTvr'};
            SelectionSlotPaste.handleSlotPaste("dataType", sources, destinationScenarioChunk, [], currency);
            $rootScope.$digest();
            let expectedBreaks = [];
            expect(EditDefinitions.createFlattenSlotTransformation).toHaveBeenCalledWith([ 8.133 ], 'ADULTS', undefined, 'TOTALTV,TVR', 'ITV,SHARE', 'NO', { date : undefined, startTime : undefined, endTime : undefined, requestedAverage : undefined }, expectedBreaks);
        });

        function createTestDestinationScenarioChunk() {
            var newTimeslot = {
                "ITV": {"TVR": 3.142, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            };

            var destinationTimeslots = new Array(17).fill(newTimeslot);
            return {
                data: {
                    isBreakScenarioChunk: function () {
                        return true;
                    },
                    getActualTimeslots: function () {
                        return $q.when(destinationTimeslots);
                    },
                    context: {
                        scenarioId: "myScenario",
                        dateFrom: 20170402,
                        dateTo: 20170402,
                        timeFrom: 940,
                        timeTo: 944,
                        region: 'NO',
                        demographic: 'AD'

                    },
                    meta: {
                        breakObject: {
                            ratings: {
                                "ADULTS": 0.4430
                            },
                            nominalEndTime: 1800,
                            date: 20170402,
                            time: 940
                        }
                    }
                }
            };
        };
    });
});
