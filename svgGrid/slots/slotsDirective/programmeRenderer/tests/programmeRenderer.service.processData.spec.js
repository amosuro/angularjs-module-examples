'use strict';

describe('ProgrammeRenderer:processData is a method that:\n', () => {
    let ProgrammeRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function(_AuthorisedUser_) {_AuthorisedUser_.user = { username: 'CA Test User' }}));
    beforeEach(inject(function(_ProgrammeRenderer_) { ProgrammeRenderer = _ProgrammeRenderer_; }));

    it('that extends the programme data with svg render specific properties', () => {
        let scenarioChunkContext = {
            granularity : 'MIN'
        };
        let scenarioChunk1 = {
            context : scenarioChunkContext,
            regionCode : 'LO',
            programmes : [{duration : 10, displayDuration: 10}, { duration : 20, displayDuration: 20}]
        };
        let scenarioChunk2 = _.cloneDeep(scenarioChunk1);
        let scenarioChunks = [scenarioChunk1, scenarioChunk2];
        ProgrammeRenderer.processData(scenarioChunks);

        ProgrammeRenderer.scenarioChunks.forEach(scenarioChunk => expect(scenarioChunk.pixelsPerMinute).toBe(30));
        ProgrammeRenderer.programmeData.forEach(programme => expect(programme.regionCode).toBe(scenarioChunks[0].regionCode));

        ProgrammeRenderer.programmeData.forEach(programme => expect(programme.scenarioChunkContext).toEqual(scenarioChunkContext));
        ProgrammeRenderer.programmeData.forEach(programme => expect(programme.height).toEqual(programme.displayDuration * scenarioChunk1.pixelsPerMinute));

        expect(ProgrammeRenderer.programmeData.length).toBe(4);

        expect(ProgrammeRenderer.programmeData[0].col).toBe(0);
        expect(ProgrammeRenderer.programmeData[0].topPosition).toBe(0);

        expect(ProgrammeRenderer.programmeData[1].col).toBe(0);
        expect(ProgrammeRenderer.programmeData[1].topPosition).toBe(300);

        expect(ProgrammeRenderer.programmeData[2].col).toBe(1);
        expect(ProgrammeRenderer.programmeData[2].topPosition).toBe(0);

        expect(ProgrammeRenderer.programmeData[3].col).toBe(1);
        expect(ProgrammeRenderer.programmeData[3].topPosition).toBe(300);
    });
});