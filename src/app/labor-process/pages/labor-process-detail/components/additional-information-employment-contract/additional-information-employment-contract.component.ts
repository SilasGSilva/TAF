import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../utils/formatter-utils';
import { COLUMNS, OPTIONS_MTV_DESLIG_TSV, OPTIONS_NAT_ATIVIDADE, OPTIONS_UND_SAL_FIXO } from './constants/data';
import { InfoComplValidations } from '../validations/infoCompl-validations';
import { CodCategEnum, InfoContr, NatAtividadeEnum, OptionsAnswer, Remuneracao, TypeContract, UndSalFixoEnum, UndSalFixoLabelEnum } from '../../../../../models/labor-process.model';

interface RemuneracaoView {
  dtRemunLabel: Date;
  vrSalFxLabel: number;
  undSalFixoLabel: string;
  dscSalVarLabel: string;
}

@Component({
  selector: 'app-additional-information-employment-contract',
  templateUrl: './additional-information-employment-contract.component.html',
  styleUrls: [
    './additional-information-employment-contract.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class AdditionalInformationEmploymentContractComponent implements OnInit, OnDestroy {
  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});
  @Input() isEditMode: boolean;

  isEdit: boolean = false;
  editIndex: number = null;
  isSelected: boolean = false;

  optionsNatAtividade: PoSelectOption[] = OPTIONS_NAT_ATIVIDADE;
  optionsMtvDesligTSV: PoSelectOption[] = OPTIONS_MTV_DESLIG_TSV;
  optionsUndSalFixo: PoSelectOption[] = OPTIONS_UND_SAL_FIXO;

  tpContratoEnum = TypeContract;
  categoryEnum = CodCategEnum;
  unidadeEnum = UndSalFixoEnum;
  codCategEnum = CodCategEnum;

  columns: PoTableColumn[] = COLUMNS;
  actions: PoTableAction[] = [];

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  maxDate = DateTime.now().plus({ days: 10 }).toJSDate();

  rows: RemuneracaoView[] = [];

  excluidoERP: string = '';
  subscriptions: Subscription[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoCompl.remuneracao') as UntypedFormControl;
  }

  get formArrayValue(): Remuneracao[] {
    return this.formArray.value ?? [];
  }

  get isRequiredCodCBO(): boolean {
    const optionalCodCateg = [
      CodCategEnum.Estagiario,
      CodCategEnum.Bolsista,
      CodCategEnum.ParticipanteCurso,
    ];

    return !this.isDisabledInfoCompl && !optionalCodCateg.includes(this.codCateg);
  }

  get isRequiredNatAtividade(): boolean {
    const isCodCategEmpregado = this.codCateg >= 101 && this.codCateg <= 199;
    const isCodCategAvulso = this.codCateg >= 201 && this.codCateg <= 299;
    const isCodCategAgentePublico = this.codCateg >= 301 && this.codCateg <= 399;
    const requiredCodCateg = [
      CodCategEnum.DirigenteSindical,
      CodCategEnum.ContribuinteIndivCooperado,
      CodCategEnum.ContribuinteIndivTransp,
      CodCategEnum.ContribuinteIndivCooperadoFiliado,
    ];

    const isRequiredByCodCateg = requiredCodCateg.includes(this.codCateg) ||
      isCodCategEmpregado ||
      isCodCategAvulso ||
      isCodCategAgentePublico;

    return !this.isDisabledInfoCompl && isRequiredByCodCateg;
  }

  get isDisabledNatAtividade(): boolean {
    const disabledCodCateg = [
      CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar,
      CodCategEnum.Estagiario,
    ];

    return disabledCodCateg.includes(this.codCateg);
  }

  get isDisabledDtTerm(): boolean {
    return this.isDisabledInfoTerm;
  }

  get isRequiredMtvDesligTSV(): boolean {
    return !this.isDisabledInfoCompl && !this.isDisabledMtvDesligTSV;
  }

  get isDisabledMtvDesligTSV(): boolean {
    return this.isDisabledInfoTerm || this.codCateg !== CodCategEnum.ContribuinteIndivDiretorComFgts;
  }

  private get isDisabledInfoCompl(): boolean {
    const indContr: InfoContr['indContr'] = this.currentFormGroup.get('indContr').value;

    return InfoComplValidations.isDisabledInfoCompl(indContr);
  }

  get isDisabledInfoTerm(): boolean {
    const indContr: InfoContr['indContr'] = this.currentFormGroup.get('indContr').value;
    const tpContr: InfoContr['tpContr'] = this.currentFormGroup.get('tpContr').value;

    return InfoComplValidations.isDisabledInfoTerm(indContr, tpContr);
  }

  private get codCateg(): InfoContr['codCateg'] {
    return this.currentFormGroup.get('codCateg').value;
  }

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.subscriptions.push(this.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
      this.initializeTableActions();
    }));
    this.transformRows();
    this.initializeTableActions();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));
    this.subscriptions.push(this.currentFormGroup.get('tpContr').valueChanges.subscribe(() => {
      this.handleChangesTpContr();
    }));
    this.subscriptions.push(this.currentFormGroup.get('codCateg').valueChanges.subscribe(() => {
      this.handleChangesCodCateg();
      this.updateValidityCodCBO();
      this.updateValidityNatAtividade();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.codCBO').valueChanges.subscribe(() => {
      this.updateValidityCodCBO();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.natAtividade').valueChanges.subscribe(() => {
      this.updateValidityNatAtividade();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoTerm.mtvDesligTSV').valueChanges.subscribe(() => {
      this.updateValidityMtvDesligTSV();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  initializeTableActions(): void {
    if (this.isExcluded) {
      this.actions = [{
        label: 'Ver',
        action: this.clickToEditAdditionalInformation.bind(this),
      }];
    }
    else {
      this.actions = [
        {
          label: 'Editar',
          action: this.clickToEditAdditionalInformation.bind(this),
        },
        {
          label: 'Excluir',
          action: this.deleteAdditionalInformation.bind(this),
        },
      ];
    }
  }

  transformRows(): void {
    this.rows = this.formArrayValue.map(item => ({
      dtRemunLabel: item.dtRemun,
      vrSalFxLabel: item.vrSalFx,
      undSalFixoLabel: FormatterUtils.convertValueToLabel(item.undSalFixo, UndSalFixoEnum, UndSalFixoLabelEnum),
      dscSalVarLabel: item.dscSalVar,
    }))
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      dtRemun: [null, this.verifyDuplicateDate.bind(this)],
      vrSalFx: [null, this.verifyIsZero.bind(this)],
      undSalFixo: [null],
      dscSalVar: [null],
    });
  }

  changeValueNullToCorrectType(): void {
    if (this.subFormGroup.value.dscSalVar == null) {
      this.subFormGroup.value.dscSalVar = '';
    }
    if (this.subFormGroup.value.vrSalFx == null) {
      this.subFormGroup.value.vrSalFx = 0;
    }
  }

  saveAdditionalInformation(): void {
    const value = this.formArrayValue;
    this.changeValueNullToCorrectType();
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  clickToEditAdditionalInformation(remuneracao: RemuneracaoView): void {
    const position = this.rows.findIndex(item => item === remuneracao);
    this.editIndex = position;
    this.isEdit = true;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArrayValue[position]);
  }

  deleteAdditionalInformation(remuneracao: RemuneracaoView): void {
    const position = this.rows.findIndex(item => item === remuneracao);
    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  updateAdditionalInformation(): void {
    const currentValue = this.formArrayValue;
    this.changeValueNullToCorrectType();
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  cancel(): void {
    this.isSelected = false;
  }

  private handleChangesTpContr(): void {
    if (this.isDisabledDtTerm) {
      this.currentFormGroup.get('infoCompl.infoTerm.dtTerm').reset();
    }
  } 

  private handleChangesCodCateg(): void {
    if (this.codCateg === CodCategEnum.Domestico) {
      this.currentFormGroup.get('infoCompl.natAtividade').setValue(NatAtividadeEnum.trabUrbano);
    }
    if (this.codCateg === CodCategEnum.EmpregadoRural) {
      this.currentFormGroup.get('infoCompl.natAtividade').setValue(NatAtividadeEnum.trabRural);
    }
    if (this.isDisabledNatAtividade) {
      this.currentFormGroup.get('infoCompl.natAtividade').reset();
    }
  }

  private updateValidityCodCBO(): void {
    const codCBOField = this.currentFormGroup.get('infoCompl.codCBO');
    const errors = this.isRequiredCodCBO && CustomValidators.isValueEmpty(codCBOField.value)
      ? { isRequiredCodCBO: true }
      : null;

    codCBOField.setErrors(errors);
  }

  private updateValidityNatAtividade(): void {
    const natAtividadeField = this.currentFormGroup.get('infoCompl.natAtividade');
    const errors = this.isRequiredNatAtividade && CustomValidators.isValueEmpty(natAtividadeField.value)
      ? { isRequiredNatAtividade: true }
      : null;

    natAtividadeField.setErrors(errors);
  }

  private updateValidityMtvDesligTSV(): void {
    const mtvDesligTSVField = this.currentFormGroup.get('infoCompl.infoTerm.mtvDesligTSV');
    const errors = this.isRequiredMtvDesligTSV && CustomValidators.isValueEmpty(mtvDesligTSVField.value)
      ? { isRequiredMtvDesligTSV: true }
      : null;

    mtvDesligTSVField.setErrors(errors);
  }

  setValueToSal(): void {
    if (this.subFormGroup.value.undSalFixo === UndSalFixoEnum.naoAplicavel) {
      this.subFormGroup.get('vrSalFx').setValue(0);
    }
  }

  verifyIsZero(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const undSalFixo = this.subFormGroup.get('undSalFixo').value;

    if (
      currentValue != null &&
      undSalFixo !== null
    ) {
      if (
        undSalFixo === UndSalFixoEnum.naoAplicavel &&
        currentValue !== 0
      ) {
        return { valueZero: true };
      }
    }

    return null;
  }

  verifyDuplicateDate(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.isEdit) {
      return null;
    }
    const currentValue = control.value;
    const values = this.formArrayValue;

    if (values == null) {
      return null;
    }
    else if (currentValue != null) {
      const alreadyExistsArray = values.some((remuneracao) => remuneracao.dtRemun == currentValue);
      if (alreadyExistsArray) {
        return { duplicatedDate: true };
      }
    }

    return null;
  }
}
