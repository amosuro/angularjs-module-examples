(function () {
    'use strict';

    function ContextMenu($rootScope) {
        this.$rootScope = $rootScope;
    }

    ContextMenu.prototype.openContextMenu = function(xCord, yCord, menuOptions) {
        var _root = this;
        _root.$rootScope.$broadcast('contextDataReady', xCord, yCord, menuOptions);
    };

    angular.module('contextMenu').service('ContextMenu', ContextMenu);
})();