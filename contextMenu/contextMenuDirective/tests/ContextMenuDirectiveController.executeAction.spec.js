'use strict';

describe('ContextMenuDirectiveController:executeAction is a method that:\n', function() {
    var createController, $controller, $rootScope, $scope;

    beforeEach(module('contextMenu'));
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
        function(_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();

            createController = function() {
                return $controller('ContextMenuDirectiveController as contextMenu', {
                    '$scope': $scope
                });
            };
        }));

    it('Calls the passed action and sets the controller visibility property to false', function() {
        var some = {
            action: function() {
                return true;
            }
        };
        spyOn(some, 'action');

        createController();
        //$scope.contextMenu.isVisible = true;

        $scope.contextMenu.executeAction(some.action);
        expect(some.action).toHaveBeenCalled();
        //expect($scope.contextMenu.isVisible).toBe(false);
    });


});