import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InfoProcRet, TpCREnum, TpProcRetEnum, TpProcRetLabelEnum } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../../utils/formatter-utils';
import { ModalFormGroupComponent } from '../../../../../components/modal-form-group/modal-form-group.component';
import { InfoCRIRRFValidations } from '../validations/infoCRIRRF-validations';
import { InfoValoresStateService } from './service/info-valores-state.service';
import { COLUMNS, OPTIONS_TP_PROC_RET } from './constants/data';

export interface InfoProcRetView {
  tpProcRetLabel: string;
  nrProcRetLabel: InfoProcRet['nrProcRet'];
  codSuspLabel: InfoProcRet['codSusp'];
}

@Component({
  selector: 'app-withholding-and-judicial-deposits',
  templateUrl: './withholding-and-judicial-deposits.component.html',
  styleUrls: [
    './withholding-and-judicial-deposits.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ],
  providers: [InfoValoresStateService],
})
export class WithholdingAndJudicialDepositsComponent implements OnInit, OnDestroy {
  @ViewChild(ModalFormGroupComponent) modalFormGroup: ModalFormGroupComponent;

  @Input() mainModalFormGroup: UntypedFormGroup;
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: InfoProcRetView[] = [];

  optionsTpProcRet: PoSelectOption[] = OPTIONS_TP_PROC_RET;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoProcRet') as UntypedFormControl;
  }

  get formArrayValue(): InfoProcRet[] {
    return this.formArray.value ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 50;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get valueLabelInfoValores(): string {
    const infoValores: InfoProcRet['infoValores'] = this.subFormGroup.get('infoValores').value;
    if (!infoValores || infoValores.length === 0) {
      return 'Nenhum incluído';
    }
    if (infoValores.length === 1) {
      return '1 incluído';
    }
    return `${infoValores.length} incluídos`;
  }

  get isDisabledSaveInfoValores(): boolean {
    return this.subFormGroup.get('infoValores').invalid || this.isExcluded;
  }

  get errorsNrProcRet(): ValidationErrors {
    const nrProcRet: InfoProcRet['nrProcRet'] = this.subFormGroup.get('nrProcRet').value;

    if (!nrProcRet) return { isRequiredNrProcRet: true };
    if (!this.isValidNrProcRet) return { invalidLengthNrProcRet: true };

    return null;
  }

  get isValidNrProcRet(): boolean {
    const nrProcRet: InfoProcRet['nrProcRet'] = this.subFormGroup.get('nrProcRet').value;
    const validLengths = [17, 20, 21];
    return validLengths.includes(nrProcRet?.length);
  }

  constructor(private fb: UntypedFormBuilder, private infoValoresStateService: InfoValoresStateService) { }

  ngOnInit(): void {
    this.subFormGroup = this.createSubFormGroup();

    this.initializeTableActions();
    this.transformRows();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.currentFormGroup.get('tpCR').valueChanges.subscribe(() => {
      this.handleChangesTpCR();
    }));

    this.subscriptions.push(this.subFormGroup.get('nrProcRet').valueChanges.subscribe(() => {
      this.updateValidityNrProcRet();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpProcRet: [null, CustomValidators.requiredIgnoreWhiteSpace],
      nrProcRet: [null],
      codSusp: [null],
      infoValores: this.fb.control([]),
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
    this.rows = this.formArrayValue.map(infoProcRet => ({
      tpProcRetLabel: FormatterUtils.convertValueToLabel(infoProcRet.tpProcRet, TpProcRetEnum, TpProcRetLabelEnum),
      nrProcRetLabel: infoProcRet.nrProcRet,
      codSuspLabel: infoProcRet.codSusp,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.openForm(false);
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.closeForm();
  }

  update(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.closeForm();
  }

  cancel(): void {
    this.closeForm();
  }

  openModal(): void {
    const subFormData: InfoProcRet['infoValores'] = this.subFormGroup.get('infoValores').value ?? [];
    this.infoValoresStateService.setData(subFormData);

    this.modalFormGroup.open();
  }

  saveModal(): void {
    const modalFormData = this.infoValoresStateService.getData();
    this.subFormGroup.get('infoValores').setValue(modalFormData);

    this.clearModalData();
  }

  closeModal(): void {
    this.clearModalData();
  }

  private clearModalData(): void {
    this.infoValoresStateService.resetData();
  }

  handleClickEdit(infoProcRet: InfoProcRetView): void {
    const clickIndex = this.rows.findIndex(item => item === infoProcRet);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(infoProcRet: InfoProcRetView): void {
    const clickIndex = this.rows.findIndex(item => item === infoProcRet);

    const currentValue = this.formArrayValue;
    currentValue.splice(clickIndex, 1);
    this.formArray.setValue(currentValue);

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

  private handleChangesTpCR(): void {
    const tpCR: TpCREnum = this.currentFormGroup.get('tpCR').value;
    if (!InfoCRIRRFValidations.isDisabledInfoProcRet(tpCR)) {
      return;
    }

    this.closeForm();
    this.formArray.reset();
  }

  private updateValidityNrProcRet(): void {
    const currentField = this.subFormGroup.get('nrProcRet');
    const errors = this.errorsNrProcRet;

    currentField.setErrors(errors);
  }
}
