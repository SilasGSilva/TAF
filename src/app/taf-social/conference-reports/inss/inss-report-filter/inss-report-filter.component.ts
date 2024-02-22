import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { EMPTY, forkJoin } from 'rxjs';
import { delay, expand, map, reduce, retryWhen, take, tap } from 'rxjs/operators';
import { PoDisclaimer, PoModalAction, PoModalComponent, PoMultiselectLiterals, PoMultiselectOption, PoNotificationService } from '@po-ui/ng-components';
import { cpf } from 'cpf-cnpj-validator';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { LegacyStatusEnvironmentModalComponent } from '../../../../shared/legacy-status-environment/legacy-status-environment-modal.component';
import { LegacyStatusEnvironmentSocialService } from '../../../../shared/legacy-status-environment/services/legacy-status-environment.service';
import { MasksPipe } from '../../../../shared/pipe/masks.pipe';
import { DisclaimerFilterConferenceReports } from '../../conference-reports-models/DisclaimerFilterConferenceReports';
import { ESocialBaseConferRetValuesRequest } from '../../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ESocialBaseConferInssRetValuesResponse } from '../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { ESocialBaseConferInssValuesResponse } from '../../conference-reports-models/ESocialBaseConferInssValuesResponse';
import { EstablishmentRequest } from '../../conference-reports-models/EstablishmentRequest';
import { ExecuteAnalyticalEsocialBaseConferRequest } from '../../conference-reports-models/ExecuteAnalyticalEsocialBaseConferRequest';
import { ExecuteReportEsocialBaseConferRequest } from '../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';
import { LotationRequest } from '../../conference-reports-models/LotatationRequest';
import { ReportEsocialBaseConferStatusRequest } from '../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ReportFilterCategoriesService } from '../../services/report-filter-categories.service';
import { InssReportCardStoreService } from '../../services/stores/inss/inss-report-card-store/inss-report-card-store.service';
import { InssReportParamsStoreService } from '../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';
import { InssReportRequestParamsStoreService } from '../../services/stores/inss/inss-report-request-params-store/inss-report-request-params-store.service';
import { InssReportStoreService } from '../../services/stores/inss/inss-report-store/inss-report-store.service';
import { EstablishmentReportFilterService } from './inss-report-filter-establishment.service';
import { InssReportFilterLotationService } from './inss-report-filter-lotation.service';
import { InssReportFilterService } from './services/inss-report-filter.service';

@Component({
  selector: 'app-inss-report-filter',
  templateUrl: './inss-report-filter.component.html',
  styleUrls: ['./inss-report-filter.component.scss'],
})
export class InssReportFilterComponent implements OnInit {
  public requestId: string;
  public categories = this.categoriesFilterService.getCategories();
  public menuContext: string;
  public companyId = this.inssReportFilterService.getCompany();
  public page = 1;
  public pageSize: 15;
  public progressBarValue = 0;
  public isTafFull: boolean;
  public disableButton = true;
  public loadFilter = false;
  public disabledInputs = false;
  public cpfValid = true;
  public periodValid = true;
  public control: AbstractControl;
  public close: PoModalAction;
  public confirm: PoModalAction;
  public formFilter: UntypedFormGroup;
  public formFilterModal: UntypedFormGroup;
  public literals = {};
  public selectedFilters = [];
  public listEstablishment = new Array<PoMultiselectOption>();
  public listLotations = new Array<PoMultiselectOption>();
  public validPeriod = /^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$/;
  public currentRequestParams: ExecuteReportEsocialBaseConferRequest;
  public customLiterals: PoMultiselectLiterals;
  public showFilterAlert = false;
  private executeAnalyticalFilterParams:ExecuteAnalyticalEsocialBaseConferRequest = {};

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(LegacyStatusEnvironmentModalComponent, { static: true })
  legacyStatusEnvironmentModal: LegacyStatusEnvironmentModalComponent;

