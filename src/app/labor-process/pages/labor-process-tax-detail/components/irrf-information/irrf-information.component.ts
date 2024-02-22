import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoAccordionItemComponent, PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InfoCRIRRF, TpCREnum, TpCRInfoCRIRRFEnum, TpCRLabelEnum, TpCRLabelInfoCRIRRFEnum } from '../../../../../models/labor-process-taxes.model';
import { ESocialVersionEnum, OptionsAnswer } from '../../../../../models/labor-process.model';
import { FormatterUtils } from '../../../../utils/formatter-utils'
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { InfoCRIRRFValidations } from './validations/infoCRIRRF-validations';
import { COLUMNS, OPTIONS_TP_CR, OPTIONS_TP_CR_V1 } from './constants/data';

interface InfoCRIRRFView {
  tpCRLabel: string;
  vrCRLabel: number;
}

@Component({
  selector: 'app-irrf-information',
  templateUrl: './irrf-information.component.html',
  styleUrls: [
    './irrf-information.component.scss',
    '../../labor-process-tax-detail.component.scss',
  ],
})
export class IrrfInformationComponent implements OnInit, OnDestroy {
  @ViewChild('withholdingAndJudicialDepositsItem') accordionItemInfoProcRet: PoAccordionItemComponent;
  @ViewChild('lawyersIdentificationItem') accordionItemLawyersIdentification: PoAccordionItemComponent;

  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  subscriptions: Subscription[] = [];

  version: ESocialVersionEnum;

  isSelected: boolean = false;
  isEdit: boolean = false;
  editIndex: number = null;

  actions: PoTableAction[];
  columns: PoTableColumn[] = COLUMNS;
  rows: InfoCRIRRFView[] = [];

  optionsTpCR: PoSelectOption[];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoCRIRRF') as UntypedFormControl;
  }

  get formArrayValue(): InfoCRIRRF[] {
    return this.formArray.value ?? [];
  }

  get isDisabledLawyersIdentification(): boolean {
    const tpCR: InfoCRIRRF['tpCR'] = this.subFormGroup.get('tpCR').value;
    return InfoCRIRRFValidations.isDisabledInfoRRA(tpCR);
  }

  get isDisabledWithholdingAndJudicialDeposits(): boolean {
    const tpCR: InfoCRIRRF['tpCR'] = this.subFormGroup.get('tpCR').value;

    return InfoCRIRRFValidations.isDisabledInfoProcRet(tpCR);
  }

  constructor(private fb: UntypedFormBuilder, private laborProcessDataStateService: LaborProcessDataStateService) { }

  ngOnInit(): void {
    this.version = this.laborProcessDataStateService.getVersion();

    this.optionsTpCR = this.isV1 ? OPTIONS_TP_CR_V1 : OPTIONS_TP_CR;
    
    this.transformRows();
    this.initializeTableActions();

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));

    this.subscriptions.push(this.subFormGroup.get('tpCR').valueChanges.subscribe(() => {
      this.handleChangesTpCR();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpCR: [null],
      vrCR: [null, this.validateVrCR.bind(this)],
      infoIR: this.fb.group({
        vrRendTrib: [null, Validators.min(0.00)],
        vrRendTrib13: [null, Validators.min(0.00)],
        vrRendMoleGrave: [null, Validators.min(0.00)],
        vrRendIsen65: [null, Validators.min(0.00)],
        vrJurosMora: [null, Validators.min(0.00)],
        vrRendIsenNTrib: [null, Validators.min(0.00)],
        descIsenNTrib: [null],
        vrPrevOficial: [null, Validators.min(0.00)],
      }),
      infoRRA: this.fb.group({
        descRRA: [null],
        qtdMesesRRA: [null],
        despProcJud: this.fb.group({
          vlrDespCustas: [null],
          vlrDespAdvogados: [null],
        }),
        ideAdv: this.fb.control([]),
      }),
      dedDepen: this.fb.control([]),
      penAlim: this.fb.control([]),
      infoProcRet: this.fb.control([]),
    });
  }

  transformRows(): void {
    const valueFormArray = this.formArrayValue;
    this.rows = valueFormArray.map(infoCRIRRF => ({
      tpCRLabel: FormatterUtils.convertValueToLabel(infoCRIRRF.tpCR, 
                  this.isV1 ? TpCREnum : TpCRInfoCRIRRFEnum,
                  this.isV1 ? TpCRLabelEnum : TpCRLabelInfoCRIRRFEnum),
      vrCRLabel: infoCRIRRF.vrCR,
    }))
  }

  initializeTableActions(): void {
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

  create(): void {
    this.subFormGroup.reset();

    this.isSelected = true;
    this.isEdit = false;
  }

  save(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.isSelected = false;
    this.editIndex = null;
  }

  update(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.isSelected = false;
    this.editIndex = null;
  }

  cancel(): void {
    this.isSelected = false;
    this.editIndex = null;
  }

  handleClickEdit(infoCRIRRF: InfoCRIRRFView): void {
    const clickIndex = this.rows.findIndex(item => item === infoCRIRRF);

    this.isEdit = true;
    this.editIndex = clickIndex;
    this.isSelected = true;

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  handleClickDelete(infoCRIRRF: InfoCRIRRFView): void {
    const currentValue = this.formArrayValue;
    const clickIndex = this.rows.findIndex(item => item === infoCRIRRF);
    currentValue.splice(clickIndex, 1);

    this.formArray.setValue(currentValue);

    this.isEdit = false;
    this.isSelected = false;
  }

  private validateVrCR(control: AbstractControl): ValidationErrors {
    if (this.isV1) return Validators.min(0.01)(control);
    return Validators.min(0.00)(control);
  }

  private handleChangesTpCR(): void {
    if (this.isDisabledLawyersIdentification) {
      this.accordionItemLawyersIdentification?.collapse();
    }

    if (this.isDisabledWithholdingAndJudicialDeposits) {
      this.accordionItemInfoProcRet.collapse();
    }
  }
}
