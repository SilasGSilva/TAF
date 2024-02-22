import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { DedDepen, InfoDep, TpRendEnum, TpRendLabelEnum } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { FormatterUtils } from '../../../../../utils/formatter-utils';
import { CustomValidators } from '../../../../../validators/custom-validators';
import { InfoCRIRRFValidations } from '../validations/infoCRIRRF-validations';
import { COLUMNS, OPTIONS_TP_REND } from './constants/data';

export interface DedDepenView {
  cpfDepLabel: string;
  tpRendLabel: string;
  vlrDeducaoLabel: number;
}

@Component({
  selector: 'app-dependent-deduction',
  templateUrl: './dependent-deduction.component.html',
  styleUrls: [
    './dependent-deduction.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class DependentDeductionComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() modalFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: DedDepenView[] = [];

  optionsTpRend: PoSelectOption[] = OPTIONS_TP_REND;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('dedDepen') as UntypedFormControl;
  }

  get formArrayValue(): DedDepen[] {
    return this.formArray.value ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 999;
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

  createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpRend: [null, CustomValidators.requiredIgnoreWhiteSpace],
      cpfDep: [null, [CustomValidators.cpf, this.validateCpfDep.bind(this)]],
      vlrDeducao: [null, Validators.min(0.01)],
    });
  }

  initializeTableActions(): void {
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

  transformRows(): void {
    this.rows = this.formArrayValue.map(dedDepen => ({
      cpfDepLabel: FormatterUtils.formatCpf(dedDepen.cpfDep),
      tpRendLabel: FormatterUtils.convertValueToLabel(dedDepen.tpRend, TpRendEnum, TpRendLabelEnum),
      vlrDeducaoLabel: dedDepen.vlrDeducao,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.openForm(false);
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.closeForm();
  }

  update(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.closeForm();
  }

  cancel(): void {
    this.closeForm();
  }

  handleClickEdit(dedDepen: DedDepenView): void {
    const clickIndex = this.rows.findIndex(item => item === dedDepen);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(dedDepen: DedDepenView): void {
    const clickIndex = this.rows.findIndex(item => item === dedDepen);

    const currentValue = this.formArrayValue;
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
    const infoDep: InfoDep[] = this.modalFormGroup.get('infoIRComplem.infoDep').value;

    return InfoCRIRRFValidations.validateCpfDep(control.value, infoDep);
  }
}
