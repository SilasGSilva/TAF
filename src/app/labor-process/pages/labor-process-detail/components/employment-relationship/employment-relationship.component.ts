import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { PoComboComponent, PoComboOption, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CodCategEnum, ESocialVersionEnum, InfoContr, InfoDeslig, InfoVinc, Observacoes, OptionsAnswer, PensAlimEnum, SucessaoVinc, TpContrDuracaoEnum, TpInscEnum, TpRegPrevEnum, TpRegTrabEnum } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FormUtils } from '../../../../validators/form-utils';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { InfoComplValidations } from '../validations/infoCompl-validations';
import { COLUMNS, OPTIONS_CLAU_ASSEC, OPTIONS_MTV_DESLIG, OPTIONS_PENS_ALIM, OPTIONS_TMP_PARC, OPTIONS_TP_CONTR, OPTIONS_TP_INSC, OPTIONS_TP_REG_PREV, OPTIONS_TP_REG_TRAB } from './constants/data';

@Component({
  selector: 'app-employment-relationship',
  templateUrl: './employment-relationship.component.html',
  styleUrls: [
    './employment-relationship.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class EmploymentRelationshipComponent implements OnInit, OnDestroy {
  @ViewChild('mtvDeslig', { static: false }) comboMtvDeslig: PoComboComponent;

  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});

  hasTpRegTrab: boolean = false;

  isEdit: boolean = false;
  position: number = null;
  editIndex: number = null;

  optionsTpRegPrev: PoSelectOption[] = OPTIONS_TP_REG_PREV;
  optionsTmpParc: PoSelectOption[] = OPTIONS_TMP_PARC;
  optionsTpContr: PoSelectOption[] = OPTIONS_TP_CONTR;
  optionsTpRegTrab: PoSelectOption[] = OPTIONS_TP_REG_TRAB;
  optionsClauAssec: PoSelectOption[] = OPTIONS_CLAU_ASSEC;
  optionsTpInsc: PoSelectOption[] = OPTIONS_TP_INSC;
  optionsMtvDeslig: PoComboOption[] = OPTIONS_MTV_DESLIG;
  optionsPensAlim: PoSelectOption[] = OPTIONS_PENS_ALIM;

  tpInscEnum = TpInscEnum;

  columns: PoTableColumn[] = COLUMNS;

  actions: PoTableAction[] = [
    { label: 'Editar', action: this.clickToEditObservacao.bind(this) },
    { label: 'Excluir', action: this.deleteObservacao.bind(this) },
  ];
  subFormGroup: UntypedFormGroup = this.createSubFormGroup();
  isSelected: boolean = false;

  version: ESocialVersionEnum;

  excluidoERP: string = '';
  subscriptions: Subscription[] = [];
  isDisabledDtTerm: boolean = false;
  isOptionalDtTerm: boolean = false;
  isDisabledDuracao: boolean = false;
  isDisabledClauAssec: boolean = false;
  isDisabledObjDet: boolean = false;

  maxDate = DateTime.now().plus({ days: 10 }).toJSDate();

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoCompl.infoVinc.observacoes') as UntypedFormControl;
  }

  get formArrayValue(): Observacoes[] {
    return this.formArray.value ?? [];
  }

  get isTmpParcDisabled(): boolean {
    return this.currentFormGroup.value.infoCompl.infoVinc.tpRegTrab !== TpRegTrabEnum.CLT;
  }

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get isDisabledPensAlim(): boolean {
    return this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').value !== TpRegTrabEnum.CLT;
  }

  get isOptionalPensAlim(): boolean {
    const dateFormat = 'yyyy-MM-dd';

    const dtCCP: string = this.mainFormGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP')?.value || '';
    const dtSent: string = this.mainFormGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent')?.value || '';

    const dtCCPDate = DateTime.fromFormat(dtCCP, dateFormat);
    const dtSentDate = DateTime.fromFormat(dtSent, dateFormat);
    const baseDate = DateTime.fromFormat('2024-01-22', dateFormat);

    return dtCCPDate < baseDate || dtSentDate < baseDate;
  }

  get isRequiredPercAliment(): boolean {
    const pensAlimRequiredValues = [PensAlimEnum.percentPensao, PensAlimEnum.percentEValorPensao];
    const pensAlim: PensAlimEnum = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').value;

    return pensAlimRequiredValues.includes(pensAlim);
  }

  get isRequiredVrAlim(): boolean {
    const pensAlimRequiredValues = [PensAlimEnum.valorPensao, PensAlimEnum.percentEValorPensao];
    const pensAlim: PensAlimEnum = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').value;

    return pensAlimRequiredValues.includes(pensAlim);
  }

  get isRequiredDtDeslig(): boolean {
    return !this.isDisabledInfoVinc;
  }

  get isRequiredMtvDeslig(): boolean {
    return !this.isDisabledInfoVinc;
  }

  get errorsDtDeslig(): ValidationErrors {
    if (!this.isRequiredDtDeslig) return null;

    const dtDeslig: InfoDeslig['dtDeslig'] = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig').value;
    const dtAdm: InfoVinc['dtAdm'] = this.currentFormGroup.get('infoCompl.infoVinc.dtAdm').value;

    if (dtDeslig < dtAdm) {
      return { isDtDesligLowerThanDtAdm: true };
    }

    if (dtDeslig > this.maxDate) {
      return { isDtDesligGreaterThanDtAdm: true };
    }

    return null;
  }

  private get isDisabledInfoVinc(): boolean {
    const indContr: InfoContr['indContr'] = this.currentFormGroup.get('indContr').value;
    const tpContr: InfoContr['tpContr'] = this.currentFormGroup.get('tpContr').value;

    return InfoComplValidations.isDisabledInfoVinc(indContr, tpContr);
  }

  get maskNrInsc(): string {
    const tpInsc: SucessaoVinc['tpInsc'] = this.currentFormGroup.value.infoCompl.infoVinc.sucessaoVinc.tpInsc;

    if (tpInsc == this.tpInscEnum.Cnpj) {
      return  '99.999.999/9999-99';
    } else if (tpInsc == this.tpInscEnum.Cpf) {
      return  '999.999.999-99'
    } else {
      return  '';
    }
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      observacao: [null],
    });
  }

  constructor(private fb: UntypedFormBuilder, private laborProcessDataStateService: LaborProcessDataStateService) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
    }));

    this.subscriptions.push(this.currentFormGroup.get('tpContr').valueChanges.subscribe(() => {
      this.handleChangesTpContr();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indContr').valueChanges.subscribe(() => {
      this.handleChangesIndContr();
    }));

    this.subscriptions.push(this.currentFormGroup.get('codCateg').valueChanges.subscribe(() => {
      this.handleChangesCodCateg();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.dtAdm').valueChanges.subscribe(() => {
      this.updateValidityDtDeslig();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig').valueChanges.subscribe(() => {
      this.updateValidityDtDeslig();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig').valueChanges.subscribe(() => {
      this.updateValidityMtvDeslig();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').valueChanges.subscribe(() => {
      this.handleChangesTpRegTrab();
      this.updateValidityPensAlim();
      this.updateValidityDuracao();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').valueChanges.subscribe(() => {
      this.handleChangesPensAlim();
      this.updateValidityPensAlim();
      this.updateValidityPercAliment();
      this.updateValidityVrAlim();
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.duracao.tpContr').valueChanges.subscribe(() => {
      this.handleChangeTpContr()
    }));
    this.subscriptions.push(this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc').valueChanges.subscribe(() => {
      this.changeTpInsc();
    }));

    const applyMaskNrInscSubscription = this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').valueChanges.subscribe((value) => {
      if (value ===  null)
      {
        return;
      }

      const nrInscField = this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc');
      applyMaskNrInscSubscription.unsubscribe();
      // NOTE: maskNrInsc é chamado no html após valueChanges e a mask é aplicada sobre valor já existente no nrInsc
      setTimeout(() => nrInscField.setValue(value));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  saveObservacao(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateObservacao(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  clickToEditObservacao(observacoes: Observacoes): void {
    const position = this.formArrayValue.findIndex(item => item === observacoes);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArrayValue[position]);
  }

  deleteObservacao(observacoes: Observacoes): void {
    const position = this.formArrayValue.findIndex(item => item === observacoes);
    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  cancel(): void {
    this.isSelected = false;
  }

  changeTpInsc() {
    const tpInsc: SucessaoVinc['tpInsc'] = this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc').value;
    FormUtils.getFormControl(this.currentFormGroup, 'infoCompl.infoVinc.sucessaoVinc.nrInsc').reset();

    if (tpInsc == TpInscEnum.Cnpj) {
      this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').setValidators(CustomValidators.cnpj);
    } else if (tpInsc == TpInscEnum.Cpf) {
      this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').setValidators(CustomValidators.cpf);
    } else {
      this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').removeValidators(CustomValidators.cnpj);
      this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').removeValidators(CustomValidators.cpf);
    }
  }

  changeDtTransf() {
    const tpInsc = this.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc');
    tpInsc.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  updateTpRegTrab(): void {
    const dtDeslig = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig');
    const mtvDeslig = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');

    const tpRegTrabValues = [TpRegTrabEnum.CLT, TpRegTrabEnum.EstatOuLegislEspec];
    const tpRegTrab: InfoVinc['tpRegTrab'] = this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').value;
    if (tpRegTrabValues.includes(tpRegTrab)) {
      dtDeslig.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      mtvDeslig.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      this.hasTpRegTrab = true;
    }
    else {
      dtDeslig.setValidators([]);
      mtvDeslig.setValidators([]);
      this.hasTpRegTrab = false;
    }

    dtDeslig.updateValueAndValidity();
    mtvDeslig.updateValueAndValidity();

    this.handleResetMtvDesligAndTpRegTrab();

    const tmpParc = this.currentFormGroup.get('infoCompl.infoVinc.tmpParc');
    tmpParc.setValidators([]);
    tmpParc.setValue(null);
    tmpParc.updateValueAndValidity();
  }

  updateValidityDuracao(): void {
    const tpRegTrab = this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab');
    const tpContr = this.currentFormGroup.get('infoCompl.infoVinc.duracao.tpContr');
    const dtTerm = this.currentFormGroup.get('infoCompl.infoVinc.duracao.dtTerm');
    const clauAssec = this.currentFormGroup.get('infoCompl.infoVinc.duracao.clauAssec');
    const objDet = this.currentFormGroup.get('infoCompl.infoVinc.duracao.objDet');

    if (tpRegTrab.value === TpRegTrabEnum.CLT)
    {
      this.isDisabledDuracao = false;
      tpContr.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
    } else {
      tpContr.setValidators([]);
      tpContr.reset();
      dtTerm.setValidators([]);
      dtTerm.reset();
      clauAssec.setValidators([]);
      clauAssec.reset();
      objDet.setValidators([]);
      objDet.reset();

      this.isDisabledDuracao = true;
    }

    tpContr.updateValueAndValidity();
    dtTerm.updateValueAndValidity();
    clauAssec.updateValueAndValidity();
    objDet.updateValueAndValidity();
  }

  handleResetMtvDesligAndTpRegTrab(): void {
    const mtvDesligField = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');
    const tpRegTrabField = this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab');

    const mtvDeslig: InfoDeslig['mtvDeslig'] = mtvDesligField.value;
    const tpRegTrab: InfoVinc['tpRegTrab'] = tpRegTrabField.value;

    if (CustomValidators.isValueEmpty(mtvDeslig)) {
      mtvDesligField.reset();
    }
    if (CustomValidators.isValueEmpty(tpRegTrab)) {
      tpRegTrabField.reset();
    }
  }

  handleChangeTpContr(): void {
    const tpContrValue = this.currentFormGroup.get('infoCompl.infoVinc.duracao.tpContr').value;

    const dtTerm = this.currentFormGroup.get('infoCompl.infoVinc.duracao.dtTerm');
    const clauAssec = this.currentFormGroup.get('infoCompl.infoVinc.duracao.clauAssec');
    const objDet = this.currentFormGroup.get('infoCompl.infoVinc.duracao.objDet');

    if (tpContrValue === TpContrDuracaoEnum.prazoDeterminadoDias) {
      dtTerm.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      this.isDisabledDtTerm = false;
      this.isOptionalDtTerm = false;
    } else if (tpContrValue === TpContrDuracaoEnum.prazoIndeterminado) {
      dtTerm.setValidators([]);
      dtTerm.reset();
      this.isDisabledDtTerm = true;
      this.isOptionalDtTerm = false;
    } else if (tpContrValue === TpContrDuracaoEnum.prazoDeterminadoFato) {
      dtTerm.setValidators([]);
      this.isOptionalDtTerm = true;
      this.isDisabledDtTerm = false;
    } else {
      dtTerm.setValidators([]);
      dtTerm.reset();
      this.isOptionalDtTerm = false;
      this.isDisabledDtTerm = true;
    }

    if (tpContrValue === TpContrDuracaoEnum.prazoDeterminadoDias || tpContrValue === TpContrDuracaoEnum.prazoDeterminadoFato) {
      clauAssec.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      this.isDisabledClauAssec = false;
    } else {
      clauAssec.setValidators([]);
      clauAssec.reset();
      this.isDisabledClauAssec = true;
    }

    if (tpContrValue === TpContrDuracaoEnum.prazoDeterminadoFato) {
      objDet.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      this.isDisabledObjDet = false;
    } else {
      objDet.setValidators([]);
      objDet.reset();
      this.isDisabledObjDet = true;
    }

    dtTerm.updateValueAndValidity();
    clauAssec.updateValueAndValidity();
    objDet.updateValueAndValidity();
  }

  handleChangesTpRegTrab(): void {
    if (!this.isDisabledPensAlim) {
      return;
    }

    this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').reset();
    this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.percAliment').reset();
    this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.vrAlim').reset();
  }

  handleChangesPensAlim(): void {
    if (!this.isRequiredPercAliment) {
      this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.percAliment').reset();
    }

    if (!this.isRequiredVrAlim) {
      this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.vrAlim').reset();
    }
  }

  handleChangesCodCateg(): void {
    const codCateg: InfoContr['codCateg'] = this.currentFormGroup.get('codCateg').value;

    if (codCateg === CodCategEnum.Domestico) {
      this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(TpRegTrabEnum.CLT);
      this.currentFormGroup.get('infoCompl.infoVinc.tpRegPrev').setValue(TpRegPrevEnum.regimeGeral);
    }
  }

  handleChangesIndContr() {
    this.updateValidityTpregtrab();
  }

  handleChangesTpContr() {
    this.updateValidityTpregtrab();
  }

  private updateValidityTpregtrab(): void {
    const tpContr: AbstractControl<any, any> = this.currentFormGroup.get('tpContr');
    const indContr: AbstractControl<any, any> = this.currentFormGroup.get('indContr');
    const tpRegTrab: AbstractControl<any, any> = this.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab');
    const tpRegPrev: AbstractControl<any, any> = this.currentFormGroup.get('infoCompl.infoVinc.tpRegPrev');
    const dtAdm: AbstractControl<any, any> = this.currentFormGroup.get('infoCompl.infoVinc.dtAdm');
    const infoVinc: AbstractControl<any, any> = this.currentFormGroup.get('infoCompl.infoVinc');

    tpRegTrab?.clearValidators();

    if (!InfoComplValidations.isDisabledInfoVinc(indContr.value, tpContr.value))
    {
      tpRegTrab.setValidators([Validators.required]);
      tpRegPrev.setValidators([Validators.required]);
      dtAdm.setValidators([Validators.required]);
    } else {
      tpRegTrab.setValidators([]);
      tpRegPrev.setValidators([]);
      dtAdm.setValidators([]);

      infoVinc.reset()
    }

    infoVinc?.updateValueAndValidity();
    tpRegTrab?.updateValueAndValidity();
    tpRegPrev?.updateValueAndValidity();
    dtAdm?.updateValueAndValidity();

    this.resetInfoComplOrInfoVincIsDisabled(indContr.value, tpContr.value);

  }

  private updateValidityDtDeslig(): void {
    const errors = this.errorsDtDeslig;

    this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig').setErrors(errors);
  }

  private updateValidityMtvDeslig(): void {
    const mtvDesligField = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');
    const errors = this.isRequiredMtvDeslig && CustomValidators.isValueEmpty(mtvDesligField.value)
      ? { isRequiredMtvDeslig: true }
      : null;

    mtvDesligField.setErrors(errors);
  }

  updateValidityPensAlim(): void {
    const pensAlimField = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim');
    const isRequiredPensAlim = !this.isDisabledPensAlim && !this.isOptionalPensAlim;
    const errors = isRequiredPensAlim && pensAlimField.value == null
      ? { isRequiredPensAlim: true }
      : null;

    pensAlimField.setErrors(errors);
  }

  updateValidityPercAliment(): void {
    const percAlimentField = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.percAliment');
    const errors = this.isRequiredPercAliment && !percAlimentField.value
      ? { isRequiredPercAliment: true }
      : null;

    percAlimentField.setErrors(errors);
  }

  updateValidityVrAlim(): void {
    const vrAlimField = this.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.vrAlim');
    const errors = this.isRequiredVrAlim && !vrAlimField.value
      ? { isRequiredVrAlim: true }
      : null;

    vrAlimField.setErrors(errors);
  }

  private resetInfoComplOrInfoVincIsDisabled(indContr: InfoContr['indContr'], tpContr: InfoContr['tpContr']): void {
    if(InfoComplValidations.isDisabledInfoCompl(indContr))
    {
      this.currentFormGroup.get('infoCompl').reset();
      this.currentFormGroup.get('infoCompl').updateValueAndValidity();
    } else if(InfoComplValidations.isDisabledInfoVinc(indContr, tpContr)) {
      this.currentFormGroup.get('infoCompl.infoVinc').reset();
      this.currentFormGroup.get('infoCompl.infoVinc').updateValueAndValidity();
    }
  }

  renderMtvDeslig() {
    this.comboMtvDeslig.updateComboList([...this.optionsMtvDeslig]);
  }
}
