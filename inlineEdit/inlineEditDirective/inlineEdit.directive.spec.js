'use strict';

describe('InlineEditDirective after initialising:\n', function() {
    let $rootScope, $scope, $compile, element;

    beforeEach(module('dir-templates'));
    beforeEach(module('utils'));
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

    beforeEach(inject(function($controller, _$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;

        $scope = $rootScope.$new();
        element = $compile('<inline-edit ng-model="test" />')($scope);

        $scope.$digest();

        element.isolateScope().inlineEdit.inlineEditForm = {
            $invalid: true
        };
    }));

    it('calls $broadcast and $digest methods and sets currentlyEditing to true', function() {
        spyOn(element.isolateScope(), '$broadcast');
        spyOn(element.isolateScope(), '$digest');
        element.isolateScope().inlineEdit.editDisabled = false;

        element.triggerHandler('dblclick');
        $scope.$digest();

        expect(element.isolateScope().inlineEdit.currentlyEditing).toEqual(true);
        expect(element.isolateScope().$broadcast).toHaveBeenCalledWith('editingStarted');
        expect(element.isolateScope().$digest).toHaveBeenCalled();
    });

    it('calls startEditing method on editingStarted', function() {
        spyOn(element.isolateScope().inlineEdit, 'startEditing');

        $scope.$broadcast('editingStarted');
        $scope.$digest();

        expect(element.isolateScope().inlineEdit.startEditing).toHaveBeenCalled();
    });

    it('calls resetEdit method only on enter keydown', function() {
        spyOn(element.isolateScope().inlineEdit, 'resetEdit');
        spyOn(element.isolateScope().inlineEdit.InlineEdit, 'applyChange');
        spyOn(element.isolateScope().inlineEdit, 'finishEditing');

        $scope.$broadcast('editingStarted');

        $('body').triggerHandler({
            type: 'keydown',
            which: 13
        });


        $scope.$digest();

        expect(element.isolateScope().inlineEdit.resetEdit).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.InlineEdit.applyChange).not.toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.finishEditing).not.toHaveBeenCalled();
    });

    it('calls resetEdit, applyChange and finishEditing methods', function() {
        spyOn(element.isolateScope().inlineEdit, 'resetEdit');
        spyOn(element.isolateScope().inlineEdit.InlineEdit, 'applyChange');
        spyOn(element.isolateScope().inlineEdit, 'finishEditing');

        $scope.$broadcast('editingStarted');

        element.isolateScope().inlineEdit.inlineEditForm = {
            $invalid: false
        };

        $('body').triggerHandler({
            type: 'keydown',
            which: 13
        });

        element.isolateScope().inlineEdit.viewModel = '5';

        $scope.$digest();

        expect(element.isolateScope().inlineEdit.resetEdit).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.InlineEdit.applyChange).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.finishEditing).toHaveBeenCalled();
    });

    it('calls resetEdit method on escape key down', function() {
        spyOn(element.isolateScope().inlineEdit, 'resetEdit');
        spyOn(element.isolateScope().inlineEdit.InlineEdit, 'applyChange');
        spyOn(element.isolateScope().inlineEdit, 'finishEditing');

        $scope.$broadcast('editingStarted');

        $('body').triggerHandler({
            type: 'keydown',
            which: 27
        });

        element.isolateScope().inlineEdit.viewModel = '5';

        $scope.$digest();

        expect(element.isolateScope().inlineEdit.resetEdit).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.InlineEdit.applyChange).not.toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.finishEditing).not.toHaveBeenCalled();
    });

    it('calls resetEdit on mousedown if target is not the target input and form is invalid', function() {
        spyOn(element.isolateScope().inlineEdit, 'resetEdit');
        spyOn(element.isolateScope().inlineEdit.InlineEdit, 'applyChange');
        spyOn(element.isolateScope().inlineEdit, 'finishEditing');
        spyOn(element.isolateScope().inlineEdit.UtilsService, 'findSelectableAncestor').and.returnValue(undefined);

        $scope.$broadcast('editingStarted');

        element.isolateScope().inlineEdit.inlineEditForm = {
            $invalid: true
        };

        $('body').triggerHandler('mousedown');

        $scope.$digest();

        expect(element.isolateScope().inlineEdit.resetEdit).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.InlineEdit.applyChange).not.toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.finishEditing).not.toHaveBeenCalled();
    });

    it('does not call resetEdit if target is not the target input but form is valid', function() {
        spyOn(element.isolateScope().inlineEdit, 'resetEdit');
        spyOn(element.isolateScope().inlineEdit.InlineEdit, 'applyChange');
        spyOn(element.isolateScope().inlineEdit, 'finishEditing');
        spyOn(element.isolateScope().inlineEdit.UtilsService, 'findSelectableAncestor').and.returnValue(undefined);

        element.isolateScope().inlineEdit.inlineEditForm = {
            $invalid: false
        };

        $scope.$broadcast('editingStarted');


        $('body').triggerHandler('mousedown');

        $scope.$digest();

        expect(element.isolateScope().inlineEdit.resetEdit).not.toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.InlineEdit.applyChange).toHaveBeenCalled();
        expect(element.isolateScope().inlineEdit.finishEditing).toHaveBeenCalled();
    });
});