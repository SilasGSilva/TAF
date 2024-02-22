import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { IndApuracaoEnum, IndApuracaoLabelEnum, InfoIR, InfoProcRet, InfoValores, TpProcRetEnum } from '../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../../../utils/formatter-utils';
import { ModalFormGroupComponent } from '../../../../../../components/modal-form-group/modal-form-group.component';
import { InfoValoresStateService } from '../service/info-valores-state.service';
import { DedSuspStateService } from './service/ded-susp-state.service';
import { COLUMNS, OPTIONS_IND_APURACAO } from './constants/data';

export interface InfoValoresView {
  indApuracaoLabel: string;
  vlrNRetidoLabel: InfoValores['vlrNRetido'];
  vlrDepJudLabel: InfoValores['vlrDepJud'];
  vlrCmpAnoCalLabel: InfoValores['vlrCmpAnoCal'];
  vlrCmpAnoAntLabel: InfoValores['vlrCmpAnoAnt'];
  vlrRendSuspLabel: InfoValores['vlrRendSusp'];
}

@Component({
  selector: 'app-values-information',
  templateUrl: './values-information.component.html',
  styleUrls: [
    './values-information.component.scss',
    '../../../../labor-process-tax-detail.component.scss',
  ],
  providers: [DedSuspStateService],
})
export class ValuesInformationComponent implements OnInit, OnDestroy {
  @ViewChild(ModalFormGroupComponent) modalFormGroup: ModalFormGroupComponent;

  @Input() mainModalFormGroup: UntypedFormGroup;
  @Input() mainFormGroup: UntypedFormGroup;
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: InfoValoresView[] = [];

