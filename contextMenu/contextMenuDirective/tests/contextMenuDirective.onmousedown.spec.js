'use strict';

describe('ContextMenu:onmousedown:\n', function() {
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

    it('Calls the controller method to handle the event and calls scope digest', function() {
        $rootScope.$broadcast('contextDataReady', x, y, menuOptions);
        $rootScope.$digest();
        spyOn($scope, '$digest');
        spyOn($scope.contextMenu, 'hideIfOpen');

        $('body').mousedown();

        expect($scope.contextMenu.hideIfOpen).toHaveBeenCalled();
        expect($scope.$digest).toHaveBeenCalled();
    });


});