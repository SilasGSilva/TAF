import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { InfoCRIRRF } from '../../../../../../models/labor-process-taxes.model';
import { InfoCRIRRFValidations } from '../validations/infoCRIRRF-validations';

@Component({
  selector: 'app-additional-information-rra',
  templateUrl: './additional-information-rra.component.html',
  styleUrls: [
    './additional-information-rra.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class AdditionalInformationRraComponent implements OnInit, OnDestroy {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: OptionsAnswer;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isRequiredInfoRRA(): boolean {
    const tpCR: InfoCRIRRF['tpCR'] = this.currentFormGroup.get('tpCR').value;
    return !InfoCRIRRFValidations.isDisabledInfoRRA(tpCR);
  }

  constructor() { }

  ngOnInit(): void {
    this.subFormGroup = this.setSubFormGroup();

    this.subscriptions.push(this.currentFormGroup.get('tpCR').valueChanges.subscribe(() => {
      this.handleChangesTpCR();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setSubFormGroup(): UntypedFormGroup {
    return this.currentFormGroup.get('infoRRA') as UntypedFormGroup;
  }

  private handleChangesTpCR(): void {
    if (!this.isRequiredInfoRRA) {
      this.subFormGroup.get('descRRA').reset();
      this.subFormGroup.get('qtdMesesRRA').reset();
    }
  }
}
