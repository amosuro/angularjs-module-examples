'use strict';

describe('Clipboard:paste is a method that:\n', function () {
    var Clipboard,
        dataType,
        currency,
        copiedItem;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_Clipboard_) {
            Clipboard = _Clipboard_;
            
            dataType = {'example type': 'bar'};
            currency = {id: 'tvr'};
            copiedItem = {data: {a: 'b'}, type: dataType, currency: currency};
        }));

    it('should return clipboard content if it matches given dataType & currency', () => {
        Clipboard.clipboard = [copiedItem];
        
        expect(Clipboard.paste(dataType, currency)).toEqual([copiedItem.data]);
        expect(Clipboard.paste('someOtherType', currency)).toEqual([]);
    });
    
    it('should not return clipboard content if it matches given dataType but not currency', () => {
        Clipboard.clipboard = [copiedItem];
        
        expect(Clipboard.paste(dataType, 'some other currency')).toEqual([]);
    });
});