  optionsIndApuracao: PoSelectOption[] = OPTIONS_IND_APURACAO;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArrayValue(): InfoValores[] {
    return this.infoValoresStateService.getData() ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 2;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get valueLabelDedSusp(): string {
    const infoValores: InfoValores['dedSusp'] = this.subFormGroup.get('dedSusp').value;
    if (!infoValores || infoValores.length === 0) {
      return 'Nenhum incluído';
    }
    if (infoValores.length === 1) {
      return '1 incluído';
    }
    return `${infoValores.length} incluídos`;
  }

  get isDisabledSaveDedSusp(): boolean {
    return this.subFormGroup.get('dedSusp').invalid || this.isExcluded;
  }

  get isDisabledVlrCmpAnoCal(): boolean {
    return this.isTpProcRetJudicial || this.isExcluded;
  }

  get isDisabledVlrCmpAnoAnt(): boolean {
    return this.isTpProcRetJudicial || this.isExcluded;
  }

  private get isTpProcRetJudicial(): boolean {
    const tpProcRet: InfoProcRet['tpProcRet'] = this.currentFormGroup.get('tpProcRet').value;

    return tpProcRet === TpProcRetEnum.judicial;
  }

  get errorsVlrRendSusp(): ValidationErrors {
    const indApuracao: InfoValores['indApuracao'] = this.subFormGroup.get('indApuracao').value;
    const vlrRendSusp: InfoValores['vlrRendSusp'] = this.subFormGroup.get('vlrRendSusp').value;
    if (vlrRendSusp === null) return null;
    if (vlrRendSusp === 0) return { mustBeOverThanZero: true };

    if (indApuracao === IndApuracaoEnum.mensal) {
      const vrRendTrib: InfoIR['vrRendTrib'] = this.mainFormGroup.get('infoIR.vrRendTrib').value;
      const error = { isOverThanVrRendTrib: true };
      if (vrRendTrib === null) return error;

      return vlrRendSusp > vrRendTrib ? error : null;
    }
    if (indApuracao === IndApuracaoEnum.anual) {
      const vrRendTrib13: InfoIR['vrRendTrib13'] = this.mainFormGroup.get('infoIR.vrRendTrib13').value;
      const error = { isOverThanVrRendTrib13: true };
      if (vrRendTrib13 === null) return error;

      return vlrRendSusp > vrRendTrib13 ? error : null;
    }
    return null;
  }

  get showErrorMessageVlrRendSusp(): boolean {
    const errors = this.subFormGroup.get('vlrRendSusp')?.errors;
    if (!errors) return false;

    return errors.isOverThanVrRendTrib || errors.isOverThanVrRendTrib13;
  }

  get errorMessageVlrRendSusp(): string {
    if (!this.showErrorMessageVlrRendSusp) return '';

    const errors = this.subFormGroup.get('vlrRendSusp')?.errors;
    if (errors.isOverThanVrRendTrib) {
      return 'Valor não pode ser maior que "Valor do rendimento tributável mensal do Imposto de Renda"';
    }
    if (errors.isOverThanVrRendTrib13) {
      return 'Valor não pode ser maior que "Valor do rendimento tributável do Imposto de Renda referente ao 13º salário - Tributação exclusiva"';
    }
    return '';
  }

  constructor(private fb: UntypedFormBuilder, private infoValoresStateService: InfoValoresStateService, private dedSuspStateService: DedSuspStateService) { }

  ngOnInit(): void {
    this.subFormGroup = this.createSubFormGroup();

    this.initializeTableActions();
    this.transformRows();

    this.subscriptions.push(this.infoValoresStateService.state$.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.subFormGroup.get('indApuracao').valueChanges.subscribe(() => {
      this.updateValidityVlrRendSusp();
    }));
    this.subscriptions.push(this.subFormGroup.get('vlrRendSusp').valueChanges.subscribe(() => {
      this.updateValidityVlrRendSusp();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      indApuracao: [null, CustomValidators.requiredIgnoreWhiteSpace],
      vlrNRetido: [null, Validators.min(0.01)],
      vlrDepJud: [null, Validators.min(0.01)],
      vlrCmpAnoCal: [null, Validators.min(0.01)],
      vlrCmpAnoAnt: [null, Validators.min(0.01)],
      vlrRendSusp: [null],
      dedSusp: this.fb.control([]),
    });
  }

  private initializeTableActions(): void {
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

  private transformRows(): void {
    this.rows = this.formArrayValue.map(infoValores => ({
      indApuracaoLabel: FormatterUtils.convertValueToLabel(infoValores.indApuracao, IndApuracaoEnum, IndApuracaoLabelEnum),
      vlrNRetidoLabel: infoValores.vlrNRetido,
      vlrDepJudLabel: infoValores.vlrDepJud,
      vlrCmpAnoCalLabel: infoValores.vlrCmpAnoCal,
      vlrCmpAnoAntLabel: infoValores.vlrCmpAnoAnt,
      vlrRendSuspLabel: infoValores.vlrRendSusp,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.openForm(false);
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.infoValoresStateService.setData([...currentValue, this.subFormGroup.getRawValue()]);

    this.closeForm();
  }

  update(): void {
    const currentValue = [...this.formArrayValue];
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.infoValoresStateService.setData(currentValue);

    this.closeForm();
  }

  cancel(): void {
    this.closeForm();
  }

  openModal(): void {
    const subFormData: InfoValores['dedSusp'] = this.subFormGroup.get('dedSusp').value ?? [];
    this.dedSuspStateService.setData(subFormData);

    this.modalFormGroup.open();
  }

  saveModal(): void {
    const modalFormData = this.dedSuspStateService.getData();
    this.subFormGroup.get('dedSusp').setValue(modalFormData);

    this.clearModalData();
  }

  closeModal(): void {
    this.clearModalData();
  }

  private clearModalData(): void {
    this.dedSuspStateService.resetData();
  }

  handleClickEdit(infoValores: InfoValoresView): void {
    const clickIndex = this.rows.findIndex(item => item === infoValores);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(infoValores: InfoValoresView): void {
    const clickIndex = this.rows.findIndex(item => item === infoValores);

    const currentValue = [...this.formArrayValue];
    currentValue.splice(clickIndex, 1);
    this.infoValoresStateService.setData(currentValue);

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

  private updateValidityVlrRendSusp(): void {
    const currentField = this.subFormGroup.get('vlrRendSusp');
    const errors = this.errorsVlrRendSusp;

    currentField.setErrors(errors);
  }
}
