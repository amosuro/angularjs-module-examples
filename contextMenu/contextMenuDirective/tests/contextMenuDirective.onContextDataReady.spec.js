'use strict';

describe('ContextMenu:getContextMenuActions is a method that:\n', function() {
    var $rootScope, $compile, $scope, element;

    var x = 10;
    var y = 20;
    var menuOptions = [{
        label: 'Compare model',
        action: function() {
            return true;
        }
    }];

    beforeEach(module('contextMenu'));
    beforeEach(module('dir-templates'));
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
            element = $compile(angular.element('<body></body><div context-menu></div></body>'))($scope);
            $scope.$digest();
        }));

    it('Set data sent through rootscope event to the scope properties', function() {
        $rootScope.$broadcast('contextDataReady', x, y, menuOptions);
        $rootScope.$digest();

        expect($scope.contextMenu.menuOptions).toEqual(menuOptions);
        expect($scope.contextMenu.isVisible).toBeTruthy();
    });


});