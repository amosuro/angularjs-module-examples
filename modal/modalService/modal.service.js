(function () {

    'use strict';

    function ModalService($timeout) {
        var _root = this;
        this.$timeout = $timeout;
        this.contentTemplate = null;
        this.isVisible = false;

        this.defaults = {
            positive: {
                label: 'Ok',
                action: function () {
                    _root.cancel();
                }
            },
            negative: {
                label: 'Cancel',
                action: function () {
                    _root.cancel();
                }
            }
        };

        this.options = angular.copy(this.defaults);
    }

    ModalService.prototype.show = function () {
        this.isVisible = true;
        this.$timeout(function(){
            $('#modalForm').find('input, textarea, button.option').first().focus();
        });
    };

    ModalService.prototype.cancel = function () {
        this.isVisible = false;
    };

    ModalService.prototype.setOptions = function (options) {
        var _root = this;

        this.options.positive = {
            label: options[0].label,
            action: function() {
                options[0].action();
                _root.cancel();
            }
        };

        this.options.negative = options[1] || this.defaults.negative;
    };

    ModalService.prototype.init = function (template, options) {
        this.contentTemplate = template;
        this.setOptions(options);
        this.show();
    };


    angular.module('modal').service('ModalService', ModalService);

})();