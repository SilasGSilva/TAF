import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { DedSusp, IndTpDeducaoEnum, IndTpDeducaoLabelEnum, InfoValores } from '../../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../../../../utils/formatter-utils';
import { DedSuspStateService } from '../service/ded-susp-state.service';
import { COLUMNS, OPTIONS_IND_TP_DEDUCAO } from './constants/data';

export interface DedSuspView {
  indTpDeducaoLabel: string;
  vlrDedSuspLabel: DedSusp['vlrDedSusp'];
}

@Component({
  selector: 'app-deductions-suspended-eligibility',
  templateUrl: './deductions-suspended-eligibility.component.html',
  styleUrls: [
    './deductions-suspended-eligibility.component.scss',
    '../../../../../labor-process-tax-detail.component.scss',
  ]
})
export class DeductionsSuspendedEligibilityComponent implements OnInit, OnDestroy {
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
  rows: DedSuspView[] = [];

  optionsIndTpDeducao: PoSelectOption[] = OPTIONS_IND_TP_DEDUCAO;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get formArrayValue(): DedSusp[] {
    return this.dedSuspStateService.getData() ?? [];
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 25;
    const hasLessItemsThanLimit = this.formArrayValue.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcluded;
  }

  get isDisabledVlrDedSusp(): boolean {
    return !this.isFilledVlrRendSusp || this.isExcluded;
  }

  get isFilledVlrRendSusp(): boolean {
    const vlrRendSusp: InfoValores['vlrRendSusp'] = this.currentFormGroup.get('vlrRendSusp').value;

    return vlrRendSusp !== null && vlrRendSusp > 0;
  }

  get haveDefaultValueVlrDedSusp(): boolean {
    const indTpDeducao: DedSusp['indTpDeducao'] = this.subFormGroup.get('indTpDeducao').value;
    const benefPen: DedSusp['benefPen'] = this.subFormGroup.get('benefPen').value ?? [];

    const defaultValueOptions = [IndTpDeducaoEnum.penAlim, IndTpDeducaoEnum.dep];
    return defaultValueOptions.includes(indTpDeducao) && benefPen.length > 0;
  }

  get errorMessageVlrDedSusp(): string {
    const errors = this.subFormGroup.get('vlrDedSusp')?.errors;
    if (!errors) return '';

    if (errors.isWrongDefaultValueVlrDedSusp) {
      const expectedValue = this.makeDefaultValueVlrDedSusp().toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      return `O valor deve ser "${expectedValue}"`;
    }
    return '';
  }

  constructor(private fb: UntypedFormBuilder, private dedSuspStateService: DedSuspStateService) { }

  ngOnInit(): void {
    this.subFormGroup = this.createSubFormGroup();

    this.initializeTableActions();
    this.transformRows();

    this.subscriptions.push(this.dedSuspStateService.state$.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.subFormGroup.get('benefPen').valueChanges.subscribe(() => {
      this.updateValueVlrDedSusp();
    }));
    this.subscriptions.push(this.subFormGroup.get('vlrDedSusp').valueChanges.subscribe(() => {
      this.updateValidityVlrDedSusp();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      indTpDeducao: [null, CustomValidators.requiredIgnoreWhiteSpace],
      vlrDedSusp: [null, Validators.min(0.01)],
      benefPen: this.fb.control([]),
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
    this.rows = this.formArrayValue.map(dedSusp => ({
      indTpDeducaoLabel: FormatterUtils.convertValueToLabel(dedSusp.indTpDeducao, IndTpDeducaoEnum, IndTpDeducaoLabelEnum),
      vlrDedSuspLabel: dedSusp.vlrDedSusp,
    }));
  }

  create(): void {
    this.subFormGroup.reset();

    this.openForm(false);
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.dedSuspStateService.setData([...currentValue, this.subFormGroup.value]);

    this.closeForm();
  }

  update(): void {
    const currentValue = [...this.formArrayValue];
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.dedSuspStateService.setData(currentValue);

    this.closeForm();
  }

  cancel(): void {
    this.closeForm();
  }

  handleClickEdit(dedSusp: DedSuspView): void {
    const clickIndex = this.rows.findIndex(item => item === dedSusp);

    this.editIndex = clickIndex;
    this.openForm(true);

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(dedSusp: DedSuspView): void {
    const clickIndex = this.rows.findIndex(item => item === dedSusp);

    const currentValue = [...this.formArrayValue];
    currentValue.splice(clickIndex, 1);
    this.dedSuspStateService.setData(currentValue);

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

  private updateValueVlrDedSusp(): void {
    if (!this.haveDefaultValueVlrDedSusp) return;

    const newValue = this.makeDefaultValueVlrDedSusp();
    this.subFormGroup.get('vlrDedSusp').setValue(newValue);
  }

  private updateValidityVlrDedSusp(): void {
    const vlrDedSusp = this.subFormGroup.get('vlrDedSusp');
    const errors = this.haveDefaultValueVlrDedSusp && vlrDedSusp.value !== this.makeDefaultValueVlrDedSusp()
      ? { isWrongDefaultValueVlrDedSusp: true }
      : null;

    vlrDedSusp.setErrors(errors);
  }

  private makeDefaultValueVlrDedSusp(): number {
    const benefPen: DedSusp['benefPen'] = this.subFormGroup.get('benefPen').value ?? [];

    return benefPen.reduce((sum, benefPen) => sum += benefPen.vlrDepenSusp, 0);
  }
}
