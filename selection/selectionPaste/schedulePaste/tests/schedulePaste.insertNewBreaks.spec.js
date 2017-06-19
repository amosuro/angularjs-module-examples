'use strict';

describe('SchedulePaste:insertNewBreaks is a method that:\n', function () {
    var BreaksManager,
        EditFilters,
        Demographics,
        EditDefinitions,
        TimeUtils,
        ProgrammeDetails,
        Clipboard,
        EditPending,
        $rootScope,
        TimeslotsRest,
        $q,
        SchedulePaste;

    var response = {
        wrappedEntity: [
            {
                region: 'the moon'
            }
        ]
    };

    var sourceData = {
        date: 'today',
        startTime: 600,
        endTime: 629
    };

    var targetData = {
        date: 'today',
        startTime: 800,
        endTime: 829
    };

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
        function (_BreaksManager_,
                  _EditFilters_,
                  _Demographics_,
                  _EditDefinitions_,
                  _TimeUtils_,
                  _ProgrammeDetails_,
                  _Clipboard_,
                  _EditPending_,
                  _$rootScope_,
                  _TimeslotsRest_,
                  _$q_,
                  _SchedulePaste_) {

            Demographics = _Demographics_;
            BreaksManager = _BreaksManager_;
            EditFilters = _EditFilters_;
            EditDefinitions = _EditDefinitions_;
            TimeUtils = _TimeUtils_;
            ProgrammeDetails = _ProgrammeDetails_;
            Clipboard = _Clipboard_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SchedulePaste = _SchedulePaste_;
            TimeslotsRest = _TimeslotsRest_;
            $q = _$q_;
        }));

    describe('Functionality of insertNewBreaks', () => {
        beforeEach(() => {
            Demographics.demographics = [
                {traded: true, abbreviation: 'puppies'},
                {traded: true, abbreviation: 'kittens'},
                {traded: false, abbreviation: 'spiders'}
            ]
            spyOn(EditPending, 'get').and.returnValue('pending edit');
            spyOn(EditPending, 'addBreak');
        });


        it('creates the right newBreak transformations in editPending', () => {

            EditFilters.demographic = {
                selected: {
                    abbreviation: 'cats'
                },
                affected: {
                    abbreviation: 'puppies'
                }
            };

            var    breaks= [
                    {
                        area: 'fairyland',
                        date: 'what is time?',
                        duration: 30,
                        positionInProgramme: 'left',
                        time: 600,
                        ratings: {
                            'cats': 1.2
                        },
                        ratingStatus: 'meow'
                    }
                ]


            SchedulePaste.insertNewBreaks(sourceData, targetData, '123', 'chunky chunk', breaks);

            $rootScope.$digest();

            var expectedNewBreak = {
                area: 'fairyland',
                date: targetData.date,
                duration: 30,
                isEdited: true,
                positionInProgramme: 'left',
                status: 'ADDED',
                time: 800,
                actualTime: 800,
                ratingStatus: 'meow'
            };


            expect(EditPending.addBreak).toHaveBeenCalledWith(expectedNewBreak);
        });


    });
});
