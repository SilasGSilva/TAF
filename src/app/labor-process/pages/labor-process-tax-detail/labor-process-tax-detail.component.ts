import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, lastValueFrom, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoBreadcrumb, PoNotificationService, PoTableAction, PoTableColumn, PoToasterOrientation } from '@po-ui/ng-components';
import { ESocialVersionEnum, OptionsAnswer } from '../../../models/labor-process.model';
import { ProcessTax, ProcessWorker, IdeTrab, IdeProc } from '../../../models/labor-process-taxes.model';
import { LaborProcessTaxInfoService } from '../../service/labor-process-tax-info.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { CustomValidators } from '../../validators/custom-validators';
import { OptionalValuesFormatterUtils } from '../../utils/optional-values-formatter-utils';
import { WorkerModalComponent } from './components/worker-modal/worker-modal.component';
import { PayloadUtils } from './utils/payload-utils';
import { COLUMNS, COLUMNS_V1 } from './constants/data';

@Component({
  selector: 'app-labor-process-tax-detail',
  templateUrl: './labor-process-tax-detail.component.html',
  styleUrls: ['./labor-process-tax-detail.component.scss'],
})
export class LaborProcessTaxDetailComponent implements OnInit, OnDestroy {
  @ViewChild(WorkerModalComponent) workerModal?: WorkerModalComponent;

  version: ESocialVersionEnum;
  excluidoERP: OptionsAnswer = OptionsAnswer.No;
  isLoading = false;
  isEditSubject = new BehaviorSubject(false);
  isEdit: boolean = false;
  taxId = null;
  isFormValid = false;
  id: string = '';
  resultWorkers: any[] = [];

  title$ = combineLatest([this.isEditSubject]).pipe(
    map(([isEdit]) => this.getAddOrUpdateTitle(isEdit))
  );

  breadcrumb$: PoBreadcrumb = {
    items: [
      {
        label: 'Início',
        link: '/labor-process/tax'
      },
      {
        label: this.getAddOrUpdateTitle(this.isEditSubject.value),
      },
    ],
  };

  breadCrumb$ = combineLatest([this.isEditSubject]).pipe(
    map(([isEdit]) => {
      const breadcrumb: PoBreadcrumb = {
        items: [],
      };

      breadcrumb.items.push({
        label: 'Início',
        link: '/labor-process/tax',
      });

      breadcrumb.items.push({
        label: this.getAddOrUpdateTitle(isEdit),
      });

      return breadcrumb;
    })
  );

  formGroup = this.fb.group({
    ideProc: this.fb.group({
      nrProcTrab: [null, CustomValidators.isValidProcessNumber],
      perApurPgto: [null, CustomValidators.requiredIgnoreWhiteSpace],
      obs: [null],
    }),
    ideTrab: this.fb.array([]),
  });

  columns: PoTableColumn[] = COLUMNS;

  actions: PoTableAction[];
  isProtheus: boolean = false
  subscriptions: Subscription[] = [];

  get isExcluded(): boolean {
    return this.excluidoERP === OptionsAnswer.Yes;
  }

