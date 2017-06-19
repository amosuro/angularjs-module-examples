'use strict';

describe('TimeSlotRenderer:isValidNumberOrExpression is a method that:\n', () => {
    let TimeSlotRenderer;

    beforeEach(module('slots'));
    beforeEach(inject(function (_AuthorisedUser_) { _AuthorisedUser_.user = { username: 'CA Test User' }; }));
    beforeEach(inject(function (_TimeSlotRenderer_) { TimeSlotRenderer = _TimeSlotRenderer_; }));

    it('checks if a given expression is valid when currency is tvr', () => {
        let currency = { id : 'tvr' };
        expect(TimeSlotRenderer.isValidNumberOrExpression(1, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(1.0, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(-1.0, currency)).toBeFalsy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(100.1, currency)).toBeFalsy();
    });

    it('checks if a given expression is valid when currency is share', () => {
        let currency = { id : 'share' };
        expect(TimeSlotRenderer.isValidNumberOrExpression(1, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(1.0, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(-1.0, currency)).toBeFalsy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(1.1, currency)).toBeFalsy();
    });

    it('checks if a given expression is valid when currency is totalTvr', () => {
        let currency = { id : 'totalTvr' };
        expect(TimeSlotRenderer.isValidNumberOrExpression(1, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(1.0, currency)).toBeTruthy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(-1.0, currency)).toBeFalsy();
        expect(TimeSlotRenderer.isValidNumberOrExpression(100.1, currency)).toBeFalsy();
    });

    it('checks if a given expression is valid calculation', () => {
        let currency = { id : 'totalTvr' };
        expect(TimeSlotRenderer.isValidNumberOrExpression('x*2', currency)).toBeTruthy();
    });
});