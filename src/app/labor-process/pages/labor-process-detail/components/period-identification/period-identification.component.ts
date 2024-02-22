import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoComboComponent, PoComboOption, PoNotificationService, PoSelectOption, PoTableAction, PoTableColumn, PoToasterOrientation } from '@po-ui/ng-components';
import { CodCategEnum, ESocialVersionEnum, OptionsAnswer, IdePeriodo, InfoContr, InfoFGTS } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { COLUMNS, OPTIONS_COD_CATEG, OPTIONS_GRAU_EXP, OPTIONS_PAG_DIRETO } from './constants/data';

@Component({
  selector: 'app-period-identification',
  templateUrl: './period-identification.component.html',
  styleUrls: [
    './period-identification.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class PeriodIdentificationComponent implements OnInit, OnDestroy {
  @ViewChild('codCateg', { static: false }) comboCodCateg: PoComboComponent;

  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});

  version: ESocialVersionEnum;

  excluidoERP: OptionsAnswer;

  isEdit: boolean = false;
  editIndex: number = null;
  isSelected: boolean = false;

  optionsAnswerEnum = OptionsAnswer;
  categoryEnum = CodCategEnum;

  optionsGrauExp: PoSelectOption[] = OPTIONS_GRAU_EXP;
  optionsPagDireto: PoSelectOption[] = OPTIONS_PAG_DIRETO;
  optionsCodCateg: PoComboOption[] = OPTIONS_COD_CATEG;

  columns: PoTableColumn[] = COLUMNS;
  actions: PoTableAction[] = []

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  subscription: Subscription;

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('ideEstab.infoVlr.idePeriodo') as UntypedFormControl;
  }

  get formArrayValue(): IdePeriodo[] {
    return this.formArray.value ?? [];
  }

  get canCreateIdePeriodo(): boolean {
    return (this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo')?.value?.length ?? 0) < 1;
  }

  get isRequiredPerRef(): boolean {
    return this.isV1 && this.currentFormGroup.get('ideEstab.infoVlr.repercProc').value == 1;
  }

  get isRequiredGrauExp(): boolean {
    const requiredCodCateg = [
      CodCategEnum.EmpregadoGeral,
      CodCategEnum.EmpregadoRural,
      CodCategEnum.Aprendiz,
      CodCategEnum.Domestico,
      CodCategEnum.ContratoTermoFirmado,
      CodCategEnum.TrabTemporario,
      CodCategEnum.ContrVerdeAmarelo,
      CodCategEnum.ContrVerdeAmareloComAcordo,
      CodCategEnum.Intermitente,
      CodCategEnum.TrabAvulso,
      CodCategEnum.TrabAvulsoNaoPortuario,
      CodCategEnum.ServPubefetivo,
      CodCategEnum.ServPublicoComissao,
      CodCategEnum.MandatoEletivo,
      CodCategEnum.MandatoEletivoComissao,
      CodCategEnum.SerPubConselho,
      CodCategEnum.SerPubContrTempoDeterminado,
      CodCategEnum.Militar,
      CodCategEnum.Conscrito,
      CodCategEnum.AgentePublico,
      CodCategEnum.ServidorPublicoEventual,
      CodCategEnum.Ministros,
      CodCategEnum.Auxiliar,
      CodCategEnum.ServPubInstrutoria,
      CodCategEnum.ContribuinteIndivCooperado,
      CodCategEnum.ContribuinteIndivTransp,
      CodCategEnum.ContribuinteIndivCooperadoFiliado,
    ];
    const codCateg: InfoContr['codCateg'] = this.currentFormGroup.get('codCateg').value;

    return requiredCodCateg.includes(codCateg);
  }

  get isRequiredV1InfoFGTSFields(): boolean {
    const pagDireto: InfoFGTS['pagDireto'] = this.subFormGroup.get('infoFGTS.pagDireto').value;

    return this.subFormGroup.get('infoFGTS.vrBcFgtsGuia').value != null ||
      this.subFormGroup.get('infoFGTS.vrBcFgts13Guia').value != null ||
      !CustomValidators.isValueEmpty(pagDireto);
  }

  get isRequiredVrBcFGTSProcTrab(): boolean {
    return this.subFormGroup.get('infoFGTS.vrBcFGTSSefip').value !== null ||
      this.subFormGroup.get('infoFGTS.vrBcFGTSDecAnt').value !== null;
  }

  get baseCalculoSubtitle(): string {
    return this.isV1
      ? 'Bases de cálculo de contribuição previdenciária e FGTS decorrentes de processo trabalhista e ainda não declaradas'
      : 'Bases de cálculo de contribuição previdenciária decorrentes de processo trabalhista e ainda não declaradas';
  }

  constructor(
    private fb: UntypedFormBuilder,
    private laborProcessDataStateService: LaborProcessDataStateService,
    private notificationService: PoNotificationService,
  ) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.subscription = this.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
      this.initializeTableActions();
      if (this.excluidoERP === 'S') {
        this.subFormGroup.disable();
      }
    })
    this.initializeTableActions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeTableActions(): void {
    if (this.excluidoERP === 'S') {
      this.actions = [{ label: 'Ver', action: this.clickToEditPeriod.bind(this) },]
    }
    else {
      this.actions = [
        { label: 'Editar', action: this.clickToEditPeriod.bind(this) },
        { label: 'Excluir', action: this.deletePeriod.bind(this) },
      ];
    }
  }

  create(): void {
    const countPeriodos = this.currentFormGroup.get('ideEstab.infoVlr.idePeriodo')?.value?.length ?? 0;
    const sizeMaxPeriodos = this.isV1 ? 360 : 999;

    if (countPeriodos >= sizeMaxPeriodos) {
      this.notificationService.error({
        message: 'Não é permitido incluir mais periodos',
        orientation: PoToasterOrientation.Top,
      });
      return;
    }

    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  cancel(): void {
    this.isSelected = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      perRef: [null, [CustomValidators.requiredIgnoreWhiteSpace, this.verifyPeriodInterval.bind(this), this.verifyDuplicatePeriod.bind(this)]],
      baseCalculo: this.fb.group({
        vrBcCpMensal: [null, [CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00)]],
        vrBcCp13: [null, [Validators.min(0.00), CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace)]],
        vrBcFgts: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00))],
        vrBcFgts13: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00))],
        infoAgNocivo: this.fb.group({
          grauExp: [null],
        }),
      }),
      infoFGTS: this.fb.group({
        vrBcFGTSProcTrab: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, Validators.min(0.01))],
        vrBcFGTSSefip: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, Validators.min(0.01))],
        vrBcFGTSDecAnt: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, Validators.min(0.01))],
        vrBcFgtsGuia: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, Validators.min(0.00))],
        vrBcFgts13Guia: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, Validators.min(0.00))],
        pagDireto: [null],
      }),
      baseMudCateg: this.fb.group({
        codCateg: [null],
        vrBcCPrev: [null, Validators.min(0.01)],
      })
    });
  }

  clickToEditPeriod(idePeriodo: IdePeriodo): void {
    const currentValue = this.formArrayValue;
    const position = currentValue.findIndex(item => item === idePeriodo);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArrayValue[position]);
  }

  savePeriod(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updatePeriod(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  deletePeriod(idePeriodo: IdePeriodo): void {
    const currentValue = this.formArrayValue;
    const position = currentValue.findIndex(item => item === idePeriodo);
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  verifyPeriodInterval(control: AbstractControl): ValidationErrors {
    if (this.currentFormGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const compIni = this.currentFormGroup.get('ideEstab.infoVlr.compIni')?.value;
    const compFim = this.currentFormGroup.get('ideEstab.infoVlr.compFim')?.value;

    if (
      compIni != null &&
      compFim !== null
    ) {
      if (currentValue != null) {
        let dateCompIni = compIni.split('/');
        let dateCompFim = compFim.split('/');
        let datePer = currentValue.split('/');
        const mesIni = parseInt(dateCompIni[0]);
        const anoIni = parseInt(dateCompIni[1]);
        const dataIni = new Date(anoIni, mesIni - 1, 1);

        const mesFim = parseInt(dateCompFim[0]);
        const anoFim = parseInt(dateCompFim[1]);
        const dataFim = new Date(anoFim, mesFim - 1, 1);

        const datePerMes = parseInt(datePer[0]);
        const datePerAno = parseInt(datePer[1]);

        const datePeriod = new Date(datePerAno, datePerMes - 1, 1);

        if (datePeriod < dataIni || datePeriod > dataFim) {
          return { invalidPeriod: true };
        }
      }
    }

    return null;
  }

  verifyDuplicatePeriod(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.isEdit) {
      return null;
    }
    const currentValue = control.value;

    const values = this.formArrayValue;

    if (values == null) {
      return null;
    }
    else if (currentValue != null) {
      const alreadyExistsArray = values.some((item) => item.perRef == currentValue);
      if (alreadyExistsArray) {
        return { duplicatedPeriod: true };
      }
    }

    return null;
  }

  renderCodCateg() {
    this.comboCodCateg.updateComboList([...this.optionsCodCateg]);
  }
}
