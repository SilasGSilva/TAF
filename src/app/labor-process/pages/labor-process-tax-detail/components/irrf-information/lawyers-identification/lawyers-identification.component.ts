import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { IdeAdv, InfoCRIRRF, TpInscEnum, TpInscLabelEnum } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../validators/custom-validators';
import { FormUtils } from '../../../../../validators/form-utils';
import { FormatterUtils } from '../../../../../utils/formatter-utils';
import { COLUMNS, OPTIONS_TP_INSC } from './constants/data';
import { InfoCRIRRFValidations } from '../validations/infoCRIRRF-validations';

export interface IdeAdvView {
  tpInscLabel: string;
  nrInscLabel: IdeAdv['nrInsc'];
  vlrAdvLabel: IdeAdv['vlrAdv'];
}

@Component({
  selector: 'app-lawyers-identification',
  templateUrl: './lawyers-identification.component.html',
  styleUrls: [
    './lawyers-identification.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class LawyersIdentificationComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: IdeAdvView[] = [];

  optionsTpInsc: PoSelectOption[] = OPTIONS_TP_INSC;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoRRA.ideAdv') as UntypedFormControl;
  }

  get formArrayValue(): IdeAdv[] {
    return this.formArray.value ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 99;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get isDisabledInfoRRA(): boolean {
    const tpCR: InfoCRIRRF['tpCR'] = this.currentFormGroup.get('tpCR').value;
    return InfoCRIRRFValidations.isDisabledInfoRRA(tpCR);
  }

  get maskNrInsc(): string {
    return this.isTpInscCpf ? '999.999.999-99' : '99.999.999/9999-99';
  }

  get isTpInscCpf(): boolean {
    const tpInsc: IdeAdv['tpInsc'] = this.subFormGroup.get('tpInsc').value;

    return this.isCpf(tpInsc);
  }

  get isDisabledNrInsc(): boolean {
    return !this.subFormGroup.get('tpInsc').value || this.isExcluded;
  }

  constructor(private fb: UntypedFormBuilder) { }

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
    this.subscriptions.push(this.subFormGroup.get('tpInsc').valueChanges.subscribe(() => {
      this.updateValidityTpInsc();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpInsc: [null, CustomValidators.requiredIgnoreWhiteSpace],
      nrInsc: [null],
      vlrAdv: [null],
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
    this.rows = this.formArrayValue.map(ideAdv => ({
      tpInscLabel: FormatterUtils.convertValueToLabel(ideAdv.tpInsc, TpInscEnum, TpInscLabelEnum),
      nrInscLabel: FormatterUtils.formatCpfOrCnpj(ideAdv.nrInsc, this.isCpf(ideAdv.tpInsc)),
      vlrAdvLabel: ideAdv.vlrAdv,
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

  handleClickEdit(ideAdv: IdeAdvView): void {
    const clickIndex = this.rows.findIndex(item => item === ideAdv);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(ideAdv: IdeAdvView): void {
    const clickIndex = this.rows.findIndex(item => item === ideAdv);

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
    if (this.isDisabledInfoRRA) {
      this.formArray.reset();
    }
  }

  private updateValidityTpInsc(): void {
    FormUtils.changeValidityControlCpfOrCnpj(this.isTpInscCpf, this.subFormGroup, 'nrInsc');
  }

  private isCpf(tpInsc: IdeAdv['tpInsc']): boolean {
    return tpInsc === TpInscEnum.cpf;
  }
}
