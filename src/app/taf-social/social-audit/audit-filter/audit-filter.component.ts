import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { expand } from 'rxjs/operators';
import { PoMultiselectLiterals, PoMultiselectOption, PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from '../../../core/i18n/literal.service';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { AuditChartSeriesRequest } from '../social-audit-models/AuditChartSeriesRequest';
import { AuditChartSeriesResponse } from '../social-audit-models/AuditChartSeriesResponse';
import { AuditStatusRequest } from '../social-audit-models/AuditStatusRequest';
import { AuditValuesResponse } from '../social-audit-models/AuditValuesResponse';
import { DisclaimerFilterAudit } from '../social-audit-models/DisclaimerFilterAudit';
import { BranchRequest } from './../../models/BranchRequest';
import { AuditExecuteRequest } from './../social-audit-models/AuditRequest';
import { AuditValuesRequest } from './../social-audit-models/AuditValuesRequest';
import { AuditEnvironmentService } from './services/audit-environment.service';
import { AuditService } from './services/audit.service';
import { SocialListEventService } from './../../services/social-list-event/social-list-event.service';

@Component({
  selector: 'app-audit-filter',
  templateUrl: './audit-filter.component.html',
  styleUrls: ['./audit-filter.component.scss']
})
export class AuditFilterComponent implements OnInit, OnChanges {
  @Input('showMore') showMore: boolean;
  @Input('disableButtonApplyFilters') disableButtonApplyFilters = true;
  @Output('updateProgressBar') progressBar = new EventEmitter<number>();
  @Output('payloadAuditTable') payloadAuditTable = new EventEmitter<AuditValuesResponse>();
  @Output('payloadAuditChart') payloadAuditChart = new EventEmitter<AuditChartSeriesResponse>();
  @Output('reset') reset = new EventEmitter();

  public disabledInputs = false;
  public showMoreFilter = false;
  public loadFilter = false;
  public buttonTitle = '';
  public labelButtonFilter = '';
  public literals = {};
  public currentParams = {};
  public listEvent = [];
  public selectedFilters = [];
  public listEventNonAuth = [];
  public listStatus: Array<PoMultiselectOption> = [];
  public listDeadline: Array<PoMultiselectOption> = [];
  public listBranch = new Array<PoMultiselectOption>();
  public customLiterals: PoMultiselectLiterals = null;
  public periodPattern = '^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$';
  public formFilter: UntypedFormGroup = this.formBuilder.group({
    branch: ['', Validators.required],
    period: ['', [Validators.pattern(this.periodPattern)]],
    periodFrom: ['', Validators.required],
    periodTo: ['', Validators.required],
    event: [''],
    transmission: [''],
    deadline: ['']
  });
  public hasUnauthorizedEvents = false;
  public unauthorizedEventMessage = '';
  private requestId = '';
  private page = 0;
  private companyId: string = this.auditEnviromentService.getCompany();
  private isTAFFull = false;

  constructor(
    private literalsService: LiteralService,
    private socialListEventService: SocialListEventService,
    private socialListBranchService: SocialListBranchService,
    private formBuilder: UntypedFormBuilder,
    private poNotificationService: PoNotificationService,
    private auditEnviromentService: AuditEnvironmentService,
    private auditService: AuditService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.customLiterals = {
      noData: this.literals['auditEsocial']['noDataFound'],
      placeholderSearch: this.literals['auditEsocial']['search']
    };
    this.buttonTitle = this.literals['auditEsocial']['moreFilters'];
    this.labelButtonFilter = this.literals['auditEsocial']['executeFilter'];
    this.getBranches();
    this.getEvents();

    this.auditService.getCurrentParams().subscribe(
      params => (this.currentParams = params)
    );

    this.fillStatusItems(this.listStatus);
    this.fillDeadlineItems(this.listDeadline);

  }

  ngOnChanges(): void {
    if (this.showMore) {
      const request = this.changeParamsGetTable(this.requestId, this.companyId);
      this.auditService.getValuesAudit(request).subscribe(response => {
        this.payloadAuditTable.emit(response);
        this.showMore = undefined;
      });
    }
  }

  public async onChangePeriod(event: string): Promise<void> {
    const date = this.formFilter.get('period').value;
    const dates = await this.setDates(date, date.length);
    const position = this.verifyPositionArray('period', this.selectedFilters);

    if (position >= 0) {
      this.selectedFilters.splice(position, 1, {
        value: event,
        id: 'period',
        label: this.literals['auditEsocial']['period'] + ': ' + event,
      });
      this.selectedFilters = [...this.selectedFilters];
    } else {
      this.selectedFilters = [
        ...this.selectedFilters,
        {
          value: event,
          id: 'period',
          label: this.literals['auditEsocial']['period'] + ': ' + event,
        },
      ];
    }

    if (event === '') {
      const positionPeriodFrom = this.verifyPositionArray('periodFrom', this.selectedFilters);
      positionPeriodFrom >= 0 && this.selectedFilters.splice(positionPeriodFrom, 1);

      const positionPeriodTo = this.verifyPositionArray('periodTo', this.selectedFilters);
      positionPeriodTo >= 0 && this.selectedFilters.splice(positionPeriodTo, 1);

      this.formFilter.get('periodFrom').setValue('');
      this.formFilter.get('periodTo').setValue('');
    }
    await this.changePeriodNotPeriodics(dates);
  }

  public async changePeriodNotPeriodics(dates: Array<number>): Promise<void> {
    const valuePeriodTo = this.formFilter.get('periodTo').value;
    const valuePeriodFrom = this.formFilter.get('periodFrom').value;

    if (dates) {
      const dateFrom = new Date(
        Date.UTC(dates[0], (dates[1] ? dates[1] - 1 : 0), 2)
      ).toLocaleDateString('pt-BR');
      const dateTo = new Date(
        Date.UTC(dates[0], (dates[1] ? dates[1] - 1 : 11), dates[2] + 1)
      ).toLocaleDateString('pt-BR');

      const positionPeriodFrom = this.verifyPositionArray(
        'periodFrom',
        this.selectedFilters
      );

      if (positionPeriodFrom >= 0) {
        this.selectedFilters[positionPeriodFrom] = {
          value: valuePeriodFrom.replace(/[/]/g, '-'),
          id: 'periodFrom',
          label: `${
            this.literals['auditEsocial']['periodFrom']
          } : ${dateFrom}`,
        };
      } else if (valuePeriodFrom !== undefined && valuePeriodFrom !== '') {
        this.selectedFilters.push({
          value: valuePeriodFrom.replace(/[/]/g, '-'),
          id: 'periodFrom',
          label: `${
            this.literals['auditEsocial']['periodFrom']
          } : ${dateFrom}`,
        });
      }

      const positionPeriodTo = this.verifyPositionArray(
        'periodTo',
        this.selectedFilters
      );

      if (positionPeriodTo >= 0) {
        this.selectedFilters[positionPeriodTo] = {
          value: valuePeriodTo.replace(/[/]/g, '-'),
          id: 'periodTo',
          label: `${this.literals['auditEsocial']['periodTo']} : ${dateTo}`,
        };
      } else if (valuePeriodTo !== undefined && valuePeriodTo !== '') {
        this.selectedFilters.push({
          value: valuePeriodTo.replace(/[/]/g, '-'),
          id: 'periodTo',
          label: `${this.literals['auditEsocial']['periodTo']} : ${dateTo}`,
        });
      }
    }
  }

  public onChangeNotPeriodics(event: string, periodType: string): void {
    const positionPeriod = this.verifyPositionArray(periodType, this.selectedFilters);

    if (event && periodType) {
      const year = event.substring(6, 10);
      const month = event.substring(3, 5);
      const day = event.substring(0, 2);

      if (positionPeriod >= 0) {
        this.selectedFilters.splice(positionPeriod, 1);
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['auditEsocial'][periodType]} : ${event}`,
        });
      } else {
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['auditEsocial'][periodType]} : ${event}`,
        });
      }
    } else if (positionPeriod >= 0) {
      this.selectedFilters.splice(positionPeriod, 1);
    }
  }

  public async setDates(date: any, size: number): Promise<Array<number>> {
    const dates = [];
    const year = date.substring(0, 4);
    const lastday = (yyyy, mm) => {
      return new Date(yyyy, mm, 0).getDate();
    };
    let month = date.substring(4);

    if (size === 4) {
      this.formFilter.get('periodFrom').setValue(`${year}-${'01'}-${'01'}`);
      this.formFilter.get('periodTo').setValue(`${year}-${'12'}-${'31'}`);
      month = 0;
    } else {
      this.formFilter.patchValue({ periodFrom: `${year}-${month}-${'01'}` });
      this.formFilter.patchValue({
        periodTo: `${year}-${month}-${lastday(year, month)}`,
      });
    }
    dates.push(parseInt(year, 10));
    dates.push(parseInt(month, 10));
    dates.push(lastday(year, month));

    return dates;
  }

  public verifyPositionArray(id: string, array: Array<DisclaimerFilterAudit>): number {
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

  public onChangeMultiSelect(nameMultiSelect: string, event: Array<PoMultiselectOption>) {
    const newSelectedFilters = this.selectedFilters;
    this.selectedFilters = [];

    if (event !== null) {
      event.forEach(element => {
        this.selectedFilters.push({
          value: element.value,
          id: nameMultiSelect,
          label:
            this.literals['auditEsocial'][nameMultiSelect] + ': ' + element.label,
        });
      });
    }

    newSelectedFilters.forEach(element => {
      if (element.id !== nameMultiSelect) {
        this.selectedFilters.push(element);
      }
    });
  }

  public showFilter(): void {
    this.showMoreFilter = !this.showMoreFilter;
    this.buttonTitle = this.showMoreFilter
      ? this.literals['auditEsocial']['lessFilters']
      : this.literals['auditEsocial']['moreFilters'];
  }

  public onCheckMinPeriod(): string {
    return this.formFilter.get('periodFrom').value;
  }

  public onChangeDisclaimerSelect(): void {
    let arrayBranches = [];
    let arrayEvents = [];
    let arrayTransmissions = [];
    let arrayDeadlines = [];
    let period = '';
    let findPeriod = false;
    let findPeriodFrom = false;
    let findPeriodTo = false;
    let findBranch = false;
    let findEvent = false;
    let findTransmission = false;
    let findDeadline = false;

    this.selectedFilters.forEach(element => {
      if (element.id === 'period') {
        findPeriod = true;
      } else if (element.id === 'branch') {
        findBranch = true;
      } else if (element.id === 'event') {
        findEvent = true;
      } else if (element.id === 'periodFrom') {
        findPeriodFrom = true;
      } else if (element.id === 'periodTo') {
        findPeriodTo = true;
      } else if (element.id === 'transmission') {
        findTransmission = true;
      } else if (element.id === 'deadline') {
        findDeadline = true;
      }
    });

    if (!findPeriod) {
      this.formFilter.patchValue({ period: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'period') {
          period = element.value;
        }
      });
      period = period.replace('/', '');
      this.formFilter.patchValue({ period: period });
    }

    if (!findPeriodFrom) {
      this.formFilter.patchValue({ periodFrom: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'periodFrom') {
          this.formFilter.patchValue({
            periodFrom: element.value,
          });
        }
      });
    }

    if (!findPeriodTo) {
      this.formFilter.patchValue({ periodTo: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'periodTo') {
          this.formFilter.patchValue({
            periodTo: element.value,
          });
        }
      });
    }

    if (findBranch) {
      arrayBranches = this.selectedFilters.filter(
        element => element.id === 'branch'
      ).map(branch => branch.value);
    }

    if (findEvent) {
      arrayEvents = this.selectedFilters.filter(
        element => element.id === 'event'
      ).map(event => event.value);
    }

    if (findTransmission) {
      arrayTransmissions = this.selectedFilters.filter(
        element => element.id === 'transmission'
      ).map(transmissionStatus => transmissionStatus.value);
    }

    if (findDeadline) {
      arrayDeadlines = this.selectedFilters.filter(
        element => element.id === 'deadline'
      ).map(deadlineStatus => deadlineStatus.value);
    }

    this.formFilter.patchValue({ event: arrayEvents });
    this.formFilter.patchValue({ branch: arrayBranches });
    this.formFilter.patchValue({ transmission: arrayTransmissions });
    this.formFilter.patchValue({ deadline: arrayDeadlines });

    if (findBranch && findPeriod && findPeriodFrom && findPeriodTo ) {
      this.disableButtonApplyFilters = false;
    } else {
      this.disableButtonApplyFilters = true;
    }

    this.labelButtonFilter = this.literals['auditEsocial']['executeFilter'];
  }

  public applyFilter(): void {
    const payload = this.formFilter.getRawValue();
    const payloadPost: AuditExecuteRequest = {
      companyId: this.companyId,
      branches: payload.branch,
      period: payload.period,
      eventCodes: payload.event.length > 0
        ? payload.event : this.listEvent.map(item => item.value),
      status: payload.transmission.length == 1 ? payload.transmission[0] : '3',
      deadline: payload.deadline.length == 1 ? payload.deadline[0] : '3',
      periodFrom: payload.periodFrom.replaceAll('-', ''),
      periodTo: payload.periodTo.replaceAll('-', '')
    };

    let percent = 1;
    let finished = false;

    this.requestId = '';
    this.page = 1;

    this.loadFilter = true;
    this.disabledInputs = true;
    this.reset.emit();

    if (!this.requestId) {
      this.auditService
        .postExecuteAudit(payloadPost)
        .subscribe(response => {
          this.requestId = response.requestId;
          this.progressBar.emit(percent);
        });
    }

    const intervalTimeOut = 3000;
    const interval = setInterval(() => {
      if (this.requestId) {
        this.selectedFilters.forEach(element => (element.hideClose = true));

        if (percent < 100) {
          this.auditService.getStatusAudit(this.changeParamsGet(this.requestId, this.companyId))
            .subscribe(response => {
              finished = response.finished;
              percent = response.percent;

              this.progressBar.emit(percent);
            });
        } else {
          if (percent === 100 && finished) {
            const request = this.changeParamsGetTable(this.requestId, this.companyId);
            const requestChart = this.changeParamsGetChart(this.requestId, this.companyId);

            this.auditService.getChartSeriesAudit(requestChart).subscribe(response => {
              this.payloadAuditChart.emit(response);
            });

            this.auditService.getValuesAudit(request).subscribe(response => {
              this.payloadAuditTable.emit(response);
            });
          }

          this.selectedFilters.forEach(element => (element.hideClose = false));
          this.loadFilter = false;
          this.disabledInputs = false;
          clearInterval(interval);
        }
      } else {
        this.selectedFilters.forEach(element => (element.hideClose = false));
        this.loadFilter = false;
        this.disabledInputs = false;
        this.poNotificationService.setDefaultDuration(30000);
        this.poNotificationService.error(
          this.literals['auditEsocial']['messageNotProcess']
        );
        clearInterval(interval);
      }
    }, intervalTimeOut);
  }

  private getBranches(): void {
    const companyId = this.auditEnviromentService.getCompany();
    const pageSize = 20;
    const branchs = [];
    const params: BranchRequest = {
      companyId,
      page: 1,
      pageSize,
    };

    this.socialListBranchService.getListBranchs(params).pipe(expand(response =>
      response.hasNext ? this.socialListBranchService.getListBranchs(params, ++params.page) : EMPTY
    )).subscribe(response => {
        response.items.forEach(branch => {
          this.listBranch = [...this.listBranch, {
            label: `${branch.branchCode}-${branch.branchDescription}`,
            value: branch.branchCode,
          }];
        });
    });
  }

  private getEvents(): void {
    this.socialListEventService.getListEvents({
      companyId: this.auditEnviromentService.getCompany()
    }).subscribe(payload => {
        const events = {
          listEvent: [],
          listEventNonAuth: []
        };

        payload.items.forEach(element => {
          if (this.getUnaudibleEvents(element.eventCode)) {
            const eventPermission = element.permissionEvent ?? true ? 'listEvent' : 'listEventNonAuth';

            events[eventPermission].push({
              value: element.eventCode,
              label: this.isTAFFull ? element.eventCode + ' - ' + element.eventDescription : element.eventCode,
            });
          }
        });

        this.listEvent = [...events.listEvent];
        this.listEventNonAuth = [...events.listEventNonAuth];

        if (this.listEventNonAuth.length) {
          this.hasUnauthorizedEvents = true;
          this.unauthorizedEventMessage = `${this.literals['auditEsocial']['unauthorizedEventMessage']}
            ${ this.listEventNonAuth.map( item => item['value']).join(', ') }.`;
        }
      });
  }

  private changeParamsGet(requestId: string, companyId: string): AuditStatusRequest {
    const params = {
      companyId: companyId,
      requestId: requestId,
    };

    return params;
  }

  private changeParamsGetTable(requestId: string, companyId: string): AuditValuesRequest {
    const params = {
      companyId: companyId,
      requestId: requestId,
      page: this.page++,
      pageSize: 20
    };

    return params;
  }

  private changeParamsGetChart(requestId: string, companyId: string): AuditChartSeriesRequest {
    const params = {
      companyId: companyId,
      requestId: requestId
    };

    return params;
  }

  private fillStatusItems(listStatus: Array<PoMultiselectOption>): void {
    listStatus.push({ label: this.literals['auditEsocial']['transmitted'], value: '1'});
    listStatus.push({ label: this.literals['auditEsocial']['notTransmitted'], value: '2'});
  }

  private fillDeadlineItems(listDeadline: Array<PoMultiselectOption>): void {
    listDeadline.push({ label: this.literals['auditEsocial']['inDeadline'], value: '1'});
    listDeadline.push({ label: this.literals['auditEsocial']['outDeadline'], value: '2'});
  }

  private getUnaudibleEvents(event: any): boolean {
    const unaudibleEvents = [
      'S-1000',
      'S-1005',
      'S-1010',
      'S-1020',
      'S-1030',
      'S-1035',
      'S-1040',
      'S-1050',
      'S-1060',
      'S-1070',
      'S-1080',
      'S-1250',
      'S-1298',
      'S-1300',
      'S-2221',
      'S-2250',
      'S-2260',
      'S-3000',
      'S-5001',
      'S-5002',
      'S-5003',
      'S-5011',
      'S-5012',
      'S-5013'
    ];

    if (unaudibleEvents.indexOf(event) >= 0) {
      return false;
    } else {
      return true;
    }
  }

  public validateRequiredFields(): void {
    if (this.formFilter.invalid) {
      this.disableButtonApplyFilters = true;
    } else {
      this.disableButtonApplyFilters = false;
    }
  }

  public onClean(): void {
    this.formFilter.patchValue({
      branch: [''],
      period: '',
      periodFrom: '',
      periodTo: '',
      event: [''],
      transmission: [''],
      deadline: ['']
    });
  }

  public onRemoveEvents(event): void {

    switch(event.removedDisclaimer.id.valueOf()) {
      case 'branch':
        this.formFilter.patchValue({branch: ['']});
        break;
      case 'period':
        this.formFilter.patchValue({period: ''});
        break;
      case 'periodFrom':
        this.formFilter.patchValue({periodFrom: ''});
        break;
      case 'periodTo':
        this.formFilter.patchValue({periodTo: ''});
        break;
      case 'event':
        this.formFilter.patchValue({event: ['']});
        break;
      case 'transmission':
        this.formFilter.patchValue({transmission: ['']});
        break;
      case 'deadline':
        this.formFilter.patchValue({deadline: ['']});
        break;
    }
    
    this.selectedFilters = event.currentDisclaimers;
  }
}
