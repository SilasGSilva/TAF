import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { CalcTrib } from '../../../../../models/labor-process-taxes.model';
import { ESocialVersionEnum, OptionsAnswer } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { COLUMNS_V1, COLUMNS_NOT_V1 } from './constants/data';

interface CalcTribView {
  periodoReferenciaLabel: string;
  baseContribMensalLabel: number;
  baseContribMensal13Label: number;
}

interface CalcTribViewV1 extends CalcTribView {
  rendimentoTribIRRFLabel: number;
  rendimentoTribIRRF13Label: number;
}

@Component({
  selector: 'app-calculation-period-and-basis',
  templateUrl: './calculation-period-and-basis.component.html',
  styleUrls: [
    './calculation-period-and-basis.component.scss',
    '../../labor-process-tax-detail.component.scss',
  ],
})
export class CalculationPeriodAndBasisComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  version: ESocialVersionEnum;

  isSelected: boolean = false;
  isEdit: boolean = false;
  rows: CalcTribView[] | CalcTribViewV1[] = [];
  editIndex: number | null = null;
  subscriptions: Subscription[] = [];
  readonly subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('calcTrib') as UntypedFormControl;
  }

  get formArrayValue(): CalcTrib[] {
    return this.formArray.value ?? [];
  }

  actions: PoTableAction[];
  columns: PoTableColumn[];

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  constructor(private fb: UntypedFormBuilder, private laborProcessDataStateService: LaborProcessDataStateService) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.initializeColumns();
    this.transformRows();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
      this.subFormGroup.reset();
    }));

    if (this.isExcluded) {
      this.subFormGroup.disable();
    }

    this.initializeTableActions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  get errorMessagePerRef(): string {
    if (this.subFormGroup.controls['perRef'].errors?.outOfRange) {
      return 'O período deve ser maior ou igual a "2008-12"';
    }
    if (this.subFormGroup.controls['perRef'].errors?.invalidPerRef) {
      return 'Período não cadastrado para o trabalhador no evento S-2500';
    }
  }

  initializeTableActions(): void {
    const viewOnlyActions = [
      {
        action: this.clickToEditCalcTribPeriod.bind(this),
        label: 'Ver',
      },
    ];
    const viewAndEditActions = [
      {
        action: this.clickToEditCalcTribPeriod.bind(this),
        label: 'Editar',
      },
      {
        action: this.deleteCalcTribPeriod.bind(this),
        label: 'Excluir',
      },
    ];

    this.actions = this.isExcluded ? viewOnlyActions : viewAndEditActions;
  }

  private initializeColumns(): void {
    this.columns = this.isV1 ? COLUMNS_V1 : COLUMNS_NOT_V1;
  }

  transformRows(): void {
    const transformRow = this.isV1 ? this.transformRowInV1.bind(this) : this.transformRowNotInV1.bind(this);

    this.rows = this.formArrayValue.map(transformRow);
  }

  private transformRowInV1(calcTrib: CalcTrib): CalcTribViewV1 {
    return {
      periodoReferenciaLabel: calcTrib?.perRef,
      baseContribMensalLabel: calcTrib?.vrBcCpMensal,
      baseContribMensal13Label: calcTrib?.vrBcCp13,
      rendimentoTribIRRFLabel: calcTrib?.vrRendIRRF,
      rendimentoTribIRRF13Label: calcTrib?.vrRendIRRF13,
    };
  }

  private transformRowNotInV1(calcTrib: CalcTrib): CalcTribView {
    return {
      periodoReferenciaLabel: calcTrib?.perRef,
      baseContribMensalLabel: calcTrib?.vrBcCpMensal,
      baseContribMensal13Label: calcTrib?.vrBcCp13,
    };
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  saveCalcTribPeriod(): void {
    const value = this.formArrayValue;
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateCalcTribPeriod(): void {
    const currentValue: CalcTrib[] = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  clickToEditCalcTribPeriod(calcTribPeriod: CalcTribView | CalcTribViewV1): void {
    const position = this.rows.findIndex(item => item === calcTribPeriod);

    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;

    this.subFormGroup.patchValue(this.formArray.value[position]);
  }

  deleteCalcTribPeriod(calcTribPeriod: CalcTribView | CalcTribViewV1): void {
    const position = this.rows.findIndex(item => item === calcTribPeriod);

    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);

    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      perRef: [[null], [CustomValidators.validPerRef([])]],
      vrBcCpMensal: [null, [CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00)]],
      vrBcCp13: [null, [CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.00)]],
      vrRendIRRF: [null, [CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace), Validators.min(0.00)]],
      vrRendIRRF13: [null, [CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.requiredIgnoreWhiteSpace), Validators.min(0.00)]],
      infoCRContrib: this.fb.control([]),
    });
  }

  cancel(): void {
    this.isSelected = false;
  }

  resetValidatorsAndSubFormGroup(workerValidPeriods: string[]): void {
    this.subFormGroup.get('perRef').setValidators([CustomValidators.validPerRef(workerValidPeriods)]);
    this.subFormGroup.get('perRef').updateValueAndValidity();
    this.subFormGroup.reset();
  }
}
