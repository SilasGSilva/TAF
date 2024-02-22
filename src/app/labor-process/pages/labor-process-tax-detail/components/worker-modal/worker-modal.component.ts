import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { lastValueFrom, Subscription } from 'rxjs';
import { PoModalAction, PoModalComponent, PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { ESocialVersionEnum } from '../../../../../models/labor-process.model';
import { IdeTrab } from '../../../../../models/labor-process-taxes.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessService } from '../../../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { IrrfInformationComponent } from '../irrf-information/irrf-information.component';
import { CalculationPeriodAndBasisComponent } from '../calculation-period-and-basis/calculation-period-and-basis.component';

@Component({
  selector: 'app-worker-modal',
  templateUrl: './worker-modal.component.html',
  styleUrls: ['./worker-modal.component.scss'],
})
export class WorkerModalComponent implements OnInit {
  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  @ViewChild(CalculationPeriodAndBasisComponent) calculationPeriodForm: CalculationPeriodAndBasisComponent
  @ViewChild(IrrfInformationComponent) irrfInformationForm: IrrfInformationComponent

  @Input() excluidoERP: string;
  @Input() nrProcTrab: string;
  @Input() perApurPgto: string;
  @Output() saveClicked = new EventEmitter<UntypedFormGroup>();

  version: ESocialVersionEnum;
  formGroup: UntypedFormGroup = this.fb.group({
    cpfTrab: [null],
    nmTrab: [null],
    dtNascto: [null],
    calcTrib: this.fb.control([], CustomValidators.validateFieldInSomeVersion(() => this.isV1, CustomValidators.hasCalculationPeriod)),
    infoCRIRRF: this.fb.control([]),
    infoIRComplem: this.fb.group({
      dtLaudo: [null],
      infoDep: this.fb.control([]),
    }),
  });
  workerName: string = '';
  modalPrimaryAction: PoModalAction
  modalSecondaryAction: PoModalAction
  subscription: Subscription
  workerValidPeriods: string[] = [];
  isLoading = false;

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private laborProcessService: LaborProcessService,
    private laborProcessDataStateService: LaborProcessDataStateService,
    private notificationService: PoNotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.version = this.laborProcessDataStateService.getVersion();

    this.initializeModalActions();
    this.subscription = this.formGroup.controls['calcTrib'].valueChanges.subscribe(() => {
      this.initializeModalActions();
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initializeModalActions(): void {
    this.modalPrimaryAction = {
      action: this.onSave.bind(this),
      label: "Salvar",
      disabled: this.formGroup.controls['calcTrib'].invalid || this.excluidoERP === 'S',
    }

    this.modalSecondaryAction = {
      action: this.onClose.bind(this),
      label: "Fechar"
    }
  }

  async openModal(ideTrab: IdeTrab, workerName: string): Promise<void> {
    this.formGroup.patchValue(ideTrab);
    this.workerName = workerName;
    this.irrfInformationForm.initializeTableActions();
    this.calculationPeriodForm.initializeTableActions();
    await this.getWorkerValidPeriods();
    this.calculationPeriodForm.resetValidatorsAndSubFormGroup(this.workerValidPeriods);
    this.poModal.open();
  }

  onClose(): void {
    this.calculationPeriodForm.cancel();
    this.irrfInformationForm.cancel();
    this.formGroup.reset();

    this.poModal.close();
  }

  onSave() {
    this.saveClicked.emit(this.formGroup)
  }

  private async getWorkerValidPeriods() {
    this.isLoading = true;
    const id = this.makeLaborProcessId();

    try {
      const result = await lastValueFrom(this.laborProcessService.getSimple(id));
      let idePeriodoList = [];
      result?.items[0]?.ideTrab?.infoContr?.map(i => {
        idePeriodoList = idePeriodoList.concat(i.ideEstab?.infoVlr?.idePeriodo)
      });
      this.workerValidPeriods = idePeriodoList.map(p => p?.perRef);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        this.notificationService.error({
          message: (e.error?.Message) ? e.error?.Message : 'Ocorreu um erro, tente novamente!',
          orientation: PoToasterOrientation.Top,
        });
      }
    }
    finally {
      this.isLoading = false;
    }
  }

  private makeLaborProcessId(): string {
    const cpf: IdeTrab['cpfTrab'] = this.formGroup.get('cpfTrab').value;
    const companyId = this.laborProcessService.companyId;
    const branchId = this.laborProcessService.branchId;

    return `${companyId};${branchId};${this.nrProcTrab};${cpf}`;
  }
}
