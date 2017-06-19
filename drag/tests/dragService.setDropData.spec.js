'use strict';

describe('DragService:setDropData is a function that:\n', function() {
    var DragService,
        fakeEvent;

    beforeEach(module('utils'));
    beforeEach(inject(
        function(_DragService_) {
            DragService = _DragService_;
            
            fakeEvent = {
                dataTransfer: {
                    setData: function () {}
                }
            };
        }));

    it('sets the effectAllowed and setData properties', function() {
        const data = 'fake data';
        spyOn(fakeEvent.dataTransfer, 'setData');
        
        DragService.setDropData(fakeEvent, data);
        
        expect(fakeEvent.dataTransfer.setData).toHaveBeenCalledWith('text', data);
        expect(fakeEvent.dataTransfer.effectAllowed).toEqual('copyMove');
    });
});
