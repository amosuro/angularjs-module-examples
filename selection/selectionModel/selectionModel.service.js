(function () {

    'use strict';

    function SelectionModel() {
        this.selectedElements = [];
    }

    SelectionModel.prototype.add = function(elementToAdd, dataType, currency) {
        // We need to set the 'selected' state on the object for this to work
        // with vsRepeat (infinite scroll). We should eventually update everything to use
        // this approach
        
        elementToAdd.isSelected = dataType;
        this.selectedElements.push({data: elementToAdd, type: dataType, currency: currency});
    };

    SelectionModel.prototype.remove = function(elementToRemove) {
        elementToRemove.isSelected = false;
        this.selectedElements = _.filter(this.selectedElements, element => element.data !== elementToRemove);
    };

    SelectionModel.prototype.empty = function() {
        this.selectedElements.forEach((element) => {
            element.data.isSelected = false;
        });
        
        this.selectedElements.length = 0;
    };

    SelectionModel.prototype.get = function() {
        return this.selectedElements;
    };

    SelectionModel.prototype.isEmpty = function() {
        return !this.selectedElements.length;
    };
    
    SelectionModel.prototype.getByType = function (dataType) {
        return _.map(this.selectedElements.filter(element => element.type === dataType), 'data');
    };
    
    SelectionModel.prototype.isTypeEmpty = function (dataType) {
        return this.getByType(dataType).length === 0;
    };

    SelectionModel.prototype.getType = function() {
        return this.get().length > 0 ? this.get()[0].type : undefined;
    };
    
    SelectionModel.prototype.find = function(data) {
        return this.selectedElements.find(element => _.isEqual(element.data, data));
    };
    
    SelectionModel.prototype.getCurrency = function() {
        return this.get().length > 0 ? this.get()[0].currency : undefined;
    };

    angular.module('selection').service('SelectionModel', SelectionModel);
})();
