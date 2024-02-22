import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { Abono, OptionsAnswer } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { COLUMNS } from './constants/data';

@Component({
  selector: 'app-years-base-indemnity',
  templateUrl: './years-base-indemnity.component.html',
  styleUrls: [
    './years-base-indemnity.component.scss',
    '../../labor-process-detail.component.scss',
  ]
})
export class YearsBaseIndemnityComponent implements OnInit, OnDestroy {
  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});

  editIndex: number = null;
  isEdit: boolean = false;
  isSelected: boolean = false;

  excluidoERP: OptionsAnswer;

  rows: Abono[] = [];
  actions: PoTableAction[] = [];
  subscriptions: Subscription[] = [];

  columns: PoTableColumn[] = COLUMNS;

  subFormGroup: UntypedFormGroup = this.createSubFormGroup();

  get formArray(): UntypedFormControl {
    return this.currentFormGroup?.get('ideEstab.infoVlr.abono') as UntypedFormControl;
  }

  get formArrayValue(): Abono[] {
    return this.formArray.value ?? [];
  }

  get isExcludedERP(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get canCreateNewItem(): boolean {
    const MAX_ITEM_LIMIT = 9;
    const items = this.formArrayValue;
    const hasLessItemsThanLimit = items.length < MAX_ITEM_LIMIT;

    return hasLessItemsThanLimit && !this.isSelected && !this.isExcludedERP;
  }

  constructor(private fb: UntypedFormBuilder) { }

  public ngOnInit(): void {
    this.subscriptions.push(this.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
      this.excluidoERP = this.mainFormGroup.get('excluidoERP').value;
    }));

    this.subscriptions.push(this.formArray.valueChanges.subscribe(() => {
      this.transformRows();
    }));

    this.transformRows();
    this.initializeTableActions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private createSubFormGroup(): UntypedFormGroup {
    return this.fb.group({
      anoBase: [null, CustomValidators.requiredIgnoreWhiteSpace],
    });
  }

  private transformRows(): void {
    const valueFormArray = this.formArrayValue;

    this.rows = valueFormArray.map(item => ({ anoBase: item.anoBase }))
  }

  private initializeTableActions(): void {
    if (this.isExcludedERP) {
      return;
    }

    this.actions = [
      {
        label: 'Editar',
        action: this.handleClickEdit.bind(this),
      },
      {
        label: 'Excluir',
        action: this.handleClickDelete.bind(this),
      },
    ];
  }

  private handleClickEdit(item: Abono): void {
    const clickIndex = this.rows.findIndex(row => row === item);

    this.isEdit = true;
    this.isSelected = true;
    this.editIndex = clickIndex;

    this.subFormGroup.patchValue(this.formArrayValue[clickIndex]);
  }

  private handleClickDelete(item: Abono): void {
    const clickIndex = this.rows.findIndex(row => row === item);
    const currentValue = this.formArrayValue;
    currentValue.splice(clickIndex, 1);
    this.formArray.setValue(currentValue);

    this.isEdit = false;
    this.isSelected = false;
  }

  public save(): void {
    const currentValue = this.formArrayValue;
    this.formArray.setValue([...currentValue, this.subFormGroup.getRawValue()]);

    this.isSelected = false;
  }

  public update(): void {
    const currentValue = this.formArrayValue;
    currentValue.splice(this.editIndex, 1, this.subFormGroup.getRawValue());
    this.formArray.setValue(currentValue);

    this.isSelected = false;
  }

  public create(): void {
    this.subFormGroup.reset();

    this.isSelected = true;
    this.isEdit = false;
  }

  public cancel(): void {
    this.isSelected = false;
  }
}
