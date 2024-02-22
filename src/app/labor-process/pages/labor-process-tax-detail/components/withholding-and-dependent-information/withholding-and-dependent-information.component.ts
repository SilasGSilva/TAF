import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OptionsAnswer } from '../../../../../models/labor-process.model';

@Component({
  selector: 'app-withholding-and-dependent-information',
  templateUrl: './withholding-and-dependent-information.component.html',
  styleUrls: [
    './withholding-and-dependent-information.component.scss',
    '../../labor-process-tax-detail.component.scss',
  ]
})
export class WithholdingAndDependentInformationComponent implements OnInit {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: OptionsAnswer;

  subFormGroup: UntypedFormGroup;

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  constructor() { }

  ngOnInit(): void {
    this.subFormGroup = this.setSubFormGroup();

    if (this.isExcluded) {
      this.subFormGroup.disable();
    }
  }

  setSubFormGroup(): UntypedFormGroup {
    return this.currentFormGroup.get('infoIRComplem') as UntypedFormGroup;
  }
}
