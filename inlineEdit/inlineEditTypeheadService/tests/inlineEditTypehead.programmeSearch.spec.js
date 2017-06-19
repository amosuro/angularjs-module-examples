'use strict';

describe('InlineEditTypehead:programmeSearch is a method that:\n', function () {
    var InlineEditTypehead, ProgrammesRest, Stations, EditFilters, $rootScope, $q, ScenariosManager;

    var programmeData = {
        programmes: ['a', 'b', 'c']
    };

    beforeEach(module('schedule'));
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
        function (_InlineEditTypehead_, _ProgrammesRest_, _Stations_, _EditFilters_, _$rootScope_, _$q_, _ScenariosManager_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            InlineEditTypehead = _InlineEditTypehead_;
            ProgrammesRest = _ProgrammesRest_;
            Stations = _Stations_;
            EditFilters = _EditFilters_;
            ScenariosManager = _ScenariosManager_;

            InlineEditTypehead.context = {
                region: 'LO'
            };

            Stations.regions = {
                "ITV": [{"code": "ITV1", "name": "Network"}, {
                    "code": "LO",
                    "name": "London"
                }, {"code": "NO", "name": "North"}, {"code": "GB", "name": "Granada Border"}, {
                    "code": "GR",
                    "name": "Granada"
                }, {"code": "BD", "name": "Border"}, {"code": "YT", "name": "Yorkshire Tyne Tees"}, {
                    "code": "YO",
                    "name": "Yorkshire"
                }, {"code": "TT", "name": "Tyne Tees"}, {"code": "MW", "name": "MidWest"}, {
                    "code": "CN",
                    "name": "Central"
                }, {"code": "WM", "name": "West Macro"}, {"code": "WW", "name": "Wales & West"}, {
                    "code": "WC",
                    "name": "West Country"
                }, {"code": "SE", "name": "South East"}, {"code": "MR", "name": "Meridian"}, {
                    "code": "AN",
                    "name": "Anglia"
                }, {"code": "SM", "name": "Scotland"}, {"code": "SH", "name": "STV"}, {
                    "code": "GP",
                    "name": "Grampian"
                }, {"code": "UL", "name": "UTV"}],
                "ITV2": [{"code": "I2", "name": "ITV2"}],
                "ITV3": [{"code": "I3", "name": "ITV3"}],
                "ITV4": [{"code": "I4", "name": "ITV4"}],
                "ITVBE": [{"code": "IB", "name": "ITVBe"}],
                "ENCORE": [{"code": "IE", "name": "Encore"}],
                "KIDS": [{"code": "IK", "name": "Kids"}],
                "CHANNEL": [{"code": "CH", "name": "Channel"}],
                "GMTV1": [{"code": "G1", "name": "GMTV1"}],
                "GMTV2": [{"code": "G2", "name": "GMTV2"}]
            };

            EditFilters.StationSelector.stations = {
                options: [{
                    code: 'ITV1'
                }, {
                    code: 'ITV2'
                }],
                selected: {
                    code: 'ITV2'
                }
            };

            ScenariosManager.current = {
                id: 'ego',
                startDate: '2016-01-26',
                endDate: '2016-07-14'
            }
        }));

    it('Takes a search string and area code from the context, calls the search and saves its results', function () {
        var searchString = 'a';

        spyOn(ProgrammesRest, 'searchLus').and.returnValue($q.when(programmeData));

        InlineEditTypehead.programmeSearch(searchString);

        $rootScope.$digest();

        var expectedRequestParams = {
            searchString: searchString
        };

        expect(ProgrammesRest.searchLus).toHaveBeenCalledWith(expectedRequestParams);
        expect(InlineEditTypehead.programmeSearchResults).toEqual(programmeData.programmes);
    });

    it('Correctly toggles loading state of data', function () {
        var searchString = 'a';

        spyOn(ProgrammesRest, 'searchLus').and.returnValue($q.when(programmeData));

        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(false);

        InlineEditTypehead.programmeSearch(searchString);
        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(true);

        $rootScope.$digest();
        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(false);

    });

    it('Correctly toggles loading state of data on REST failure', function () {
        var searchString = 'a';

        spyOn(ProgrammesRest, 'searchLus').and.callFake(function () {
            var deferred = $q.defer();
            deferred.reject();
            return deferred.promise;
        });

        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(false);

        InlineEditTypehead.programmeSearch(searchString);
        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(true);

        $rootScope.$digest();
        expect(InlineEditTypehead.loadingMatchingProgrammes).toEqual(false);

    });
});
