'use strict';

describe('SchedulePaste:schedulePasteRest is a method that:\n', function () {
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
        RestApi;

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
                  _RestApi_) {

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
            $q = _$q_;
            RestApi = _RestApi_;
        }));

    describe('Calls out for programme info', () => {
        beforeEach(() => {
        });

        it('calls the rest endpoint with the correct params', () => {
            spyOn(RestApi, 'post');
            spyOn(EditPending, 'get').and.returnValue('pending edit');

           var sourceData = {
                startTime: 600,
                endTime: 629
           };

           var requestParams = {
                demographic: 'MEN',
                channels: 'some channels',
                dateFrom: 20160505,
                area: 'NO',
                scenarioId: '123'
           };

           SchedulePaste.schedulePasteRest(sourceData, requestParams);
           var expectedParameters = {
                date: requestParams.dateFrom,
                timeFrom: sourceData.startTime,
                timeTo: sourceData.endTime,
                demographic: requestParams.demographic,
                area: requestParams.area,
                channels: requestParams.channels
            };
           expect(RestApi.post).toHaveBeenCalledWith('/schedulePaste/123', 'pending edit', expectedParameters);

        });

    });
});
