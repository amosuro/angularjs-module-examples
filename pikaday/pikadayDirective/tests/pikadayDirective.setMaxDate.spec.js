'use strict';

describe('The PikadayDirective:setMaxDate is a method that \n', function() {

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

    it('should have a watcher on the maxdate model and sets the datepicker when it changes to a valid date value', function() {
        spyOn(element.isolateScope().pikadayInstance, 'setMaxDate');
    
        element.isolateScope().maxDate = '2020-07-10';
        element.isolateScope().$digest();
    
        expect(element.isolateScope().pikadayInstance.setMaxDate).toHaveBeenCalledWith(new Date('2020-07-10'));
    });
    
    it('should have a watcher on the maxdate model and does not set the datepicker when it changes to an invalid date value', function() {
        spyOn(element.isolateScope().pikadayInstance, 'setMaxDate');
    
        element.isolateScope().maxDate = null;
        element.isolateScope().$digest();
    
        expect(element.isolateScope().pikadayInstance.setMaxDate).not.toHaveBeenCalledWith(null);
    });
});
