import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoAccordionItemComponent, PoComboComponent, PoComboOption, PoSelectOption } from '@po-ui/ng-components';
import { Abono, DocumentTypeEnum, ESocialVersionEnum, IndRepercEnum, OptionsAnswer, IdePeriodo, TypeContract, InfoContr, IdeTrab, IdeEstab } from '../../../../../models/labor-process.model';
import { FormUtils } from '../../../../validators/form-utils';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { OPTIONS_IND_REPERC, OPTIONS_ANSWER, OPTIONS_TP_CONTR, OPTIONS_TYPE_INSC, OPTIONS_INDEN_SD, OPTIONS_INDEN_ABONO, OPTIONS_IND_REINT, OPTIONS_IND_UNIC, OPTIONS_COD_CATEG, OPTIONS_PAG_DIRETO_RESC } from './constants/data';

@Component({
  selector: 'app-employment-contract',
  templateUrl: './employment-contract.component.html',
  styleUrls: [
    './employment-contract.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class EmploymentContractComponent implements OnInit, OnDestroy {
  @ViewChild('periodIdentificationItem') accordionItemPeriodIdentification: PoAccordionItemComponent;
  @ViewChild('mudCategAtivItem') accordionItemMudCategAtiv: PoAccordionItemComponent;
  @ViewChild('codCateg', { static: true }) comboCodCateg: PoComboComponent;

  @Input() mainFormGroup: UntypedFormGroup;
  @Input() currentFormGroup = new UntypedFormGroup({});
  @Input() isEditMode: boolean;

  version: ESocialVersionEnum;

  excluidoERP: string = '';

  subscriptions: Subscription[] = [];

  optionsTpContr: PoSelectOption[] = OPTIONS_TP_CONTR;
  optionsIndReint: PoSelectOption[] = OPTIONS_IND_REINT;
  optionsIndUnic: PoSelectOption[] = OPTIONS_IND_UNIC;
  optionsTypeInsc: PoSelectOption[] = OPTIONS_TYPE_INSC;

  optionsAnswer: PoSelectOption[] = OPTIONS_ANSWER;
  optionsCodCateg: PoComboOption[] = OPTIONS_COD_CATEG;

  optionsIndReperc: PoSelectOption[] = OPTIONS_IND_REPERC;
  optionsIndenSD: PoSelectOption[] = OPTIONS_INDEN_SD;
  optionsIndenAbono: PoSelectOption[] = OPTIONS_INDEN_ABONO;
  optionsPagDiretoResc: PoSelectOption[] = OPTIONS_PAG_DIRETO_RESC;

  isEdit: boolean = false;
  position: number = null;

  typeContractEnum = TypeContract;
  documentTypeEnum = DocumentTypeEnum;
  optionsAnswerEnum = OptionsAnswer;

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get isEditing(): boolean {
    return this.isEditMode && this.isEdit;
  }

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isRequiredCodCateg(): boolean {
    return this.indContr === OptionsAnswer.No || !this.matricula;
  }

  get isRequiredMatricula(): boolean {
    return this.indUnic === OptionsAnswer.Yes;
  }

  get isDisabledBondsOrContracts(): boolean {
    return !this.tpContr ||
      (this.tpContr != 9 && !this.isV1) ||
      (this.indUnic !== OptionsAnswer.Yes && this.isV1);
  }

  get isRequiredDtAdmOrig(): boolean {
    return this.isV1AndRequiredDtAdmOrig || this.isV2AndRequiredDtAdmOrig;
  }

  private get isV1AndRequiredDtAdmOrig(): boolean {
    return (this.isV1 &&
    (this.currentFormGroup.value.tpContr ===
      this.typeContractEnum.TrabalhadorComVincComAlt ||
      this.currentFormGroup.value.tpContr ===
      this.typeContractEnum.TrabalhadorComVincComAltData) &&
      this.currentFormGroup.value.indContr == this.optionsAnswerEnum.No)
  }

  private get isV2AndRequiredDtAdmOrig(): boolean {
    return (!this.isV1 &&
    (this.currentFormGroup.value.tpContr ===
      this.typeContractEnum.TrabalhadorComVincComAlt ||
      this.currentFormGroup.value.tpContr ===
      this.typeContractEnum.TrabalhadorComVincComAltData))
  }

  get isDisabledPeriodIdentification(): boolean {
    const infoVlrControl = this.currentFormGroup.get('ideEstab.infoVlr');

    return  !this.isV1 &&
            infoVlrControl.get('indReperc').value !== IndRepercEnum.DecisComRepercTrib;
  }

  get isDisabledDtInicio(): boolean {
    return !this.isRequiredDtInicio;
  }

  get isRequiredDtInicio(): boolean {
    return (this.tpContr === TypeContract.TrabSemVinculo && this.indContr === OptionsAnswer.No) ||
      CustomValidators.isValueEmpty(this.matricula);
  }

  get errorsDtInicio(): ValidationErrors {
    const dtInicio: InfoContr['dtInicio'] = this.currentFormGroup.get('dtInicio').value;

    if (this.isRequiredDtInicio && CustomValidators.isValueEmpty(dtInicio)) {
      return { isRequiredDtInicio: true };
    }

    if (dtInicio <= this.ideTrabDtNascto) {
      return { invalidValue1: true };
    }

    return null;
  }

  private get tpContr(): InfoContr['tpContr'] {
    return this.currentFormGroup.get('tpContr')?.value;
  }

  private get indContr(): InfoContr['indContr'] {
    return this.currentFormGroup.get('indContr')?.value;
  }

  private get matricula(): InfoContr['matricula'] {
    return this.currentFormGroup.get('matricula')?.value;
  }

  private get indUnic(): InfoContr['indUnic'] {
    return this.currentFormGroup.get('indUnic')?.value;
  }

  private get ideTrabDtNascto(): IdeTrab['dtNascto'] {
    return this.currentFormGroup.get('ideTrab.dtNascto')?.value;
  }

  get disableMudCategAtiv(): boolean {
    return this.currentFormGroup.value.tpContr == null ||
      this.currentFormGroup.value.indContr == null ||
      this.currentFormGroup.value.indCateg == null ||
      this.currentFormGroup.value.indNatAtiv == null ||
      this.currentFormGroup.value.indMotDeslig == null ||
      (this.currentFormGroup.get('indCateg').value !== 'S' &&
      this.currentFormGroup.get('indNatAtiv').value !== 'S');
  }

  get maskNrInsc(): string {
    const tpInsc: IdeEstab['tpInsc'] = this.currentFormGroup.value.ideEstab.tpInsc;
    return tpInsc == this.documentTypeEnum.Cnpj ? '99.999.999/9999-99' : '';
  }

  constructor(private laborProcessDataStateService: LaborProcessDataStateService) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.subscriptions.push(this.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
      this.updateDisabledInputs();
    }));

    this.subscriptions.push(this.currentFormGroup.get('tpContr').valueChanges.subscribe(() => {
      this.updateValidityDtInicio();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indContr').valueChanges.subscribe(() => {
      this.handleChangesIndContr();
      this.updateValidityDtInicio();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indCateg').valueChanges.subscribe(() => {
      this.handleChangesIndCateg();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indNatAtiv').valueChanges.subscribe(() => {
      this.handleChangesIndNatAtiv();
    }));
    this.subscriptions.push(this.currentFormGroup.get('dtInicio').valueChanges.subscribe(() => {
      this.updateValidityDtInicio();
    }));
    this.subscriptions.push(this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo')?.valueChanges.subscribe(() => {
      this.updateValidityIdePeriodo();
    }));
    this.subscriptions.push(this.currentFormGroup.get('ideEstab.infoVlr.repercProc')?.valueChanges.subscribe(() => {
      this.updateValidityIdePeriodo();
    }));
    this.subscriptions.push(this.currentFormGroup.get('ideEstab.infoVlr.indReperc').valueChanges.subscribe(() => {
      this.handleChangesIndReperc();
      this.updateValidityIdePeriodo();
    }));
    this.subscriptions.push(this.currentFormGroup.get('ideEstab.infoVlr.indenAbono').valueChanges.subscribe(() => {
      this.updateValidityAbono();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indContr').valueChanges.subscribe(() => {
      this.handleChangesIndContr();
      this.updateValidityCodCateg();
    }));
    this.subscriptions.push(this.currentFormGroup.get('matricula').valueChanges.subscribe(() => {
      this.handleChangesMatricula();
      this.updateValidityCodCateg();
    }));
    this.subscriptions.push(this.currentFormGroup.get('indUnic').valueChanges.subscribe(() => {
      this.updateValidityMatricula();
    }));
    this.subscriptions.push(this.currentFormGroup.get('ideEstab.tpInsc').valueChanges.subscribe(() => {
      this.changeTpInsc();
    }));

    const applyMaskNrInscSubscription = this.currentFormGroup.get('ideEstab.nrInsc').valueChanges.subscribe((value) => {
      if (value ===  null)
      {
        return;
      }

      const nrInscField = this.currentFormGroup.get('ideEstab.nrInsc');
      applyMaskNrInscSubscription.unsubscribe();
      // NOTE: maskNrInsc é chamado no html após valueChanges e a mask é aplicada sobre valor já existente no nrInsc
      setTimeout(() => nrInscField.setValue(value));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateDisabledInputs(): void {
    if (this.isExcluded && this.isV1) {
      this.currentFormGroup.get('ideEstab.infoVlr.vrRemun').disable();
      this.currentFormGroup.get('ideEstab.infoVlr.vrAPI').disable();
      this.currentFormGroup.get('ideEstab.infoVlr.vr13API').disable();
      this.currentFormGroup.get('ideEstab.infoVlr.vrInden').disable();
      this.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS').disable();
    }
  }

  validateCompIni(): void {
    const compIniControl = FormUtils.getFormControl(this.currentFormGroup,'ideEstab.infoVlr.compIni');
    const { errors } = compIniControl;

    const compIniSplit = this.currentFormGroup.value.ideEstab.infoVlr.compIni.split('-');
    let compIniAnoMes = `${compIniSplit[0]}${compIniSplit[1]}`;

    if (this.currentFormGroup.value.dtAdmOrig !== null) {
      const dtAdmOrigSplit = this.currentFormGroup.value.dtAdmOrig.split('-');
      let dtAdmOrigAnoMes = `${dtAdmOrigSplit[0]}${dtAdmOrigSplit[1]}`;

      if (
        this.currentFormGroup.value.tpContr === TypeContract.TrabalhadorComVincSemAlt ||
        this.currentFormGroup.value.tpContr === TypeContract.TrabalhadorComVincComInclAlt ||
        this.currentFormGroup.value.tpContr === TypeContract.TrabComVincAntEsocial ||
        this.currentFormGroup.value.tpContr === TypeContract.RespIndireta ||
        this.currentFormGroup.value.tpContr === TypeContract.TrabContrUnificados
      ) {
        if (compIniAnoMes < dtAdmOrigAnoMes) {
          compIniControl.setErrors({ ...errors, invalidDate1: true });
        }
      }

      if (
        this.currentFormGroup.value.tpContr ===
        TypeContract.TrabalhadorComVincComAlt ||
        this.currentFormGroup.value.tpContr ===
        TypeContract.TrabalhadorComVincComAltData ||
        this.currentFormGroup.value.tpContr ===
        TypeContract.EmpregadoComReconhecimentoVinc
      ) {
        if (compIniAnoMes !== dtAdmOrigAnoMes) {
          compIniControl.setErrors({ ...errors, invalidDate2: true });
        }
      }
    }

    if (this.currentFormGroup.value.dtInicio !== null) {
      if (this.currentFormGroup.value.tpContr === TypeContract.TrabSemVinculo) {
        const dtInicioSplit = this.currentFormGroup.value.dtInicio.split('-');
        let dtInicioAnoMes = `${dtInicioSplit[0]}${dtInicioSplit[1]}`;
        if (compIniAnoMes < dtInicioAnoMes) {
          compIniControl.setErrors({ ...errors, invalidDate3: true });
        }
      }
    }
  }

  validateCompFim(): void {
    const compFimControl = FormUtils.getFormControl(this.currentFormGroup,'ideEstab.infoVlr.compFim');
    const { errors } = compFimControl;

    if (this.currentFormGroup.value.ideEstab.infoVlr.compFim !== null) {

      const compFimSplit = this.currentFormGroup.value.ideEstab.infoVlr.compFim.split('-');
      let compFimAnoMes = `${compFimSplit[0]}${compFimSplit[1]}`;

      let compIniAnoMes = '999999';
      if (this.currentFormGroup.value.ideEstab.infoVlr.compIni !== null) {
        const compIniSplit = this.currentFormGroup.value.ideEstab.infoVlr.compIni.split('-');
        compIniAnoMes = `${compIniSplit[0]}${compIniSplit[1]}`;
      }

      if (compFimAnoMes < compIniAnoMes) {
        compFimControl.setErrors({ ...errors, invalidDateFim1: true });
      }

      if (
        this.isV1 &&
        this.currentFormGroup.value.ideEstab.infoVlr.compFim !== null &&
        this.currentFormGroup.value.infoCompl.infoVinc.infoDeslig.dtDeslig !== null
      ) {
        const dtDesligSplit = this.currentFormGroup.value.infoCompl.infoVinc.infoDeslig.dtDeslig.split('-');
        let dtDesligAnoMes = `${dtDesligSplit[0]}${dtDesligSplit[1]}`;

        if (
          this.currentFormGroup.value.tpContr == TypeContract.TrabalhadorComVincSemAlt ||
          this.currentFormGroup.value.tpContr == TypeContract.TrabalhadorComVincComAlt
        ) {
          if (compFimAnoMes > dtDesligAnoMes) {
            compFimControl.setErrors({ ...errors, invalidDateFim2: true });
          }
        } else if (
          this.currentFormGroup.value.tpContr == TypeContract.TrabalhadorComVincComInclAlt ||
          this.currentFormGroup.value.tpContr == TypeContract.TrabalhadorComVincComAltData ||
          this.currentFormGroup.value.tpContr == TypeContract.EmpregadoComReconhecimentoVinc
        ) {
          if (compFimAnoMes !== dtDesligAnoMes) {
            compFimControl.setErrors({ ...errors, invalidDateFim3: true });
          }
        } else if (
          this.currentFormGroup.value.tpContr == TypeContract.TrabSemVinculo &&
          this.currentFormGroup.value.dtTerm !== null
        ) {
          const dtTermSplit = this.currentFormGroup.value.infoCompl.infoTerm.dtTerm.split('-');
          let dtTermAnoMes = `${dtTermSplit[0]}${dtTermSplit[1]}`;

          if (compFimAnoMes > dtTermAnoMes) {
            compFimControl.setErrors({ ...errors, invalidDateFim4: true });
          }
        }
      }

      if (!this.isV1) {
        const dtSentSplit = this.mainFormGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent')?.value?.split('-') ?? ['0000', '00'];
        const dtSentAnoMes = `${dtSentSplit[0]}${dtSentSplit[1]}`;

        const dtCCPSplit = this.mainFormGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP')?.value?.split('-') ?? ['0000', '00'];
        const dtCCPAnoMes = `${dtCCPSplit[0]}${dtCCPSplit[1]}`;

        if (compFimAnoMes > dtSentAnoMes && compFimAnoMes > dtCCPAnoMes) {
          compFimControl.setErrors({ ...errors, invalidDateFim5: true });
        }
      }
    }
  }
  changeTpInsc() {
    const tpInsc: IdeEstab['tpInsc'] = this.currentFormGroup.get('ideEstab.tpInsc').value;
    FormUtils.getFormControl(this.currentFormGroup, 'ideEstab.nrInsc').reset();

    if (tpInsc === DocumentTypeEnum.Cnpj) {
      this.currentFormGroup.get('ideEstab.nrInsc').setValidators([CustomValidators.cnpj, CustomValidators.requiredIgnoreWhiteSpace]);
    } else {
      this.currentFormGroup.get('ideEstab.nrInsc').setValidators([Validators.pattern(/^[0-9]+$/), CustomValidators.requiredIgnoreWhiteSpace]);
    }
  }

  changeVrBaseIndenFGTS(): void {
    const vrBaseIndenFGTS: AbstractControl<any, any> = this.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS');
    const pagDiretoResc: AbstractControl<any, any> = this.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc');
    pagDiretoResc?.clearValidators();
    if (vrBaseIndenFGTS.value != null && vrBaseIndenFGTS.value !== '') {
      pagDiretoResc?.setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
    } else {
      this.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc').setValue(null);
    }
    pagDiretoResc?.updateValueAndValidity();
  }

  get isRequiredYearsBaseIndemnity(): boolean {
    return this.currentFormGroup.get('ideEstab.infoVlr.indenAbono').value === OptionsAnswer.Yes;
  }

  get isInvalidYearsBaseIndemnity(): boolean {
    const abonoItems: Abono[] = this.currentFormGroup.get('ideEstab.infoVlr.abono').value ?? [];
    return !this.isV1 && this.isRequiredYearsBaseIndemnity && abonoItems.length < 1;
  }

  get isIdePeriodoInvalid(): boolean {
    const idePeriodoItems: IdePeriodo[] = this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value ?? [];
    const isRequiredIdePeriodoV1 = this.currentFormGroup.get('ideEstab.infoVlr.repercProc').value === 1;
    const isRequiredIdePeriodoNotV1 = this.currentFormGroup.get('ideEstab.infoVlr.indReperc').value === IndRepercEnum.DecisComRepercTrib;
    const isRequiredIdePeriodo = (this.isV1 && isRequiredIdePeriodoV1) || (!this.isV1 && isRequiredIdePeriodoNotV1);

    return isRequiredIdePeriodo && idePeriodoItems.length < 1;
  }

  private updateValidityIdePeriodo(): void {
    const errors = this.isIdePeriodoInvalid
      ? { mustHaveAtLeastOne: true }
      : null;

    this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').setErrors(errors);
  }

  private updateValidityCodCateg(): void {
    const codCategField = this.currentFormGroup.get('codCateg');
    const errors = this.isRequiredCodCateg && CustomValidators.isValueEmpty(codCategField.value)
      ? { isRequiredCodCateg: true }
      : null;

    codCategField.setErrors(errors);
  }

  private updateValidityMatricula(): void {
    const indUnicField = this.currentFormGroup.get('indUnic');
    const errors = this.isV1 && this.isRequiredMatricula && !indUnicField.value
      ? { isRequiredIndUnic: true }
      : null;

    indUnicField.setErrors(errors);
  }

  private updateValidityAbono(): void {
    const errors = this.isInvalidYearsBaseIndemnity
      ? { isRequiredAbono: true }
      : null;

    this.currentFormGroup.get('ideEstab.infoVlr.abono').setErrors(errors);
  }

  private updateValidityDtInicio(): void {
    const errors = this.errorsDtInicio;

    this.currentFormGroup.get('dtInicio').setErrors(errors);
  }

  private handleChangesIndReperc(): void {
    if (this.isDisabledPeriodIdentification) {
      this.accordionItemPeriodIdentification?.collapse();
      this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').reset();
    }
  }

  private handleChangesIndContr(): void {
    this.resetCodCategIsNotRequired();
  }

  private handleChangesMatricula(): void {
    this.resetCodCategIsNotRequired();
  }

  private handleChangesIndCateg(): void {
    this.collapseAndResetMudCategAtiv();
  }

  private handleChangesIndNatAtiv(): void {
    this.collapseAndResetMudCategAtiv();
  }

  private collapseAndResetMudCategAtiv(): void {
    if (this.disableMudCategAtiv) {
      this.accordionItemMudCategAtiv?.collapse();
      this.currentFormGroup.get('mudCategAtiv').reset();
    }
  }

  private resetCodCategIsNotRequired(): void {
    const codCateg = this.currentFormGroup.get('codCateg');
    if (!this.isRequiredCodCateg) {
      codCateg.reset();
    }
  }

  renderCodCateg() {
    this.comboCodCateg.updateComboList([...this.optionsCodCateg]);
  }
}
