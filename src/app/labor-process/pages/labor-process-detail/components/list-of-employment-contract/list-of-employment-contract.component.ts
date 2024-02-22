import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService, PoTableAction, PoTableColumn, PoToasterOrientation } from '@po-ui/ng-components';
import { CodCategEnum, ESocialVersionEnum, InfoContrSimple, InfoContr, OptionsAnswer, TpInscEnum, TypeContract } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { EmploymentContractModalComponent } from '../employment-contract-modal/employment-contract-modal.component';
import { COLUMNS } from './constants/data';

type InfoContrSimpleView = {
  [key in 'tpContrLabel' | 'indContrLabel' | 'indCategLabel' | 'indNatAtivLabel' | 'indMotDesligLabel']: string;
}

@Component({
  selector: 'app-list-of-employment-contract',
  templateUrl: './list-of-employment-contract.component.html',
  styleUrls: [
    './list-of-employment-contract.component.scss',
    '../../labor-process-detail.component.scss',
  ],
})
export class ListOfEmploymentContractComponent implements OnInit {
  @ViewChild(EmploymentContractModalComponent)
  employmentContractModal?: EmploymentContractModalComponent;

  @Input() formGroup: UntypedFormGroup;
  @Input() isEditMode: boolean;

  version: ESocialVersionEnum;

  excluidoERP: OptionsAnswer = OptionsAnswer.No;

  isEdit: boolean = false;
  editIndex: number | null = null;

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  subscriptions: Subscription[] = []

  optionsAnswer = OptionsAnswer;

  columns: PoTableColumn[] = COLUMNS;
  rows: InfoContrSimpleView[] = [];
  actions: PoTableAction[] = []

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get formArray(): UntypedFormControl {
    return this.formGroup?.get('ideTrab.infoContr') as UntypedFormControl;
  }

  get formArrayValue(): InfoContr[] {
    return this.formArray.value ?? [];
  }

