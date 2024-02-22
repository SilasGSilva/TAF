import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { DespProcJud, InfoCRIRRF } from '../../../../../../models/labor-process-taxes.model';
import { InfoCRIRRFValidations } from '../validations/infoCRIRRF-validations';

@Component({
  selector: 'app-expenses-legal-proceedings',
  templateUrl: './expenses-legal-proceedings.component.html',
  styleUrls: [
    './expenses-legal-proceedings.component.scss',
    '../../../labor-process-tax-detail.component.scss',
  ]
})
export class ExpensesLegalProceedingsComponent implements OnInit {
  @Input() currentFormGroup: UntypedFormGroup;
  @Input() excluidoERP: OptionsAnswer;

  subFormGroup: UntypedFormGroup;

  subscriptions: Subscription[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isDisabledInfoRRA(): boolean {
    const tpCR: InfoCRIRRF['tpCR'] = this.currentFormGroup.get('tpCR').value;
    return InfoCRIRRFValidations.isDisabledInfoRRA(tpCR);
  }

  get isRequiredVlrDespCustas(): boolean {
    return this.isFilledVlrDespCustasOrVlrDespAdvogados;
  }

  get isRequiredVlrDespAdvogados(): boolean {
    return this.isFilledVlrDespCustasOrVlrDespAdvogados;
  }

  get isFilledVlrDespCustasOrVlrDespAdvogados(): boolean {
    return this.isFilledVlrDespCustas || this.isFilledVlrDespAdvogados;
  }

  get isFilledVlrDespCustas(): boolean {
    const vlrDespCustas: DespProcJud['vlrDespCustas'] = this.subFormGroup.get('vlrDespCustas').value;
    return vlrDespCustas !== null && vlrDespCustas >= 0;
  }

  get isFilledVlrDespAdvogados(): boolean {
    const vlrDespAdvogados: DespProcJud['vlrDespAdvogados'] = this.subFormGroup.get('vlrDespAdvogados').value;
    return vlrDespAdvogados !== null && vlrDespAdvogados >= 0;
  }

  constructor() { }

  ngOnInit(): void {
    this.subFormGroup = this.setSubFormGroup();

    this.subscriptions.push(this.currentFormGroup.get('tpCR').valueChanges.subscribe(() => {
      this.handleChangesTpCR();
    }));

    this.subscriptions.push(this.subFormGroup.get('vlrDespCustas').valueChanges.subscribe(() => {
      this.updateValidityVlrDespCustas();
      this.updateValidityVlrDespAdvogados();
    }));
    this.subscriptions.push(this.subFormGroup.get('vlrDespAdvogados').valueChanges.subscribe(() => {
      this.updateValidityVlrDespCustas();
      this.updateValidityVlrDespAdvogados();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setSubFormGroup(): UntypedFormGroup {
    return this.currentFormGroup.get('infoRRA.despProcJud') as UntypedFormGroup;
  }

  private updateValidityVlrDespCustas(): void {
    const currentField = this.subFormGroup.get('vlrDespCustas');
    const errors = this.isRequiredVlrDespCustas && !this.isFilledVlrDespCustas
      ? { isRequiredVlrDespCustas: true }
      : null;
    
    currentField.setErrors(errors);
  }

  private updateValidityVlrDespAdvogados(): void {
    const currentField = this.subFormGroup.get('vlrDespAdvogados');
    const errors = this.isRequiredVlrDespAdvogados && !this.isFilledVlrDespAdvogados
      ? { isRequiredVlrDespAdvogados: true }
      : null;
    
    currentField.setErrors(errors);
  }

  private handleChangesTpCR(): void {
    if (this.isDisabledInfoRRA) {
      this.subFormGroup.get('vlrDespCustas').reset();
      this.subFormGroup.get('vlrDespAdvogados').reset();
    }
  }
}
