'use strict';

describe('The PikadayDirective:setMonthFromDate is a method that \n', function() {

    var $rootScope, 
        $compile, 
        $scope,
        element,
        DateRange,
        createController;
            
    beforeEach(module('dir-templates'));
    beforeEach(module('utils'));
    beforeEach(inject(
        function(_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function(_$rootScope_, _$compile_, _$controller_, _DateRange_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $scope = $rootScope.$new();
            DateRange = _DateRange_;
            createController = function() {
                return _$controller_('PikadayDirectiveController as pikaday', {
                    '$scope': $scope
                });
            };
        }));
        
    it('should set date to a month from now', () => {
        createController();

        var withControls = '2017-01-01';
        $scope.pikaday.scope.date = '2015-01-01';
        $scope.pikaday.scope.withControls = angular.copy(withControls);


        $scope.pikaday.setMonthFromDate();
        $scope.$digest();

        expect($scope.pikaday.scope.date).toEqual(DateRange.monthFromNow(withControls));
    });
});
