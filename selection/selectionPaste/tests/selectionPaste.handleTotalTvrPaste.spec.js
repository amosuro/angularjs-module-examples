'use strict';

describe('SelectionPaste:handleTotalTvrPaste is a method that:\n', function () {
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

    it('calls copyTotalTvr if targetCurrency id equals totalTvr', () => {
        const source = {
            compItems: ['item']
        };

        const targetCurrency = { id: 'totalTvr' };

        spyOn(SelectionPaste.EditManager, 'copyTotalTvr');

        SelectionPaste.handleTotalTvrPaste(source, targetCurrency);

        expect(SelectionPaste.EditManager.copyTotalTvr).toHaveBeenCalledWith(['item']);
    });

    it('does not call copyTotalTvr if targetCurrency id does not equal totalTvr', () => {
        const source = {
            compItems: ['item']
        };

        const targetCurrency = { id: 'tvr' };

        spyOn(SelectionPaste.EditManager, 'copyTotalTvr');

        SelectionPaste.handleTotalTvrPaste(source, targetCurrency);

        expect(SelectionPaste.EditManager.copyTotalTvr).not.toHaveBeenCalled();
    });
});
