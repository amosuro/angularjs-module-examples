'use strict';

describe('InlineEdit:applyProgrammeChange is a method that:\n', function () {
    var InlineEdit, AuthorisedUser, EditManager, locationParams, $location, ScheduleModel, EditProgramme, EditPending, $q, EditModel, $rootScope, InlineEditTypehead, TIMERANGE;

    const scheduleItems = {
        "scheduleItems": [
            {
                "description": "",
                "date": 20170901,
                "startTime": 924,
                "endTime": 924,
                "duration": 1,
                "categories": [
                    "NOPROG"
                ],
                "region": "ITV1",
                "ADULTS": {
                    "ITV": {
                        "TVR": 0,
                        "SHARE": 0,
                        "VIEWERS": 0
                    },
                    "TOTALTV": {
                        "TVR": 0,
                        "VIEWERS": 0
                    }
                }
            },
            {
                "description": "Jeremy kyle",
                "date": 20170901,
                "startTime": 925,
                "endTime": 1029,
                "duration": 65,
                "categories": [
                    "LIGHT_ENTERTAINMENT"
                ],
                "region": "ITV1",
                "ADULTS": {
                    "ITV": {
                        "TVR": 1.976,
                        "SHARE": 0.208,
                        "VIEWERS": 992.313
                    },
                    "TOTALTV": {
                        "TVR": 9.468,
                        "VIEWERS": 4755.165
                    }
                }
            },
            {
                "description": "This morning",
                "date": 20170901,
                "startTime": 1030,
                "endTime": 1124,
                "duration": 55,
                "categories": [
                    "LIFESTYLE"
                ],
                "region": "ITV1",
                "ADULTS": {
                    "ITV": {
                        "TVR": 1.454,
                        "SHARE": 0.156,
                        "VIEWERS": 730.154
                    },
                    "TOTALTV": {
                        "TVR": 9.307,
                        "VIEWERS": 4673.957
                    }
                }
            }
        ]
    };

    beforeEach(module('utils'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_InlineEdit_, _EditManager_, _$location_, _ScheduleModel_, _EditProgramme_, _EditPending_, _$q_, _EditModel_, _$rootScope_, _InlineEditTypehead_, _TIMERANGE_) {
            $q = _$q_;
            $location = _$location_;
            EditManager = _EditManager_;
            InlineEdit = _InlineEdit_;
            ScheduleModel = _ScheduleModel_;
            EditProgramme = _EditProgramme_;
            EditPending = _EditPending_;
            EditModel = _EditModel_;
            $rootScope = _$rootScope_;
            InlineEditTypehead = _InlineEditTypehead_;
            TIMERANGE = _TIMERANGE_;


            locationParams = {
                editStation: 'ITV',
                editDemo: 'ADULTS',
                editWeekDays: '1,2,3,4,5,6,7',
                editScenario: 'BLEURGH!'
            };

            $location.search(locationParams);

            spyOn(ScheduleModel, 'getSchedule').and.callFake(() => {
                EditPending.auditTrail.push('Edit');
                return $q.when(scheduleItems)
            });
        }));

    it('fetch schedule with correct parameters', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20150101,
                    timeFrom: 1800,
                    timeTo: 1859
                }
            },
            newValue = 942,
            changeType = 'startTime',
            edit = {edit: 'me'};


        let expectedParams = {
            dateFrom: 20150101,
            dateTo: 20150101,
            timeFrom: 1759,
            timeTo: 1900,
            area: locationParams.editStation,
            demographic: locationParams.editDemo,
            weekDays: locationParams.editWeekDays,
            pendingEdit: edit
        };

        spyOn(EditPending, 'get').and.returnValue(edit);

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        expect(ScheduleModel.getSchedule).toHaveBeenCalledWith(expectedParams, locationParams.editScenario, true);
    });

    it('fetch schedule with correct parameters on boundaries', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20150101,
                    timeFrom: TIMERANGE.MIN,
                    timeTo: TIMERANGE.MAX
                }
            },
            newValue = 942,
            changeType = 'startTime',
            edit = {edit: 'me'};


        let expectedParams = {
            dateFrom: 20150101,
            dateTo: 20150101,
            timeFrom: TIMERANGE.MIN,
            timeTo: TIMERANGE.MAX,
            area: locationParams.editStation,
            demographic: locationParams.editDemo,
            weekDays: locationParams.editWeekDays,
            pendingEdit: edit
        };

        spyOn(EditPending, 'get').and.returnValue(edit);

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        expect(ScheduleModel.getSchedule).toHaveBeenCalledWith(expectedParams, locationParams.editScenario, true);
    });


    it('should cascadeEdits', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20170901,
                    timeFrom: 925,
                    timeTo: 1029
                }
            },
            newValue = 930,
            changeType = 'startTime',
            edit = {edit: 'me'},
            programme = scheduleItems.scheduleItems[1];

        spyOn(EditPending, 'cascadeEdits');
        spyOn(EditModel, 'updateScenarioChunks');
        spyOn(EditPending, 'get').and.returnValue(edit);


        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        $rootScope.$digest();

        expect(EditPending.cascadeEdits).toHaveBeenCalledWith(3);
    });

    it('should edit startTime, and also end time keeping duration constant', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20170901,
                    timeFrom: 925,
                    timeTo: 1029
                }
            },
            newValue = 930,
            changeType = 'startTime',
            edit = {edit: 'me'},
            programme = scheduleItems.scheduleItems[1];

        spyOn(EditProgramme, 'addScheduleItemChanges');
        spyOn(EditModel, 'updateScenarioChunks');
        spyOn(EditPending, 'get').and.returnValue(edit);


        let expectedNewProgramme = angular.copy(programme);
        expectedNewProgramme.previousProgramme = angular.copy(scheduleItems.scheduleItems[0]);
        expectedNewProgramme.nextProgramme = angular.copy(scheduleItems.scheduleItems[2]);
        expectedNewProgramme.startTime = newValue;
        expectedNewProgramme.endTime = 1034;

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        $rootScope.$digest();

        expect(EditProgramme.addScheduleItemChanges).toHaveBeenCalledWith(programme, expectedNewProgramme, programme.region)
    });


    it('should edit duration', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20170901,
                    timeFrom: 925,
                    timeTo: 1029
                }
            },
            newValue = '75',
            changeType = 'duration',
            edit = {edit: 'me'},
            programme = scheduleItems.scheduleItems[1];

        spyOn(EditProgramme, 'addScheduleItemChanges');
        spyOn(EditModel, 'updateScenarioChunks');
        spyOn(EditPending, 'get').and.returnValue(edit);


        let expectedNewProgramme = angular.copy(programme);
        expectedNewProgramme.previousProgramme = angular.copy(scheduleItems.scheduleItems[0]);
        expectedNewProgramme.nextProgramme = angular.copy(scheduleItems.scheduleItems[2]);
        expectedNewProgramme.endTime = 1039;

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        $rootScope.$digest();

        expect(EditProgramme.addScheduleItemChanges).toHaveBeenCalledWith(programme, expectedNewProgramme, programme.region)
    });

    it('should edit duration ignoring any seconds provided', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20170901,
                    timeFrom: 925,
                    timeTo: 1029
                }
            },
            newValue = '75:59',
            changeType = 'duration',
            edit = {edit: 'me'},
            programme = scheduleItems.scheduleItems[1];

        spyOn(EditProgramme, 'addScheduleItemChanges');
        spyOn(EditModel, 'updateScenarioChunks');
        spyOn(EditPending, 'get').and.returnValue(edit);


        let expectedNewProgramme = angular.copy(programme);
        expectedNewProgramme.previousProgramme = angular.copy(scheduleItems.scheduleItems[0]);
        expectedNewProgramme.nextProgramme = angular.copy(scheduleItems.scheduleItems[2]);
        expectedNewProgramme.endTime = 1039;

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        $rootScope.$digest();

        expect(EditProgramme.addScheduleItemChanges).toHaveBeenCalledWith(programme, expectedNewProgramme, programme.region)
    });

    it('should edit startTime', function () {
        const chunk = {
                meta: {
                    isBreak: false
                },
                context: {
                    dateFrom: 20170901,
                    timeFrom: 925,
                    timeTo: 1029
                }
            },
            newValue = 'ignored',
            changeType = 'description',
            edit = {edit: 'me'},
            programme = scheduleItems.scheduleItems[1];


        InlineEditTypehead.editedData = {
            "description": {"value": "ANALYSE THIS", "disabled": false},
            "categories": {"value": "FILMS"},
            "shortName": {"value": "ANALYSE T1"}
        };


        spyOn(InlineEditTypehead, 'reset');
        spyOn(EditModel, 'updateScenarioChunks');
        spyOn(EditProgramme, 'addScheduleItemChanges');
        spyOn(EditPending, 'get').and.returnValue(edit);


        let expectedNewProgramme = angular.copy(programme);
        expectedNewProgramme.description = 'ANALYSE THIS';
        expectedNewProgramme.shortName = 'ANALYSE T1';
        expectedNewProgramme.categories = 'FILMS';

        InlineEdit.applyProgrammeChange(chunk, newValue, changeType);

        $rootScope.$digest();

        expect(InlineEditTypehead.reset).toHaveBeenCalled();
        expect(EditProgramme.addScheduleItemChanges).toHaveBeenCalled();
    });

});
