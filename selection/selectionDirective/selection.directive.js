(function () {

    'use strict';

    function SelectionDirectiveLink($scope, $element, $attrs) {
        $element.on('click', event => {
            $scope.Selection.handleClick(event);
            $scope.$digest();
        });
        
        $(document).on('keydown', event => $scope.Selection.handleCopyPaste(event));
    }

    function SelectionController($scope, Selection) {
        $scope.Selection = Selection;
    }

    function SelectionDirective() {
        return {
            controller: SelectionController,
            link: SelectionDirectiveLink,
            restrict: 'A'
        };
    }

    angular.module('selection')
        .controller('SelectionController', SelectionController)
        .directive('selection', SelectionDirective);

})();
