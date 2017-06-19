'use strict';

describe('SchedulePaste:createScheduleReference is a method that:\n', function () {
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


    it('creates correct schedulereference and adds to pending edit', () => {

        var sourceData = {
            date: 20160403,
            startTime: 1900,
            endTime: 1904
        };

        var targetData = {
            date: 20160404,
            startTime: '1910',
            regionCode: 'LO'

        };

        SchedulePaste.createScheduleReference(sourceData, targetData);

        expect(EditPending.scheduleReferences).toEqual([{
            sourceDate: 20160403,
            targetDate: 20160404,
            startTime: 1910,
            endTime: 1914,
            region: 'LO',
            minuteShift: 10,
            index:0
        }]);
    });

    it('trims schedulereference times at end of day', () => {
        var sourceData = {
            date: 20160403,
            startTime: 1900,
            endTime: 1959
        };

        var targetData = {
            date: 20160404,
            startTime: '2930',
            regionCode: 'LO'
        };

        SchedulePaste.createScheduleReference(sourceData, targetData);

        expect(EditPending.scheduleReferences).toEqual([{
            sourceDate: 20160403,
            targetDate: 20160404,
            startTime: 2930,
            endTime: 2959,
            region: 'LO',
            minuteShift: 630,
            index:0
        }]);
    });
});

