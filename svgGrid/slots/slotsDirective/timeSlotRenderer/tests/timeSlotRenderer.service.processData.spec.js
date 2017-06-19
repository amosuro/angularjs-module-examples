'use strict';

describe('TimeSlotRenderer:processData is a method that:\n', () => {
    let TimeSlotRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function (_AuthorisedUser_) { _AuthorisedUser_.user = { username: 'CA Test User' }; }));
    beforeEach(inject(function (_TimeSlotRenderer_) { TimeSlotRenderer = _TimeSlotRenderer_; }));

    it('that extends the time slot data with svg render specific properties', () => {

        let scenarioChunk1 = {
            context : {
                granularity : 'MIN'
            },
            regionCode : 'LO',
            timeslots : [{}, {}],
            timeslotsDifference : [{}, {}]
        };
        let scenarioChunk2 = _.cloneDeep(scenarioChunk1);
        var scenarioChunks = [scenarioChunk1, scenarioChunk2];
        TimeSlotRenderer.processData(scenarioChunks);

        TimeSlotRenderer.scenarioChunks.forEach(scenarioChunk => expect(scenarioChunk.pixelsPerMinute).toBe(30));
        TimeSlotRenderer.timeSlotsData.forEach(timeSlot => expect(timeSlot.regionCode).toBe('LO'));

        expect(TimeSlotRenderer.timeSlotsData.length).toBe(4);

        expect(TimeSlotRenderer.timeSlotsData[0].row).toBe(0);
        expect(TimeSlotRenderer.timeSlotsData[0].col).toBe(0);

        expect(TimeSlotRenderer.timeSlotsData[1].row).toBe(1);
        expect(TimeSlotRenderer.timeSlotsData[1].col).toBe(0);

        expect(TimeSlotRenderer.timeSlotsData[2].row).toBe(0);
        expect(TimeSlotRenderer.timeSlotsData[2].col).toBe(1);

        expect(TimeSlotRenderer.timeSlotsData[3].row).toBe(1);
        expect(TimeSlotRenderer.timeSlotsData[3].col).toBe(1);
    });
});