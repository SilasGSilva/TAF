import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors } from "@angular/forms";
import { AbstractControlMock } from "../../../util/test/mock/global/abstract-control-mock";
import { FormUtils } from "./form-utils";

describe('FormUtils', () => {
    let component: FormUtils;

    beforeEach(() => {
        component = new FormUtils();
    });

    it('when called method markFormGroupAsDirty', () => {
        let fb: UntypedFormBuilder = new UntypedFormBuilder();
        let formGroup: UntypedFormGroup = fb.group({
            control1: [null],
            control2: fb.group({
                control21: [null]
            }),
            control3: fb.array([
                fb.group({
                    control31: [null]
                })
            ])
        });
        spyOn(formGroup, 'markAsDirty');

        FormUtils.markFormGroupAsDirty(formGroup);

        expect(formGroup.markAsDirty).toHaveBeenCalled();
    });

    describe('when called method getFormControl', () => {
        const name = 'controlName';

        it('should throw', () => {
            const control: AbstractControl = new AbstractControlMock() as unknown as AbstractControl;
            spyOn(control, 'get').and.returnValue(null);
            void expect(() => FormUtils.getFormControl(control, 'controlName')).toThrow(new Error(`The control with path ${name} doesn't exist`));
        });

        it('should defined result', () => {
            const control: AbstractControl = new AbstractControlMock() as unknown as AbstractControl;
            spyOn(control, 'get').and.returnValue(control);
            void expect(() => FormUtils.getFormControl(control, '')).toBeDefined();
        });
    });

    it('when called method setError', () => {
        let fb: UntypedFormBuilder = new UntypedFormBuilder();
        let formGroup: UntypedFormGroup = fb.group({
            control: [null]
        });

        formGroup.get('control').setErrors({ erro1: '1' });
        FormUtils.setError(formGroup.get('control'), { erro2: '2' });
        expect(formGroup.get('control').errors.erro1).toEqual('1');
        expect(formGroup.get('control').errors.erro2).toEqual('2');

        formGroup.get('control').setErrors(null);
        FormUtils.setError(formGroup.get('control'), { erro2: '2' });
        expect(formGroup.get('control').errors.erro1).toBeUndefined();
        expect(formGroup.get('control').errors.erro2).toEqual('2');
    });

    it('when called method unsetError', () => {
        let fb: UntypedFormBuilder = new UntypedFormBuilder();
        let formGroup: UntypedFormGroup = fb.group({
            control: [null]
        });

        formGroup.get('control').setErrors(null);
        FormUtils.unsetError(formGroup.get('control'), 'erro2');
        expect(formGroup.get('control').errors).toBeNull();

        formGroup.get('control').setErrors({ erro1: '1', erro2: '2' });
        FormUtils.unsetError(formGroup.get('control'), 'erro2');
        expect(formGroup.get('control').errors.erro1).toEqual('1');
        expect(formGroup.get('control').errors.erro2).toBeUndefined();
    });
});
