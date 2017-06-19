'use strict';

describe('DragService:dropData is a function that:\n', function() {
    var DragService,
        fakeEvent,
        $rootScope;
        

    beforeEach(module('utils'));
    beforeEach(inject(
        function(_DragService_, _$rootScope_) {
            DragService = _DragService_;
            $rootScope = _$rootScope_;
            
            fakeEvent = {
                dataTransfer: {
                    getData: function () {}
                }
            };
            
            spyOn(fakeEvent.dataTransfer, 'getData').and.returnValue('data');
        }));

    it('sets the dropEffect property and broadcasts event if target identifier found', function() {
        spyOn(DragService, 'findTargetIdentifier').and.returnValue('fakeValue');
        spyOn($rootScope, '$broadcast');
        
        DragService.dropData(fakeEvent);
        
        expect(fakeEvent.dataTransfer.dropEffect).toEqual('copyMove');
        expect($rootScope.$broadcast).toHaveBeenCalledWith('dataDropped', { sourceIdentifier: 'data', targetIdentifier: 'fakeValue' })
    });
});
