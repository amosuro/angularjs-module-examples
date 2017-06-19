'use strict';

describe('InlineEdit:applyBreakChange is a method that:\n', function () {
    var InlineEdit, AuthorisedUser, EditManager;

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
        function (_InlineEdit_, _EditManager_) {
            InlineEdit = _InlineEdit_;
            EditManager = _EditManager_;
        }));

    it('should edit startTime', function () {
        const chunk = {
                meta: {
                    isBreak: true,
                    breakObject: {
                        "date": 20170901,
                        "time": 940,
                        "actualTime": 940,
                        "actualEndTime": 944,
                        "nominalEndTime": 944,
                        "duration": 210,
                        "positionInProgramme": "C",
                        "area": "ITV1",
                        "status": "EDITED",
                        "narrative": null,
                        "rcwImpacts": {},
                        "breakNumber": 0,
                        "isDurationAggregatedAcrossSubRegions": false,
                        "tvr": 1.765591,
                        "fullMinuteAverage": 1.781163
                    }
                }
            },
            newValue = 942,
            changeType = 'startTime';


        let expectedBreak = angular.copy(chunk.meta.breakObject);
        expectedBreak.time = newValue;
        expectedBreak.originalTime = chunk.meta.breakObject.time;
        expectedBreak.originalDuration = chunk.meta.breakObject.duration;

        spyOn(EditManager, 'moveOrModifyBreakInListView');

        InlineEdit.applyBreakChange(chunk, newValue, changeType);

        expect(EditManager.moveOrModifyBreakInListView).toHaveBeenCalledWith(chunk.meta.breakObject, expectedBreak, chunk, changeType);
    });

    it('should edit breakType', function () {
        const chunk = {
                meta: {
                    isBreak: true,
                    breakObject: {
                        "date": 20170901,
                        "time": 940,
                        "actualTime": 940,
                        "actualEndTime": 944,
                        "nominalEndTime": 944,
                        "duration": 210,
                        "positionInProgramme": "C",
                        "area": "ITV1",
                        "status": "EDITED",
                        "narrative": null,
                        "rcwImpacts": {},
                        "breakNumber": 0,
                        "isDurationAggregatedAcrossSubRegions": false,
                        "tvr": 1.765591,
                        "fullMinuteAverage": 1.781163
                    }
                }
            },
            newValue = 'E',
            changeType = 'breakType';


        let expectedBreak = angular.copy(chunk.meta.breakObject);
        expectedBreak.positionInProgramme = newValue;

        spyOn(EditManager, 'moveOrModifyBreakInListView');

        InlineEdit.applyBreakChange(chunk, newValue, changeType);

        expect(EditManager.moveOrModifyBreakInListView).toHaveBeenCalledWith(chunk.meta.breakObject, expectedBreak, chunk, changeType);
    });

    it('should edit duration', function () {
        const chunk = {
                meta: {
                    isBreak: true,
                    breakObject: {
                        "date": 20170901,
                        "time": 940,
                        "actualTime": 940,
                        "actualEndTime": 944,
                        "nominalEndTime": 944,
                        "duration": 210,
                        "positionInProgramme": "C",
                        "area": "ITV1",
                        "status": "EDITED",
                        "narrative": null,
                        "rcwImpacts": {},
                        "breakNumber": 0,
                        "isDurationAggregatedAcrossSubRegions": false,
                        "tvr": 1.765591,
                        "fullMinuteAverage": 1.781163
                    }
                }
            },
            newValue = '4:30',
            changeType = 'duration';


        let expectedBreak = angular.copy(chunk.meta.breakObject);
        expectedBreak.duration = 270;

        spyOn(EditManager, 'moveOrModifyBreakInListView');

        InlineEdit.applyBreakChange(chunk, newValue, changeType);

        expect(EditManager.moveOrModifyBreakInListView).toHaveBeenCalledWith(chunk.meta.breakObject, expectedBreak, chunk, changeType);
    });


    it('should edit duration when only minutes supplied', function () {
        const chunk = {
                meta: {
                    isBreak: true,
                    breakObject: {
                        "date": 20170901,
                        "time": 940,
                        "actualTime": 940,
                        "actualEndTime": 944,
                        "nominalEndTime": 944,
                        "duration": 210,
                        "positionInProgramme": "C",
                        "area": "ITV1",
                        "status": "EDITED",
                        "narrative": null,
                        "rcwImpacts": {},
                        "breakNumber": 0,
                        "isDurationAggregatedAcrossSubRegions": false,
                        "tvr": 1.765591,
                        "fullMinuteAverage": 1.781163
                    }
                }
            },
            newValue = '4',
            changeType = 'duration';


        let expectedBreak = angular.copy(chunk.meta.breakObject);
        expectedBreak.duration = 240;

        spyOn(EditManager, 'moveOrModifyBreakInListView');

        InlineEdit.applyBreakChange(chunk, newValue, changeType);

        expect(EditManager.moveOrModifyBreakInListView).toHaveBeenCalledWith(chunk.meta.breakObject, expectedBreak, chunk, changeType);
    });




});
