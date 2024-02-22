import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InfoDep, TpDepEnum } from '../../../../../../models/labor-process-taxes.model';
import { ESocialVersionEnum, OptionsAnswer } from '../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../../utils/formatter-utils';
import { LaborProcessDataStateService } from '../../../../../service/labor-process-data-state.service';
import { COLUMNS, OPTIONS_DEP_IRRF, OPTIONS_TP_DEP } from './constants/data';

export interface InfoDepView {
  cpfDepLabel: string;
  nomeLabel: string;
  descrDepLabel: string;
}

@Component({
  selector: 'app-dependent-information',
  templateUrl: './dependent-information.component.html',
  styleUrls: [
    './dependent-information.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class DependentInformationComponent implements OnInit, OnDestroy {
  @Input() mainFormGroup: UntypedFormGroup;
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  version: ESocialVersionEnum;

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: InfoDepView[] = [];

  todayDate = DateTime.now().toJSDate();

  optionsDepIRRF: PoSelectOption[] = OPTIONS_DEP_IRRF;
  optionsTpDep: PoSelectOption[] = OPTIONS_TP_DEP;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoDep') as UntypedFormControl;
  }

  get formArrayValue(): InfoDep[] {
    return this.formArray.value ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 999;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get isRequiredTpDep(): boolean {
    return this.subFormGroup.get('depIRRF').value === OptionsAnswer.Yes;
  }

  get isRequiredDescrDep(): boolean {
    return this.subFormGroup.get('tpDep').value === TpDepEnum.AgregadoOutros;
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
    if (errors.isSameValueCpfTrab) {
      return 'Mesmo CPF do trabalhador';
    }
    if (errors.haveSameValueInCpfDep) {
      return 'CPF já presente nas informações de dependentes';
    }
  }

  constructor(private fb: UntypedFormBuilder, private laborProcessDataStateService: LaborProcessDataStateService) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.subFormGroup = this.createSubFormGroup();

    this.initializeTableActions();
    this.transformRows();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.subFormGroup.get('depIRRF').valueChanges.subscribe(() => {
      this.updateValidityTpDep();
    }));
    this.subscriptions.push(this.subFormGroup.get('tpDep').valueChanges.subscribe(() => {
      this.handleChangesTpDep();
      this.updateValidityTpDep();
      this.updateValidityDescrDep();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      cpfDep: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, CustomValidators.cpf, this.validateCpfDep.bind(this))],
      dtNascto: [null],
      nome: [null],
      depIRRF: [null],
      tpDep: [null],
      descrDep: [null],
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
    this.rows = this.formArrayValue.map(infoDep => ({
      cpfDepLabel: FormatterUtils.formatCpf(infoDep.cpfDep),
      nomeLabel: infoDep.nome,
      descrDepLabel: infoDep.descrDep,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.isSelected = true;
    this.isEdit = false;
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.isSelected = false;
    this.editIndex = null;
  }

  update(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.isSelected = false;
    this.editIndex = null;
  }

  cancel(): void {
    this.isSelected = false;
    this.editIndex = null;
  }

  handleClickEdit(infoDep: InfoDepView): void {
    const clickIndex = this.rows.findIndex(item => item === infoDep);

    this.isEdit = true;
    this.editIndex = clickIndex;
    this.isSelected = true;

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(infoDep: InfoDepView): void {
    const clickIndex = this.rows.findIndex(item => item === infoDep);

    const currentValue = this.formArrayValue;
    currentValue.splice(clickIndex, 1);

    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
    this.editIndex = null;
  }

  private validateCpfDep(control: AbstractControl): ValidationErrors {
    if (this.currentFormGroup == null) {
      return null;
    }

    if (this.isSameValueCpfTrab(control.value)) {
      return { isSameValueCpfTrab: true };
    }
    if (this.haveSameValueInCpfDep(control.value)) {
      return { haveSameValueInCpfDep: true };
    }
    return  null;
  }

  private isSameValueCpfTrab(cpf: string): boolean {
    return this.mainFormGroup.get('cpfTrab').value === cpf;
  }

  private haveSameValueInCpfDep(cpf: string): boolean {
    const infoDep: InfoDep[] = this.currentFormGroup.get('infoDep').value;
    const cpfIndexInInfoDep = infoDep.findIndex(infoDep => infoDep.cpfDep === cpf);

    return cpfIndexInInfoDep !== -1 && cpfIndexInInfoDep !== this.editIndex;
  }

  private handleChangesTpDep(): void {
    if (!this.isRequiredDescrDep) {
      this.subFormGroup.get('descrDep').reset();
    }
  }

  private updateValidityTpDep(): void {
    const currentField = this.subFormGroup.get('tpDep');
    const errors = this.isRequiredTpDep && CustomValidators.isValueEmpty(currentField.value)
      ? { isRequiredTpDep: true }
      : null;

    currentField.setErrors(errors);
  }

  private updateValidityDescrDep(): void {
    const currentField = this.subFormGroup.get('descrDep');
    const errors = this.isRequiredDescrDep && !currentField.value
      ? { isRequiredDescrDep: true }
      : null;

    currentField.setErrors(errors);
  }
}
