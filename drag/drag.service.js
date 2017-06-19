(function () {
    'use strict';

    function DragService($rootScope) {
        this.$rootScope = $rootScope;
        this.currentlyDragging = [];
    }

    DragService.prototype.addElementsToDrag = function(elements) {
        elements.forEach((element) => this.currentlyDragging.push(element));
    };
    
    DragService.prototype.setDropData = function (event, data) {
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.setData('text', data);
    };
    
    DragService.prototype.dropData = function (event) {


        const sourceIdentifier = event.dataTransfer.getData('text');
        const targetIdentifier = this.findTargetIdentifier(event.target, 3);
        
        if (targetIdentifier) {
            event.dataTransfer.dropEffect = 'copyMove';
            this.$rootScope.$broadcast('dataDropped', { sourceIdentifier: sourceIdentifier, targetIdentifier: targetIdentifier });
        }
    };
    
    DragService.prototype.findTargetIdentifier = function (DOMelement, depth) {
        if (DOMelement.attributes['drag-target']) {
            return DOMelement.getAttribute('drag-target');
        } else {
            if (DOMelement.parentElement && depth) {
                return this.findTargetIdentifier(DOMelement.parentElement, depth - 1);
            } else {
                return undefined;
            }
        }
    };

    DragService.prototype.resetCurrentlyDragging = function () {
        this.currentlyDragging = [];
    };

    angular.module('utils').service('DragService', DragService);
})();
