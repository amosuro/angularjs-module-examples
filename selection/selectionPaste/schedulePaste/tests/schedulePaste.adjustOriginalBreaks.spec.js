'use strict';

describe('SchedulePaste:adjustOriginalBreaks is a method that:\n', function () {
    var $rootScope,
        $q,
        SchedulePaste,
        BreakMove;

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
    beforeEach(inject(function (_$rootScope_, _$q_, _SchedulePaste_, _BreakMove_) {
        $rootScope = _$rootScope_;
        SchedulePaste = _SchedulePaste_;
        $q = _$q_;
        BreakMove = _BreakMove_;
    }));


    it('calls alignBreaks with correct params', () => {

        spyOn(BreakMove, 'alignBreaks').and.callFake(() => $q.when());
        var sourceData = {
            date: 20160101,
            startTime: 600,
            endTime: 629
        };

        var sourceScenarioChunk = {
            regionCode: 'I3'
        };


        var scenarioID = "id";
        SchedulePaste.adjustOriginalBreaks(sourceData, sourceScenarioChunk, scenarioID);

        $rootScope.$digest();
        expect(BreakMove.alignBreaks).toHaveBeenCalledWith({
            date: 20160101,
            startTime: 600,
            endTime: 629,
            region: 'I3',
            scenarioId: scenarioID

        });

    });

})
;
