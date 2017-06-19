'use strict';

describe('InlineEditDirective.resetEdit is a method that:\n', function() {
    let $rootScope, $scope, $compile, element;
    let createController;

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

    beforeEach(inject(function($controller, _$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        $scope = $rootScope.$new();
        createController = function() {
            return $controller('InlineEditDirectiveController as inlineEdit', {
                '$scope': $scope
            });
        };
    }));

    it('broadcasts editingFinished event, sets viewModel to the originalValue and sets currentlyEditing to false', function() {
        const mockElement = {
            find: () => {}
        };

        spyOn(mockElement, 'find').and.returnValue({ blur: () => 'mock blur method'});

        createController();

        spyOn($scope, '$broadcast');

        $scope.inlineEdit.resetEdit(mockElement, 1);

        expect($scope.$broadcast).toHaveBeenCalledWith('editingFinished');
        expect($scope.inlineEdit.currentlyEditing).toEqual(false);
        expect($scope.inlineEdit.viewModel).toEqual(1);
    });
});