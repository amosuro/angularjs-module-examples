(function() {
    'use strict';
    /* global Pikaday */

    function PikadayDirectiveLink($scope, $element) {
        let $input = angular.element($element.children()[0])[0];
        
        var options = {
                field: $input,
                minDate: $scope.minDate,
                maxDate: $scope.maxDate
            };
            
        $scope.pikadayInstance = new Pikaday(options);

        $scope.$watch('date', function(newVal) {
            if (newVal) {
                $scope.pikaday.setDate(newVal);
            } else {
                $scope.pikadayInstance.gotoDate($scope.pikaday.dateProcessing($scope.minDate));
            }
        });
        
        $scope.$watch('minDate', function(newVal) {
            if (!$element[0].hasAttribute('manual-restrictions')) {
                $scope.pikaday.setMinDate(newVal);
            }
        });
        
        $scope.$watch('maxDate', function(newVal) {
            if (!$element[0].hasAttribute('manual-restrictions')) {
                $scope.pikaday.setMaxDate(newVal);
            }
        });
    }

    function PikadayDirectiveController($scope, DateRange) {
        this.scope = $scope;
        this.DateRange = DateRange;
    }
    
    PikadayDirectiveController.prototype.resetEndDate = function () {
        if (!this.scope.endDate || new Date(this.scope.date) > new Date(this.scope.endDate)) {
            this.scope.endDate = this.scope.date;
        }
    };
    
    PikadayDirectiveController.prototype.setDay = function () {
        this.scope.date = this.scope.withControls;
    };
    
    PikadayDirectiveController.prototype.setWeekFromDate = function () {
        this.scope.date = this.DateRange.weekFromNow(this.scope.withControls);
    };
    
    PikadayDirectiveController.prototype.setMonthFromDate = function () {
        this.scope.date = this.DateRange.monthFromNow(this.scope.withControls);
    };
    
    PikadayDirectiveController.prototype.setDate = function (date) {
        if (date) {
            this.scope.pikadayInstance.setDate(this.dateProcessing(date));
        }
    };
    
    PikadayDirectiveController.prototype.setMinDate = function (date) {
        if (date) {
            this.scope.pikadayInstance.setMinDate(this.dateProcessing(date));
        }
    };
    
    PikadayDirectiveController.prototype.setMaxDate = function (date) {
        if (date) {
            this.scope.pikadayInstance.setMaxDate(this.dateProcessing(date));
        }
    };

    PikadayDirectiveController.prototype.dateProcessing = function (date) {
        var splitDate,
            dateObject;
        
        if (!date) {
            return null;
        }
        date = moment(date).format('YYYY-MM-DD');
        dateObject = new Date(date);
        return moment(dateObject).toDate();
    };   
     
    function PikadayDirective() {
        return {
            link: PikadayDirectiveLink,
            controller: 'PikadayDirectiveController',
            controllerAs: 'pikaday',
            restrict: 'E',
            require: 'ngModel',
            scope: {
                inputName: '@',
                inputId: '@',
                inputPlaceholder: '@',
                inputDisabled: '=inputDisabled',
                inputChange: '=inputChange',
                date: '=ngModel',
                endDate: '=?endDate',
                minDate: '=minDate',
                maxDate: '=maxDate',
                withControls: '=withControls'
            },
            templateUrl: 'pikaday/pikaday.tpl.html'
        };
    }

    angular.module('pikaday').controller('PikadayDirectiveController', PikadayDirectiveController);
    angular.module('pikaday').directive('pikaday', PikadayDirective);

})();
