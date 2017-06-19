'use strict';

describe('SelectionDirective after initialising:\n', function() {
    let $rootScope, $scope, $compile, element;
    let createController;

    beforeEach(module('dir-templates'));
    beforeEach(module('selection'));
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

    beforeEach(inject(function($controller, _$rootScope_, _$compile_, _Selection_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Selection = _Selection_;

        $scope = $rootScope.$new();

        element = $compile('<div selection><button></button></div>')($scope);

        createController = function() {
            return $controller('SelectionController', {
                '$scope': $scope
            });
        };
    }));

    it('Injects the Selection service', function() {
        createController();
        expect($scope.Selection).toEqual(Selection);
    });

    it('calls handleClick when element is clicked', function() {
        spyOn(Selection, 'handleClick');

        element.triggerHandler('click');

        $scope.$digest();

        expect($scope.Selection.handleClick).toHaveBeenCalled();
    });
});