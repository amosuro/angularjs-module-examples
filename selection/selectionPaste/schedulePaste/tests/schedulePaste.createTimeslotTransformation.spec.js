'use strict';

describe('SchedulePaste:createTimeslotTransformation is a method that:\n', function () {
    var EditModel,
        EditFilters,
        EditLock,
        EditDefinitions,
        TimeUtils,
        Stations,
        EditManager,
        EditPending,
        $rootScope,
        TimeslotsRest,
        $q,
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
                  _EditLock_,
                  _EditDefinitions_,
                  _TimeUtils_,
                  _Stations_,
                  _EditManager_,
                  _EditPending_,
                  _$rootScope_,
                  _TimeslotsRest_,
                  _$q_,
                  _SchedulePaste_) {

            EditLock = _EditLock_;
            EditModel = _EditModel_;
            EditFilters = _EditFilters_;
            EditDefinitions = _EditDefinitions_;
            TimeUtils = _TimeUtils_;
            Stations = _Stations_;
            EditManager = _EditManager_;
            EditPending = _EditPending_;
            $rootScope = _$rootScope_;
            SchedulePaste = _SchedulePaste_;
            TimeslotsRest = _TimeslotsRest_;
            $q = _$q_;
        }));

    describe('Calls out for programme info', () => {
        beforeEach(() => {
        });

        it('calls the right stuff', () => {

            var sourceData = {
                date: 20160403,
                startTime: 1900
            };

            var timings = {
                date: 20160404,
                endDate: 20160404,
                time: 600,
                endTime: 601
            };

            var currencySource = 'ITV';

            var targetCurrency = {
                id: '123'
            };


            SchedulePaste.createTimeslotTransformations(timings, currencySource, 'meow currency', targetCurrency, 'neverland', sourceData);

            expect(EditPending.transformations).toEqual([{
                startDate: 20160404,
                startTime: 600,
                editDemo: 'ANY',
                calculateDemo: null,
                calculateValue: 'ITV,MEOW CURRENCY',
                editValue: 'ITV,123',
                expression: '[03-04-16 1900 s]',
                region: 'neverland',
                endDate: 20160404,
                endTime: 601,
                appliesToAllRegions: true,
                index: 0
            }]);
        });

    });
});