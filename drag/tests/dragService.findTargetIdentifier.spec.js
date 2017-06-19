'use strict';

describe('DragService:findTargetIdentifier is a function that:\n', function() {
    var DragService,
        TARGET_ATTRIBUTE,
        DEPTH;

    beforeEach(module('utils'));
    beforeEach(inject(
        function(_DragService_) {
            DragService = _DragService_;
            DEPTH = 3;
            TARGET_ATTRIBUTE = 'drag-target';
        }));

    it('Returns the data attribute value of the element with which it was called, if element is target', () => {
        const domElementMock = {
            attributes: {},
            getAttribute: function () {}
        };
        spyOn(domElementMock, 'getAttribute').and.returnValue('testValue');
        domElementMock.attributes[TARGET_ATTRIBUTE] = 'programme';
        
        expect(DragService.findTargetIdentifier(domElementMock, DEPTH)).toEqual('testValue');
    });
    
    it('Returns the ancestor of the element with which it was called, if this element is not selectable but its parent is', () => {
        const domGrandParentElementMock = {
            attributes: {},
            getAttribute: function () {}
        };
        domGrandParentElementMock.attributes[TARGET_ATTRIBUTE] = 'programme';
        
        const domParentElementMock = {
            attributes: {},
            getAttribute: function () {},
            parentElement: domGrandParentElementMock
        };
        
        const domElementMock = {
            attributes: {},
            getAttribute: function () {},
            parentElement: domParentElementMock
        };
        
        spyOn(domGrandParentElementMock, 'getAttribute').and.returnValue('grandParentTestValue');
        spyOn(domParentElementMock, 'getAttribute').and.returnValue('parentTestValue');
        spyOn(domElementMock, 'getAttribute').and.returnValue('testValue');
                
        expect(DragService.findTargetIdentifier(domElementMock, DEPTH)).toEqual('grandParentTestValue');
    });
    
    it('Returns undefined if neither the element or its ancestors are selectable', () => {
        const domGrandParentElementMock = {
            attributes: {},
            getAttribute: function () {},
        };
        
        const domParentElementMock = {
            attributes: {},
            getAttribute: function () {},
            parentElement: domGrandParentElementMock
        };
        
        const domElementMock = {
            attributes: {},
            getAttribute: function () {},
            parentElement: domParentElementMock
        };       
         
        expect(DragService.findTargetIdentifier(domElementMock, DEPTH)).toEqual(undefined);
    });
});
