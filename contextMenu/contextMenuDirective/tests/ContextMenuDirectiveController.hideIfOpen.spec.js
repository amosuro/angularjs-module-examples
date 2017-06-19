'use strict';

describe('ContextMenuDirectiveController:hideIfOpen is a method that:\n', function() {
    var createController, $controller, $rootScope, $scope;

    var clickOnTheTimeline = {
        target : {
            dataset : {
                type: 'context-menu__item'
            }
        }
    };
    var clickOffTheTimeline = {
        target : {
            dataset: {
                type: 'something_different'
            }
        }
    };
    
    var clickOffTheTimelineSVGElement = {
        target : {
        }
    };

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
            createController();
            $scope.contextMenu.isVisible = true;
        }));

    it('Sets the visibility to false if the click was not on the timeline item', function() {
        $scope.contextMenu.hideIfOpen(clickOffTheTimeline);
        expect($scope.contextMenu.isVisible).toBe(false);
    });

    it('Does not change visibility if the click was on the timeline item', function() {
        $scope.contextMenu.hideIfOpen(clickOnTheTimeline);
        expect($scope.contextMenu.isVisible).toBe(true);
    });
    
    it('Sets the visibility to false if the click event does not have dataset (i.e. not HTMLElement)', function() {
        $scope.contextMenu.hideIfOpen(clickOffTheTimelineSVGElement);
        expect($scope.contextMenu.isVisible).toBe(false);
    });
});
