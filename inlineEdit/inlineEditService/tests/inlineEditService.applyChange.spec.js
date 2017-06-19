'use strict';

describe('InlineEdit:applyChange is a method that:\n', function () {
    var InlineEdit, AuthorisedUser, InlineEditTypehead;

    beforeEach(module('utils'));
    beforeEach(inject(
        function (_AuthorisedUser_) {
            AuthorisedUser = _AuthorisedUser_;

            AuthorisedUser.user = {
                username: 'CA Test User',
                givenName: 'firstname',
                surname: 'surname',
                isCaUser: true
            };
        }));
    beforeEach(inject(
        function (_InlineEdit_, _InlineEditTypehead_) {
            InlineEdit = _InlineEdit_;
            InlineEditTypehead = _InlineEditTypehead_;

            spyOn(InlineEditTypehead, 'reset');
        }));

    it('does nothing when no value change', function () {
        const chunk = {meta: {isBreak: true}},
            newValue = 1,
            oldValue = 1,
            changeType = 'TYPE';

        spyOn(InlineEdit, 'applyBreakChange');
        spyOn(InlineEdit, 'applyProgrammeChange');

        InlineEdit.applyChange(chunk, newValue, oldValue, changeType);

        expect(InlineEdit.applyBreakChange).not.toHaveBeenCalled();
        expect(InlineEdit.applyProgrammeChange).not.toHaveBeenCalled();
        expect(InlineEditTypehead.reset).toHaveBeenCalled();
    });

    it('does nothing if change type is description but is not set', function () {
        const chunk = {meta: {isBreak: false}},
            newValue = 'This Morning',
            oldValue = 'This Morning',
            changeType = 'description';

        InlineEditTypehead.editedData = {
            description: {
                value: null
            }
        };

        spyOn(InlineEdit, 'applyBreakChange');
        spyOn(InlineEdit, 'applyProgrammeChange');

        InlineEdit.applyChange(chunk, newValue, oldValue, changeType);

        expect(InlineEdit.applyBreakChange).not.toHaveBeenCalled();
        expect(InlineEdit.applyProgrammeChange).not.toHaveBeenCalled();
        expect(InlineEditTypehead.reset).toHaveBeenCalled();
    });



    it('should apply break change when chunk is break', function () {
        const chunk = {meta: {isBreak: true}},
            newValue = 1,
            oldValue = 2,
            changeType = 'TYPE';

        spyOn(InlineEdit, 'applyBreakChange');
        spyOn(InlineEdit, 'applyProgrammeChange');

        InlineEdit.applyChange(chunk, newValue, oldValue, changeType);

        expect(InlineEdit.applyBreakChange).toHaveBeenCalledWith(chunk, newValue, changeType);
        expect(InlineEdit.applyProgrammeChange).not.toHaveBeenCalled();
    });


    it('should apply programme change when chunk is programme', function () {
        const chunk = {meta: {isBreak: false}},
            newValue = 1,
            oldValue = 2,
            changeType = 'TYPE';

        spyOn(InlineEdit, 'applyBreakChange');
        spyOn(InlineEdit, 'applyProgrammeChange');

        InlineEdit.applyChange(chunk, newValue, oldValue, changeType);

        expect(InlineEdit.applyBreakChange).not.toHaveBeenCalled();
        expect(InlineEdit.applyProgrammeChange).toHaveBeenCalledWith(chunk, newValue, changeType);
    });


    it('should apply programme change when chunk is programme and change type is description', function () {
        const chunk = {meta: {isBreak: false}},
            newValue = 'This Morning',
            oldValue = 'This Morning',
            changeType = 'description';

        InlineEditTypehead.editedData = {
            description: {
                value: 'Get me out of here'
            },
            categories: {value: 'set'},
            shortName: {value: 'set'}
        };

        spyOn(InlineEdit, 'applyBreakChange');
        spyOn(InlineEdit, 'applyProgrammeChange');

        InlineEdit.applyChange(chunk, newValue, oldValue, changeType);

        expect(InlineEdit.applyBreakChange).not.toHaveBeenCalled();
        expect(InlineEdit.applyProgrammeChange).toHaveBeenCalledWith(chunk, newValue, changeType);
    });





});
