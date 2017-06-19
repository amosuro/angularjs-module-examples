'use strict';

describe('SelectionBreakPaste:applyBreak is a method that:\n', function () {
    var EditPending,
        SelectionBreakPaste;

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
        function (_EditPending_, _SelectionBreakPaste_) {
            EditPending = _EditPending_;
            SelectionBreakPaste = _SelectionBreakPaste_;
        }));

    function transform(editDemo, calcDemo, inverse) {
        return {
            editDemo: editDemo,
            calculateDemo: calcDemo,
            expression: !!inverse ? 'x / (1)' : 'x*1'
        };
    }


    it('Should add all transformations', () => {
        spyOn(EditPending, 'addTransformation');

        const transformations = [transform('ADULTS'), transform('HWIVES'), transform('CHILDS'), transform('ADABC1')];

        SelectionBreakPaste.applyBreak(transformations, 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADULTS'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWIVES'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('CHILDS'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADABC1'));
    });


    it('Should create inverse expression for ADULTS', () => {
        spyOn(EditPending, 'addTransformation');

        SelectionBreakPaste.applyBreak([transform('ADULTS')], 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADULTS'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1654', 'AD55PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWIVES', 'NOTHW', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1624', 'AD25PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1634', 'AD35PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADABC1', 'ADC2DE', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('WOMEN', 'MEN', true));


        SelectionBreakPaste.applyBreak([transform('ADULTS')], 'I4');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADULTS'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1654', 'AD55PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWIVES', 'NOTHW', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1624', 'AD25PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1634', 'AD35PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADABC1', 'ADC2DE', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('MEN', 'WOMEN', true));

    });

    it('Should create inverse expression for CHILDS', () => {
        spyOn(EditPending, 'addTransformation');

        SelectionBreakPaste.applyBreak([transform('CHILDS')], 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('CHILDS'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('CHIL49', 'CHIL1015', true));
    });

    it('Should create inverse expression for HWIVES', () => {
        spyOn(EditPending, 'addTransformation');

        SelectionBreakPaste.applyBreak([transform('HWIVES')], 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWIVES'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWSCHD', 'HWNCH', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HW1654', 'HW55PL', true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('HWABC1', 'HWC2DE', true));
    });

    it('Should create inverse expression for ADABC1', () => {
        spyOn(EditPending, 'addTransformation');

        SelectionBreakPaste.applyBreak([transform('ADABC1')], 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ADABC1'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('WOABC1', undefined, true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('MEABC1', undefined, true));
    });


    it('Should create inverse expression for AD1634', () => {
        spyOn(EditPending, 'addTransformation');

        SelectionBreakPaste.applyBreak([transform('AD1634')], 'ITV1');
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('AD1634'));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('WO1634', undefined, true));
        expect(EditPending.addTransformation).toHaveBeenCalledWith(transform('ME1634', undefined, true));
    });


});
