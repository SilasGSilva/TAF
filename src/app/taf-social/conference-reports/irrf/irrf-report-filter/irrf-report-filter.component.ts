import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { delay, map, retryWhen, take, tap } from 'rxjs/operators';
import { cpf } from 'cpf-cnpj-validator';
import { PoDisclaimer, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { MasksPipe } from '../../../../shared/pipe/masks.pipe';
import { LegacyStatusEnvironmentModalComponent } from 'shared/legacy-status-environment/legacy-status-environment-modal.component';
import { DisclaimerFilterConferenceReports } from '../../conference-reports-models/DisclaimerFilterConferenceReports';
import { ExecuteReportEsocialBaseConferRequest } from '../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { ReportEsocialBaseConferStatusRequest } from '../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ESocialBaseConferRetValuesRequest } from '../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { Categories } from '../../conference-reports-models/Categories';
import { SwitchTypes } from '../irrf-models/SwitchTypes';
import { ESocialBaseConferIrrfRetValuesResponse } from '../irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { LegacyStatusEnvironmentSocialService } from 'shared/legacy-status-environment/services/legacy-status-environment.service';
import { IrrfReportParamsStoreService } from '../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';
import { IrrfReportStoreService } from '../../services/stores/irrf/irrf-report-store/irrf-report-store.service';
import { IrrfReportRequestParamsStoreService } from '../../services/stores/irrf/irrf-report-request-params-store/irrf-report-request-params-store.service';
import { IrrfReportCardStoreService } from '../../services/stores/irrf/irrf-report-card-store/irrf-report-card-store.service';
import { ReportFilterCategoriesService } from '../../services/report-filter-categories.service';
import { IrrfReportFilterService } from './services/irrf-report-filter.service';

