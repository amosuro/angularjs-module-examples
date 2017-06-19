'use strict';

describe('SelectionPaste:isInvalidPaste is a method that:\n', function () {
    let SelectionPaste;

    beforeEach(module('selection'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_SelectionPaste_) {
            SelectionPaste = _SelectionPaste_;
        }));


    it('returns true if targetData length is empty', () => {
        const targetData = [];
        const clipboardItems = ['item'];
        const targetCurrency = { id: 'tvr' };

        expect(SelectionPaste.isInvalidPaste(targetData, clipboardItems, targetCurrency)).toEqual(true);
    });

    it('returns true if clipboardItems length is empty', () => {
        const targetData = ['item'];
        const clipboardItems = [];
        const targetCurrency = { id: 'tvr' };

        expect(SelectionPaste.isInvalidPaste(targetData, clipboardItems, targetCurrency)).toEqual(true);
    });

    it('returns true if targetCurrency id does not equal totalTvr or tvr', () => {
        const targetData = ['item'];
        const clipboardItems = ['item'];
        const targetCurrency = { id: 'share' };

        expect(SelectionPaste.isInvalidPaste(targetData, clipboardItems, targetCurrency)).toEqual(true);
    });

    it('returns false targetData not empty, clipboardItems not empty and targetCurrency equals tvr or totalTvr', () => {
        const targetData = ['item'];
        const clipboardItems = ['item'];
        let targetCurrency = { id: 'totalTvr' };

        expect(SelectionPaste.isInvalidPaste(targetData, clipboardItems, targetCurrency)).toEqual(false);

        targetCurrency = { id: 'tvr' };

        expect(SelectionPaste.isInvalidPaste(targetData, clipboardItems, targetCurrency)).toEqual(false);
    });
});
