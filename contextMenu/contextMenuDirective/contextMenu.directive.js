(function () {

    function ContextMenuLink($scope, $element, $attributes) {

        $scope.$on('contextDataReady', function (event, xCord, yCord, menuOptions) {
            $scope.contextMenu.menuOptions = menuOptions;
            $scope.contextMenu.isVisible = true;

            if(!$scope.$$phase) {
                $scope.$digest();
            }

            $($element).css({
                top: yCord,
                left: xCord,
                position: 'absolute'
            });

            $('body').one('mousedown', function (clickEvent) {
                // /click is bubbling up the dom because of the timeline click that triggers the context menu,
                // so we need to use the mousedown event to detect a "fresh new click" starting
                $scope.contextMenu.hideIfOpen(clickEvent);
                $scope.$digest();
            });
        });
    }

    function ContextMenuDirectiveController() {
        this.menuOptions = [];
        this.isVisible = false;
    }

    ContextMenuDirectiveController.prototype.hideIfOpen = function (clickEvent) {
        const targetType = clickEvent.target.dataset ? clickEvent.target.dataset.type : undefined;
        
        if (targetType !== 'context-menu__item') {
            // we digest the scope only if the click was otuside the context menu item, as digesting it in the former case would make the
            // element hide immediately and the ng-click action of the menu item would not trigger
            this.isVisible = false;
        }
    };

    ContextMenuDirectiveController.prototype.executeAction = function (action) {
        action();
        this.isVisible = false;
    };

    function ContextMenuDirective() {
        return {
            restrict: 'A',
            link: ContextMenuLink,
            controller: 'ContextMenuDirectiveController',
            controllerAs: 'contextMenu',
            templateUrl: 'contextMenu/contextMenu.tpl.html'

        };
    }

    angular.module('contextMenu').controller('ContextMenuDirectiveController', ContextMenuDirectiveController);
    angular.module('contextMenu').directive('contextMenu', ContextMenuDirective);

})();