@Component({
  selector: 'app-irrf-report-filter',
  templateUrl: './irrf-report-filter.component.html',
  styleUrls: ['./irrf-report-filter.component.scss']
})
export class IrrfReportFilterComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(LegacyStatusEnvironmentModalComponent, { static: true }) legacyStatusEnvironmentModal: LegacyStatusEnvironmentModalComponent;

  @Output('reset') reset = new EventEmitter();
  @Output('emit-sent') progressBar = new EventEmitter<number>();
  @Output('sending-started') sendingStarted = new EventEmitter<boolean>();
  @Output('loading-report') loadingReport = new EventEmitter<boolean>();
  @Output('payload-table') payloadReportTable = new EventEmitter<ESocialBaseConferIrrfRetValuesResponse>();
  @Output('payload-card') payloadReportCard = new EventEmitter<ESocialBaseConferIrrfRetValuesResponse>();
  @Output('request-id') payloadRequestId = new EventEmitter<string>();
  @Output('cpf-number') payloadcpfNumber = new EventEmitter<string>();

  public disabledInputs = false;
  public disableButton = true;
  public periodValid = true;
  public cpfValid = true;
  public showFilterAlert = false;
  public loadFilter = false;
  public isTafFull: boolean;
  public page = 1;
  public companyId: string;
  public requestId: string;
  public menuContext: string;
  public selectedFilters = [];
  public literals = {};
  public formFilter: UntypedFormGroup;
  public formFilterModal: UntypedFormGroup;
  public close: PoModalAction;
  public confirm: PoModalAction;
  public validPeriod = /^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$/;
  public currentRequestParams: ExecuteReportEsocialBaseConferRequest;
  public categories: Array<Categories>;

  constructor(
    private literalsService: LiteralService,
    private categoriesFilterService: ReportFilterCategoriesService,
    private masksPipe: MasksPipe,
    private formBuilder: UntypedFormBuilder,
    private poNotification: PoNotificationService,
    private legacyStatusEnvironmentSocialService: LegacyStatusEnvironmentSocialService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService,
    private irrfReportFilterService: IrrfReportFilterService,
    private irrfReportCardStoreService: IrrfReportCardStoreService,
    private irrfReportStoreService: IrrfReportStoreService,
    private irrfReportRequestParamsStoreService: IrrfReportRequestParamsStoreService,

  ) {
    this.literals = this.literalsService.literalsTafSocial;
    this.companyId = this.irrfReportFilterService.getCompany();
    this.categories = this.categoriesFilterService.getCategories();
   }

  ngOnInit(): void {
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.isTafFull = this.getTafFull();
    this.setStandardFormFilter();
    this.setStandardFormFilterModal();
    this.loadCurrentParms();
    this.close = {
      action: () => {
        this.refreshFilters();
        this.closeModal();
      },
      label: this.literals['irrfReport']['close'],
      danger: true,
    };
    this.confirm = {
      action: () => {
        if (this.validFilters()[0]) {
          this.applyFilters(false);
          this.closeModal();
        } else {
          this.disabledInputs = true;
          this.loadFilter = false;
          this.poNotification.setDefaultDuration(2000);
          this.poNotification.error(
            this.literals['irrfReport']['invalidFilter']
          );
          this.irrfReportStoreService.resetReportValues();
          this.irrfReportCardStoreService.resetCardValues();

          setTimeout(() => {
            this.disabledInputs = false;
          }, 2000);
        }
      },
      label: this.literals['irrfReport']['applyFilters'],
    };

    this.formFilter.valueChanges.subscribe(value => {
      value.period ? (this.disableButton = false) : (this.disableButton = true);
    });
  }

  public advancedSearch(): void {
    this.poModal.open();
  }

  public getTafFull(): boolean {
    const tafTafFull = sessionStorage.getItem('TAFFull');
    return JSON.parse(tafTafFull) === null ? false : JSON.parse(tafTafFull);
  }

  public onChangePeriodSelect(event: string, from: string, to: string): void {
    const position = this.verifyPositionArray('period', this.selectedFilters);
    let filterValid: Array<boolean>;

    filterValid = this.validFilters(event, 'period', false);
    this.disableButton = !filterValid[0];
    this.periodValid = filterValid[1];

    from === 'modalPeriod'
      ? this.replicateValueModelModal(from, to)
      : this.replicateValueModel(from, to);

    if (this.formFilter.get('period').errors === null || !event) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'period',
          label: this.literals['irrfReport']['period'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'period',
            label: this.literals['irrfReport']['period'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeMultiSelect(nameMultiSelect: string, event: Array<PoDisclaimer>, from?: string, to?: string): void {
    const newSelectedFilters = this.selectedFilters;
    this.selectedFilters = [];
    let filters: String = '';
    let labelDescription: String = '';
    let newTo: String = '';
    let typeLabel: Boolean = false;

    filters = 'esocialCategory';

    if (filters.match(nameMultiSelect)) {
      newTo = to;
      typeLabel = true;
    } else {
      newTo = nameMultiSelect;
    }

    if (event !== null) {
      event.forEach(element => {
        if (typeLabel) {
          labelDescription = this.literals['irrfReport'][nameMultiSelect] + ': ' + this.masksPipe.transform(element.label);
        } else {
          labelDescription = this.literals['irrfReport'][nameMultiSelect] + ': ' + element.value;
        }

        this.selectedFilters.push({
          value: element.value,
          id: nameMultiSelect,
          label: labelDescription
        });
      });
    }

    if (filters.match(nameMultiSelect)) {
      newSelectedFilters.forEach(element => {
        if (!filters.match(element.id)) {
          this.selectedFilters.push(element);
        }
      });
    } else {
      newSelectedFilters.forEach(element => {
        if (element.id !== newTo) {
          this.selectedFilters.push(element);
        }
      });
    }
  }

  public verifyPositionArray(
    id: string,
    array: Array<DisclaimerFilterConferenceReports>
  ): number {
    let position: number;

    if (array.length > 0) {
      position = array.findIndex(element => {
        return id === element.id;
      });
    } else {
      return 0;
    }
    return position;
  }

  public replicateValueModelModal(from: string, to: string): void {
    const valueModal: object = {};

    valueModal[to] = this.formFilterModal.get(from).value;

    this.formFilter.patchValue(valueModal);
  }

  public replicateValueModel(from: string, to: string) {
    const value: object = {};

    value[to] = this.formFilter.get(from).value;

    this.formFilterModal.patchValue(value);
  }

  public validFilters(
    event?: string,
    filter?: string,
    modalFilter?: boolean
  ): Array<boolean> {
    let period = true;
    let taxNumber = true;
    let pageSize = true;
    let periodFilter: string;

    modalFilter = modalFilter === undefined ? true : modalFilter;

    if (modalFilter) {
      taxNumber = this.formFilterModal.value.modalCpf
        ? cpf.isValid(this.formFilterModal.value.modalCpf)
        : true;

      period = this.formFilterModal.value.modalPeriod
        ? this.formFilterModal.value.modalPeriod.match(this.validPeriod)
          ? true
          : false
        : false

      pageSize = !this.isTafFull
        ? this.formFilterModal.value.modalPageSize
          ? this.formFilterModal.value.modalPageSize
            .toString()
            .match(/^[1-9]\d*$/)
            ? true
            : false
          : false
        : true;

      return [period && taxNumber && pageSize];
    } else if (filter === 'period') {
      periodFilter = event;
      periodFilter = periodFilter.replace('/', '');
      period = event
        ? periodFilter.match(this.validPeriod)
          ? true
          : false
        : false;

      return [period && this.cpfValid, period];
    } else if (filter === 'cpf') {
      taxNumber = event ? cpf.isValid(event) : true;

      return [this.periodValid && taxNumber, taxNumber];
    }
  }

  public onChangeNumberOfLinesSelect(event: string): void {
    if (event.match(/^[1-9]\d*$/)) {
      const position = this.verifyPositionArray(
        'modalPageSize',
        this.selectedFilters
      );

      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'modalPageSize',
          label: this.literals['irrfReport']['numberOfLines'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'modalPageSize',
            label: this.literals['irrfReport']['numberOfLines'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeCpfSelect(event: string, from: string, to: string): void {
    const position = this.verifyPositionArray('cpf', this.selectedFilters);
    let filterValid: Array<boolean>;

    filterValid = this.validFilters(event, 'cpf', false);
    this.disableButton = !filterValid[0];
    this.cpfValid = filterValid[1];

    from === 'modalCpf'
      ? this.replicateValueModelModal(from, to)
      : this.replicateValueModel(from, to);

    if (
      this.formFilter &&
      this.formFilterModal.get('modalCpf').getError('cpfNotValid') === null
    ) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'cpf',
          label: this.literals['irrfReport']['cpf'] + ': ' + this.masksPipe.transform(event),
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'cpf',
            label: this.literals['irrfReport']['cpf'] + ': ' + this.masksPipe.transform(event),
          },
        ];
      }
    }
  }

  public onChangeSwitches(event: string, from: string, to: string): void {
    const target = `${to}|${from}`.includes(SwitchTypes.differencesOnly)
      ? SwitchTypes.differencesOnly
      : SwitchTypes.warningsOnly;
    const position = this.verifyPositionArray(target, this.selectedFilters);

    from.includes('modal')
      ? this.replicateValueModelModal(from, to)
      : this.replicateValueModel(from, to);

    if (typeof event === 'boolean') {
      event
        ? (event = this.literals['irrfReport']['yes'])
        : (event = this.literals['irrfReport']['no']);
    }

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: target,
        label: `${this.literals['irrfReport'][target]} : ${event}`,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: target,
          label: `${this.literals['irrfReport'][target]} : ${event}`,
        },
      ];
    }
    this.disableButton = false;
  }

  public onChangeDisclaimerSelect(event): void {
    this.selectedFilters = event;
    let findPeriod: Boolean = false;
    let findCpf: Boolean = false;
    let findDifferencesOnly: Boolean  = false;
    let findWarningsOnly: Boolean  = false;
    let findCategories: Boolean = true;
    let findNumberOfLines: Boolean = true;
    const arrayCategories: Array<String> = [''];

    this.selectedFilters.forEach(element => {
      if (element.id === 'period' || element.id === 'modalPeriod') {
        findPeriod = true;
      } else if (element.id === 'cpf' || element.id === 'modalCpf') {
        findCpf = true;
      } else if (element.id === 'differencesOnly' || element.id === 'modalDifferencesOnly' ) {
        findDifferencesOnly = true;
      } else if (element.id === 'warningsOnly' || element.id === 'modalWarningsOnly' ) {
        findWarningsOnly = true;
      } else if (element.id === 'modalCategories') {
        findCategories = true;
      }
      else if (element.id === 'modalPageSize') {
        findNumberOfLines = true;
      }
    });

    if (!findPeriod) {
      this.disableButton = true;
      this.formFilter.patchValue({ period: '' });
      this.formFilterModal.patchValue({ modalPeriod: '' });
    }

    if (!findCpf) {
      this.formFilter.patchValue({ cpf: '' });
      this.formFilterModal.patchValue({ modalCpf: '' });
    }

    if (!findDifferencesOnly) {
      this.formFilter.patchValue({ differencesOnly: false });
      this.formFilterModal.patchValue({ modalDifferencesOnly: false });
    }

    if (!findWarningsOnly) {
      this.formFilter.patchValue({ warningsOnly: false });
      this.formFilterModal.patchValue({ modalWarningsOnly: false });
    }

    if (findCategories) {
      this.selectedFilters.map(element => {
        if (element.id === 'esocialCategory') {
          arrayCategories.push(element.value);
        }
      });
      this.formFilterModal.patchValue({ modalCategory: arrayCategories });
    }

    if (!findNumberOfLines) {
      this.formFilterModal.patchValue({ modalPageSize: 30 });
    }

    this.showFilterAlert =
      this.formFilter.value.period.length ||
      this.formFilter.value.cpf.length ||
      this.formFilterModal.value.modalPeriod.length ||
      this.formFilterModal.value.modalCpf.length ||
      this.formFilterModal.value.modalCategory.length
  }

  public onRemoveEvents(event): void {
    switch (event.removedDisclaimer.id.valueOf()) {
      case 'period' || 'modalPeriod':
        this.formFilter.patchValue({period: ['', Validators.required]});
        this.formFilterModal.patchValue({modalPeriod: ['', Validators.required]});
        break;
      case 'differencesOnly' || 'modalDifferencesOnly':
        this.formFilter.patchValue({differencesOnly: false});
        this.formFilterModal.patchValue({modalDifferencesOnly: false});
        break;
      case 'warningsOlny' || 'modalWarningsOlny':
        this.formFilter.patchValue({warningsOlny: false});
        this.formFilterModal.patchValue({modalWarningsOlny: false});
        break;
      case 'cpf' || 'modalCpf':
        this.formFilter.patchValue({cpf: ['']});
        this.formFilterModal.patchValue({modalCpf: ['']});
        break;
      case 'modalCategory':
        this.formFilterModal.patchValue({modalCategory: [[]]});
        break;
      case 'modalPageSize':
        this.formFilterModal.patchValue({modalPageSize: [30]});
        break;
    }

    this.selectedFilters = event.currentDisclaimers;
  }

  public onClean(): void {
    this.formFilter.patchValue({
      period: ['', Validators.required],
      cpf: [''],
      differencesOnly: false,
      warningsOnly: false,
    });

    this.formFilterModal.patchValue({
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: false,
      modalWarningsOnly: false,
      modalCategory: [[]],
      modalPageSize: [30],
      modalCpf: [''],
    });

    this.disableButton = true
  }

  public setStandardFormFilter() {
    this.formFilter = this.formBuilder.group({
      period: ['', Validators.required],
      cpf: ['', this.isValidCpf()],
      differencesOnly: false,
      warningsOnly: false
    });
  }

  public setStandardFormFilterModal() {
    this.formFilterModal = this.formBuilder.group({
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: false,
      modalWarningsOnly: false,
      modalCategory: [[]],
      modalPageSize: [30],
      modalCpf: ['', this.isValidCpf()],
    });
  }

  public refreshFilters(): void {
    let position: number;

    if (!this.formFilterModal.value['modalPeriod']) {
      position = this.verifyPositionArray('period', this.selectedFilters);
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }

    if (!this.formFilterModal.value['modalCpf']) {
      position = this.verifyPositionArray('cpf', this.selectedFilters);
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }

    if (!this.formFilterModal.value['modalCategory']) {
      position = this.verifyPositionArray('modalCategory', this.selectedFilters);
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }

    if (!this.formFilterModal.value['modalPageSize']) {
      position = this.verifyPositionArray(
        'modalPageSize',
        this.selectedFilters
      );
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }
  }

  public closeModal(): void {
    this.poModal.close();
  }

  private isValidCpf(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      if (control.value !== '' && control.value[0] !== '') {
        return cpf.isValid(control.value) ? null : { cpfNotValid: true };
      }
    };
  }

  public applyFilters(
    isMainWindow: boolean = true,
    isFromSwitch: boolean = false
  ): void {
    this.page = 1;
    this.disableButton = true;
    this.loadFilter = true;
    this.disabledInputs = true;
    this.reset.emit();

    if (this.formFilter.valid && this.formFilterModal.valid) {
      this.progressBar.emit(1);

      this.isTafFull && !isFromSwitch
        ? this.legacyStatusEnvironmentSocialService
          .getLegacyStatusEnvironment({ companyId: this.companyId })
          .subscribe(status => {
            if (status.irrfIsUpToDate && status.isAvailable) {
              this.irrfReportParamsStoreService.setIsConfiguredService(
                status.isConfigured
              );
              this.reportProcess(isMainWindow, isFromSwitch);
            } else {
              this.legacyStatusEnvironmentModal.openModal({
                tribute: '3',
                status,
              });
              this.resetReport();
            }
          })
        : this.reportProcess(isMainWindow, isFromSwitch);
    } else {
      this.poNotification.setDefaultDuration(2000);
      this.poNotification.error(this.literals['irrfReport']['invalidFilter']);

      setTimeout(() => {
        this.resetReport();
      }, 2000);
    }
  }

  private resetReport(): void {
    this.disabledInputs = false;
    this.loadFilter = false;
    this.formFilter.patchValue({ differencesOnly: false });
    this.formFilterModal.patchValue({ modalDifferencesOnly: false });
    this.formFilter.patchValue({ warningsOnly: false });
    this.formFilterModal.patchValue({ modalWarningsOnly: false });
    this.irrfReportCardStoreService.resetCardValues();
    this.irrfReportStoreService.resetReportValues();
    this.irrfReportRequestParamsStoreService.resetRequestParams();
    this.irrfReportParamsStoreService.resetCurrentParams();
    this.progressBar.emit(0);

    const position = this.verifyPositionArray(
      'differencesOnly',
      this.selectedFilters
    );

    if (position >= 0) {
      this.selectedFilters.splice(position, 1);
    }

    const position1 = this.verifyPositionArray(
      'warningsOnly',
      this.selectedFilters
    );

    if (position1 >= 0) {
      this.selectedFilters.splice(position, 1);
    }
  }

  private reportProcess(
    isMainWindow: boolean = true,
    isFromSwitch: boolean = false
  ): void {
    const payloadPost = this.changePayloadPost(isMainWindow);

    this.sendingStarted.emit(true);

    if (!isFromSwitch) {
      this.requestId = '';
    }

    this.refreshFilters();

    !this.requestId
      ? this.irrfReportFilterService
        .postExecuteReport(payloadPost, this.menuContext)
        .subscribe(response => {
          this.requestId = response.requestId;
          this.getReport(isMainWindow);
        })
      : this.getReport(isMainWindow);
  }

  private changePayloadPost(
    isMainWindow?: boolean
  ): ExecuteReportEsocialBaseConferRequest {
    const formFilter = this.formFilter.getRawValue();
    const formFilterModal = this.formFilterModal.getRawValue();

    return isMainWindow
      ? {
        companyId: this.companyId,
        paymentPeriod: formFilter.period,
        tribute: '3',
        differencesOnly: formFilter.differencesOnly,
        warningsOnly: formFilter.warningsOnly,
        numberOfLines:
          formFilterModal.modalPageSize === undefined ||
            formFilterModal.modalPageSize === ''
            ? 30
            : parseFloat(formFilterModal.modalPageSize),
        cpfNumber: formFilter.cpf ? [formFilter.cpf] : [],
        eSocialCategory: formFilterModal.modalCategory
      }
      : {
        companyId: this.companyId,
        cpfNumber: formFilterModal.modalCpf ? [formFilterModal.modalCpf] : [],
        eSocialCategory: formFilterModal.modalCategory,
        paymentPeriod: formFilterModal.modalPeriod,
        tribute: '3',
        differencesOnly: formFilterModal.modalDifferencesOnly,
        warningsOnly: formFilterModal.modalWarningsOnly,
        numberOfLines:
          formFilterModal.modalPageSize === undefined ||
            formFilterModal.modalPageSize === ''
            ? 30
            : parseFloat(formFilterModal.modalPageSize),
      };
  }

  private getReport(isMainWindow: boolean = true): void {
    const intervalTimeOut =
      JSON.parse(
        sessionStorage.getItem('ERPAPPCONFIG')
      ).productLine.toLowerCase() === 'rm'
        ? 10000
        : 500;

    const timeDefault = 100;

    let runTime = 0;
    let percent = 1;
    let finished = false;

    this.irrfReportStoreService.resetReportValues();
    this.irrfReportCardStoreService.resetCardValues();
    this.loadingReport.emit(true);

    const interval = setInterval(() => {
      setTimeout(() => {
        runTime += intervalTimeOut;

        if (this.requestId) {
          if (this.requestId) {
            this.selectedFilters.forEach(element => (element.hideClose = true));

            if (percent < 100) {
              this.irrfReportFilterService
                .getStatusReport(
                  this.changeParamsGet(this.requestId),
                  this.menuContext
                )
                .subscribe(response => {
                  finished = response.finished;
                  percent = response.percent > 1 ? response.percent : percent;
                  this.progressBar.emit(percent);
                });
            } else {
              if (percent === 100 && finished) {
                const changeParams = this.changeParams(
                  this.requestId,
                  isMainWindow
                );
                let retry = 0;

                forkJoin([
                  this.irrfReportFilterService.getIrrfRetValues({ ...changeParams, synthetic: true, level: '0' }, this.menuContext),
                  this.irrfReportFilterService.getIrrfRetValues({ ...changeParams, level: '1' }, this.menuContext),
                ]).pipe(map(response => {
                  if ((response[0]?.items[0]?.employees?.length === 0 || response[1]?.items[0]?.employees?.length === 0) && retry < 5) {
                    throw new Error();
                  }

                  return response;
                }), retryWhen(errors => errors.pipe(delay(5000), take(6), tap(() => { retry++; })))).subscribe(
                  results => {
                    this.irrfReportCardStoreService.setNewCardValues(results[0]);
                    this.irrfReportStoreService.setNewReportValues(results[1]);

                    this.payloadReportTable.emit(results[1]);
                    this.payloadReportCard.emit(results[0]);

                    changeParams.synthetic = true;
                  }
                );
              }

              this.payloadRequestId.emit(this.requestId);
              this.loadingReport.emit(false);
              this.selectedFilters.forEach(
                element => (element.hideClose = false)
              );

              this.disableButton = false;
              this.loadFilter = false;
              this.disabledInputs = false;

              clearInterval(interval);
            }
          }
        } else if (runTime > 55000) {
          if (!this.requestId) {
            this.selectedFilters.forEach(
              element => (element.hideClose = false)
            );

            this.disableButton = false;
            this.loadFilter = false;
            this.disabledInputs = false;

            this.poNotification.setDefaultDuration(3000);
            this.poNotification.error(
              this.literals['irrfReport']['messageNotProcess']
            );
            clearInterval(interval);
          }
        }
      }, timeDefault);
    }, intervalTimeOut);
  }

  private changeParamsGet(
    requestId: string
  ): ReportEsocialBaseConferStatusRequest {
    const params = {
      companyId: this.companyId,
      requestId,
    };
    return params;
  }

  private changeParams(
    requestId: string,
    isMainWindow: boolean
  ): ESocialBaseConferRetValuesRequest {
    const formFilter = this.formFilter.getRawValue();
    const formFilterModal = this.formFilterModal.getRawValue();

    return {
      companyId: this.companyId,
      requestId,
      synthetic: false,
      differencesOnly: isMainWindow
        ? formFilter.differencesOnly
        : formFilterModal.modalDifferencesOnly,
      warningsOnly: isMainWindow
        ? formFilter.warningsOnly
        : formFilterModal.modalWarningsOnly,
      page: this.page++,
      pageSize:
        formFilterModal.modalPageSize === undefined ||
          formFilterModal.modalPageSize === ''
          ? 30
          : parseFloat(formFilterModal.modalPageSize),
    };
  }

  private loadCurrentParms(): void {
    this.irrfReportRequestParamsStoreService.reportRequestParams$.subscribe(
      currentRequestParams => {
        this.currentRequestParams = currentRequestParams;
        this.selectedFilters = [
          {
            value: this.currentRequestParams.paymentPeriod,
            id: 'period',
            label: `${this.literals['irrfReport']['period']}: ${this.currentRequestParams.paymentPeriod.replace(/(\d{4})?(\d{2})/, '$1/$2')}`,
          },
          {
            value: this.currentRequestParams.cpfNumber.length ? this.currentRequestParams.cpfNumber[0]: '',
            id: 'cpf',
            label: `${this.literals['irrfReport']['cpf']}: ${this.masksPipe.transform(this.currentRequestParams.cpfNumber[0])}`,
          },
        ];

        if (this.currentRequestParams.eSocialCategory) {
          this.currentRequestParams.eSocialCategory.forEach(param => {
            this.selectedFilters.push({
              value: param,
              id: 'esocialCategory',
              label: `${this.literals['irrfReport']['esocialCategory']}: ${param}`,
            });
          });
        }

        if (this.currentRequestParams.differencesOnly) {
          this.selectedFilters.push({
            value: this.currentRequestParams.differencesOnly,
            id: SwitchTypes.differencesOnly,
            label: `${this.literals['irrfReport'][SwitchTypes.differencesOnly]}: ${this.literals['irrfReport']['yes']}`,
          });
        }

        if (this.currentRequestParams.warningsOnly) {
          this.selectedFilters.push({
            value: this.currentRequestParams.warningsOnly,
            id: SwitchTypes.warningsOnly,
            label: `${this.literals['irrfReport'][SwitchTypes.warningsOnly]}: ${this.literals['irrfReport']['yes']}`,
          });
        }

        if (this.currentRequestParams.numberOfLines !== 30) {
          this.selectedFilters.push({
            value: this.currentRequestParams.numberOfLines,
            id: 'modalPageSize',
            label: `${this.literals['irrfReport']['numberOfLines']}: ${this.currentRequestParams.numberOfLines}`,
          });
        }

        this.formFilterModal.setValue({
          modalPeriod: this.currentRequestParams.paymentPeriod
            ? this.currentRequestParams.paymentPeriod
            : '',
          modalDifferencesOnly: this.currentRequestParams.differencesOnly
            ? this.currentRequestParams.differencesOnly
            : false,
          modalWarningsOnly: this.currentRequestParams.warningsOnly
            ? this.currentRequestParams.warningsOnly
            : false,
          modalCategory: this.currentRequestParams.eSocialCategory
            ? this.currentRequestParams.eSocialCategory
            : [],
          modalPageSize: this.currentRequestParams.numberOfLines
            ? this.currentRequestParams.numberOfLines
            : 30,
          modalCpf: this.currentRequestParams.cpfNumber.length
            ? this.currentRequestParams.cpfNumber[0]
            : '',
        });

        this.formFilter.setValue({
          cpf: String(this.currentRequestParams.cpfNumber),
          period: this.currentRequestParams.paymentPeriod,
          differencesOnly: this.currentRequestParams.differencesOnly,
          warningsOnly: this.currentRequestParams.warningsOnly,
        });

        if (this.formFilter.valid || this.formFilterModal.valid) {
          this.disableButton = false;
        }
      }
    );
  }
}
