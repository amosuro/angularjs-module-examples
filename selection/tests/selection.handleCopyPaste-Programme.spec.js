'use strict';

describe('Selection:handleCopyPaste (Programme) is a method that:\n', function () {
    var $q,
        $rootScope,
        Selection,
        Clipboard,
        KeyControl,
        SelectionModel,
        EditManager,
        Demographics,
        EditDefinitions,
        EditPending,
        BreaksManager,
        ScheduleModel,
        SelectionPaste;

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
        function (_$q_, _$rootScope_, _Selection_, _Clipboard_, _KeyControl_, _SelectionModel_, _EditManager_, _Demographics_, _ScheduleModel_, _EditDefinitions_, _EditPending_, _BreaksManager_, _SelectionPaste_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            Selection = _Selection_;
            Clipboard = _Clipboard_;
            KeyControl = _KeyControl_;
            SelectionModel = _SelectionModel_;
            EditManager = _EditManager_;
            Demographics = _Demographics_;
            ScheduleModel = _ScheduleModel_;
            EditDefinitions = _EditDefinitions_;
            EditPending = _EditPending_;
            BreaksManager = _BreaksManager_;
            SelectionPaste = _SelectionPaste_;
            spyOn(SelectionPaste, 'resolveNegativeBreakTvrs').and.returnValue($q.when());
            spyOn(SelectionPaste, 'resolveNegativeProgrammeTvrs').and.returnValue($q.when());
        }));

    describe('Handles pasting of a selected element and:', () => {
        beforeEach(() => {
            spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
            spyOn(KeyControl, 'isPasteKeyPressed').and.callFake(() => true);
            spyOn(EditManager, 'reloadSchedule');
        });

        it('adds and reloads transformation if we are pasting a programme on a programme', () => {
            const oldTimeslots = [{
                "ITV": {"TVR": 9.818, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 17.983, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 12.413, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 12.88, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 11.245, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 14.376, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 7.865, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 6.822, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 8.836, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 10.449, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 4.548, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 6.528, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 18.072, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 9.109, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 10.983, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 5.485, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {
                "ITV": {"TVR": 6.986, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0}
            }, {"ITV": {"TVR": 13.058, "SHARE": 0, "VIEWERS": 0}, "TOTALTV": {"TVR": 0, "VIEWERS": 0}}];

            const newTimeslots = [{
                "ITV": {"TVR": 4.015, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 0,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 8.842, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 1,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 5.068, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 2,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 5.385, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 3,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 5.769, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 4,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 7.171, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 5,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 2.676, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 6,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 2.182, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 7,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 4.482, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 8,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 5.814, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 9,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 1.585, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 10,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 3.611, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 11,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 8.449, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 12,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 2.783, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 13,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 5.29, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 14,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 2.103, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 15,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 2.18, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301,
                "regionCode": "ITV1",
                "row": 16,
                "col": 2,
                "breakObject": {
                    "date": 20170301,
                    "time": 1845,
                    "actualTime": 1843,
                    "actualEndTime": 1848,
                    "nominalEndTime": 1849,
                    "duration": 210,
                    "positionInProgramme": "C",
                    "area": "ITV1",
                    "status": "PROJECTED",
                    "narrative": null,
                    "tvr": 7.171
                },
                "context": {
                    "dateFrom": 20170301,
                    "dateTo": 20170301,
                    "timeFrom": 1845,
                    "timeTo": 1849,
                    "granularity": "DEMOGRAPHIC",
                    "demographic": "AD1654",
                    "scenarioId": "fbe7b14b-8c09-4d30-8715-68cff35b57d2",
                    "region": "ITV1",
                    "demoCalc": "AD55PL",
                    "weekDays": "1,2,3,4,5,6,7",
                    "currencies": ["SHARE", "TVR", "VIEWERS"],
                    "pendingEdit": {
                        "author": "asddas",
                        "comment": "preview",
                        "transformations": [],
                        "sourceRanges": [],
                        "schedule": [],
                        "breaks": []
                    },
                    "area": "ITV1",
                    "MIN": 600,
                    "MAX": 2959
                },
                "difference": {
                    "ITV": {"TVR": 0, "SHARE": 0, "VIEWERS": 0},
                    "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                    "time": 1845,
                    "date": 20170301
                }
            }, {
                "ITV": {"TVR": 6.42, "SHARE": 0, "VIEWERS": 0},
                "TOTALTV": {"TVR": 0, "VIEWERS": 0},
                "time": 1845,
                "date": 20170301
            }];
            const expectedTransformations = [{
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'AD1654',
                calculateDemo: 'ADULTS',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.4089427581992259',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'HWSCHD',
                calculateDemo: 'HWIVES',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.40828164021590263',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'HW1654',
                calculateDemo: 'HWIVES',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.4180900621118012',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'HWABC1',
                calculateDemo: 'HWIVES',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.5130280124499779',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'AD1624',
                calculateDemo: 'ADULTS',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.340241576605213',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'MEN',
                calculateDemo: 'ADULTS',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.5564168819982773',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'ME1634',
                calculateDemo: 'AD1634',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.348504837291117',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'WOMEN',
                calculateDemo: 'ADULTS',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.4675188136343515',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'WO1634',
                calculateDemo: 'AD1634',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.30552201119771655',
                region: 'NO',
                endTime: 1705
            }, {
                startDate: 20150101,
                startTime: 1700,
                editDemo: 'CHIL49',
                calculateDemo: 'CHILDS',
                calculateValue: 'ITV,SHARE',
                editValue: 'ITV,TVR',
                expression: 'x*0.3120526767821357',
                region: 'NO',
                endTime: 1705
            }];

            Demographics.demographics = [{
                "abbreviation": "AD1654",
                "code": "A5",
                "label": "16-54 Adults",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "AD55PL",
                    "code": "",
                    "label": "Adults 55+"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "HWIVES",
                "code": "HW",
                "label": "All Housewives",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "NOTHW",
                    "code": "",
                    "label": "Not Housewives"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "HWSCHD",
                "code": "HC",
                "label": "Housewives with Children",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "HWNCH",
                    "code": "",
                    "label": "Housewives without Children"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "HW1654",
                "code": "H5",
                "label": "Housewives 16-54",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "HW55PL",
                    "code": "",
                    "label": "Housewives 55+"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "HWABC1",
                "code": "HA",
                "label": "ABC1 Housewives",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "HWC2DE",
                    "code": "",
                    "label": "C2DE Housewives"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "ADULTS",
                "code": "AD",
                "label": "Adults",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "CHILDS",
                    "code": "CH",
                    "label": "Children"
                }, {
                    "abbreviation": "INDVLS",
                    "code": "",
                    "label": "All Individuals"
                }]
            }, {
                "abbreviation": "AD1624",
                "code": "A2",
                "label": "16-24 Adults",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "AD25PL",
                    "code": "",
                    "label": "Adults 25+"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "AD1634",
                "code": "A3",
                "label": "16-34 Adults",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "AD35PL",
                    "code": "",
                    "label": "Adults 35+"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "ADABC1",
                "code": "AA",
                "label": "ABC1 Adults",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "ADC2DE",
                    "code": "",
                    "label": "C2DE Adults"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "MEN",
                "code": "ME",
                "label": "Men",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "WOMEN",
                    "code": "WO",
                    "label": "Women"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "ME1634",
                "code": "M3",
                "label": "16-34 Men",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "WO1634",
                    "code": "W3",
                    "label": "16-34 Women"
                }, {
                    "abbreviation": "AD1634",
                    "code": "A3",
                    "label": "16-34 Adults"
                }]
            }, {
                "abbreviation": "MEABC1",
                "code": "MA",
                "label": "ABC1 Men",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "WOABC1",
                    "code": "WA",
                    "label": "ABC1 Women"
                }, {
                    "abbreviation": "ADABC1",
                    "code": "AA",
                    "label": "ABC1 Adults"
                }]
            }, {
                "abbreviation": "WOMEN",
                "code": "WO",
                "label": "Women",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "MEN",
                    "code": "ME",
                    "label": "Men"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "WO1634",
                "code": "W3",
                "label": "16-34 Women",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "ME1634",
                    "code": "M3",
                    "label": "16-34 Men"
                }, {
                    "abbreviation": "AD1634",
                    "code": "A3",
                    "label": "16-34 Adults"
                }]
            }, {
                "abbreviation": "WOABC1",
                "code": "WA",
                "label": "ABC1 Women",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "MEABC1",
                    "code": "MA",
                    "label": "ABC1 Men"
                }, {
                    "abbreviation": "ADABC1",
                    "code": "AA",
                    "label": "ABC1 Adults"
                }]
            }, {
                "abbreviation": "CHILDS",
                "code": "CH",
                "label": "Children",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }, {
                    "abbreviation": "INDVLS",
                    "code": "",
                    "label": "All Individuals"
                }]
            }, {
                "abbreviation": "CHIL49",
                "code": "C9",
                "label": "Children 4-9",
                "visible": true,
                "traded": true,
                "type": "Traded",
                "related": [{
                    "abbreviation": "CHIL1015",
                    "code": "",
                    "label": "Children 10-15"
                }, {
                    "abbreviation": "CHILDS",
                    "code": "CH",
                    "label": "Children"
                }]
            }, {
                "abbreviation": "CHIL1015",
                "code": "",
                "label": "Children 10-15",
                "visible": true,
                "traded": false,
                "type": "VisibleNotTraded",
                "related": [{
                    "abbreviation": "CHIL49",
                    "code": "C9",
                    "label": "Children 4-9"
                }, {
                    "abbreviation": "CHILDS",
                    "code": "CH",
                    "label": "Children"
                }]
            }, {
                "abbreviation": "AD35PL",
                "code": "",
                "label": "Adults 35+",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "AD1634",
                    "code": "A3",
                    "label": "16-34 Adults"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "ADC2DE",
                "code": "",
                "label": "C2DE Adults",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "ADABC1",
                    "code": "AA",
                    "label": "ABC1 Adults"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "AD25PL",
                "code": "",
                "label": "Adults 25+",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "AD1624",
                    "code": "A2",
                    "label": "16-24 Adults"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "AD55PL",
                "code": "",
                "label": "Adults 55+",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "AD1654",
                    "code": "A5",
                    "label": "16-54 Adults"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "HW55PL",
                "code": "",
                "label": "Housewives 55+",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "HW1654",
                    "code": "H5",
                    "label": "Housewives 16-54"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "HWNCH",
                "code": "",
                "label": "Housewives without Children",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "HWSCHD",
                    "code": "HC",
                    "label": "Housewives with Children"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "HWC2DE",
                "code": "",
                "label": "C2DE Housewives",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "HWABC1",
                    "code": "HA",
                    "label": "ABC1 Housewives"
                }, {
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }]
            }, {
                "abbreviation": "NOTHW",
                "code": "",
                "label": "Not Housewives",
                "visible": false,
                "traded": false,
                "type": "InvisibleNotTraded",
                "related": [{
                    "abbreviation": "HWIVES",
                    "code": "HW",
                    "label": "All Housewives"
                }, {
                    "abbreviation": "ADULTS",
                    "code": "AD",
                    "label": "Adults"
                }]
            }, {
                "abbreviation": "INDVLS",
                "code": "",
                "label": "All Individuals",
                "visible": true,
                "traded": false,
                "type": "VisibleNotTraded",
                "related": []
            }, {
                "abbreviation": "UNKNOWN",
                "code": "UNKNOWN",
                "label": "",
                "visible": false,
                "traded": false,
                "type": "Calculation",
                "related": []
            }, {
                "abbreviation": "ANY",
                "code": "ANY",
                "label": "ANY",
                "visible": false,
                "traded": false,
                "type": "Calculation",
                "related": []
            }];

            const reloadedProgramme = {
                scheduleItems: [
                    {
                        "date": 20200103,
                        "startTime": 1800,
                        "endTime": 1859,
                        "duration": 60,
                        "description": "A PROGRAMME",
                        "categories": ['LIGHT_ENTERTAINMENT'],
                        "WOABC1": {
                            "ITV": {
                                "SHARE": 0.219,
                                "TVR": 1.8
                            },
                            "TOTALTV": {
                                "TVR": 8.225
                            }
                        },
                        "WOMEN": {
                            "ITV": {
                                "SHARE": 0.256,
                                "TVR": 2.727
                            },
                            "TOTALTV": {
                                "TVR": 10.668
                            }
                        },
                        "MEN": {
                            "ITV": {
                                "SHARE": 0.172,
                                "TVR": 1.291
                            },
                            "TOTALTV": {
                                "TVR": 7.525
                            }
                        },
                        "HWSCHD": {
                            "ITV": {
                                "SHARE": 0.261,
                                "TVR": 2.901
                            },
                            "TOTALTV": {
                                "TVR": 11.137
                            }
                        },
                        "AD1624": {
                            "ITV": {
                                "SHARE": 0.296,
                                "TVR": 1.379
                            },
                            "TOTALTV": {
                                "TVR": 4.65
                            }
                        },
                        "ME1634": {
                            "ITV": {
                                "SHARE": 0.214,
                                "TVR": 0.864
                            },
                            "TOTALTV": {
                                "TVR": 4.036
                            }
                        },
                        "MEABC1": {
                            "ITV": {
                                "SHARE": 0.134,
                                "TVR": 0.74
                            },
                            "TOTALTV": {
                                "TVR": 5.548
                            }
                        },
                        "CHILDS": {
                            "ITV": {
                                "SHARE": 0.05,
                                "TVR": 0.239
                            },
                            "TOTALTV": {
                                "TVR": 4.885
                            }
                        },
                        "AD1654": {
                            "ITV": {
                                "SHARE": 0.28,
                                "TVR": 1.912
                            },
                            "TOTALTV": {
                                "TVR": 6.828
                            }
                        },
                        "HWIVES": {
                            "ITV": {
                                "SHARE": 0.233,
                                "TVR": 2.758
                            },
                            "TOTALTV": {
                                "TVR": 11.828
                            }
                        },
                        "HWABC1": {
                            "ITV": {
                                "SHARE": 0.199,
                                "TVR": 1.727
                            },
                            "TOTALTV": {
                                "TVR": 8.689
                            }
                        },
                        "WO1634": {
                            "ITV": {
                                "SHARE": 0.217,
                                "TVR": 1.566
                            },
                            "TOTALTV": {
                                "TVR": 7.214
                            }
                        },
                        "CHIL49": {
                            "ITV": {
                                "SHARE": 0.067,
                                "TVR": 0.404
                            },
                            "TOTALTV": {
                                "TVR": 6.161
                            }
                        },
                        "HW1654": {
                            "ITV": {
                                "SHARE": 0.29,
                                "TVR": 2.73
                            },
                            "TOTALTV": {
                                "TVR": 9.43
                            }
                        },
                        "ADULTS": {
                            "ITV": {
                                "SHARE": 0.222,
                                "TVR": 2.031
                            },
                            "TOTALTV": {
                                "TVR": 9.145
                            }
                        },
                        "ADABC1": {
                            "ITV": {
                                "SHARE": 0.186,
                                "TVR": 1.291
                            },
                            "TOTALTV": {
                                "TVR": 6.94
                            }
                        },
                        "AD1634": {
                            "ITV": {
                                "SHARE": 0.216,
                                "TVR": 1.217
                            },
                            "TOTALTV": {
                                "TVR": 5.632
                            }
                        }
                    }
                ]
            };

            spyOn(ScheduleModel, 'getSchedule').and.callFake(() => $q.when(reloadedProgramme));
            spyOn(BreaksManager, 'getBreaks').and.returnValue($q.when({breaks: 'broke'}));
            spyOn(EditDefinitions, 'createFlattenSlotTransformation').and.callFake(() => {});
            spyOn(EditPending, 'addTransformation').and.callFake(() => {});

            const scenarioChunk = {
                isBreakScenarioChunk: () => false,
                isProgrammeScenarioChunk: () => true,
                timeslots: oldTimeslots,
                context: {
                    dateFrom: 20200103,
                    timeFrom: 1800,
                    timeTo: 1859,
                    region: 'ITV1'
                },
                meta: {
                    breakObject: {
                        time: 1700,
                        duration: 90
                    }
                }
            };

            const pastedScenarioChunk = {
                timeslots: newTimeslots,
                centreBreakAvgRatings: {}

            };

            SelectionModel.selectedElements = [{data: scenarioChunk, type: 'programme', currency: {id: 'tvr'}}];
            Clipboard.clipboard = [{data: pastedScenarioChunk, type: 'programme', currency: {id: 'tvr'}}];

            Selection.handleCopyPaste();

            $rootScope.$digest();

            expect(EditManager.reloadSchedule).toHaveBeenCalled();
            expect(EditDefinitions.createFlattenSlotTransformation).toHaveBeenCalled();
        });
    });
});
