'use strict';

describe('SchedulePaste:deleteOriginalBreaks is a method that:\n', function () {
    var EditModel,
        EditFilters,
        Demographics,
        EditDefinitions,
        BreaksManager,
        ProgrammeDetails,
        EditManager,
        EditPending,
        $rootScope,
        TimeslotsRest,
        $q,
        Stations,
        SchedulePaste;

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
                  _Demographics_,
                  _EditDefinitions_,
                  _BreaksManager_,
                  _ProgrammeDetails_,
                  _EditManager_,
                  _EditPending_,
                  _$rootScope_,
                  _TimeslotsRest_,
                  _$q_,
                  _Stations_,
                  _SchedulePaste_) {

            Demographics = _Demographics_;
            EditModel = _EditModel_;
            EditFilters = _EditFilters_;
            EditDefinitions = _EditDefinitions_;
            BreaksManager = _BreaksManager_;
            ProgrammeDetails = _ProgrammeDetails_;
            EditManager = _EditManager_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SchedulePaste = _SchedulePaste_;
            TimeslotsRest = _TimeslotsRest_;
            $q = _$q_;
            Stations = _Stations_;
        }));

    describe('Deletes original breaks', () => {
        beforeEach(() => {
              Demographics.demographics = [
                            { traded: true, abbreviation: 'puppies'},
                            { traded: true, abbreviation: 'kittens'},
                            { traded: false, abbreviation: 'spiders'}
                        ]
        });

        it('creates the right delete break transformations', () => {

            var response = {
                wrappedEntity: [
                    {
                        region: 'the moon'
                    }
                ]
            };

            var targetData = {
                date: 'today',
                startTime: 700,
                endTime: 729,
                regionCode: 'the moon'
            };

            var scenarioId = '123';

            spyOn(EditPending, 'get').and.returnValue('pending edit');
            spyOn(EditPending, 'addBreak');

            var dummyBreak = {
                area: 'lalaland',
                id: 'rawr',
                time: 701
            };

            var sourceData = {
                duration: 60
            };

            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when( { breaks: [dummyBreak] }));
            spyOn(Stations, 'flatten').and.returnValue([ ]);

            SchedulePaste.deleteOriginalBreaks(response, targetData, scenarioId, sourceData);

            $rootScope.$digest();

            var expectedBreak = {
                id: 'rawr',
                area: 'lalaland',
                time: 701,
                status: 'DELETED'
            };

            var expectedRequestParams = {
                dateFrom: targetData.date,
                dateTo: targetData.date,
                timeFrom: targetData.startTime,
                timeTo: 759,
                demographic: 'puppies,kittens',
                area: 'the moon',
                pendingEdit: 'pending edit',
                shouldShowRegionalBreakDifferences: false
            };

            expect(BreaksManager.getBreaks).toHaveBeenCalledWith(expectedRequestParams, scenarioId, undefined, true);
            expect(EditPending.addBreak).toHaveBeenCalledWith(expectedBreak);


        });

        it('doesnt delete break if it starts in previous programme', () => {

            var response = {
                wrappedEntity: [
                    {
                        region: 'the moon'
                    }
                ]
            };

            var targetData = {
                date: 'today',
                startTime: 700,
                endTime: 729,
                regionCode: 'the moon'
            };

            var scenarioId = '123';

            spyOn(EditPending, 'get').and.returnValue('pending edit');
            spyOn(Stations, 'flatten').and.returnValue([ ]);
            spyOn(EditPending, 'addBreak');

            var dummyBreak = {
                area: 'lalaland',
                id: 'rawr',
                time: 659
            };

            var sourceData = {
                duration: 60
            };

            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when( { breaks: [dummyBreak] }));

            SchedulePaste.deleteOriginalBreaks(response, targetData, scenarioId, sourceData);

            $rootScope.$digest();

            var expectedBreak = {
                id: 'rawr',
                area: 'lalaland',
                time: 701,
                status: 'DELETED'
            };

            var expectedRequestParams = {
                dateFrom: targetData.date,
                dateTo: targetData.date,
                timeFrom: targetData.startTime,
                timeTo: 759,
                demographic: 'puppies,kittens',
                area: 'the moon',
                pendingEdit: 'pending edit',
                shouldShowRegionalBreakDifferences: false
            };

            expect(BreaksManager.getBreaks).toHaveBeenCalledWith(expectedRequestParams, scenarioId, undefined, true);
            expect(EditPending.addBreak).not.toHaveBeenCalled();


        });

    });
});
