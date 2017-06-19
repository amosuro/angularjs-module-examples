function InlineEditLink($scope, $element, $attrs, $controller) {
    if (!$scope.inlineEdit.editDisabled) {
        $element.on('dblclick', (event) => {
            $scope.inlineEdit.currentlyEditing = true;
            $scope.$broadcast('editingStarted');
            $scope.$digest();
        });
    }
    
    $scope.$on('editingStarted', (event) => {
        let originalValue = angular.copy($scope.inlineEdit.viewModel);
        
        $scope.inlineEdit.startEditing($element);
        
        $('body').on('keydown', (event) => {
            if ($scope.inlineEdit.KEY_DICTIONARY[event.which] === 'enter' || $scope.inlineEdit.KEY_DICTIONARY[event.which] === 'tab') {
                if ($scope.inlineEdit.inlineEditForm.$invalid) {
                    $scope.inlineEdit.resetEdit($element, originalValue);
                    return;
                }
                $scope.inlineEdit.resetEdit($element, originalValue, $scope.inlineEdit.viewModel);
                $scope.inlineEdit.InlineEdit.applyChange($scope.scenarioChunk, $scope.inlineEdit.viewModel, originalValue, $scope.type);
                $scope.inlineEdit.finishEditing();
            } else if ($scope.inlineEdit.KEY_DICTIONARY[event.which] === 'escape') {
                $scope.inlineEdit.resetEdit($element, originalValue);
            }
        });
        
        $('body').on('mousedown', (event) => {
            const targetInput = $scope.inlineEdit.UtilsService.findSelectableAncestor(event.target, 4, 'data-inline-content');
            
            if (targetInput === undefined) {
                if ($scope.inlineEdit.inlineEditForm.$invalid) {
                    $scope.inlineEdit.resetEdit($element, originalValue);
                    return;
                }
                $scope.inlineEdit.InlineEdit.applyChange($scope.scenarioChunk, $scope.inlineEdit.viewModel, originalValue, $scope.type);
                $scope.inlineEdit.finishEditing();
            }
            
            $scope.$digest();
        });
    });
    
    $scope.$on('editingFinished', (event) => {
        $('body').off('keydown');
        $('body').off('mousedown');
    });
}

function InlineEditDirective() {
    return {
        link: InlineEditLink,
        restrict: 'E',
        controller: 'InlineEditDirectiveController',
        controllerAs: 'inlineEdit',
        require: 'ngModel',
        scope: {
            type: '<',
            style: '<',
            viewModel: '<ngModel',
            scenarioChunk: '<',
            editDisabled: '<'
        },
        templateUrl: 'utils/inlineEdit/inlineEdit.tpl.html'
    };
}

function InlineEditDirectiveController($scope, $timeout, KEY_DICTIONARY, InlineEdit, UtilsService, TimeUtils, InlineEditTypehead, EditSettings) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.KEY_DICTIONARY = KEY_DICTIONARY;
    this.InlineEdit = InlineEdit;
    this.TimeUtils = TimeUtils;
    this.UtilsService = UtilsService;
    this.InlineEditTypehead = InlineEditTypehead;
    this.EditSettings = EditSettings;
    
    this.currentlyEditing = false;
    this.scenarioChunk = $scope.scenarioChunk;
    this.type = $scope.type;
    this.style = $scope.style;
    this.editDisabled = $scope.editDisabled;
    
    this.myForm = $scope.myForm;

    this.viewModel = this.type === 'duration' ? this.InlineEdit.getDuration($scope.scenarioChunk) : $scope.viewModel;
}

InlineEditDirectiveController.prototype.startEditing = function (element) {
    this.inputFocus(element);
};

InlineEditDirectiveController.prototype.finishEditing = function () {
    this.currentlyEditing = false;
    this.$scope.$broadcast('editingFinished');
};

InlineEditDirectiveController.prototype.resetEdit = function (element, originalValue, newValue) {
    if (!!!newValue || originalValue === newValue) {
        this.viewModel = originalValue;
        this.currentlyEditing = false;
        this.$scope.$broadcast('editingFinished');
        element.find('[data-inline-input]').blur();
    }
};

InlineEditDirectiveController.prototype.inputFocus = function (element) {
    this.$timeout(() => {
        element.find('[data-inline-input]').focus();
    });
};

(function () {

    'use strict';

    angular.module('utils')
        .controller('InlineEditDirectiveController', InlineEditDirectiveController)
        .directive('inlineEdit', InlineEditDirective);

})();
