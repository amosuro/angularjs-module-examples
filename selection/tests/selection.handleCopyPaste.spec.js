'use strict';

describe('Selection:handleCopyPaste is a method that:\n', function () {
    var $q,
        $rootScope,
        Selection,
        Clipboard,
        KeyControl,
        SelectionModel,
        EditManager,
        Demographics,
        BreaksManager,
        SelectionPaste,
        MessagePanelState;

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
        function (_$q_, _$rootScope_, _Selection_, _Clipboard_, _KeyControl_, _SelectionModel_, _EditManager_, _Demographics_, _BreaksManager_, _SelectionPaste_, _MessagePanelState_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            Selection = _Selection_;
            Clipboard = _Clipboard_;
            KeyControl = _KeyControl_;
            SelectionModel = _SelectionModel_;
            EditManager = _EditManager_;
            Demographics = _Demographics_;
            BreaksManager = _BreaksManager_;
            SelectionPaste = _SelectionPaste_;
            MessagePanelState = _MessagePanelState_;

        }));

    it('should call add selection to a clipboard if command and copy key is pressed', () => {
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
        spyOn(KeyControl, 'isCopyKeyPressed').and.callFake(() => true);
        spyOn(MessagePanelState, 'showSuccessMessage');

        SelectionModel.selectedElements = [{data: 'object', type: 'type'}];

        Selection.handleCopyPaste();

        expect(MessagePanelState.showSuccessMessage).toHaveBeenCalledWith('Copied.', '');
        expect(Clipboard.clipboard).toEqual(SelectionModel.selectedElements);
    });

    it('should call paste if command and paste key is pressed', () => {
        spyOn(KeyControl, 'isCommandKeyPressed').and.callFake(() => true);
        spyOn(KeyControl, 'isPasteKeyPressed').and.callFake(() => true);
        spyOn(SelectionPaste, 'handlePaste');
        spyOn(MessagePanelState, 'showInfoMessage');


        SelectionModel.selectedElements = [{data: 'object', type: 'type', currency: 'cat'}];

        Selection.handleCopyPaste();

        expect(MessagePanelState.showInfoMessage).toHaveBeenCalledWith('Pasting...', '');
        expect(SelectionPaste.handlePaste).toHaveBeenCalledWith(SelectionModel.selectedElements, 'type', 'cat');

    });

    it('should not call paste if there is no data selected', () => {
        spyOn(SelectionPaste, 'handlePaste');

        Selection.handleCopyPaste();

        expect(SelectionPaste.handlePaste).not.toHaveBeenCalled();

    });

});