  constructor(
    private fb: UntypedFormBuilder,
    private notificationService: PoNotificationService,
    private laborProcessDataStateService: LaborProcessDataStateService,
  ) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.transformRows();
    this.initializeTableActions();
    const subscription = this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    });
    this.subscriptions.push(subscription);
    const subscription2 = this.formArray.valueChanges.subscribe(() => {
      this.excluidoERP = this.formGroup.get('excluidoERP').value === 'S' ? OptionsAnswer.Yes : OptionsAnswer.No;
      this.initializeTableActions();
    });
    this.subscriptions.push(subscription2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }

  initializeTableActions(): void {
    if (this.excluidoERP === OptionsAnswer.Yes) {
      this.actions = [{
        label: 'Ver',
        action: this.clickToEditContract.bind(this),
      }];
      return;
    }

    this.actions = [
      { label: 'Editar', action: this.clickToEditContract.bind(this) },
      { label: 'Excluir', action: this.deleteContract.bind(this) },
    ];
  }

  transformRows(): void {
    const valueFormArray: InfoContrSimple[] = this.formArrayValue;
    this.rows = valueFormArray.map(item => {
      const value: InfoContrSimpleView = {
        tpContrLabel: this.convertOptionsTpContr(item.tpContr),
        indContrLabel: this.convertValueToLabelOption(item.indContr),
        indCategLabel: this.convertValueToLabelOption(item.indCateg),
        indNatAtivLabel: this.convertValueToLabelOption(item.indNatAtiv),
        indMotDesligLabel: this.convertValueToLabelOption(item.indMotDeslig),
      };
      return value;
    })
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpContr: [null],
      indContr: [null, [this.validateIdeRespInCont.bind(this)]],
      dtAdmOrig: [null],
      indReint: [null],
      indCateg: [null],
      indNatAtiv: [null],
      indMotDeslig: [null],
      indUnic: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, this.validateIdeRespInCont.bind(this))],
      matricula: [null],
      codCateg: [null],
      dtInicio: [null],
      ideEstab: this.fb.group({
        tpInsc: [null],
        nrInsc: [null],
        infoVlr: this.fb.group({
          compIni: [null, CustomValidators.requiredIgnoreWhiteSpace],
          compFim: [null, CustomValidators.requiredIgnoreWhiteSpace],
          indReperc: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, CustomValidators.requiredIgnoreWhiteSpace)],
          indenSD: [null],
          indenAbono: [null],
          abono: this.fb.control([]),
          repercProc: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace)],
          vrRemun: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00), this.validateRepercusao.bind(this))],
          vrAPI: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00))],
          vr13API: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00))],
          vrInden: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00))],
          vrBaseIndenFGTS: [null, CustomValidators.validateFieldInSomeVersion(() => this.isV1, Validators.min(0.00))],
          pagDiretoResc: [null],
          idePeriodo: this.fb.control([]),
        }),
      }),
      mudCategAtiv: this.fb.control([]),
      unicContr: this.fb.control([]),
      infoCompl: this.fb.group({
        codCBO: [null],
        natAtividade: [null, [this.verifyValueNatAtiv.bind(this)]],
        infoTerm: this.fb.group({
          dtTerm: [null],
          mtvDesligTSV: [null],
        }),
        remuneracao: this.fb.control([]),
        infoVinc: this.fb.group({
          tpRegTrab: [null, [this.verifyIfTheCorrectValue.bind(this)]],
          tpRegPrev: [null, [this.verifyIfTheCorrectValueRegPrev.bind(this)]],
          dtAdm: [null],
          tmpParc: [null, [this.verifyValueTempParc.bind(this)]],
          duracao: this.fb.group({
            tpContr: [null],
            dtTerm: [null],
            clauAssec: [null],
            objDet: [null],
          }),
          sucessaoVinc: this.fb.group({
            tpInsc: [null, [this.verifyIfTheTpInscIsCorrectValue.bind(this)]],
            nrInsc: [null],
            matricAnt: [null],
            dtTransf: [null],
          }),
          infoDeslig: this.fb.group({
            dtDeslig: [null],
            mtvDeslig: [null],
            dtProjFimAPI: [null],
            pensAlim: [null],
            percAliment: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, Validators.min(0.01), Validators.max(100.00))],
            vrAlim: [null, CustomValidators.validateFieldInSomeVersion(() => !this.isV1, Validators.min(0.01))],
          }),
          observacoes: this.fb.control([]),
        }),
      }),
    });
  }

  clickToEditContract(infoContrSimple: InfoContrSimpleView): void {
    const position = this.rows.findIndex(item => item === infoContrSimple);
    this.isEdit = true;
    this.editIndex = position;

    this.subFormGroup.patchValue(this.formArrayValue[position]);

    this.employmentContractModal.openModal();
  }

  deleteContract(info: any): void {
    const position = this.rows.findIndex(d => d === info);
    const currentValue: InfoContr[] = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
  }

  onClickCreate(): void {
    this.subFormGroup.reset();
    this.isEdit = false;
    this.employmentContractModal.openModal();
  }

  private create(): void {
    const value = this.formArrayValue;
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.employmentContractModal.closeModal();
  }

  update(): void {
    const currentValue: InfoContr[] = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.employmentContractModal.closeModal();
  }

  cancel(): void {
    this.employmentContractModal.closeModal();
  }

  private clearControlPagDiretoResc(): void {
    if (this.subFormGroup.get('ideEstab.infoVlr.pagDiretoResc').value == null || this.subFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS').value === '') {
      this.subFormGroup.get('ideEstab.infoVlr.pagDiretoResc').setValue('');
    }
  }

  onSaveClicked(): void {
    this.clearControlPagDiretoResc();

    if (!this.canSave()) {
      return;
    }

    this.isEdit ? this.update() : this.create();
  }

  isUnqualifiedInfoComplRemuneracao(): boolean {
    return (this.subFormGroup.get('tpContr').value != 6 && this.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').value == 2)
  }

  isRequiredInfoComplRemuneracao(): boolean {
    
    const codCateg = this.subFormGroup.get('codCateg').value;
    const validCategoryCodes = [
      CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar,
    ];

    const isCltWithWorkContract = this.subFormGroup.get('tpContr').value != TypeContract.TrabSemVinculo &&
      this.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').value == 1;

    return isCltWithWorkContract || validCategoryCodes.includes(Number(codCateg));
  }

  canSave(): boolean {
    if (this.isRequiredInfoComplRemuneracao() && this.subFormGroup.get('infoCompl.remuneracao').value?.length === 0) {
      this.showError('É obrigatório o preenchimento de: "Informações da remuneração e periodicidade de pagamento" em Informações complementares.');
      return false;
    }

    if (this.isUnqualifiedInfoComplRemuneracao() && this.subFormGroup.get('infoCompl.remuneracao').value?.length > 0) {
      this.showError('Não é necessário o preenchimento de: "Informações da remuneração e periodicidade de pagamento" em Informações complementares.');
      return false;
    }

    if(!this.isV1) {

      let infoContrArray: InfoContr[];
      let countN = 0;

      if (this.isEdit) {
        const currentValue: InfoContr[] = this.formArrayValue.slice();
        currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
        infoContrArray = currentValue;
      } else {
        const currentValue = this.formArrayValue;
        infoContrArray = [...currentValue, this.subFormGroup.getRawValue()];
      }

      infoContrArray.forEach((infoContr: any) => {
        if (infoContr.indContr === 'N') {
          countN++;
        }
      });

      if (countN > 1) {
        this.notificationService.error({
          message: 'Somente pode haver um contrato com o valor de "Possui informação no evento S-2190, S-2200 ou S-2300 no declarante?" (indContr) igual a "Não" (N)',
          orientation: PoToasterOrientation.Top,
        })
        return false;
      }
    }

    return true;
  }

  private showError(msg: string): void {
    this.notificationService.error({
      message: msg,
      orientation: PoToasterOrientation.Top,
    });
  }

  convertValueToLabelOption(tpOption: string): string {
    switch (tpOption) {
      case OptionsAnswer.Yes:
        return 'Sim';
      case OptionsAnswer.No:
        return 'Não';
    }
  }

  convertOptionsTpContr(typeContract: TypeContract): string {
    const optionsLabelHash = {
      [TypeContract.TrabalhadorComVincSemAlt]: 'Trabalhador com vínculo formalizado, sem alteração nas datas de admissão e de desligamento',
      [TypeContract.TrabalhadorComVincComAlt]: 'Trabalhador com vínculo formalizado, com alteração na data de admissão',
      [TypeContract.TrabalhadorComVincComInclAlt]: 'Trabalhador com vínculo formalizado, com inclusão ou alteração de data de desligamento',
      [TypeContract.TrabalhadorComVincComAltData]: 'Trabalhador com vínculo formalizado, com alteração nas datas de admissão e de desligamento',
      [TypeContract.EmpregadoComReconhecimentoVinc]: 'Empregado com reconhecimento de vínculo',
      [TypeContract.TrabSemVinculo]: 'Trabalhador sem vínculo de emprego/estatutário (TSVE), sem reconhecimento de vínculo empregatício',
      [TypeContract.TrabComVincAntEsocial]: 'Trabalhador com vínculo de empregado formalizado em período anterior ao eSocial',
      [TypeContract.RespIndireta]: 'Responsabilidade indireta',
      [TypeContract.TrabContrUnificados]: 'Trabalhador cujos contratos foram unificados',
    };

    return optionsLabelHash[typeContract] || '';
  }

  validateIdeRespInCont(control: AbstractControl): ValidationErrors {
    if (this.formGroup == null) {
      return null;
    }
    const currentValue = control.value;
    const ideRespTpContrato = this.formGroup.get('infoProcesso.ideResp.tpInsc').value;
    const ideRespNumeroContrato = this.formGroup.get('infoProcesso.ideResp.nrInsc').value;

    if (
      ideRespTpContrato &&
      ideRespNumeroContrato &&
      currentValue === OptionsAnswer.Yes
    ) {
      return { notPermitted: true };
    }
    return null;
  }

  validateRepercusao(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || !this.isV1) {
      return null;
    }
    const currentValue = control.value;
    const repercussao = this.subFormGroup.get('ideEstab.infoVlr.repercProc').value;
    if (
      repercussao != null &&
      repercussao == 1 && currentValue <= 0
    ) {
      return { invalidValue1: true };
    }
    else if (
      repercussao != null &&
      repercussao == 2 && currentValue != 0
    ) {
      return { invalidValue2: true };
    }

    return null;

  }

  // todo: Melhorar o nome deste método pois ele é muito genérico
  verifyIfTheCorrectValue(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.subFormGroup.get('tpContr').value == TypeContract.TrabSemVinculo || this.subFormGroup.get('indContr').value !== 'N') {
      return null;
    }
    const currentValue = control.value;
    const codCateg = this.subFormGroup.get('codCateg').value;

    // todo: Verificar esta expressão porque ela anula o teste anterior no inicio deste método
    if (this.subFormGroup.get('tpContr').value != TypeContract.TrabSemVinculo)
      return null;

    if (
      currentValue !== null &&
      codCateg !== null
    ) {
      if (
        codCateg == CodCategEnum.Domestico &&
        currentValue == 2
      ) {
        return { invalidValue1: true };
      }
    }
    return null;
  }

  verifyIfTheCorrectValueRegPrev(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.subFormGroup.get('tpContr').value == TypeContract.TrabSemVinculo || this.subFormGroup.get('indContr').value !== 'N') {
      return null;
    }

    const currentValue = control.value;
    const codCateg = this.subFormGroup.get('codCateg').value;

    if (
      currentValue !== null &&
      codCateg !== null
    ) {
      if (
        codCateg == CodCategEnum.Domestico &&
        (currentValue == 2 ||
          currentValue == 3)
      ) {
        return { invalidValue1: true };
      } else if (
        (codCateg == CodCategEnum.EmpregadoGeral ||
          codCateg == CodCategEnum.EmpregadoRural ||
          codCateg == CodCategEnum.Aprendiz ||
          codCateg == CodCategEnum.ContratoTermoFirmado ||
          codCateg == CodCategEnum.TrabTemporario ||
          codCateg == CodCategEnum.ContrVerdeAmarelo ||
          codCateg == CodCategEnum.ContrVerdeAmareloComAcordo ||
          codCateg == CodCategEnum.Intermitente) &&
        currentValue == 2
      ) {
        return { invalidValue1: true };
      }
    }
    return null;
  }

  verifyValueTempParc(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.subFormGroup.get('tpContr').value == TypeContract.TrabSemVinculo || this.subFormGroup.get('indContr')?.value !== 'N') {
      return null;
    }
    const currentValue = control.value;
    const codCateg = this.subFormGroup.get('codCateg').value;
    if (
      currentValue !== null &&
      codCateg !== null
    ) {
      if (
        codCateg !== CodCategEnum.Domestico &&
        currentValue == 1
      ) {
        return { invalidValue1: true };
      } else if (
        codCateg === CodCategEnum.Domestico &&
        (currentValue == 2 || currentValue == 3)
      ) {
        return { invalidValue1: true };
      }
    }
    return null;
  }

  verifyIfTheTpInscIsCorrectValue(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null) {
      return null;
    }

    const currentValue = control.value;
    const dtTransf = this.subFormGroup.get('infoCompl.infoVinc.sucessaoVinc.dtTransf')?.value;

    if (currentValue == TpInscEnum.Cgc && dtTransf && dtTransf > '19990630') {
      return { invalidTpTransfWithDtTransfGreater19990630: true };
    }

    if (this.isV1 && currentValue == TpInscEnum.Cei && dtTransf && dtTransf > '20111231') {
      return { invalidTpTransfWithDtTransfGreater20111231: true };
    }

    return null;
  }

  verifyValueNatAtiv(control: AbstractControl): ValidationErrors {
    if (this.subFormGroup == null || this.subFormGroup.get('indContr').value !== 'N') {
      return null;
    }
    const currentValue = control.value;
    const codCateg = this.subFormGroup.get('codCateg').value;

    if (currentValue !== null) {
      if (codCateg === CodCategEnum.Domestico) {
        if (currentValue === 2) {
          return { invalidValue1: true };
        }
      } else if (codCateg === CodCategEnum.EmpregadoRural) {
        if (currentValue === 1) {
          return { invalidValue1: true };
        }
      }
    }
    return null;
  }
}
