import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoComboComponent, PoComboOption, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CodCategEnum, MudCategAtiv, ESocialVersionEnum, OptionsAnswer, CodCategLabelEnum, NatAtividadeEnum, NatAtividadeLabelEnum } from '../../../../../models/labor-process.model';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { FormatterUtils } from '../../../../utils/formatter-utils';
import { COLUMNS, OPTIONS_COD_CATEG, OPTIONS_NAT_ATIVIDADE } from './constants/data';

interface MudCategAtivView {
  codCategLabel: string;
  natAtividadeLabel: string;
  dtMudCategAtiv: Date;
}

@Component({
  selector: 'app-nature-of-activity',
  templateUrl: './nature-of-activity.component.html',
  styleUrls: [
    './nature-of-activity.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class NatureOfActivityComponent implements OnInit, OnDestroy {
  @ViewChild('codCateg', { static: false }) comboCodCateg: PoComboComponent;

  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});

  isEdit: boolean = false;
  editIndex: number = null;
  isSelected: boolean = false;

  categoryEnum = CodCategEnum;
  optionsAnswerEnum = OptionsAnswer;

  version: ESocialVersionEnum;

  optionsCodCateg: PoComboOption[] = OPTIONS_COD_CATEG;
  optionsNatAtividade: PoSelectOption[] = OPTIONS_NAT_ATIVIDADE;

  columns: PoTableColumn[] = COLUMNS;
  actions: PoTableAction[] = [];
  rows: MudCategAtivView[] = [];

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  excluidoERP: OptionsAnswer;
  subscriptions: Subscription[] = [];

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('mudCategAtiv') as UntypedFormControl;
  }

  get formArrayValue(): MudCategAtiv[] {
    return this.formArray.value ?? [];
  }

  get isNatAtividadeRequired(): boolean {
    const requiredCodCateg = [
      CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar,
      CodCategEnum.Estagiario,
    ];

    return this.currentFormGroup.value.indCateg === OptionsAnswer.Yes ||
      this.currentFormGroup.value.indNatAtiv === OptionsAnswer.Yes ||
      !requiredCodCateg.includes(this.subFormGroup.value.codCateg);
  }

  get isNatAtividadeDisabled(): boolean {
    const isDisabled = !this.isNatAtividadeRequired;

    if (isDisabled && this.subFormGroup.value.natAtividade != null) {
      const natAtividade: AbstractControl<any, any> = this.subFormGroup.get('natAtividade');
      natAtividade.patchValue(null);
      natAtividade.updateValueAndValidity();
    }

    return isDisabled;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private laborProcessDataStateService: LaborProcessDataStateService,
  ) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  initializeTableActions(): void {
    if (this.excluidoERP !== OptionsAnswer.Yes) {
      this.actions = [
        { label: 'Editar', action: this.clickToEditNatureOfActivity.bind(this) },
        { label: 'Excluir', action: this.deleteNatureOfActivity.bind(this) },
      ];
    }
  }

  transformRows(): void {
    this.rows = this.formArrayValue.map(item => ({
      codCategLabel: FormatterUtils.convertValueToLabel(item.codCateg, CodCategEnum, CodCategLabelEnum),
      natAtividadeLabel: FormatterUtils.convertValueToLabel(item.natAtividade, NatAtividadeEnum, NatAtividadeLabelEnum),
      dtMudCategAtiv: item.dtMudCategAtiv,
    }))
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      codCateg: [null],
      natAtividade: [null, this.validateCodAndNatureActivity.bind(this)],
      dtMudCategAtiv: [null, this.validateDtMudCategAtiv.bind(this)],
    });
  }

  clickToEditNatureOfActivity(mudCategAtivView: MudCategAtivView): void {
    const position = this.rows.findIndex(item => item === mudCategAtivView);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArrayValue[position]);
  }

  deleteNatureOfActivity(mudCategAtivView: MudCategAtivView): void {
    const position = this.rows.findIndex(item => item === mudCategAtivView);
    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  saveNatureOfActivity(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateNatureOfActivity(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  validateCodAndNatureActivity(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const codCateg = this.subFormGroup.get('codCateg').value;
    if (currentValue != null) {
      if (codCateg === CodCategEnum.Domestico) {
        if (currentValue === 2) {
          return { invalidValue1: true };
        }
      } else if (
        codCateg === CodCategEnum.EmpregadoRural
      ) {
        if (currentValue === 1) {
          return { invalidValue1: true };
        }
      }
    }

    return null;
  }

  cancel(): void {
    this.isSelected = false;
  }

  validateDtMudCategAtiv(control: AbstractControl): ValidationErrors {
    const currentValue = control.value;

    if (currentValue) {
      const dtMudCategAtivSplit = currentValue?.split('-') ?? ['0000','00'];
      const dtMudCategAtiv = `${dtMudCategAtivSplit[0]}${dtMudCategAtivSplit[1]}${dtMudCategAtivSplit[2]}`;

      const dtAdmOrigSplit = this.currentFormGroup.value.dtAdmOrig?.split('-') ?? ['0000','00', '00'];
      const dtAdmOrig = `${dtAdmOrigSplit[0]}${dtAdmOrigSplit[1]}${dtAdmOrigSplit[2]}`;

      const dtDesligSplit = this.currentFormGroup.value.infoCompl.infoVinc.infoDeslig.dtDeslig?.split('-');
      const dtDeslig = dtDesligSplit?.length > 0 ? `${dtDesligSplit[0]}${dtDesligSplit[1]}${dtDesligSplit[2]}` : null;

      const indContr = this.currentFormGroup.value.indContr

      if (!this.isV1 && indContr == OptionsAnswer.No && dtMudCategAtiv <= dtAdmOrig) {
        return { lessThanOrEqualToDtAdmOrig: true };
      }

      if (dtMudCategAtiv < dtAdmOrig) {
        return { lessThanDtAdmOrig: true };
      }

      if (dtDeslig && dtMudCategAtiv > dtDeslig ) {
        return { greaterThanDtDeslig: true };
      }
    }

    return this.validateDtMudCategAtivDuplicate(control);
  }

  validateDtMudCategAtivDuplicate(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.isEdit) {
      return null;
    }
    const currentValue = control.value;
    const values = this.formArrayValue;

    if (values == null) {
      return null;
    }
    else if (currentValue != null) {
      const alreadyExistsArray = values.some((item) => item.dtMudCategAtiv == currentValue);
      if (alreadyExistsArray) {
        return { duplicatedDate: true };
      }
    }

    return null;
  }

  renderCodCateg() {
    this.comboCodCateg.updateComboList([...this.optionsCodCateg]);
  }
}
