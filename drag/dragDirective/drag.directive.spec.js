'use strict';

describe('DragDirective after initialising:\n', function() {
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
        element = $compile('<div drag></div>')($scope);

        createController = function() {
            return $controller('DragDirectiveController as drag', {
                '$scope': $scope
            });
        };
    }));

    it('calls setDropData, addElementsToDrag and adds class on dragstart', function() {
        createController();

        spyOn($scope.drag.DragService, 'setDropData');
        spyOn($scope.drag.DragService, 'addElementsToDrag');

        element.triggerHandler('dragstart');

        $scope.$digest();

        expect($scope.drag.DragService.setDropData).toHaveBeenCalled();
        expect($scope.drag.DragService.addElementsToDrag).toHaveBeenCalled();
        expect(element.attr('class')).toContain('draggable--dragging');
    });

    it('adds dropzone class if element has drag-target attribute', function() {
        createController();

        element[0].setAttribute('drag-target', true);
        element.triggerHandler('dragover');

        $scope.$digest();

        expect(element.attr('class')).toContain('draggable--dropzone');
    });

    it('removes dropzone class on dragleave', function() {
        createController();

        element.addClass('draggable--dropzone');
        expect(element.attr('class')).toContain('draggable--dropzone')

        element.triggerHandler('dragleave');

        $scope.$digest();

        expect(element.attr('class')).not.toContain('draggable--dropzone');
    });

    it('calls resetCurrentlyDragging and removes dragging class for each element currently dragging on dragend', function() {
        const elementsCurrentlyDragging = [angular.copy(element)];
        createController();

        spyOn($scope.drag.DragService, 'resetCurrentlyDragging');
        $scope.drag.DragService.currentlyDragging = elementsCurrentlyDragging;

        elementsCurrentlyDragging[0].addClass('draggable--dragging');
        expect(elementsCurrentlyDragging[0].attr('class')).toContain('draggable--dragging');


        element.triggerHandler('dragend');
        $scope.$digest();

        expect(elementsCurrentlyDragging[0].attr('class')).not.toContain('draggable--dragging');
        expect($scope.drag.DragService.resetCurrentlyDragging).toHaveBeenCalled();
    });

    it('calls dropData and removes dropzone class on drop', function() {
        createController();
        spyOn($scope.drag.DragService, 'dropData');

        element.addClass('draggable--dropzone');
        expect(element.attr('class')).toContain('draggable--dropzone');

        element.triggerHandler('drop');
        $scope.$digest();

        expect($scope.drag.DragService.dropData).toHaveBeenCalled();
        expect(element.attr('class')).not.toContain('draggable--dropzone');
    });

});