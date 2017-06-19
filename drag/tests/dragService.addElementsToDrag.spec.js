'use strict';

describe('DragService:addElementsToDrag is a function that:\n', function() {
    var DragService;

    beforeEach(module('utils'));
    beforeEach(inject(
        function(_DragService_) {
            DragService = _DragService_;
        }));

    it('pushes an element to the currentlyDragging array', function() {
        const element1 = {id: '1'};
        
        DragService.addElementsToDrag([element1]);
        
        expect(DragService.currentlyDragging).toEqual([element1])
    });
        
    it('pushes more than one element to the currentlyDragging array', function() {
        const element1 = {id: '1'};
        const element2 = {id: '2'};
        
        DragService.addElementsToDrag([element1, element2]);
        
        expect(DragService.currentlyDragging).toEqual([element1, element2])
    });
});
