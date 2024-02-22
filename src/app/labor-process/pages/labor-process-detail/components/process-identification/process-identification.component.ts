import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { DateTime } from 'luxon';
import { PoComboComponent, PoComboOption } from '@po-ui/ng-components';
import { DocumentTypeEnum, IdeResp, InfoCCP, InfoProcesso, LaborProcess, OptionsAnswer, OrigemEnum, TpCCPEnum, TpInscEnum } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FormUtils } from '../../../../validators/form-utils';
import { OPTIONS_ORIGEM, OPTIONS_TP_CCP, OPTIONS_TP_INSC, OPTIONS_UF_VARA } from './constants/data';

@Component({
  selector: 'app-process-identification',
  templateUrl: './process-identification.component.html',
  styleUrls: [
    './process-identification.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class ProcessIdentificationComponent implements OnInit, OnDestroy {
  @ViewChild('tpInsc', { static: false }) comboTpInsc: PoComboComponent;
  @ViewChild('origem', { static: false }) comboOrigem: PoComboComponent;
  @ViewChild('ufVara', { static: false }) comboUfVara: PoComboComponent;
  @ViewChild('tpCCP', { static: false }) comboTpCCP: PoComboComponent;

  @Input() formGroup = new UntypedFormGroup({});
  @Input() isEdit: boolean;

  excluidoERP: OptionsAnswer = OptionsAnswer.No;
  subscriptions: Subscription[] = [];

  optionsTpInsc: PoComboOption[] = OPTIONS_TP_INSC;
  optionsOrigem: PoComboOption[] = OPTIONS_ORIGEM;
  optionsUfVara: PoComboOption[] = OPTIONS_UF_VARA;
  optionsTpCCP: PoComboOption[] = OPTIONS_TP_CCP;

  maxDate = DateTime.now().toJSDate();

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isDisabledInfoProcJud(): boolean {
    return this.origem !== OrigemEnum.procJud;
  }

  get isDisabledInfoCCP(): boolean {
    return this.origem !== OrigemEnum.demandaSubm;
  }

  get isRequiredCnpjCCP(): boolean {
    const tpCCP: InfoCCP['tpCCP'] = this.formGroup.get('infoProcesso.dadosCompl.infoCCP.tpCCP').value;

    const requiredTpCCP = [TpCCPEnum.CCPAmbitoSindicato, TpCCPEnum.NINTER];
    return requiredTpCCP.includes(tpCCP);
  }

  get origem(): InfoProcesso['origem'] {
    return this.formGroup.get('infoProcesso.origem').value;
  }

  get fieldLengthNrProcTrab(): number {
    return this.origem === OrigemEnum.procJud ? 20 : 15;
  }

  get tooltipMessageNrProcTrab(): string {
    return this.origem === OrigemEnum.procJud
      ? 'Este campo deve ser preenchido com 20 caracteres'
      : 'Este campo deve ser preenchido com 15 caracteres';
  }

  get maskNrInsc(): string {
    const tpInsc: IdeResp['tpInsc'] = this.formGroup.value.infoProcesso.ideResp.tpInsc;
    return tpInsc == TpInscEnum.Cnpj ? '99.999.999/9999-99' : '999.999.999-99';
  }

  constructor() {}

  ngOnInit(): void {
    this.subscriptions.push(this.formGroup.valueChanges.subscribe(() => {
      const excluidoERP: LaborProcess['excluidoERP'] = this.formGroup.get('excluidoERP').value;
      this.excluidoERP = excluidoERP === OptionsAnswer.Yes ? OptionsAnswer.Yes : OptionsAnswer.No;
    }));
    this.subscriptions.push(this.formGroup.get('infoProcesso.ideResp.tpInsc').valueChanges.subscribe(() => {
      this.changeTpInsc();
    }));

    this.subscriptions.push(this.formGroup.get('infoProcesso.origem').valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
        this.handleChangeOrigem();
    }))

    const applyMaskNrInscSubscription = this.formGroup.get('infoProcesso.ideResp.nrInsc').valueChanges.subscribe((value) => {
      if (value ===  null)
      {
        return;
      }

      const nrInscField = this.formGroup.get('infoProcesso.ideResp.nrInsc');
      applyMaskNrInscSubscription.unsubscribe();
      // NOTE: maskNrInsc é chamado no html após valueChanges e a mask é aplicada sobre valor já existente no nrInsc
      setTimeout(() => nrInscField.setValue(value));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  changeTpInsc() {
    const tpInsc: IdeResp['tpInsc'] = this.formGroup.get('infoProcesso.ideResp.tpInsc').value;
    FormUtils.getFormControl(this.formGroup, 'infoProcesso.ideResp.nrInsc').reset();

    if (tpInsc == TpInscEnum.Cnpj) {
      this.formGroup.get('infoProcesso.ideResp.nrInsc').setValidators(CustomValidators.cnpj);
    } else if (tpInsc == TpInscEnum.Cpf) {
      this.formGroup.get('infoProcesso.ideResp.nrInsc').setValidators(CustomValidators.cpf);
    }
  }

  handleChangeOrigem() {
    FormUtils.getFormControl(this.formGroup, 'infoProcesso.nrProcTrab').reset();
  }

  renderTpInsc() {
    this.comboTpInsc.updateComboList([...this.optionsTpInsc]);
  }

  renderOrigem() {
    this.comboOrigem.updateComboList([...this.optionsOrigem]);
  }

  renderUfVara() {
    this.comboUfVara.updateComboList([...this.optionsUfVara]);
  }

  renderTpCCP() {
    this.comboTpCCP.updateComboList([...this.optionsTpCCP]);
  }
}
