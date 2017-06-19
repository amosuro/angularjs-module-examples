'use strict';

describe('SelectionBreakPaste:handleBreakPaste is a method that:\n', function () {
    var $q,
        $rootScope,
        $httpBackend,
        Selection,
        Clipboard,
        KeyControl,
        SelectionModel,
        SelectionBreakPaste,
        SelectionTransformationPaste,
        EditManager,
        EditDefinitions,
        Demographics,
        CONFIGURATION,
        TimeslotsDataProcessing,
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
        function (_$q_, _$rootScope_, _$httpBackend_, _EditDefinitions_, _TimeslotsDataProcessing_, _Selection_, _SelectionBreakPaste_, _Clipboard_, _KeyControl_, _SelectionModel_, _EditManager_, _Demographics_, _CONFIGURATION_, _BreaksManager_, _SelectionTransformationPaste_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
            EditDefinitions = _EditDefinitions_;
            TimeslotsDataProcessing = _TimeslotsDataProcessing_;
            Selection = _Selection_;
            SelectionBreakPaste = _SelectionBreakPaste_;
            Clipboard = _Clipboard_;
            KeyControl = _KeyControl_;
            SelectionModel = _SelectionModel_;
            EditManager = _EditManager_;
            Demographics = _Demographics_;
            CONFIGURATION = _CONFIGURATION_;
            BreaksManager = _BreaksManager_;
            SelectionTransformationPaste = _SelectionTransformationPaste_;
        }));


    it('calls TimeslotsDataProcessing.markDemosForTimeslots', () => {
        spyOn(SelectionBreakPaste, 'applyBreak');
        spyOn(TimeslotsDataProcessing, 'markDemosForTimeslots').and.returnValue([{}]);

        const scenarioChunk = createTestDestinationScenarioChunk().data;
        const ratings = new Array(17).fill(2.000);
        const currency = {id: 'tvr'};
        const expectedTransformations = [ { startDate: 20170402, startTime: 940, editDemo: undefined, calculateDemo: undefined, calculateValue: 'ITV,SHARE', editValue: 'ITV,TVR', expression: undefined, region: 'NO', endTime: 1759 } ];

        SelectionBreakPaste.handleBreakPaste(scenarioChunk, ratings, currency);

        $rootScope.$digest();

        expect(SelectionBreakPaste.applyBreak).toHaveBeenCalledWith(expectedTransformations, 'NO');

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
                },
                regionCode: 'NO'
            }
        };
    };

});
