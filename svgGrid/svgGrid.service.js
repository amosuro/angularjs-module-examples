(function () {
    'use strict';

    function SvgGrid(NumberUtils) {
        this.NumberUtils = NumberUtils;
    }
    
    SvgGrid.prototype.pixelsPerMinuteFor = function (granularity) {
        switch (granularity) {
            case 'MIN':
                return 30;
            case 'MIN5':
                return 6;
            case 'MIN15':
                return 2;
            case 'MIN30':
                return 1;
            case 'HOUR':
                return 0.5;
            default :
                return 30;
        }
    };

    angular.module('svgGrid').service('SvgGrid', SvgGrid);
})();
