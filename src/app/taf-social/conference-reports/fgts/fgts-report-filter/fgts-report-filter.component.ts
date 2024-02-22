import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { UntypedFormBuilder, Validators, AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { PoModalAction, PoModalComponent, PoDisclaimer, PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { FgtsReportFilterService } from './fgts-report-filter.service';
import { DisclaimerFilterConferenceReports } from '../../conference-reports-models/DisclaimerFilterConferenceReports';
import { ReportEsocialBaseConferStatusRequest } from '../../conference-reports-models/ReportEsocialBaseConferStatusRequest';
import { ESocialBaseConferFgtsValuesResponse } from '../../conference-reports-models/ESocialBaseConferFgtsValuesResponse';
import { ESocialBaseConferFgtsValuesRequest } from '../../conference-reports-models/ESocialBaseConferFgtsValuesRequest';
import { ExecuteReportEsocialBaseConferRequestFgts } from '../../conference-reports-models/ExecuteReportEsocialBaseConferRequestFgts';
import { ReportFilterCategoriesService } from '../../services/report-filter-categories.service';

const { cpf } = require('cpf-cnpj-validator');

@Component({
  selector: 'app-fgts-report-filter',
  templateUrl: './fgts-report-filter.component.html',
  styleUrls: ['./fgts-report-filter.component.scss'],
})
export class FgtsReportFilterComponent implements OnInit, OnChanges {
  public requestId: string;
  public literals = {};
  public selectedFilters = [];
  public page = 1;
  public pageSize = 15;
  public progressBarValue = 0;
  public isTafFull: boolean;
  public disableButton = true;
  public cpfValid = true;
  public periodValid = true;
  public control: AbstractControl;
  public close: PoModalAction;
  public confirm: PoModalAction;
  public formFilter: UntypedFormGroup;
  public formFilterModal: UntypedFormGroup;
  public categories = this.categoriesFilterService.getCategories();
  public menuContext: string;
  private companyId = this.fgtsReportFilterService.getCompany();
  public loadFilter = false;
  public disabledInputs = false;
  public validPeriod = /^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$/;
  public currentParams = {};

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  @Input() showMore: boolean;

  @Output('taf-emit-sent') progressBar = new EventEmitter<number>();
  @Output('taf-payloadCard') payloadReportCard = new EventEmitter<
    ESocialBaseConferFgtsValuesResponse[]
  >();
  @Output('taf-payloadTable') payloadReportTable = new EventEmitter<
    ESocialBaseConferFgtsValuesResponse[]
  >();
  @Output('taf-reset') reset = new EventEmitter();

  constructor(
    private literalsService: LiteralService,
    private categoriesFilterService: ReportFilterCategoriesService,
    private fgtsReportFilterService: FgtsReportFilterService,
    private formBuilder: UntypedFormBuilder,
    private poNotification: PoNotificationService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.setStandardFormFilter();
    this.setstandardFormfilterModal();
    this.isTafFull = this.getTafFull();
    this.close = {
      action: () => {
        this.refreshFilters();
        this.closeModal();
      },
      label: this.literals['fgtsReport']['close'],
      danger: true,
    };
    this.confirm = {
      action: () => {
        if (this.validFilters()[0]) {
          this.applyFilters();
          this.closeModal();
        } else {
          this.poNotification.error(
            this.literals['fgtsReport']['invalidFilter']
          );
        }
      },
      label: this.literals['fgtsReport']['applyFilters'],
    };

    this.fgtsReportFilterService.currentParams.subscribe(
      params => (this.currentParams = params)
    );
  }

  ngOnChanges() {
    if (this.showMore) {
      const request = this.changeParamsGetTable(this.requestId);
      this.fgtsReportFilterService
        .getReportTable(request, this.menuContext)
        .subscribe(response => {
          this.payloadReportTable.emit(response);
          this.showMore = undefined;
        });
    }
  }

  public validFilters(
    event?: string,
    filter?: string,
    modalFilter?: boolean
  ): Array<boolean> {
    let period = true;
    let taxNumber = true;
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

      return [period && taxNumber];
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
      period: ['', Validators.required],
      cpf: ['', this.isValidCpf()],
      registration: [''],
      differencesOnly: [''],
    });
  }

  public setstandardFormfilterModal() {
    this.formFilterModal = this.formBuilder.group({
      modalPeriod: ['', Validators.required],
      modalDifferencesOnly: [''],
      modalCategories: [''],
      modalRegistration: [''],
      modalNumberOfLines: [''],
      modalCpf: ['', this.isValidCpf()],
    });
  }

  public applyFilters(call?: string): void {
    const payloadPost = this.changePayloadPost(call);
    let percent = 0;
    let finished = false;

    this.requestId = '';
    this.page = 1;
    this.disableButton = true;
    this.loadFilter = true;
    this.disabledInputs = true;
    this.reset.emit();

    this.refreshFilters();

    if (!this.requestId) {
      this.fgtsReportFilterService
        .postExecuteReport(payloadPost, this.menuContext)
        .subscribe(response => (this.requestId = response.requestId));
    }

    const intervalTimeOut = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG')).productLine.toLowerCase() === 'rm' ? 60000 : 3000;

    const interval = setInterval(() => {
      if (this.requestId) {
        this.selectedFilters.forEach(element => (element.hideClose = true));

        if (percent < 100) {
          this.fgtsReportFilterService
            .getStatusReport(
              this.changeParamsGet(this.requestId),
              this.menuContext
            )
            .subscribe(response => {
              finished = response.finished;
              percent = response.percent;
              this.progressBar.emit(percent);
            });
        } else {
          if (percent === 100 && finished) {
            this.fgtsReportFilterService
              .getReportCard(
                this.changeParamsGetCard(this.requestId),
                this.menuContext
              )
              .subscribe(response => this.payloadReportCard.emit(response));

            const request = this.changeParamsGetTable(this.requestId);
            this.fgtsReportFilterService
              .getReportTable(request, this.menuContext)
              .subscribe(response => {
                this.payloadReportTable.emit(response);
              });
          }
          this.selectedFilters.forEach(element => (element.hideClose = false));
          this.disableButton = false;
          this.loadFilter = false;
          this.disabledInputs = false;
          clearInterval(interval);
        }
      } else {
        this.selectedFilters.forEach(element => (element.hideClose = false));
        this.disableButton = false;
        this.loadFilter = false;
        this.disabledInputs = false;
        this.poNotification.setDefaultDuration(30000);
        this.poNotification.error(
          this.literals['fgtsReport']['messageNotProcess']
        );
        clearInterval(interval);
      }
    }, intervalTimeOut);
  }

  private changePayloadPost(
    call?: string
  ): ExecuteReportEsocialBaseConferRequestFgts {
    const payloadModal = this.formFilterModal.getRawValue();
    const payload = this.formFilter.getRawValue();

    const formatPayloadPeriod = payload.period
      ? payload.period.substring(0, 4) + payload.period.substring(4, 6)
      : '';
    const formatPayloadModalPeriod = payloadModal.modalPeriod
      ? payloadModal.modalPeriod.substring(0, 4) +
      payloadModal.modalPeriod.substring(4, 6)
      : '';

    const payloadModified = {
      companyId: this.companyId,
      paymentPeriod:
        typeof call === 'string'
          ? formatPayloadPeriod
          : formatPayloadModalPeriod,
      tribute: '2',
    };

    if (
      typeof payloadModal.modalCategories === 'object' &&
      payloadModal.modalCategories.length > 0
    ) {
      payloadModified['eSocialCategory'] = payloadModal.modalCategories;
    }

    if (typeof call === 'string') {
      if (typeof payload.cpf === 'string') {
        if (payload.cpf !== '' && payload.cpf !== 'undefined') {
          payloadModified['cpfNumber'] = [payload.cpf];
        }
      }
    } else {
      if (typeof payloadModal.modalCpf === 'string') {
        if (
          payloadModal.modalCpf !== '' &&
          payloadModal.modalCpf !== 'undefined'
        ) {
          payloadModified['cpfNumber'] = [payloadModal.modalCpf];
        }
      }
    }

    if (typeof call === 'string') {
      if (typeof payload.registration === 'string') {
        if (
          payload.registration !== '' &&
          payload.registration !== 'undefined'
        ) {
          payloadModified['eSocialRegistration'] = [payload.registration];
        }
      }
    } else {
      if (typeof payloadModal.modalRegistration === 'string') {
        if (
          payloadModal.modalRegistration !== '' &&
          payloadModal.modalRegistration !== 'undefined'
        ) {
          payloadModified['eSocialRegistration'] = [
            payloadModal.modalRegistration,
          ];
        }
      }
    }

    return payloadModified;
  }

  private changeParamsGet(
    requestId: string
  ): ReportEsocialBaseConferStatusRequest {
    const params = {
      companyId: this.companyId,
      requestId: requestId,
    };
    return params;
  }

  private changeParamsGetCard(
    requestId: string
  ): ESocialBaseConferFgtsValuesRequest {
    const payload = this.formFilterModal.getRawValue();

    const params = {
      companyId: this.companyId,
      requestId: requestId,
      synthetic: true,
      differencesOnly:
        payload.modalDifferencesOnly === undefined ||
          payload.modalDifferencesOnly === ''
          ? (payload.modalDifferencesOnly = false)
          : payload.modalDifferencesOnly,
      pageSize:
        payload.modalNumberOfLines === undefined ||
          payload.modalNumberOfLines === ''
          ? 15
          : payload.modalNumberOfLines,
    };
    return params;
  }

  private changeParamsGetTable(
    requestId: string
  ): ESocialBaseConferFgtsValuesRequest {
    const payload = this.formFilterModal.getRawValue();

    const params = {
      companyId: this.companyId,
      requestId: requestId,
      synthetic: false,
      differencesOnly:
        payload.modalDifferencesOnly === undefined ||
          payload.modalDifferencesOnly === ''
          ? (payload.modalDifferencesOnly = false)
          : payload.modalDifferencesOnly,
      page: this.page++,
      pageSize:
        payload.modalNumberOfLines === undefined ||
          payload.modalNumberOfLines === ''
          ? 15
          : payload.modalNumberOfLines,
    };
    return params;
  }

  public closeModal(): void {
    this.poModal.close();
  }

  public advancedSearch(): void {
    this.poModal.open();
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

    if (this.formFilter.get('period').errors === null) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'period',
          label: this.literals['fgtsReport']['period'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'period',
            label: this.literals['fgtsReport']['period'] + ': ' + event,
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
        label: `${this.literals['fgtsReport']['differencesOnly']} : ${event}`,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'differencesOnly',
          label: `${this.literals['fgtsReport']['differencesOnly']} : ${event}`,
        },
      ];
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

    if (this.formFilter && this.formFilter.get('cpf').errors === null) {
      if (position >= 0) {
        this.selectedFilters.splice(position, 1, {
          value: event,
          id: 'cpf',
          label: this.literals['fgtsReport']['cpf'] + ': ' + event,
        });
        this.selectedFilters = [...this.selectedFilters];
      } else {
        this.selectedFilters = [
          ...this.selectedFilters,
          {
            value: event,
            id: 'cpf',
            label: this.literals['fgtsReport']['cpf'] + ': ' + event,
          },
        ];
      }
    }
  }

  public onChangeCategoriesSelect(event: Array<PoDisclaimer>): void {
    const newSelectedFilters = this.selectedFilters;

    this.selectedFilters = [];

    event.forEach(element => {
      this.selectedFilters.push({
        value: element.value,
        id: 'categories',
        label: this.literals['fgtsReport']['categorie'] + ': ' + element.value,
      });
    });

    newSelectedFilters.forEach(element => {
      if (element.id !== 'categories') {
        this.selectedFilters.push(element);
      }
    });
  }

  public onChangeRegistrationSelect(
    event: string,
    from: string,
    to: string
  ): void {
    from === 'modalRegistration'
      ? this.replicateValueModelModal(from, to)
      : this.replicateValueModel(from, to);

    const position = this.verifyPositionArray(
      'registration',
      this.selectedFilters
    );

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'registration',
        label: this.literals['fgtsReport']['registration'] + ': ' + event,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'registration',
          label: this.literals['fgtsReport']['registration'] + ': ' + event,
        },
      ];
    }
  }

  public onChangeNumberOfLinesSelect(event: Array<PoDisclaimer>): void {
    const position = this.verifyPositionArray(
      'modalNumberOfLines',
      this.selectedFilters
    );

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'modalNumberOfLines',
        label: this.literals['fgtsReport']['numberOfLines'] + ': ' + event,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'modalNumberOfLines',
          label: this.literals['fgtsReport']['numberOfLines'] + ': ' + event,
        },
      ];
    }
  }

  public onChangeDisclaimerSelect(): void {
    let findCpf = false;
    let findPeriod = false;
    let findCategories = true;
    let findNumberOfLines = true;
    let findRegistration = false;
    let findDifferencesOnly = false;
    const arrayCategories = [];

    this.selectedFilters.forEach(element => {
      if (element.id === 'period') {
        findPeriod = true;
      } else if (element.id === 'cpf') {
        findCpf = true;
      } else if (element.id === 'differencesOnly') {
        findDifferencesOnly = true;
      } else if (element.id === 'categories') {
        findCategories = true;
      } else if (element.id === 'registration') {
        findRegistration = true;
      } else if (element.id === 'modalNumberOfLines') {
        findNumberOfLines = true;
      }
    });

    if (!findPeriod) {
      this.disableButton = true;
      this.formFilter.patchValue({ period: undefined });
      this.formFilterModal.patchValue({ modalPeriod: undefined });
    }

    if (!findCpf) {
      this.formFilter.patchValue({ cpf: '' });
      this.formFilterModal.patchValue({ modalCpf: '' });
    }

    if (!findDifferencesOnly) {
      this.formFilter.patchValue({ differencesOnly: false });
      this.formFilterModal.patchValue({ modalDifferencesOnly: false });
    }

    if (findCategories) {
      this.selectedFilters.map(element => {
        if (element.id === 'categories') {
          arrayCategories.push(element.value);
        }
      });
      this.formFilterModal.patchValue({ modalCategories: arrayCategories });
    }

    if (!findRegistration) {
      this.formFilter.patchValue({ registration: undefined });
      this.formFilterModal.patchValue({ modalRegistration: undefined });
    }

    if (!findNumberOfLines) {
      this.formFilterModal.patchValue({ modalNumberOfLines: undefined });
    }
  }

  public replicateValueModelModal(from: string, to: string): void {
    const valueModal = {};

    valueModal[from] = this.formFilter.get(to).value;

    this.formFilterModal.patchValue(valueModal);
  }

  public replicateValueModel(from: string, to: string) {
    const value = {};

    value[from] = this.formFilterModal.get(to).value;

    this.formFilter.patchValue(value);
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
      if (control.value.length > 0) {
        return !cpf.isValid(control.value) ? { cpfNotValid: true } : null;
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

    if (!this.formFilterModal.value['modalNumberOfLines']) {
      position = this.verifyPositionArray(
        'modalNumberOfLines',
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

  public onClean(): void {
    this.formFilter.patchValue({
      cpf: '',
      differencesOnly: '',
      period: '',
      registration: ''
    });

    this.formFilterModal.patchValue({
      modalPeriod: '',
      modalCpf: '',
      modalRegistrarion: '',
      modalDifferencesOnly: '',
      modalCategories: [[]],
      modalNumberOfLines: ''
    });
  }

  public onRemoveEvents(event): void {

    switch(event.removedDisclaimer.id.valueOf()) {
      case 'cpf':
        this.formFilter.patchValue({cpf: ''});
        this.formFilterModal.patchValue({modalCpf: ''});
        break;
      case 'differencesOnly':
        this.formFilter.patchValue({differencesOnly: ''});
        this.formFilterModal.patchValue({modalDifferencesOnly: ''});
        break;
      case 'period':
        this.formFilter.patchValue({period: ''});
        this.formFilterModal.patchValue({modalPeriod: ''});
        break;
      case 'registration':
        this.formFilterModal.patchValue({registration: ''});
        this.formFilterModal.patchValue({modalRegistrarion: ''});
        break;
      case 'categories':
        this.formFilterModal.patchValue({modalCategories: [[]]});
        break;
      case 'modalNumberOfLines':
        this.formFilterModal.patchValue({modalNumberOfLines: ''});
        break;
    }

    this.selectedFilters = event.currentDisclaimers;
  }
}