  @Output('taf-emit-sent') progressBar = new EventEmitter<number>();
  @Output('taf-sending-started') sendingStarted = new EventEmitter<boolean>();
  @Output('taf-payloadCard') payloadReportCard = new EventEmitter<
    ESocialBaseConferInssRetValuesResponse
  >();
  @Output('taf-payloadTable') payloadReportTable = new EventEmitter<
    ESocialBaseConferInssRetValuesResponse
  >();
  @Output('taf-reset') reset = new EventEmitter();
  @Output('taf-requestId') payloadRequestId = new EventEmitter<string>();
  @Output('taf-analyticalFilterParamns') payloadanalyticalFilterParamns = new EventEmitter<ExecuteAnalyticalEsocialBaseConferRequest>();
  @Output('taf-payloadModal') payloadReportModal = new EventEmitter<
    ESocialBaseConferInssValuesResponse[]
  >();
  @Output('taf-loadingReport') loadingReport = new EventEmitter<boolean>();

  constructor(
    private literalsService: LiteralService,
    private lotationService: InssReportFilterLotationService,
    private categoriesFilterService: ReportFilterCategoriesService,
    private inssReportFilterService: InssReportFilterService,
    private establishmentService: EstablishmentReportFilterService,
    private formBuilder: UntypedFormBuilder,
    private poNotification: PoNotificationService,
    private inssReportStoreService: InssReportStoreService,
    private inssReportCardStoreService: InssReportCardStoreService,
    private inssReportRequestParamsStoreService: InssReportRequestParamsStoreService,
    private masksPipe: MasksPipe,
    private legacyStatusEnvironmentSocialService: LegacyStatusEnvironmentSocialService,
    private inssReportParamsStoreService: InssReportParamsStoreService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.getEstablishment();
    this.setStandardFormFilter();
    this.setStandardFormFilterModal();
    this.getLotations();
    this.loadCurrentParms();
    this.isTafFull = this.getTafFull();
    this.close = {
      action: () => {
        this.refreshFilters();
        this.closeModal();
      },
      label: this.literals['inssReport']['close'],
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
            this.literals['fgtsReport']['invalidFilter']
          );
          this.inssReportStoreService.resetReportValues();
          this.inssReportCardStoreService.resetCardValues();

          setTimeout(() => {
            this.disabledInputs = false;
          }, 2000);
        }
      },
      label: this.literals['inssReport']['applyFilters'],
    };
    this.customLiterals = { noData: this.literals['inssReport']['searching'] };

    this.formFilter.valueChanges.subscribe(value => {
      value.period ? (this.disableButton = false) : (this.disableButton = true);
    });
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
        : false;

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

  public setStandardFormFilter() {
    this.formFilter = this.formBuilder.group({
      establishment: [''],
      period: ['', Validators.required],
      differencesOnly: false,
    });
  }

  public setStandardFormFilterModal() {
    this.formFilterModal = this.formBuilder.group({
      modalEstablishment: [''],
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: false,
      modalLotation: [[]],
      modalCategory: [[]],
      modalRegistration: [''],
      modalPageSize: [30],
      modalCpf: ['', this.isValidCpf()],
    });
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
            if (status.inssIsUpToDate && status.isAvailable) {
              this.inssReportParamsStoreService.setIsConfiguredService(
                status.isConfigured
              );
              this.reportProcess(isMainWindow, isFromSwitch);
            } else {
              this.legacyStatusEnvironmentModal.openModal({
                tribute: '1',
                status,
              });
              this.resetReport();
            }
          })
        : this.reportProcess(isMainWindow, isFromSwitch);
    } else {
      this.poNotification.setDefaultDuration(2000);
      this.poNotification.error(this.literals['fgtsReport']['invalidFilter']);

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
    this.inssReportCardStoreService.resetCardValues(false);
    this.inssReportStoreService.resetReportValues();
    this.inssReportRequestParamsStoreService.resetRequestParams();
    this.inssReportParamsStoreService.resetCurrentParams();
    this.progressBar.emit(0);

    const position = this.verifyPositionArray(
      'differencesOnly',
      this.selectedFilters
    );

    if (position >= 0) {
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
      ? this.inssReportFilterService
        .postExecuteReport(payloadPost, this.menuContext)
        .subscribe(response => {
          this.requestId = response.requestId;
          this.getReport(isMainWindow);
        })
      : this.getReport(isMainWindow);
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

    this.inssReportStoreService.resetReportValues();
    this.inssReportCardStoreService.resetCardValues();
    this.loadingReport.emit(true);

    const interval = setInterval(() => {
      setTimeout(() => {
        runTime += intervalTimeOut;

        if (this.requestId) {
          if (this.requestId) {
            this.selectedFilters.forEach(element => (element.hideClose = true));

            if (percent < 100) {
              this.inssReportFilterService
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
                  this.inssReportFilterService.getInssRetValues({ ...changeParams, synthetic: true }, this.menuContext),
                  this.inssReportFilterService.getInssRetValues(changeParams, this.menuContext),
                ]).pipe(map(response => {
                  if ((response[0]?.items?.length === 0 || response[1]?.items?.length === 0) && retry < 5) {
                    throw new Error();
                  }

                  return response;
                }), retryWhen(errors => errors.pipe(delay(5000), take(6), tap(() => { retry++; })))).subscribe(
                  results => {
                    this.inssReportCardStoreService.setNewCardValues(results[0]);
                    this.inssReportStoreService.setNewReportValues(results[1]);

                    this.payloadReportTable.emit(results[1]);
                    this.payloadReportCard.emit(results[0]);

                    changeParams.synthetic = true;
                  }
                );
              }

              this.payloadRequestId.emit(this.requestId);
              this.payloadanalyticalFilterParamns.emit(this.executeAnalyticalFilterParams);
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
              this.literals['inssReport']['messageNotProcess']
            );
            clearInterval(interval);
          }
        }
      }, timeDefault);
    }, intervalTimeOut);
  }

  private changePayloadPost(
    isMainWindow?: boolean
  ): ExecuteReportEsocialBaseConferRequest {
    const formFilter = this.formFilter.getRawValue();
    const formFilterModal = this.formFilterModal.getRawValue();
    this.executeAnalyticalFilterParams.cpfNumber = formFilterModal.modalCpf ? [formFilterModal.modalCpf] : []
    this.executeAnalyticalFilterParams.eSocialCategory = formFilterModal.modalCategory
    this.executeAnalyticalFilterParams.eSocialRegistration = formFilterModal.modalRegistration ? [formFilterModal.modalRegistration] : []
    this.executeAnalyticalFilterParams.registrationNumber = isMainWindow ? formFilter.establishment : formFilterModal.modalEstablishment
    this.executeAnalyticalFilterParams.lotationCode = formFilterModal.modalLotation
    
    return isMainWindow
      ? { 
        companyId: this.companyId,
        paymentPeriod: formFilter.period,
        registrationNumber: this.executeAnalyticalFilterParams.registrationNumber,
        tribute: '1',
        differencesOnly: formFilter.differencesOnly,
        numberOfLines:
          formFilterModal.modalPageSize === undefined ||
            formFilterModal.modalPageSize === ''
            ? 30
            : parseFloat(formFilterModal.modalPageSize),
        lotationCode: this.executeAnalyticalFilterParams.lotationCode,
        cpfNumber: this.executeAnalyticalFilterParams.cpfNumber,
        eSocialCategory: this.executeAnalyticalFilterParams.eSocialCategory,
        eSocialRegistration: this.executeAnalyticalFilterParams.eSocialRegistration
      }
      : {
        companyId: this.companyId,
        cpfNumber: this.executeAnalyticalFilterParams.cpfNumber,
        eSocialCategory: this.executeAnalyticalFilterParams.eSocialCategory,
        eSocialRegistration: this.executeAnalyticalFilterParams.eSocialRegistration,
        lotationCode: this.executeAnalyticalFilterParams.lotationCode,
        paymentPeriod: formFilterModal.modalPeriod,
        registrationNumber: this.executeAnalyticalFilterParams.registrationNumber,
        tribute: '1',
        differencesOnly: formFilterModal.modalDifferencesOnly,
        numberOfLines:
          formFilterModal.modalPageSize === undefined ||
            formFilterModal.modalPageSize === ''
            ? 30
            : parseFloat(formFilterModal.modalPageSize),
      };
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
      page: this.page++,
      pageSize:
        formFilterModal.modalPageSize === undefined ||
          formFilterModal.modalPageSize === ''
          ? 30
          : parseFloat(formFilterModal.modalPageSize),
    };
  }

  public closeModal(): void {
    this.poModal.close();
  }

  public advancedSearch(): void {
    this.poModal.open();
  }

  public getEstablishment(): void {
    const pageSize = 500;
    const params: EstablishmentRequest = {
      companyId: this.companyId,
      page: 1,
      pageSize,
    };

    this.establishmentService
      .getListEstablishment(params).pipe(expand(response =>
        response.hasNext ? this.establishmentService.getListEstablishment(params, ++params.page) : EMPTY
      )).subscribe(response => {
        response.items.forEach(item => {
          if (
            !this.listEstablishment.find(
              establishment => item.registrationNumber === establishment.value
            )
          ) {
            this.listEstablishment.push({
              label: this.masksPipe.transform(item.registrationNumber),
              value: item.registrationNumber,
            });
          }
        });
      });
  }

  private getLotations(): void {
    const pageSize = 500;

    const params: LotationRequest = {
      companyId: this.companyId,
      page: 1,
      pageSize,
    };

    this.lotationService
        .getListLotations(params)
        .pipe(expand(response =>
          response.hasNext ? this.lotationService.getListLotations(params, ++params.page) : EMPTY
        )).subscribe(response => {
          response.items.forEach(item => {
            if (
              !this.listLotations.find(
                lotation => item.lotationCode === lotation.value
              )
            ) {
              this.listLotations.push({
                label: item.lotationCode,
                value: item.lotationCode,
              });
            }
          });
        });
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
          label: this.literals['inssReport']['period'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'period',
            label: this.literals['inssReport']['period'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeDivergencesSelect(
    event: string,
    from: string,
    to: string
  ): void {
    const position = this.verifyPositionArray(
      'differencesOnly',
      this.selectedFilters
    );

    from === 'modalDifferencesOnly'
      ? this.replicateValueModelModal(from, to)
      : this.replicateValueModel(from, to);

    if (typeof event === 'boolean') {
      event
        ? (event = this.literals['fgtsReport']['yes'])
        : (event = this.literals['fgtsReport']['no']);
    }

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'differencesOnly',
        label: `${this.literals['inssReport']['differencesOnly']} : ${event}`,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'differencesOnly',
          label: `${this.literals['inssReport']['differencesOnly']} : ${event}`,
        },
      ];
    }
    this.disableButton = false;
  }

  public onChangeCpfSelect(event: string): void {
    const position = this.verifyPositionArray('cpf', this.selectedFilters);
    let filterValid: Array<boolean>;

    filterValid = this.validFilters(event, 'cpf', false);
    this.disableButton = !filterValid[0];
    this.cpfValid = filterValid[1];
    if (
      this.formFilter &&
      this.formFilterModal.get('modalCpf').getError('cpfNotValid') === null
    ) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'cpf',
          label: this.literals['inssReport']['cpf'] + ': ' + this.masksPipe.transform(event),
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'cpf',
            label: this.literals['inssReport']['cpf'] + ': ' + this.masksPipe.transform(event),
          },
        ];
      }
    }
  }

  public onChangeMultiSelect(nameMultiSelect: string, event: Array<PoDisclaimer>, from?: string, to?: string): void {
    const newSelectedFilters = this.selectedFilters;
    this.selectedFilters = [];
    let filters: String = "";
    let labelDescription: String = "";
    let newTo: String = "";
    let typeLabel: Boolean = false;

    filters = "establishment|modalEstablishment";

    if (filters.match(nameMultiSelect)) {
      newTo = to;
      typeLabel = true;
      from === 'modalEstablishment' ? this.replicateValueModelModal(from, to) : this.replicateValueModel(from, to);
    } else {
      newTo = nameMultiSelect;
    }

    if (event !== null) {
      event.forEach(element => {
        if (typeLabel) {
          labelDescription = this.literals['inssReport'][nameMultiSelect] + ': ' + this.masksPipe.transform(element.label);
        } else {
          labelDescription = this.literals['inssReport'][nameMultiSelect] + ': ' + element.value;
        }

        this.selectedFilters.push({
          value: element.value,
          id: nameMultiSelect,
          label: labelDescription
        });
      });
    }

    if (filters.match(nameMultiSelect)) {
      if(event.length > 0) {
        if(this.formFilter.value.establishment.length > 0 || this.formFilterModal.value.modalEstablishment.length > 0) {
          newSelectedFilters.forEach(element => {
            if (element.id !== newTo) {
              this.selectedFilters.push(element);
            }
          });
        }
      } else {
        newSelectedFilters.forEach(element => {
          if (!filters.match(element.id)) {
            this.selectedFilters.push(element);
          }
        });
      }
    } else {
      newSelectedFilters.forEach(element => {
        if (element.id !== newTo) {
          this.selectedFilters.push(element);
        }
      });
    }
  }

  public onChangeRegistrationSelect(event: string): void {
    const position = this.verifyPositionArray(
      'registration',
      this.selectedFilters
    );

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'registration',
        label: this.literals['inssReport']['registration'] + ': ' + event,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'registration',
          label: this.literals['inssReport']['registration'] + ': ' + event,
        },
      ];
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
          label: this.literals['fgtsReport']['numberOfLines'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'modalPageSize',
            label: this.literals['fgtsReport']['numberOfLines'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeDisclaimerSelect(event): void {
    this.selectedFilters = event;
    let findEstablishment: Boolean = true;
    let findPeriod: Boolean = false;
    let findCpf: Boolean = false;
    let findDifferencesOnly: Boolean  = false;
    let findLotation: Boolean = true;
    let findCategories: Boolean = true;
    let findRegistration: Boolean = false;
    let findNumberOfLines: Boolean = true;
    const arrayEstablishment: Array<String> = [''];
    const arrayCategories: Array<String> = [''];
    const arrayLotations: Array<String> = [''];

    this.selectedFilters.forEach(element => {
      if (element.id === 'establishment' || element.id === 'modalEstablishment') {
        findEstablishment = true;
      } else if (element.id === 'period') {
        findPeriod = true;
      } else if (element.id === 'cpf') {
        findCpf = true;
      } else if (element.id === 'differencesOnly') {
        findDifferencesOnly = true;
      } else if (element.id === 'lotation') {
        findLotation = true;
      } else if (element.id === 'categories') {
        findCategories = true;
      } else if (element.id === 'registration') {
        findRegistration = true;
      } else if (element.id === 'modalPageSize') {
        findNumberOfLines = true;
      }
    });

    if (findEstablishment) {
      this.selectedFilters.map(element => {
        if (element.id === 'establishment' || element.id === 'modalEstablishment') {
          arrayEstablishment.push(element.value);
        }
      });

      this.formFilter.patchValue({ establishment: arrayEstablishment });
      this.formFilterModal.patchValue({ modalEstablishment: arrayEstablishment, });
    }

    if (!findPeriod) {
      this.disableButton = true;
      this.formFilter.patchValue({ period: '' });
      this.formFilterModal.patchValue({ modalPeriod: '' });
    }

    if (!findCpf) {
      this.formFilterModal.patchValue({ modalCpf: '' });
    }

    if (!findDifferencesOnly) {
      this.formFilter.patchValue({ differencesOnly: false });
      this.formFilterModal.patchValue({ modalDifferencesOnly: false });
    }

    if (findLotation) {
      this.selectedFilters.map(element => {
        if (element.id === 'lotation') {
          arrayLotations.push(element.value);
        }
      });
      this.formFilterModal.patchValue({ modalLotation: arrayLotations });
    }

    if (findCategories) {
      this.selectedFilters.map(element => {
        if (element.id === 'categories') {
          arrayCategories.push(element.value);
        }
      });
      this.formFilterModal.patchValue({ modalCategory: arrayCategories });
    }

    if (!findRegistration) {
      this.formFilterModal.patchValue({ modalRegistration: '' });
    }

    if (!findNumberOfLines) {
      this.formFilterModal.patchValue({ modalPageSize: 30 });
    }

    this.showFilterAlert =
      this.formFilter.value.establishment.length ||
      this.formFilterModal.value.modalEstablishment.length ||
      this.formFilterModal.value.modalLotation.length ||
      this.formFilterModal.value.modalCategory.length ||
      this.formFilterModal.value.modalRegistration
        ? true
        : false;

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

  private isValidCpf(): ValidatorFn {
    return (control: AbstractControl): Validators => {
      if (control.value !== '' && control.value[0] !== '') {
        return cpf.isValid(control.value) ? null : { cpfNotValid: true };
      }
    };
  }

  public getTafFull(): boolean {
    const tafTafFull = sessionStorage.getItem('TAFFull');
    return JSON.parse(tafTafFull) === null ? false : JSON.parse(tafTafFull);
  }

  public refreshFilters(): void {
    let position: number;

    if (!this.formFilterModal.value['modalPeriod']) {
      position = this.verifyPositionArray('period', this.selectedFilters);
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }

    if (!this.formFilterModal.value['modalRegistration']) {
      position = this.verifyPositionArray('registration', this.selectedFilters);
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

    if (!this.formFilterModal.value['modalCpf']) {
      position = this.verifyPositionArray('cpf', this.selectedFilters);
      if (position >= 0) {
        this.selectedFilters.splice(position, 1);
      }
    }
  }

  private loadCurrentParms(): void {
    this.inssReportRequestParamsStoreService.reportRequestParams$.subscribe(
      currentRequestParams => {
        this.currentRequestParams = currentRequestParams;

        if (currentRequestParams.lotationCode) {
          currentRequestParams.lotationCode.forEach(lotationCode => {
            if (
              lotationCode &&
              !this.listLotations.find(
                lotation => lotationCode === lotation.value
              )
            ) {
              this.listLotations.push({
                label: lotationCode,
                value: lotationCode,
              });
            }
          });
        }

        if (currentRequestParams.registrationNumber) {
          currentRequestParams.registrationNumber.forEach(
            registrationNumber => {
              if (
                registrationNumber &&
                !this.listEstablishment.find(
                  registration => registrationNumber === registration.value
                )
              ) {
                this.listEstablishment.push({
                  label: this.masksPipe.transform(registrationNumber),
                  value: registrationNumber,
                });
              }
            }
          );
        }

        this.selectedFilters = [
          {
            value: this.currentRequestParams.paymentPeriod,
            id: 'period',
            label: this.literals['inssReport']['period'] + ': ' +
              this.currentRequestParams.paymentPeriod.replace(
                /(\d{4})?(\d{2})/,
                '$1/$2'
              ),
          },
          {
            value: this.currentRequestParams.cpfNumber.length
              ? this.currentRequestParams.cpfNumber[0]
              : '',
            id: 'cpf',
            label: this.literals['inssReport']['cpf'] + ': ' + this.masksPipe.transform(this.currentRequestParams.cpfNumber[0]),
          },
          {
            value: this.currentRequestParams.eSocialRegistration.length
              ? this.currentRequestParams.eSocialRegistration[0]
              : '',
            id: 'registration',
            label: this.literals['inssReport']['registration'] + ': ' + this.currentRequestParams.eSocialRegistration[0],
          },
        ];

        if (this.currentRequestParams.registrationNumber) {
          this.currentRequestParams.registrationNumber.forEach(param => {
            this.selectedFilters.push({
              value: param,
              id: 'establishment',
              label: this.literals['inssReport']['establishment'] + ': ' + this.masksPipe.transform(param),
            });
          });
        }

        if (this.currentRequestParams.lotationCode) {
          this.currentRequestParams.lotationCode.forEach(param => {
            this.selectedFilters.push({
              value: param,
              id: 'lotation',
              label: this.literals['inssReport']['lotation'] + ': ' + param,
            });
          });
        }

        if (this.currentRequestParams.eSocialCategory) {
          this.currentRequestParams.eSocialCategory.forEach(param => {
            this.selectedFilters.push({
              value: param,
              id: 'categories',
              label: this.literals['inssReport']['categories'] + ': ' + param,
            });
          });
        }

        if (this.currentRequestParams.differencesOnly) {
          this.selectedFilters.push({
            value: this.currentRequestParams.differencesOnly,
            id: 'differencesOnly',
            label: this.literals['inssReport']['differencesOnly'] + ': ' + this.literals['inssReport']['yes'],
          });
        }

        if (this.currentRequestParams.numberOfLines !== 30) {
          this.selectedFilters.push({
            value: this.currentRequestParams.numberOfLines,
            id: 'modalPageSize',
            label: this.literals['inssReport']['numberOfLines'] + ': ' + this.currentRequestParams.numberOfLines,
          });
        }

        this.formFilterModal.setValue({
          modalPeriod: this.currentRequestParams.paymentPeriod
            ? this.currentRequestParams.paymentPeriod
            : '',
          modalDifferencesOnly: this.currentRequestParams.differencesOnly
            ? this.currentRequestParams.differencesOnly
            : false,
          modalEstablishment: this.currentRequestParams.registrationNumber
            ? this.currentRequestParams.registrationNumber
            : [],
          modalLotation: this.currentRequestParams.lotationCode
            ? this.currentRequestParams.lotationCode
            : [],
          modalCategory: this.currentRequestParams.eSocialCategory
            ? this.currentRequestParams.eSocialCategory
            : [],
          modalRegistration: this.currentRequestParams.eSocialRegistration
            .length
            ? this.currentRequestParams.eSocialRegistration[0]
            : '',
          modalPageSize: this.currentRequestParams.numberOfLines
            ? this.currentRequestParams.numberOfLines
            : 30,
          modalCpf: this.currentRequestParams.cpfNumber.length
            ? this.currentRequestParams.cpfNumber[0]
            : '',
        });

        this.formFilter.setValue({
          period: this.currentRequestParams.paymentPeriod,
          establishment: this.currentRequestParams.registrationNumber,
          differencesOnly: this.currentRequestParams.differencesOnly,
        });

        if (this.formFilter.valid || this.formFilterModal.valid) {
          this.disableButton = false;
        }
      }
    );
  }

  public onClean(): void {
    this.formFilter.patchValue({
      establishment: [''],
      period: ['', Validators.required],
      differencesOnly: false,
    });

    this.formFilterModal.patchValue({
      modalEstablishment: [''],
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: false,
      modalLotation: [[]],
      modalCategory: [[]],
      modalRegistration: [''],
      modalPageSize: [30],
      modalCpf: [''],
    });

    this.disableButton = true;
  }

  public onRemoveEvents(event): void {
    switch (event.removedDisclaimer.id.valueOf()) {
      case 'establishment' || 'modalEstablishment':
        this.formFilter.patchValue({establishment: ['']});
        this.formFilterModal.patchValue({modalEstablishment: ['']});
        break;
      case 'period':
        this.formFilter.patchValue({period: ['', Validators.required]});
        this.formFilterModal.patchValue({modalPeriod: ['', Validators.required]});
        break;
      case 'differencesOnly':
        this.formFilter.patchValue({differencesOnly: false});
        this.formFilterModal.patchValue({modalDifferencesOnly: false});
        break;
      case 'cpf':
        this.formFilterModal.patchValue({modalCpf: ['']});
        break;
      case 'lotation':
        this.formFilterModal.patchValue({modalLotation: [[]]});
        break;
      case 'categories':
        this.formFilterModal.patchValue({modalCategory: [[]]});
        break;
      case 'modalPageSize':
        this.formFilterModal.patchValue({modalPageSize: [30]});
        break;
    }

    this.selectedFilters = event.currentDisclaimers;
  }
}
