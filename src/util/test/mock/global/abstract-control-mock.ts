import { AbstractControl, ValidationErrors, ValidatorFn, ɵGetProperty } from "@angular/forms";

export class AbstractControlMock {
  value: any;
  pristine: boolean;
  untouched: boolean;

  setValue(value: unknown = null): void {
    this.value = value;
  }

  setValidators(validators: ValidatorFn | ValidatorFn[] | null): void {
    return;
  }

  clearValidators(): void {
    return;
  }

  setErrors(errors: ValidationErrors | null, opts?: {
    emitEvent?: boolean;
  }): void { return; };

  updateValueAndValidity(opts?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    return;
  }

  markAsPristine(opt: unknown = null): void {
    this.pristine = opt === null ? !this.pristine : <boolean>opt;
  }

  markAsUntouched(opt: unknown = null): void {
    this.untouched = opt === null ? !this.pristine : <boolean>opt;
  }

  get<P extends string | (readonly (string | number)[])>(path: P): AbstractControl<any> | null {
    return;
  };

  get valid(): boolean {
    return;
  };
}
