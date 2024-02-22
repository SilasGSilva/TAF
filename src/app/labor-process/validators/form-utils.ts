import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { CustomValidators } from './custom-validators';

export class FormUtils {
  private static markAllControlsAsDirty(abstractControls: AbstractControl[]): void {
    abstractControls.forEach((abstractControl) => {
      if (abstractControl instanceof UntypedFormControl) {
        (abstractControl as UntypedFormControl).markAsDirty({ onlySelf: true });
      } else if (abstractControl instanceof UntypedFormGroup) {
        abstractControl.markAsDirty({ onlySelf: true });
        this.markAllControlsAsDirty(Object.values((abstractControl as UntypedFormGroup).controls));
      } else if (abstractControl instanceof UntypedFormArray) {
        abstractControl.markAsDirty({ onlySelf: true });
        this.markAllControlsAsDirty((abstractControl as UntypedFormArray).controls);
      }
    });
  }

  public static markFormGroupAsDirty(formGroup: UntypedFormGroup): void {
    formGroup.markAsDirty();
    this.markAllControlsAsDirty([formGroup]);
  }

  public static getFormControl<T extends AbstractControl = AbstractControl>(
    control: AbstractControl,
    name: string,
  ): T {
    const result = control.get(name);
    if (result == null) {
      throw new Error(`The control with path ${name} doesn't exist`);
    }
    return result as T;
  }

  public static setError(control: AbstractControl, error: ValidationErrors): void {
    let currentError = control.errors ?? {};
    currentError = { ...currentError, ...error };
    control.setErrors(currentError);
  }

  public static unsetError(control: AbstractControl, errorKey: string): void {
    if (control.errors == null) {
      return;
    }
    const errors = { ...control.errors };
    delete errors[errorKey];
    const numberOfKeys = Object.keys(errors).length;
    control.setErrors(numberOfKeys > 0 ? errors : null);
  }

  public static changeValidityControlCpfOrCnpj(isCpf: boolean, control: AbstractControl, controlPath: string, resetControl = true): void {
    if (resetControl) {
      this.getFormControl(control, controlPath).reset();
    }

    control.get(controlPath).removeValidators(CustomValidators.cpf);
    control.get(controlPath).removeValidators(CustomValidators.cnpj);

    const validatorToAdd = isCpf ? CustomValidators.cpf : CustomValidators.cnpj;
    control.get(controlPath).addValidators(validatorToAdd);
  }
}
