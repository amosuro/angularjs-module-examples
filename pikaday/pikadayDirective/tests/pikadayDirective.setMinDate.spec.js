'use strict';

describe('The PikadayDirective:setMinDate is a method that \n', function() {

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

    it('should have a watcher on the mindate model and sets the datepicker when it changes to a valid date value', function() {
        spyOn(element.isolateScope().pikadayInstance, 'setMinDate');
    
        element.isolateScope().minDate = '2016-09-07';
        element.isolateScope().$digest();
    
        expect(element.isolateScope().pikadayInstance.setMinDate).toHaveBeenCalledWith(new Date('2016-09-07'));
    });
    
    
    it('should have a watcher on the mindate model and does not set the datepicker when it changes to an invalid date value', function() {
        spyOn(element.isolateScope().pikadayInstance, 'setMinDate');
    
        element.isolateScope().minDate = null;
        element.isolateScope().$digest();
    
        expect(element.isolateScope().pikadayInstance.setMinDate).not.toHaveBeenCalledWith(null);
    });
});
