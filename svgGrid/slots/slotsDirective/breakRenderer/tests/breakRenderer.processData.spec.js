'use strict';

describe('BreakRenderer:processData is a method that:\n', () => {
    let BreakRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));
    beforeEach(inject(function(_BreakRenderer_) { BreakRenderer = _BreakRenderer_; }));

    it('that extends the break data with svg render specific properties', () => {
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
        BreakRenderer.processData(scenarioChunks);

        BreakRenderer.breakData.forEach(programme => expect(programme.scenarioChunkContext).toEqual(scenarioChunkContext));
        BreakRenderer.breakData.forEach(programme => expect(programme.timeIndex).toEqual(programme.time));

        expect(BreakRenderer.breakData.length).toBe(4);
        expect(BreakRenderer.breakData[0].col).toBe(0);
        expect(BreakRenderer.breakData[1].col).toBe(0);
        expect(BreakRenderer.breakData[2].col).toBe(1);
        expect(BreakRenderer.breakData[3].col).toBe(1);
    });
});