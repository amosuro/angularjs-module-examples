'use strict';

describe('The slots directive handles the timeslots: \n', () => {
    let scenarioChunk = {
            timeslots: [
                {ITV: {TVR: 1, SHARE: 2}, TOTALTV: {TVR: 3}, regionCode: 'LO', row: 0, col: 0}
            ]
        };
    let demographics = [{"abbreviation":"AD1654","code":"A5","label":"16-54 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD55PL","code":"","label":"Adults 55+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"NOTHW","code":"","label":"Not Housewives"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"HWSCHD","code":"HC","label":"Housewives with Children","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HWNCH","code":"","label":"Housewives without Children"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"HW1654","code":"H5","label":"Housewives 16-54","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HW55PL","code":"","label":"Housewives 55+"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"HWABC1","code":"HA","label":"ABC1 Housewives","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HWC2DE","code":"","label":"C2DE Housewives"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"ADULTS","code":"AD","label":"Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"CHILDS","code":"CH","label":"Children"},{"abbreviation":"INDVLS","code":"","label":"All Individuals"}]},{"abbreviation":"AD1624","code":"A2","label":"16-24 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD25PL","code":"","label":"Adults 25+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD35PL","code":"","label":"Adults 35+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ADC2DE","code":"","label":"C2DE Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"MEN","code":"ME","label":"Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WOMEN","code":"WO","label":"Women"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"ME1634","code":"M3","label":"16-34 Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WO1634","code":"W3","label":"16-34 Women"},{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults"}]},{"abbreviation":"MEABC1","code":"MA","label":"ABC1 Men","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"WOABC1","code":"WA","label":"ABC1 Women"},{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults"}]},{"abbreviation":"WOMEN","code":"WO","label":"Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"MEN","code":"ME","label":"Men"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"WO1634","code":"W3","label":"16-34 Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ME1634","code":"M3","label":"16-34 Men"},{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults"}]},{"abbreviation":"WOABC1","code":"WA","label":"ABC1 Women","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"MEABC1","code":"MA","label":"ABC1 Men"},{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults"}]},{"abbreviation":"CHILDS","code":"CH","label":"Children","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"ADULTS","code":"AD","label":"Adults"},{"abbreviation":"INDVLS","code":"","label":"All Individuals"}]},{"abbreviation":"CHIL49","code":"C9","label":"Children 4-9","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"CHIL1015","code":"","label":"Children 10-15"},{"abbreviation":"CHILDS","code":"CH","label":"Children"}]},{"abbreviation":"CHIL1015","code":"","label":"Children 10-15","visible":true,"traded":false,"type":"VisibleNotTraded","related":[{"abbreviation":"CHIL49","code":"C9","label":"Children 4-9"},{"abbreviation":"CHILDS","code":"CH","label":"Children"}]},{"abbreviation":"AD35PL","code":"","label":"Adults 35+","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"AD1634","code":"A3","label":"16-34 Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"ADC2DE","code":"","label":"C2DE Adults","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"ADABC1","code":"AA","label":"ABC1 Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"AD25PL","code":"","label":"Adults 25+","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"AD1624","code":"A2","label":"16-24 Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"AD55PL","code":"","label":"Adults 55+","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"AD1654","code":"A5","label":"16-54 Adults"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"HW55PL","code":"","label":"Housewives 55+","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"HW1654","code":"H5","label":"Housewives 16-54"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"HWNCH","code":"","label":"Housewives without Children","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"HWSCHD","code":"HC","label":"Housewives with Children"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"HWC2DE","code":"","label":"C2DE Housewives","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"HWABC1","code":"HA","label":"ABC1 Housewives"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]},{"abbreviation":"NOTHW","code":"","label":"Not Housewives","visible":false,"traded":false,"type":"InvisibleNotTraded","related":[{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]},{"abbreviation":"INDVLS","code":"","label":"All Individuals","visible":true,"traded":false,"type":"VisibleNotTraded","related":[]},{"abbreviation":"UNKNOWN","code":"UNKNOWN","label":"","visible":false,"traded":false,"type":"Calculation","related":[]},{"abbreviation":"ANY","code":"ANY","label":"ANY","visible":false,"traded":false,"type":"Calculation","related":[]}];
    let xHeaders = [{"code":"A5","locked":false,"active":false,"$$hashKey":"object:462","demo":{"abbreviation":"AD1654","code":"A5","label":"16-54 Adults","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"AD55PL","code":"","label":"Adults 55+"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]}},{"code":"HW","locked":false,"active":false,"$$hashKey":"object:463","demo":{"abbreviation":"HWIVES","code":"HW","label":"All Housewives","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"NOTHW","code":"","label":"Not Housewives"},{"abbreviation":"ADULTS","code":"AD","label":"Adults"}]}},{"code":"HC","locked":false,"active":false,"$$hashKey":"object:464","demo":{"abbreviation":"HWSCHD","code":"HC","label":"Housewives with Children","visible":true,"traded":true,"type":"Traded","related":[{"abbreviation":"HWNCH","code":"","label":"Housewives without Children"},{"abbreviation":"HWIVES","code":"HW","label":"All Housewives"}]}},{"code":"H5","locked":false,"active":false,"$$hashKey":"object:465"},{"code":"HA","locked":false,"active":false,"$$hashKey":"object:466"},{"code":"AD","locked":false,"active":false,"$$hashKey":"object:467"},{"code":"A2","locked":false,"active":false,"$$hashKey":"object:468"},{"code":"A3","locked":false,"active":false,"$$hashKey":"object:469"},{"code":"AA","locked":false,"active":false,"$$hashKey":"object:470"},{"code":"ME","locked":false,"active":false,"$$hashKey":"object:471"},{"code":"M3","locked":false,"active":false,"$$hashKey":"object:472"},{"code":"MA","locked":false,"active":false,"$$hashKey":"object:473"},{"code":"WO","locked":false,"active":false,"$$hashKey":"object:474"},{"code":"W3","locked":false,"active":false,"$$hashKey":"object:475"},{"code":"WA","locked":false,"active":false,"$$hashKey":"object:476"},{"code":"CH","locked":false,"active":false,"$$hashKey":"object:477"},{"code":"C9","locked":false,"active":false,"$$hashKey":"object:478"}];
        
    beforeEach(module('slots'));
    beforeEach(inject(function ($location) { $location.search('editMode', 'slots'); }));
    beforeEach(inject(function(_AuthorisedUser_) { _AuthorisedUser_.user = { username: 'CA Test User' };}));
    beforeEach(inject(function($rootScope, $compile, _BreakRenderer_, _ProgrammeRenderer_, _CostaRenderer_, _BreakMultiEdit_, _Demographics_, _TableHeaderService_, _EditModel_) {
                rootScope = $rootScope;
                compile = $compile;
                $scope = $rootScope.$new();
                $scope.BreakRenderer = _BreakRenderer_;
                $scope.ProgrammeRenderer = _ProgrammeRenderer_;
                $scope.BreakMultiEdit = _BreakMultiEdit_;
                $scope.Demographics = _Demographics_;
                $scope.TableHeaderService = _TableHeaderService_;
                $scope.EditModel = _EditModel_;
                $scope.CostaRenderer = _CostaRenderer_;
                scenarioChunk1 = { context: { granularity: 'MIN5'} };
                scenarioChunk1.timeslots = [];
                scenarioChunk1.timeslotsDifference = [];
                scenarioChunk1.programmes = [];
                scenarioChunk1.breaks = [];
                scenarioChunk1.costa = { "hourly": {
                    "900": {
                        result: 'UNDER',
                        startTime: 900,
                        endTime: 1000,
                        duration: 60
                    },
                    "1000": {
                        result: 'UNDER',
                        startTime: 1000,
                        endTime: 1100,
                        duration: 60
                    }
                } };
                scenarioChunk1.regionCode = 'LO';

                $scope.scenarioChunks = [scenarioChunk1];
                $scope.currency = { label : 'TVR', id : 'tvr'};
                $scope.kpi = { label : 'TVR', id : 'tvr'};
                $scope.programmeeditactive = false;
                $scope.breaksdisplayactive =  false;
                
                $scope.Demographics.demographics = demographics;
                $scope.EditModel.headers.x = xHeaders;
                
                spyOn($scope.CostaRenderer, 'repaintCosta');
                spyOn($scope.CostaRenderer, 'processData');
            }
        )
    );

    it('Renders the timeSlots and re-renders them on currency switch', () => {
        createDirective();
        expect(d3.select('#test').selectAll('.time-slot-group:first-child').select('text').text()).toEqual('1.000');

        $scope.currency = { label : 'SHARE', id : 'share'};
        $scope.$digest();
        expect(d3.select('#test').selectAll('.time-slot-group:first-child').select('text').text()).toEqual('2.00');

        $scope.currency = { label : 'TOTALTVR', id : 'totalTvr'};
        $scope.$digest();
        expect(d3.select('#test').selectAll('.time-slot-group:first-child').select('text').text()).toEqual('3.000');

        $scope.scenarioChunks.length = 0;
    });

    it('on timeSlot click it renders an input box and binds the tvr value to it, then on blur remove the foreignObject', () => {
        $scope.BreakMultiEdit.scenarioChunk = scenarioChunk;
        createDirective();
        var timeSlotElement = d3.select('#test').selectAll('.time-slot-group:first-child');
        fireEventOnElement('click', timeSlotElement);

        expect(d3.select('#test').select('input').classed('edit-cell__input')).toBeTruthy();
        expect(d3.select('#test').select('input').attr('value')).toEqual('1.000');

        var inputElement = timeSlotElement.select('input');
        expect(d3.select('#test').select('foreignObject').empty()).toBeFalsy();
        fireEventOnElement('blur', inputElement);
        expect(d3.select('#test').select('foreignObject').empty()).toBeTruthy();
    });
});
