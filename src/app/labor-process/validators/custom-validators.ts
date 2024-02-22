import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { OptionalValuesFormatterUtils } from '../utils/optional-values-formatter-utils';
import { validateCNPJ } from './cnpj';
import { validateCPF } from './cpf';

export class CustomValidators {
  static cnpj(control: AbstractControl): ValidationErrors | null {
    let { value } = control;
    if (typeof value === 'string') {
      value = value.trim();
      if (value === '') {
        return null;
      }
    }
    if (value == null) {
      return null;
    }
    const isValid = validateCNPJ(value);
    return isValid ? null : { cnpj: true };
  }

  static requiredIgnoreWhiteSpace(control: AbstractControl): ValidationErrors | null {
    const { value } = control;

    if (typeof value === 'string') {
      const stringValue = value.trim();
      if (CustomValidators.isValueEmpty(stringValue)) {
        return { required: true };
      }
    }
    return Validators.required(control);
  }

  static isValueEmpty(value: any): boolean {
    if (value == null) return true;
    const emptyStringValues = ['', OptionalValuesFormatterUtils.SELECT_DEFAULT_EMPTY_VALUE];

    return emptyStringValues.includes(value);
  }

  static cpf(control: AbstractControl): ValidationErrors | null {
    const { value } = control;
    if (value == null) {
      return null;
    }

    let cpf = value.toString();
    if (Array.isArray(value)) cpf = cpf.toString().replace(/,/, '');
    if (cpf.length > 0 && !validateCPF(cpf)) {
      return { cpf: true };
    }
    return null;
  }

  static same(
    controlName: string,
    matchingControlName: string,
    errorName: string = 'same'
  ): ValidatorFn {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (control.value !== null && matchingControl.value !== null) {
        if (control.value === matchingControl.value) {
          return { [errorName]: true };
        }
      }
      return null;
    };
  }

  static hasCalculationPeriod(control: AbstractControl): ValidationErrors | null {
    const { value } = control;
    return value?.length > 0 ? null : { hasCalculationPeriod: true };
  }

  static isValidProcessNumber(control: AbstractControl): ValidationErrors | null {
    const { value } = control;
    const processNumberLength = value?.trim()?.length
    const isValid = processNumberLength === 15 || processNumberLength === 20;
    return isValid ? null : { processNumberLength: true };
  }

  static validPerRef(validPeriods: String[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const { value } = control;
      const inputDate = new Date(value + '-01');
      const minDate = new Date('2008-12-01');

      if (inputDate < minDate && value?.length > 6) {
        return { outOfRange: true };
      }
      if (!validPeriods.includes(value) && value?.length > 6) {
        return { invalidPerRef: true };
      }
      return null;
    }
  }

  static validateFieldInSomeVersion(isVersion: () => boolean,...validators: ValidatorFn[]) {
    return (control: AbstractControl) => {
      if (!isVersion()) {
        return null;
      }

      for (const validator of validators) {
        const validationResult = validator(control);
        if (validationResult !== null) {
          return validationResult;
        }
      }

      return null;
    };
  }
}
