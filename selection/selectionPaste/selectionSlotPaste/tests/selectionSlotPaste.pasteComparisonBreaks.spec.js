'use strict';

describe('SelectionSlotPaste:pasteComparisonBreaks is a method that:\n', function () {
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
        TimeslotsDataProcessing,
        ProgrammeDetails,
        BreaksManager,
        destinationScenarioChunk,
        EditModel,
        ComparisonAggregates,
        EditPending;

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
        function (_$q_, _$rootScope_, _$httpBackend_, _EditModel_, _EditDefinitions_, _TimeslotsDataProcessing_, _Selection_, _SelectionBreakPaste_, _Clipboard_, _KeyControl_, _SelectionModel_, _EditManager_, _Demographics_, _CONFIGURATION_, _BreaksManager_, _SelectionTransformationPaste_, _ProgrammeDetails_, _SelectionSlotPaste_, _CopyPasteUtils_, _EditPending_, _ComparisonAggregates_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            EditDefinitions = _EditDefinitions_;
            TimeslotsDataProcessing = _TimeslotsDataProcessing_;
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
            EditModel = _EditModel_;
            ComparisonAggregates = _ComparisonAggregates_;
        }));


    describe('Pastes lots of breaks', () => {
        beforeEach(() => {
            spyOn(SelectionBreakPaste, 'handleBreakPaste').and.returnValue($q.when());

            spyOn(CopyPasteUtils, 'calculateSlotAverageExcludingBreaks').and.returnValue([8.133]);
            spyOn(EditDefinitions, 'createFlattenSlotTransformation').and.returnValue({calculateDemo: "ADULTS"});
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: 'broke'}));
            spyOn(EditManager, 'reloadSchedule').and.returnValue($q.when());
            spyOn(EditPending, 'get').and.returnValue(['edits']);

            TimeslotsDataProcessing.defaultOrderedDemoPairsForSlots = [['ADULTS', undefined]];

            Demographics.demographics = [{abbreviation: "ADULTS", traded: true}];


            destinationScenarioChunk = {
                context: {
                    region: "NO"
                },
                regionCode: "NO",
                date: 20170201,
                timeFrom: 1000,
                timeTo: 1030
            };
        });

        it('should call breaks manager after building transformations', () => {
            var sourceSlot = {"date": 20150101, "startTime": 925, "endTime": 1029};
            var destinationSlot = {"date": 20170901, "startTime": 1030, "endTime": 1124};

            var sources = {
                centreBreakAvgRatings: {"ADULTS": 2.001},
                endBreakRatings: {"ADULTS": 2.003}
            };

            var currency = "tvr blah";
            var destinationScenarioChunkContext = {
                scenarioId: 'mySpecialScenario',
                region: 'cat-land'
            };
            var destinationScenarioChunk = {
                context: destinationScenarioChunkContext
            };
            var expectedParams = {
                dateFrom: destinationSlot.date,
                dateTo: destinationSlot.date,
                timeFrom: destinationSlot.startTime,
                timeTo: destinationSlot.endTime,
                demographic: 'ADULTS',
                area: destinationScenarioChunkContext.region,
                pendingEdit: ['edits']
            };

            var centreBreakSc1 = {meta: {breakObject: {positionInProgramme: 'C'}}, fullMinuteAverages: [5.001]};
            var centreBreakSc2 = {meta: {breakObject: {positionInProgramme: 'C'}}, fullMinuteAverages: [6.001]};
            var endBreakSc1 = {meta: {breakObject: {positionInProgramme: 'E'}}, fullMinuteAverages: [7.001]};
            spyOn(ProgrammeDetails, 'getBreakScenarioChunksInProgramme').and.callFake(slot => [centreBreakSc1, centreBreakSc2, endBreakSc1]);

            SelectionSlotPaste.pasteComparisonBreaks(sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk);

            $rootScope.$digest();

            expect(BreaksManager.getBreaks).toHaveBeenCalledWith(expectedParams, destinationScenarioChunkContext.scenarioId);

        });

        it('should use comparison aggregates to call into SelectionBreakPaste', () => {
            var sourceSlot = {"date": 20150101, "startTime": 925, "endTime": 1029};
            var destinationSlot = {"date": 20170901, "startTime": 1030, "endTime": 1124};

            var sources = {
                aggregationGroupId: '12345'
            };

            var currency = {
                label: 'TVR'
            };
            var destinationScenarioChunkContext = {
                scenarioId: 'mySpecialScenario',
                region: 'cat-land'
            };
            var destinationScenarioChunk = {
                context: destinationScenarioChunkContext
            };
            var expectedParams = {
                dateFrom: destinationSlot.date,
                dateTo: destinationSlot.date,
                timeFrom: destinationSlot.startTime,
                timeTo: destinationSlot.endTime,
                demographic: 'ADULTS',
                area: destinationScenarioChunkContext.region,
                pendingEdit: ['edits']
            };

            var centreBreakSc1 = {meta: {breakObject: {positionInProgramme: 'C'}}, fullMinuteAverages: [5.001]};
            var centreBreakSc2 = {meta: {breakObject: {positionInProgramme: 'C'}}, fullMinuteAverages: [6.001]};
            var endBreakSc1 = {meta: {breakObject: {positionInProgramme: 'E'}}, fullMinuteAverages: [7.001]};
            spyOn(ProgrammeDetails, 'getBreakScenarioChunksInProgramme').and.callFake(slot => [centreBreakSc1, centreBreakSc2, endBreakSc1]);

            var group1 = [
                {
                    type: 'P',
                    aggregationGroupId: '12345',
                    timeslots: {
                    }
                },
                {
                    type: 'C',
                    aggregationGroupId: '12345',
                    timeslots: [
                        {
                            ITV: {
                                TVR: 1.0
                            }
                        }
                    ]
                },
                {
                    type: 'E',
                    aggregationGroupId: '12345',
                    timeslots: [
                        {
                            ITV: {
                                TVR: 2.0
                            }
                        }
                    ]
                }
            ];

            var group2 = [
                {
                    type: 'P',
                    aggregationGroupId: '6789'
                },
                {
                    type: 'C',
                    aggregationGroupId: '6789'
                },
                {
                    type: 'E',
                    aggregationGroupId: '6789'
                }
            ];

            ComparisonAggregates.aggregateGroups = [group1, group2];

            SelectionSlotPaste.pasteComparisonBreaks(sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk);

            $rootScope.$digest();

            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc1, [1.0], currency, false);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc2, [1.0], currency, false);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(endBreakSc1, [2.0], currency, false);

        });

        it('should default to maintaining original break factor for centre breaks if source programme has no breaks', () => {
            var sourceSlot = {"date": 20150101, "startTime": 925, "endTime": 1029};
            var destinationSlot = {"date": 20170901, "startTime": 1030, "endTime": 1124};
            var sources = {};

            var currency = {'id': 'tvr'};
            var destinationScenarioChunkContext = {
                scenarioId: 'mySpecialScenario',
                region: 'cat-land'
            };
            var destinationScenarioChunk = {
                context: destinationScenarioChunkContext,
                timeslots: [
                    {
                        ITV: {
                            TVR: 4.0
                        }
                    }
                ]

            };
            var centreBreakSc1 = {
                            meta: {
                                breakObject: {
                                    positionInProgramme: 'C',
                                    date: 20170901,
                                    time: 1045
                                }
                            },
                            fullMinuteAverages: [5.001],
                            timeslots: [
                                {
                                    ITV: {
                                        TVR: 2.0
                                    }
                                }
                            ],
                            isBreakScenarioChunk: function () { return true; }
                         };

            EditModel.scenarioChunks = [centreBreakSc1];

            var newSlotRatings = [8.0];

            SelectionSlotPaste.pasteComparisonBreaks(sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk, newSlotRatings);

            $rootScope.$digest();

            var expectedRatings = [4.0];
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc1, expectedRatings, currency, false);


        });

         it('should default to maintaining original break factor for end and centre breaks if source programme has no breaks', () => {
            var sourceSlot = {"date": 20150101, "startTime": 925, "endTime": 1029};
            var destinationSlot = {"date": 20170901, "startTime": 1030, "endTime": 1124};
            var sources = {};

            var currency = {'id': 'tvr'};
            var destinationScenarioChunkContext = {
                scenarioId: 'mySpecialScenario',
                region: 'cat-land'
            };
            var destinationScenarioChunk = {
                context: destinationScenarioChunkContext,
                timeslots: [
                    {
                        ITV: {
                            TVR: 4.0
                        }
                    }
                ]

            };
            var centreBreakSc1 = {
                            meta: {
                                breakObject: {
                                    positionInProgramme: 'C',
                                    date: 20170901,
                                    time: 1045
                                }
                            },
                            fullMinuteAverages: [5.001],
                            timeslots: [
                                {
                                    ITV: { TVR: 3.0 }
                                }
                            ],
                            isBreakScenarioChunk: function () { return true; }
                         };

            var centreBreakSc2 = {
                            meta: {
                                breakObject: {
                                    positionInProgramme: 'C',
                                    date: 20170901,
                                    time: 1045
                                }
                            },
                            fullMinuteAverages: [5.001],
                            timeslots: [
                                {
                                    ITV: { TVR: 1.0 }
                                }
                            ],
                            isBreakScenarioChunk: function () { return true; }
                         };

             var endBreakSc1 = {
                             meta: {
                                 breakObject: {
                                     positionInProgramme: 'E',
                                     date: 20170901,
                                     time: 1120
                                 }
                             },
                             fullMinuteAverages: [5.001],
                             timeslots: [
                                 {
                                     ITV: { TVR: 1.0 }
                                 }
                             ],
                             isBreakScenarioChunk: function () { return true; }
                          };

            EditModel.scenarioChunks = [centreBreakSc1, centreBreakSc2, endBreakSc1];

            var newSlotRatings = [8.0];

            SelectionSlotPaste.pasteComparisonBreaks(sources, sourceSlot, destinationSlot, currency, destinationScenarioChunk, newSlotRatings);

            $rootScope.$digest();

            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(centreBreakSc1, [4.0], currency, false);
            expect(SelectionBreakPaste.handleBreakPaste).toHaveBeenCalledWith(endBreakSc1, [2.0], currency, false);
        });
    });
});
