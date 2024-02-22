import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { PoModalComponent } from '@po-ui/ng-components';
import { OptionsAnswer, TypeContract, InfoVlr } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';

@Component({
  selector: 'app-employment-contract-modal',
  templateUrl: './employment-contract-modal.component.html',
  styleUrls: ['./employment-contract-modal.component.scss'],
})
export class EmploymentContractModalComponent {
  @ViewChild(PoModalComponent) poModal?: PoModalComponent;

  @Input() mainFormGroup = new UntypedFormGroup({});
  @Input() currentFormGroup = new UntypedFormGroup({});
  @Input() isEditMode: boolean;

  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();

  get isDisabledEmploymentRelationship(): boolean {
    return this.currentFormGroup.get('indContr').value !== OptionsAnswer.No ||
      this.currentFormGroup.get('tpContr').value === TypeContract.TrabSemVinculo
  }

  constructor() { }

  openModal(): void {
    this.poModal.open();
    this.initializeVrBaseIndenFGTS();
  }

  closeModal(): void {
    this.poModal.close();
  }

  initializeVrBaseIndenFGTS(): void {
    const vrBaseIndenFGTSField = this.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS');
    const vrBaseIndenFGTS: InfoVlr['vrBaseIndenFGTS'] = vrBaseIndenFGTSField.value;
    const pagDiretoResc: InfoVlr['pagDiretoResc'] = this.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc').value;
    const isVrBaseIndenFGTSInInitialState = CustomValidators.isValueEmpty(pagDiretoResc) && vrBaseIndenFGTS === 0.0;

    if (!isVrBaseIndenFGTSInInitialState) {
      return;
    }
    vrBaseIndenFGTSField.setValue(null);
  }
}
