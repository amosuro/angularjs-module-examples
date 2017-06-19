(function() {

    'use strict';

    const TABLE_LAYOUT = {
        CELL: {
            WIDTH: 120,
            NARROW_WIDTH: 60,
            WIDE_WIDTH: 160,
            HEIGHT: 30,
            NARROW_HEIGHT: 20
        },
        BREAK: {
            WIDTH: 16,
            WIDE_WIDTH: 160
        },
        PROGRAMME: {
            WIDTH: 15,
            WIDE_WIDTH: 160
        },
        COSTA: {
            NARROW_WIDTH: 5,
            WIDTH: 30,
            HEIGHT: 16
        }
    };

    angular.module('svgGrid').constant('TABLE_LAYOUT', TABLE_LAYOUT);

})();