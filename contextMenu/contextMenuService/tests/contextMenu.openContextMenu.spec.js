'use strict';

describe('ContextMenu:openContextMenu is a method that:\n', function() {
    var $rootScope, ContextMenu;

    beforeEach(module('contextMenu'));
    beforeEach(inject(
        function(_AuthorisedUser_) {
            var AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function(_$rootScope_, _ContextMenu_) {
            $rootScope = _$rootScope_;
            ContextMenu = _ContextMenu_;
        }));

    it('emits a $rootscope event passing in the correct parameters', function() {
        var emitSpy = spyOn($rootScope, '$broadcast');
        var x = 10;
        var y = 20;
        var menuOptions = [{
            a: 1
        }];

        ContextMenu.openContextMenu(x, y, menuOptions);

        expect(emitSpy).toHaveBeenCalledWith('contextDataReady', x, y, menuOptions);
    });


});