'use strict';

describe('CostaRenderer:processData is a method that:\n', () => {
    let CostaRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {
        _AuthorisedUser_.user = { username: 'CA Test User' };
    }));
    beforeEach(inject(function(_CostaRenderer_, $location) {
        CostaRenderer = _CostaRenderer_;
        $location = $location;
    }));

    it('should extend the costa data with svg render specific properties', () => {
        let scenarioChunkContext = {
            granularity : 'MIN5'
        };
        
        let scenarioChunk1 = {
            context : scenarioChunkContext,
            regionCode : 'LO',
            costa: {
                "hourly": {
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
                }
            }
        };
        
        let scenarioChunk2 = _.cloneDeep(scenarioChunk1);
        let scenarioChunks = [scenarioChunk1, scenarioChunk2];
        let pixelsPerMinute = 6;
        let hourLength = 60;
        
        spyOn(CostaRenderer.$location, 'search').and.callFake(function() {
            return {
                editTimeFrom: 900,
                editTimeTo: 1100
            };
        });

        CostaRenderer.processData(scenarioChunks);

        CostaRenderer.scenarioChunks.forEach(scenarioChunk => expect(scenarioChunk.pixelsPerMinute).toBe(pixelsPerMinute));

        CostaRenderer.costaData.forEach(costa => expect(costa.scenarioChunkContext).toEqual(scenarioChunkContext));
        CostaRenderer.costaData.forEach(costa => expect(costa.height).toEqual(costa.duration * scenarioChunk1.pixelsPerMinute));

        expect(CostaRenderer.costaData[0].topPosition).toBe(0);
        expect(CostaRenderer.costaData[1].topPosition).toBe(pixelsPerMinute * hourLength);
    });
    
    it('does not process any data when scenariochunk does not have any costa hours', () => {
        let scenarioChunkContext = {
            granularity : 'MIN5'
        };
        
        let scenarioChunk1 = {
            context : scenarioChunkContext,
            regionCode : 'LO',
            costa: {

            }
        };
        
        let scenarioChunk2 = _.cloneDeep(scenarioChunk1);
        let scenarioChunks = [scenarioChunk1, scenarioChunk2];

        CostaRenderer.processData(scenarioChunks);
        
        expect(CostaRenderer.costaData).toEqual([])
    });
});
