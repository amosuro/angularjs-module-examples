'use strict';

describe('SchedulePaste:handleScheduleProgrammePaste is a method that:\n', function () {
    var EditModel,
        EditFilters,
        EditLock,
        EditDefinitions,
        TimeUtils,
        ProgrammeDetails,
        EditManager,
        EditPending,
        $rootScope,
        TimeslotsRest,
        $q,
        SchedulePaste,
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
        function (_EditModel_,
                  _EditFilters_,
                  _EditLock_,
                  _EditDefinitions_,
                  _TimeUtils_,
                  _ProgrammeDetails_,
                  _EditManager_,
                  _EditPending_,
                  _$rootScope_,
                  _TimeslotsRest_,
                  _$q_,
                  _SchedulePaste_,
                  _BreaksManager_) {

            EditLock = _EditLock_;
            EditModel = _EditModel_;
            EditFilters = _EditFilters_;
            EditDefinitions = _EditDefinitions_;
            TimeUtils = _TimeUtils_;
            ProgrammeDetails = _ProgrammeDetails_;
            EditManager = _EditManager_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SchedulePaste = _SchedulePaste_;
            TimeslotsRest = _TimeslotsRest_;
            BreaksManager = _BreaksManager_;
            $q = _$q_;
        }));

    describe('Handles pasting of a selected element and:', () => {
        beforeEach(() => {
            spyOn(EditManager, 'reloadSchedule');
            spyOn(EditPending, 'addScheduleItem');
            spyOn(EditPending, 'addTransformation');

            EditFilters.demographic = {
                selected: {
                    abbreviation: 'ADULTS',
                },
                affected: {
                    abbreviation: 'INDVLS'
                }
            };

            EditLock.optionsForStation('ITV');
        });

        it('called into adjust original breaks with the correct params with the correct query params', () => {
            spyOn(SchedulePaste, 'adjustOriginalBreaks').and.returnValue($q.when());
            spyOn(SchedulePaste, 'createScheduleReference').and.callFake(() => {
            });
            spyOn(EditPending, 'cascadeEdits');

            var sourceData = {
                col: 0
            };

            var targetData = {
                startTime: 600,
                duration: 30,
                date: 20160505,
                col: 0
            };

            var scenarioChunk = {
                getRequestParams: function () {
                    return {
                        scenarioId: 'cat'
                    }
                }
            };
            EditModel.scenarioChunks = [scenarioChunk];

            SchedulePaste.handleScheduleProgrammePaste(sourceData, [{data: targetData}], 'currency');
            $rootScope.$digest();
            expect(SchedulePaste.adjustOriginalBreaks).toHaveBeenCalledWith(sourceData, scenarioChunk, 'cat');

        });


        it('called into createScheduleItemTransformations with correct params', () => {
            spyOn(SchedulePaste, 'adjustOriginalBreaks').and.returnValue($q.when());
            spyOn(SchedulePaste, 'createScheduleReference').and.callFake(() => {});


            spyOn(EditPending, 'cascadeEdits');


            var sourceData = {
                col: 0,
                duration: 30
            };

            var targetData = {
                startTime: 600,
                date: 20160505,
                col: 0
            };

            var scenarioChunk = {
                getRequestParams: function () {
                    return {scenarioId: '123'}
                }
            };
            EditModel.scenarioChunks = [scenarioChunk];
            EditLock.selected.id = 'share';

            var targetCurrency = {id: 'share'};

            SchedulePaste.handleScheduleProgrammePaste(sourceData, [{data: targetData}], targetCurrency);

            $rootScope.$digest();

            expect(SchedulePaste.createScheduleReference).toHaveBeenCalledWith( sourceData, targetData);
        });

    });
});