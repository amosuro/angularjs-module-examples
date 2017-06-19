function DragLink($scope, $element, $attrs) {
    $element.attr('draggable', 'true');
    
    $element.on('dragstart', (e) => {
        $element.addClass('draggable--dragging');

        $scope.drag.DragService.setDropData(e.originalEvent, $scope.data);
        
        $scope.drag.DragService.addElementsToDrag([$element]);
    });
    
    $element.on('dragover', (e) => {
        e.preventDefault();
        
        if ($element[0].hasAttribute('drag-target')) {
            $element.addClass('draggable--dropzone');
        }
    });
    
    $element.on('dragleave', (e) => {
        $element.removeClass('draggable--dropzone');
    });

    $element.on('dragend', (e) => {
        $scope.drag.DragService.currentlyDragging.forEach(($element) => {
            $element.removeClass('draggable--dragging');
        });

        $scope.drag.DragService.resetCurrentlyDragging();
    });
    
    $element.on('drop', (e) => {
        $scope.drag.DragService.dropData(e.originalEvent);
        $element.removeClass('draggable--dropzone');
        
        return false;
    });
}

function DragDirective() {
    return {
        link: DragLink,
        restrict: 'A',
        controller: 'DragDirectiveController',
        controllerAs: 'drag',
        scope: {
            data: '<dragData'
        }
    };
}

function DragDirectiveController($scope, DragService) {
    this.$scope = $scope;
    this.DragService = DragService;
}

(function() {

    'use strict';

    angular.module('utils')
        .controller('DragDirectiveController', DragDirectiveController)
        .directive('drag', DragDirective);

})();
