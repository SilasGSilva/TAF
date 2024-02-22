import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { TpCREnum } from '../../../../../../models/labor-process-taxes.model';

@Component({
  selector: 'app-income-tax-information',
  templateUrl: './income-tax-information.component.html',
  styleUrls: [
    './income-tax-information.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class IncomeTaxInformationComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: string;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isDisabledVrRendTrib13(): boolean {
    const tpCR: TpCREnum = this.currentFormGroup.get('tpCR').value;

    return tpCR === TpCREnum.IRRFRRA || this.isExcluded;
  }

  get isDisabledDescIsenNTrib(): boolean {
    const vrRendIsenNTrib: number = this.subFormGroup.get('vrRendIsenNTrib').value;

    return vrRendIsenNTrib <= 0 || this.isExcluded;
  }

  constructor() { }

  ngOnInit(): void {
    this.subFormGroup = this.setSubFormGroup();

    this.subscriptions.push(this.currentFormGroup.get('tpCR').valueChanges.subscribe(() => {
      this.handleChangesTpCR();
    }));

    this.subscriptions.push(this.subFormGroup.get('vrRendIsenNTrib').valueChanges.subscribe(() => {
      this.handleChangesVrRendIsenNTrib();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setSubFormGroup(): UntypedFormGroup {
    return this.currentFormGroup.get('infoIR') as UntypedFormGroup;
  }
  
  private handleChangesTpCR(): void {
    if (!this.isDisabledVrRendTrib13) {
      return;
    }

    this.subFormGroup.get('vrRendTrib13').reset();
  }

  private handleChangesVrRendIsenNTrib(): void {
    if (!this.isDisabledDescIsenNTrib) {
      return;
    }

    this.subFormGroup.get('descIsenNTrib').reset();
  }
}
