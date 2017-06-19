'use strict';

describe('The PikadayDirective:resetEndDate is a method that\n', function() {

    var $rootScope, 
        $compile, 
        $scope,
        element;
    
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
        function(_$rootScope_, _$compile_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $scope = $rootScope.$new();
            element = $compile('<pikaday min-date="scope.minDate" max-date="scope.maxDate" ng-model="scope.date"></pikaday>')($scope);
            $scope.$digest();
        }));
    
    it('should reset target end date if it is before target date', function() {
        let startDate = new Date('2017-01-01'),
            endDate = new Date('2016-01-01');
        
        element.isolateScope().date = startDate;
        element.isolateScope().endDate = endDate;
        
        element.isolateScope().$digest();

        expect(element.isolateScope().endDate).toBe(element.isolateScope().date);
    });
    
    it('should reset target end date if it is before target date', function() {
        let startDate = new Date('2017-01-01');
        
        element.isolateScope().date = startDate;
    
        element.isolateScope().$digest();

        expect(element.isolateScope().endDate).toBe(element.isolateScope().date);
    });
});