  get isV1(): boolean {
    return this.version === ESocialVersionEnum.v1;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private service: LaborProcessTaxInfoService,
    private laborProcessDataStateService: LaborProcessDataStateService,
    private notificationService: PoNotificationService,
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getVersion();

    this.initializeColumns();

    const routeSubscription = this.route.params.subscribe(async params => {
      const { id } = params
      if (id != undefined) {
        this.isEditSubject.next(true);
        this.isEdit = true;
        await this.getTax(id);
      } else {
        this.isEditSubject.next(false);
        this.isEdit = false;
        this.isLoading = false;
      }
      this.initializeTableActions()
    });
    this.subscriptions.push(routeSubscription);

    this.subscriptions.push(this.formGroup.valueChanges.subscribe(() => {
      this.updateFormValidity();
    }));

    this.updateTableStatus();
    this.subscriptions.push(this.formGroup.get('ideTrab').valueChanges.subscribe(() => {
      this.updateTableStatus();
      this.updateFormValidity();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  private getVersion() {
    this.version = this.laborProcessDataStateService.getVersion(true);

    if (this.version === null) {
      this.goToPreviousPage();
    }
  }

  private initializeColumns(): void {
    this.columns = this.isV1 ? COLUMNS_V1 : COLUMNS;
  }

  private getAddOrUpdateTitle(isEdit: boolean) {
    return isEdit ? 'Edição de informações de tributos' : 'Cadastro de informações de tributos';
  }

  initializeTableActions(): void {
    this.actions = [
      {
        action: this.clickToEditWorker.bind(this),
        label: this.isExcluded ? 'Ver' : 'Editar',
      },
    ];
  }

  async goToPreviousPage(): Promise<void> {
    await this.router.navigate(['labor-process/tax']);
  }

  async getWorkers(): Promise<void> {
    const nrProcTrabField = this.formGroup.get('ideProc.nrProcTrab');
    if (!nrProcTrabField.valid) return;
    const nrProcTrab: IdeProc['nrProcTrab'] = nrProcTrabField.value;

    const result = await lastValueFrom(this.service.getProcessWorkers(nrProcTrab));
    const formArray = this.formGroup.get('ideTrab') as UntypedFormArray;
    formArray.clear();
    this.resultWorkers = [];
    result.items
      .map(trabalhador => this.createWorkerFormGroup(trabalhador))
      .forEach(formGroup => formArray.push(formGroup));

    this.resultWorkers = [...result.items];
    this.resultWorkers = this.resultWorkers.map((worker) => {
      return { ...worker, hasCalculationPeriod: ['hasNoValidPeriod'] }
    });
  }

  async clickToEditWorker(worker: ProcessWorker): Promise<void> {
    const formArray = this.formGroup.get('ideTrab') as UntypedFormArray;
    const workers: IdeTrab[] = formArray.value;
    const formIndex = workers.findIndex(formWorker => formWorker.cpfTrab === worker.cpfTrab);

    this.isLoading = true;
    const ideTrab = OptionalValuesFormatterUtils.removeDefaultOptionalValues(workers[formIndex]);
    await this.workerModal.openModal(ideTrab, worker.nmTrab);
    this.isLoading = false;
  }

  onModalSave(formGroup: UntypedFormGroup): void {
    const formArray = this.formGroup.get('ideTrab') as UntypedFormArray;
    const workers: ProcessWorker[] = formArray.value;
    const formIndex = workers.findIndex(formWorker => formWorker.cpfTrab === formGroup.get('cpfTrab').value);
    formArray.at(formIndex).patchValue(formGroup.value);
    this.workerModal.onClose();
  }

  createWorkerFormGroup(worker: ProcessWorker): UntypedFormGroup {
    return this.fb.group({
      cpfTrab: [worker.cpfTrab],
      nmTrab: [worker.nmTrab],
      dtNascto: [worker.dtNascto],
      calcTrib: this.fb.control([]),
      infoCRIRRF: this.fb.control([]),
      infoIRComplem: this.fb.group({
        dtLaudo: [null],
        infoDep: this.fb.control([]),
      }),
    });
  }

  private updateTableStatus(): void {
    const formArray: IdeTrab[] = this.formGroup.get('ideTrab').value;
    formArray.forEach((workerForm => {
      this.resultWorkers = this.resultWorkers.map((worker) => {
        if (worker.cpfTrab === workerForm?.cpfTrab) {
          const periodValidity = workerForm?.calcTrib.length > 0 || !this.isV1 ? 'hasValidPeriod' : 'hasNoValidPeriod';
          worker.hasCalculationPeriod = [periodValidity];
        }
        return worker;
      });
    }));
  }

  private updateFormValidity() {
    const allWorkersValid = this.resultWorkers.every(worker => worker.hasCalculationPeriod[0] === 'hasValidPeriod');
    const areAllWorkersValid = allWorkersValid || !this.isV1;

    this.isFormValid = areAllWorkersValid && this.formGroup.valid && !this.isExcluded;
  };

  async getTax(id: string) {
    this.taxId = id;
    const nrProcTrab = id.split(';')[2];
    const perApurPagto = id.split(';')[3];

    const result = await lastValueFrom(this.service.get(this.taxId));
    this.formGroup.patchValue({
      ideProc: {
        nrProcTrab,
        perApurPagto,
      }
    });
    await this.getWorkers();
    this.formGroup.patchValue(result.items[0]);
    this.excluidoERP = result.items[0].excluidoERP === OptionsAnswer.Yes ? OptionsAnswer.Yes : OptionsAnswer.No;
    this.isLoading = false;
  }

  async savePayment() {
    const processTaxItem = this.createProcessTaxItem();
    if (this.isV1) {
      this.formatProcessTaxV1(processTaxItem);
    }
    if (!this.isV1) {
      this.formatProcessTaxNotV1(processTaxItem);
    }

    this.isLoading = true;
    let hasError: boolean = false;
    let errorMessage: string = null;
    try {
      const result = !this.isEdit
        ? await lastValueFrom(this.service.create(processTaxItem))
        : await lastValueFrom(this.service.edit(this.taxId, processTaxItem));

      hasError = !result;
      this.handleCreateOrUpdateProcessSuccess(hasError);

    } catch (error) {
      hasError = true;
      errorMessage = error?.error?.Message;
    } finally {
      this.isLoading = false;
    }

    if (hasError) {
      this.notificationService.error({
        message: `Tente novamente! ${errorMessage ?? ''}`,
        orientation: PoToasterOrientation.Top,
      });
    }
  }

  private createProcessTaxItem(): ProcessTax {
    const item = this.getProcessTaxItemCopy();

    this.addBasePropertiesToProcessTax(item);

    const formattedItem = OptionalValuesFormatterUtils.changeSelectEmptyValuesToNull(item);
    PayloadUtils.changeOptionalValuesProcessTax(formattedItem);
    this.removeUnnecessaryFields(formattedItem);

    return formattedItem;
  }

  private getProcessTaxItemCopy(): ProcessTax {
    const item: ProcessTax = this.formGroup.getRawValue();

    return JSON.parse(JSON.stringify(item));
  }

  private addBasePropertiesToProcessTax(item: ProcessTax): void {
    item.excluidoERP = this.excluidoERP;
    item.companyId = this.laborProcessDataStateService.getCompanyId();
    item.branchId = this.laborProcessDataStateService.getBranchId();
    item.userName = this.laborProcessDataStateService.getUserName();
  }

  private removeUnnecessaryFields(item: ProcessTax): void {
    item.ideTrab.forEach(worker => {
      delete worker?.dtNascto;
      delete worker?.nmTrab;
    });
  }

  private formatProcessTaxV1(item: ProcessTax): void {
    item.ideTrab.forEach(ideTrab => {
      delete ideTrab.infoIRComplem;

      ideTrab.infoCRIRRF.forEach(infoCRIRRF => {
        delete infoCRIRRF.infoIR;
        delete infoCRIRRF.infoRRA;
        delete infoCRIRRF.dedDepen;
        delete infoCRIRRF.penAlim;
        delete infoCRIRRF.infoProcRet;
      })
    });
  }

  private formatProcessTaxNotV1(item: ProcessTax): void {
    item.ideTrab.forEach(ideTrab => {
      ideTrab.calcTrib.forEach(calcTrib => {
        delete calcTrib.vrRendIRRF;
        delete calcTrib.vrRendIRRF13;
      });
    });
  }

  private handleCreateOrUpdateProcessSuccess(hasError: boolean): boolean {
    if (hasError) {
      return;
    }

    this.goToPreviousPage();
    this.notificationService.success({
      message: this.isEdit ? 'Período atualizado com sucesso!' : 'Período cadastrado com sucesso!',
      orientation: PoToasterOrientation.Top,
      duration: 5_000,
    });
  }
}
