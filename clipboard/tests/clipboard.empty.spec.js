'use strict';

describe('Clipboard:empty is a method that:\n', function () {
    var Clipboard;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_Clipboard_) {
            Clipboard = _Clipboard_;
        }));

    it('should empty the clipboard array content', () => {
        let copiedData1 = {
                data: {a: 'b'}, 
                type: 'programme-schedule'
            }
        Clipboard.clipboard = [{
                data: {a: 'b'}, 
                type: 'programme-schedule'
            },
            {
                data: {a: 'b'}, 
                type: 'programme-demo'
            }
        ];
        
        Clipboard.empty('programme-demo');
        
        expect(Clipboard.clipboard).toEqual([{ data: {a: 'b'}, type: 'programme-schedule' }]);
    });
});
