'use strict';

describe('Clipboard:add is a method that:\n', function () {
    var Clipboard;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_Clipboard_) {
            Clipboard = _Clipboard_;
        }));

    it('should push data and data type to clipboard array', () => {
        let selectedObject = {data: 'foo', type: 'bar'};
            
        Clipboard.add([selectedObject]);
        
        expect(Clipboard.clipboard).toEqual([selectedObject]);
    });
});
