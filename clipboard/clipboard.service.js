(function() {
    'use strict';

    function Clipboard(UtilsService) {
        this.UtilsService = UtilsService;
        this.clipboard = [];
        this.DEFAULT_CURRENCY = {
            EDITED: this.UtilsService.getCurrencies()[0].id,
            CALCULATED: this.UtilsService.getCurrencies()[1].id
        };
    }

    Clipboard.prototype.add = function (dataToAdd) {
        this.clipboard = [].concat(dataToAdd);
    };

    Clipboard.prototype.paste = function (dataType, currency) {
        return this.clipboard.filter(clipboardItem => clipboardItem.type === dataType && clipboardItem.currency.id === currency.id)
                             .map(clipboardItem => clipboardItem.data);
    };

    Clipboard.prototype.empty = function (dataType) {
        this.clipboard.filter(clipboardItem => clipboardItem.type === dataType).map((clipboardItem, index) => {
            this.clipboard.splice(this.clipboard.indexOf(clipboardItem), 1);
        });
    };

    Clipboard.prototype.getEditedCurrency = function () {
        return this.DEFAULT_CURRENCY.EDITED;
    };

    Clipboard.prototype.getCalculatedCurrency = function () {
        return this.DEFAULT_CURRENCY.CALCULATED;
    };

    angular.module('utils').service('Clipboard', Clipboard);
})();
