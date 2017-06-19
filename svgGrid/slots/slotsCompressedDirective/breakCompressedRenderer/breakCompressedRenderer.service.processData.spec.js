'use strict';

describe('BreakCompressedRenderer:processData is a method that:\n', () => {
    let BreakCompressedRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));
    beforeEach(inject(function(_BreakCompressedRenderer_) { BreakCompressedRenderer = _BreakCompressedRenderer_; }));

    it('that extends the break data with svg render specific properties', () => {
        const rowHeaders = [
            1800,
            1900,
            2000,
            2100
        ];
        
        const TABLE_LAYOUT = {
            CELL: {
                HEIGHT: 20
            }
        };
        
        let scenarioChunkContext = {
            granularity : 'MIN'
        };
        let scenarioChunk1 = {
            context : scenarioChunkContext,
            regionCode : 'LO',
            breaks : [{duration : 10}, { duration : 20}]
        };
        let scenarioChunk2 = _.cloneDeep(scenarioChunk1);
        let scenarioChunks = [scenarioChunk1, scenarioChunk2];
        BreakCompressedRenderer.processData(scenarioChunks, rowHeaders, TABLE_LAYOUT);

        BreakCompressedRenderer.breakData.forEach(programme => expect(programme.scenarioChunkContext).toEqual(scenarioChunkContext));
        BreakCompressedRenderer.breakData.forEach(programme => expect(programme.timeIndex).toEqual(programme.time));

        expect(BreakCompressedRenderer.breakData.length).toBe(4);
        expect(BreakCompressedRenderer.breakData[0].col).toBe(0);
        expect(BreakCompressedRenderer.breakData[1].col).toBe(0);
        expect(BreakCompressedRenderer.breakData[2].col).toBe(1);
        expect(BreakCompressedRenderer.breakData[3].col).toBe(1);
    });
});
