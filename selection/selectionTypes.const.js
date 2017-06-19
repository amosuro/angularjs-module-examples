(function() {

    'use strict';

    var SELECTION_TYPES = {
        PROGRAMME_DEMO: 'programme-demo',
        BREAK_DEMO: 'break-demo',
        SCHEDULE_PROGRAMME: 'programme-schedule',
        SCHEDULE_BREAK: 'break-schedule',
        SCHEDULE_DAY: 'schedule-day',
        TOTALTVR: 'totaltvr-schedule',
        PROGRAMME_AGGREGATE: 'programme-aggregate',
        BREAK_AGGREGATE: 'break-aggregate',
        TIMERANGE_AGGREGATE: 'timerange-demo'
    };

    angular.module('selection').constant('SELECTION_TYPES', SELECTION_TYPES);

})();
