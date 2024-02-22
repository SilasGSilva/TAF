import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { BenefPen, InfoDep } from '../../../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../../../../../utils/formatter-utils';
import { InfoCRIRRFValidations } from '../../../../validations/infoCRIRRF-validations';
import { COLUMNS } from './constants/data';

export interface BenefPenView {
  cpfDepLabel: BenefPen['cpfDep'];
  vlrDepenSuspLabel: BenefPen['vlrDepenSusp'];
}

@Component({
  selector: 'app-deductions-and-beneficiaries',
  templateUrl: './deductions-and-beneficiaries.component.html',
  styleUrls: [
    './deductions-and-beneficiaries.component.scss',
    '../../../../../../labor-process-tax-detail.component.scss',
  ]
})
export class DeductionsAndBeneficiariesComponent implements OnInit, OnDestroy {
  @Input() mainModalFormGroup: UntypedFormGroup;
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: BenefPenView[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('benefPen') as UntypedFormControl;
  }

  get formArrayValue(): BenefPen[] {
    return this.formArray.value ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 99;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get errorMessageCpfDep(): string {
    const errors = this.subFormGroup.get('cpfDep')?.errors;
    if (!errors) {
      return '';
    }

    if (errors.required) {
      return 'Campo obrigatório';
    }
    if (errors.cpf) {
      return 'CPF inválido';
    }
    if (errors.notExistsValueInInfoDep) {
      return InfoCRIRRFValidations.notExistsValueInInfoDepErrorMessage;
    }
  }

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.subFormGroup = this.createSubFormGroup();

    this.initializeTableActions();
    this.transformRows();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      cpfDep: [null, [CustomValidators.cpf, this.validateCpfDep.bind(this)]],
      vlrDepenSusp: [null, [CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.01)]],
    });
  }

  private initializeTableActions(): void {
    const viewOnlyActions = [
      {
        action: this.handleClickEdit.bind(this),
        label: 'Ver',
      },
    ];
    const viewAndEditActions = [
      {
        action: this.handleClickEdit.bind(this),
        label: 'Editar',
      },
      {
        action: this.handleClickDelete.bind(this),
        label: 'Excluir',
      },
    ];

    this.actions = this.isExcluded ? viewOnlyActions : viewAndEditActions;
  }

  private transformRows(): void {
    this.rows = this.formArrayValue.map(benefPen => ({
      cpfDepLabel: FormatterUtils.formatCpf(benefPen.cpfDep),
      vlrDepenSuspLabel: benefPen.vlrDepenSusp,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.openForm(false);
  }

  save(): void {
    const currentValue = [...this.formArrayValue];
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.closeForm();
  }

  update(): void {
    const currentValue = [...this.formArrayValue];
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.closeForm();
  }

  cancel(): void {
    this.closeForm();
  }

  handleClickEdit(benefPen: BenefPenView): void {
    const clickIndex = this.rows.findIndex(item => item === benefPen);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(benefPen: BenefPenView): void {
    const clickIndex = this.rows.findIndex(item => item === benefPen);

    const currentValue = [...this.formArrayValue];
    currentValue.splice(clickIndex, 1);
    this.formArray.setValue(currentValue);

    this.closeForm();
    this.isEdit = false;
  }

  private openForm(isEdit: boolean): void {
    this.isSelected = true;
    this.isEdit = isEdit;
  }

  private closeForm(): void {
    this.isSelected = false;
    this.editIndex = null;
  }

  private validateCpfDep(control: AbstractControl): ValidationErrors {
    const infoDep: InfoDep[] = this.mainModalFormGroup.get('infoIRComplem.infoDep').value;

    return InfoCRIRRFValidations.validateCpfDep(control.value, infoDep);
  }
}
