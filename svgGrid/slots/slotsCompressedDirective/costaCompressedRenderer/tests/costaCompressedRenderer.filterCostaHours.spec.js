'use strict';

describe('CostaCompressedRenderer:filterCostaHours is a method that:\n', () => {
    let CostaCompressedRenderer;
    let scenarioChunk, dayPartStartTime, dayPartEndTime;

    beforeEach(module('slots'));
    beforeEach(inject((_AuthorisedUser_) => _AuthorisedUser_.user = { username: 'CA Test User' }));
    beforeEach(inject((_CostaCompressedRenderer_) => {
        CostaCompressedRenderer = _CostaCompressedRenderer_;

        CostaCompressedRenderer.EditModel.headers.yCompressed = ['9:33', '9:40', '9:59', '10:02', '12:04'];

        scenarioChunk = {
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
                    },
                    "1200": {
                        result: 'OVER',
                        startTime: 1200,
                        endTime: 1300,
                        duration: 60
                    }
                }
            }
        };

        dayPartStartTime = 800;
        dayPartEndTime = 1300;
    }));

    it('returns costa hours which fall within the current dayparts and match an hour listed in compressed headers', () => {
        const expectedHours = [
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
            },
            {
                result: 'OVER',
                startTime: 1200,
                endTime: 1300,
                duration: 60
            }
        ];

        expect(CostaCompressedRenderer.filterCostaHours(scenarioChunk, dayPartStartTime, dayPartEndTime)).toEqual(expectedHours);
    });
});
