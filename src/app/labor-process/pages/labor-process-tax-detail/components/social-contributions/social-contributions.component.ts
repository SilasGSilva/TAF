import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoSelectOption, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { InfoCRContrib, TpCREnum, TpCRLabelEnum } from '../../../../../models/labor-process-taxes.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { FormatterUtils } from '../../../../utils/formatter-utils';
import { COLUMNS, OPTIONS_TP_CR } from './constants/data';

interface InfoCRContribView {
  codigoReceitaLabel: string;
  valorLabel: number;
}

@Component({
  selector: 'app-social-contributions',
  templateUrl: './social-contributions.component.html',
  styleUrls: [
    './social-contributions.component.scss',
    '../../labor-process-tax-detail.component.scss',
  ],
})
export class SocialContributionsComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;
  isSelected: boolean = false;
  isEdit: boolean = false;
  rows: InfoCRContribView[] = [];
  editIndex: number = null;
  subFormGroup: UntypedFormGroup = this.createSubFormGroup();
  actions: PoTableAction[]
  columns: PoTableColumn[] = COLUMNS;
  subscription: Subscription
  optionsTpCR: PoSelectOption[] = OPTIONS_TP_CR;

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('infoCRContrib') as UntypedFormControl;
  }

  get formArrayValue(): InfoCRContrib[] {
    return this.formArray.value ?? [];
  }

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.transformRows();
    this.subscription = this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    });
    this.initializeTableActions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeTableActions() {
    this.actions = this.excluidoERP === 'S' ? [] : [
      { action: this.clickToEditSocialContrib.bind(this), label: 'Editar' },
      { action: this.deleteSocialContrib.bind(this), label: 'Excluir' },
    ];
  }

  transformRows(): void {
    this.rows = this.formArrayValue.map(item => ({
      codigoReceitaLabel: FormatterUtils.convertValueToLabel(item.tpCR, TpCREnum, TpCRLabelEnum),
      valorLabel: item?.vrCR
    }))
  }

  create(): void {
    this.subFormGroup.reset();
    this.isSelected = true;
    this.isEdit = false;
  }

  saveSocialContrib(): void {
    const value = this.formArrayValue;
    this.formArray.setValue([...value, this.subFormGroup.getRawValue()]);
    this.isSelected = false;
  }

  updateSocialContrib(): void {
    const currentValue: InfoCRContrib[] = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);
    this.isSelected = false;
  }

  clickToEditSocialContrib(infoCRContrib: InfoCRContribView): void {
    const position = this.rows.findIndex(item => item === infoCRContrib);
    this.isEdit = true;
    this.editIndex = position;
    this.isSelected = true;
    this.subFormGroup.patchValue(this.formArray.value[position]);
  }

  deleteSocialContrib(infoCRContrib: InfoCRContribView): void {
    const position = this.rows.findIndex(item => item === infoCRContrib);
    const currentValue = this.formArrayValue;
    currentValue.splice(position, 1);
    this.formArray.setValue(currentValue);
    this.isEdit = false;
    this.isSelected = false;
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      tpCR: [null],
      vrCR: [null, [CustomValidators.requiredIgnoreWhiteSpace, Validators.min(0.01)]],
    });
  }

  cancel(): void {
    this.isSelected = false;
  }
}
