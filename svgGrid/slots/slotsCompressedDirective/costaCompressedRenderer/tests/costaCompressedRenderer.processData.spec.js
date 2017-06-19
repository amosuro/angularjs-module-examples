'use strict';

describe('CostaCompressedRenderer:processData is a method that:\n', () => {
    let CostaCompressedRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {
        _AuthorisedUser_.user = { username: 'CA Test User' };
    }));

    beforeEach(inject(function(_CostaCompressedRenderer_) {
        CostaCompressedRenderer = _CostaCompressedRenderer_;
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
                    },
                    "1100": {
                        result: 'OVER',
                        startTime: 1100,
                        endTime: 1200,
                        duration: 60
                    }
                }
            }
        };
        let scenarioChunks = [scenarioChunk1];

        let filteredCostaHours = [
            {
                result: 'UNDER',
                startTime: 900,
                endTime: 1000,
                duration: 60
            },
            {
                result: 'UNDER',
                startTime: 1000,
                endTime: 1100,
                duration: 60
            }
        ];
        
        spyOn(CostaCompressedRenderer.$location, 'search').and.returnValue({
            editTimeFrom: 933,
            editTimeTo: 1049
        });
        spyOn(CostaCompressedRenderer, 'setCostaHourHeight').and.returnValue(45);
        spyOn(CostaCompressedRenderer, 'filterCostaHours').and.returnValue(filteredCostaHours);

        CostaCompressedRenderer.processData(scenarioChunks);

        CostaCompressedRenderer.costaData.forEach(costa => expect(costa.scenarioChunkContext).toEqual(scenarioChunkContext));
        CostaCompressedRenderer.costaData.forEach(costa => expect(costa.height).toEqual(45));

        expect(CostaCompressedRenderer.costaData[0].topPosition).toBe(0);
        expect(CostaCompressedRenderer.costaData[0].col).toBe(0);
        expect(CostaCompressedRenderer.costaData[1].topPosition).toBe(45);
        expect(CostaCompressedRenderer.costaData[1].col).toBe(0);
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
        
        let scenarioChunks = [scenarioChunk1];

        CostaCompressedRenderer.processData(scenarioChunks);
        
        expect(CostaCompressedRenderer.costaData).toEqual([]);
    });
});
