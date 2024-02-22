import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoTableAction, PoTableColumn, PoNotificationService, PoToasterOrientation, PoSelectOption, PoComboComponent, PoComboOption } from '@po-ui/ng-components';
import { UnicContr, CodCategEnum, CodCategLabelEnum } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../utils/formatter-utils';
import { COLUMNS, OPTIONS_COD_CATEG } from './constants/data';

interface UnicContrView {
  matUnic: string;
  codCateg: string;
  dtInicio: Date;
}

@Component({
  selector: 'app-bonds-or-contracts',
  templateUrl: './bonds-or-contracts.component.html',
  styleUrls: [
    './bonds-or-contracts.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class BondsOrContractsComponent implements OnInit {
  @ViewChild('codCateg', { static: false }) comboCodCateg: PoComboComponent;

  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});

  editIndex: number | null = null;
  isEdit: boolean = false;
  isSelected: boolean = false;

  rows: UnicContrView[] = [];
  excluidoERP: string = '';
  subscriptions: Subscription[] = [];

  optionsCodCateg: PoComboOption[] = OPTIONS_COD_CATEG;

  columns: PoTableColumn[] = COLUMNS;
  actions: PoTableAction[] = [];

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('unicContr') as UntypedFormControl;
  }

  get formArrayValue(): UnicContr[] {
    return this.formArray.value ?? [];
  }

  constructor(private fb: UntypedFormBuilder, private notificationService: PoNotificationService,) { }

  ngOnInit(): void {
    const subscription = this.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
      this.initializeTableActions();
    });
    this.subscriptions.push(subscription)
    this.transformRows();
    this.initializeTableActions();
    const subscription2 = this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    });
    this.subscriptions.push(subscription2)
  }

  initializeTableActions(): void {
    if (this.excluidoERP !== 'S') {
      this.actions = [
        { label: 'Editar', action: this.clickToEditBoundOrContract.bind(this) },
        { label: 'Excluir', action: this.deleteBoundOrContract.bind(this) },
      ];
    }
  }

  transformRows(): void {
    const valueFormArray: UnicContr[] = this.formArray.value ?? [];
    this.rows = valueFormArray.map(item => ({
      matUnic: item.matUnic,
      codCateg: FormatterUtils.convertValueToLabel(item.codCateg, CodCategEnum, CodCategLabelEnum),
      dtInicio: item.dtInicio,
    }))
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      matUnic: [null, [this.validateEqualMatricula.bind(this)]],
      codCateg: [null, [this.validateEqualCod.bind(this)]],
      dtInicio: [null, [this.validateEqualDate.bind(this)]],
    });
  }

  clickToEditBoundOrContract(unicContr: UnicContrView): void {
    const position = this.rows.findIndex(item => item === unicContr);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArrayValue[position]);
  }

  deleteBoundOrContract(unicContr: UnicContrView): void {
    const position = this.rows.findIndex(item => item === unicContr);
    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  saveBoundOrContract(): void {
    const hasError = this.validateVinculoBoundOrContract();
    if (hasError) return;

    const value = this.formArrayValue;
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateBoundOrContract(): void {
    const hasError = this.validateVinculoBoundOrContract();
    if (hasError) return;

    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  validateVinculoBoundOrContract(): Boolean {
    const matUnic: UnicContr['matUnic'] = this.subFormGroup.get('matUnic').value;
    const hasMatUnic = CustomValidators.isValueEmpty(matUnic);

    const codCateg: UnicContr['codCateg'] = this.subFormGroup.get('codCateg').value;
    const hasCodCateg = CustomValidators.isValueEmpty(codCateg);

    const dtInicio: UnicContr['dtInicio'] = this.subFormGroup.get('dtInicio').value;
    const hasDtInicio = CustomValidators.isValueEmpty(dtInicio);

    if ((hasMatUnic && (hasCodCateg || hasDtInicio)) ||
      (!hasMatUnic && (!hasCodCateg || !hasDtInicio))) {
      this.notificationService.error({
        message: 'Deve-se informar somente "Matrícula incorporada" ou "Código" e "Data de início de TSVE"',
        orientation: PoToasterOrientation.Top,
      });
      return true;
    }

    return false;
  }

  cancel(): void {
    this.isSelected = false;
  }

  validateEqualMatricula(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const matricula = this.currentFormGroup.get('matricula').value;

    if (currentValue !== null && currentValue !== '') {
      if (matricula !== null && matricula !== '') {
        if (matricula === currentValue) {
          return { matEqual: true };
        }
      }
      return null;
    }
  }

  validateEqualCod(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const codCateg = this.currentFormGroup.get('codCateg').value;

    if (currentValue !== null && codCateg !== null) {
      if (codCateg === currentValue) {
        return { codEqual: true };
      }
    }
    return null;
  }

  validateEqualDate(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const dtInicio = this.currentFormGroup.get('dtInicio').value;
    if (currentValue != null && dtInicio != null) {
      if (
        currentValue === dtInicio
      ) {
        return { dateEqual: true };
      }
    }
    return null;
  }

  renderCodCateg() {
    this.comboCodCateg.updateComboList([...this.optionsCodCateg]);
  }
}
