import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { expand } from 'rxjs/operators';
import { PoMultiselectOption } from '@po-ui/ng-components';
import { LiteralService } from '../../../core/i18n/literal.service';
import { SocialUserFilterService } from '../../../taf-social/services/social-user-filter/social-user-filter.service';
import { BranchRequest } from '../../models/BranchRequest';
import { EventRequest } from '../../models/EventRequest';
import { DisclaimerFilterMonitor } from '../social-monitor-models/DisclaimerFilterMonitor';
import { SocialMonitorService } from '../social-monitor.service';
import { MonitorFilterMotiveService } from './monitor-filter-motive.service';
import { SocialListBranchService } from '../../services/social-list-branch/social-list-branch.service';
import { SocialListEventService } from '../../services/social-list-event/social-list-event.service';

@Component({
  selector: 'app-monitor-filter',
  templateUrl: './monitor-filter.component.html',
  styleUrls: ['./monitor-filter.component.scss'],
})
export class MonitorFilterComponent implements OnInit {
  public showEvents = false;
  public showMoreFilter = false;
  public showMotiveFilter = false;

  public buttonTitle: string;
  public labelButtonFilter: string;
  public menuContext: string;

  public literals = {};
  public listEvent = {
    allEvents: [],
    tables: [],
    notPeriodics: [],
    periodics: [],
    totalizers: [],
    unauthorizedEvents: [],
  };
  public selectedFilters = [];
  public items = [];
  public selectedChecks = [];
  public listBranch = new Array<PoMultiselectOption>();
  public listOptionsStatus = new Array<PoMultiselectOption>();
  public withdrawalMotive = new Array<PoMultiselectOption>();
  public listEventGroups = new Array<PoMultiselectOption>();
  public periodPattern = '^(19[0-9]{2}|2[0-9]{3})(0[1-9]|1[0-2])?$';
  public isTAFFull: boolean;
  public unauthorizedEventMessage: string;
  public hasUnauthorizedEvents = false;

  formFilter: UntypedFormGroup = this.formBuilder.group({
    branch: ['', Validators.required],
    period: ['', [Validators.pattern(this.periodPattern)]],
    periodFrom: [''],
    periodTo: [''],
    event: [''],
    motive: [''],
    listStatus: [''],
    filEventGroups: [''],

  });

  @Input('disableButtonApplyFilters') disableButtonApplyFilters = true;
  @Input('isLoadingExecuteFilter') isLoadingExecuteFilter = false;
  @Output() execFilter = new EventEmitter();
  @ViewChild('nonAuthorizationAlert') nonAuthorizationAlert: ElementRef;

  constructor(
    private literalsService: LiteralService,
    private socialListEventService: SocialListEventService,
    private socialListBranchService: SocialListBranchService,
    private motiveService: MonitorFilterMotiveService,
    private monitorService: SocialMonitorService,
    private formBuilder: UntypedFormBuilder,
    private socialUserFilterService: SocialUserFilterService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.buttonTitle = this.literals['monitorFilters']['moreFilters'];
    this.onLoadEvents();
    this.getBranches();
    this.loadSavedParams();
    this.filterStatus(this.listOptionsStatus);
    this.eventGroups(this.listEventGroups);

    if (this.isTAFFull) {
      this.getMotives();
    }

    this.labelButtonFilter = this.literals['monitorFilters']['executeFilter'];

    this.formFilter.get('period').statusChanges
      .pipe()
      .subscribe((dados: string) => dados ? this.onChangePeriod(dados) : EMPTY);

  }

  private filterStatus(listOptionsStatus: Array<PoMultiselectOption>): void {
    listOptionsStatus.push({ value: '1', label: 'Pendente de Envio'});
    listOptionsStatus.push({ value: '2', label: 'Aguardando Governo'});
    listOptionsStatus.push({ value: '3', label: 'Rejeitado'});
    listOptionsStatus.push({ value: '4', label: 'Sucesso'});
    listOptionsStatus.push({ value: '5', label: 'Excluído'});
  }
  private eventGroups(listEventGroups: Array<PoMultiselectOption>): void {
    listEventGroups.push({ value: 'C', label: 'Tabelas'});
    listEventGroups.push({ value: 'M', label: 'Periódicos'});
    listEventGroups.push({ value: 'E', label: 'Não Periódicos'});
    listEventGroups.push({ value: 'S', label: 'SST'});
    listEventGroups.push({ value: 'O', label: 'Órgãos Públicos'});
    listEventGroups.push({ value: 'T', label: 'Totalizadores'});
  }

  public onExecuteFilter(): void {
    const onlyAnnual = this.menuContext === 'esocial'
      && String(this.formFilter.get('period').value ?? '').length === 4;

    if (onlyAnnual) {
      this.onChangeMultiSelect('event', []);
      this.onChangeMultiSelect('filEventGroups', [
        { value: 'M', label: this.literals['monitorFilters']['periodics'] }
      ]);
      this.onChangeNotPeriodics(null, 'periodFrom');
      this.onChangeNotPeriodics(null, 'periodTo');
    }

    this.execFilter.emit({
      filters: this.selectedFilters,
      listEvent: this.listEvent,
    });

    this.labelButtonFilter = this.literals['monitorFilters']['updateStatus'];
  }

  public onChangeMultiSelect(nameMultiSelect: string, event: Array<PoMultiselectOption>): void {

    const newSelectedFilters = this.selectedFilters;
    this.selectedFilters = [];
    let filters = "";
    let labelDescription = "";
    let typeLabel = false;

    filters = "listStatus|filEventGroups";

    if (filters.match(nameMultiSelect)){
      typeLabel = true;
    }

    event.forEach(element => {
      if (typeLabel) {
        labelDescription = this.literals['monitorFilters'][nameMultiSelect] + ': ' + element.label
      }else{
        labelDescription = this.literals['monitorFilters'][nameMultiSelect] + ': ' + element.value
      }
      this.selectedFilters.push({
        value: element.value,
        id: nameMultiSelect,
        label: labelDescription
      });
    });

    newSelectedFilters.forEach(element => {
      if (element.id !== nameMultiSelect) {
        this.selectedFilters.push(element);
      }
    });

    if (nameMultiSelect == 'event'){
      this.showMotiveFilter = this.validFilterMotive();
    }
  }

  public onChangeDisclaimerSelect(execute?: boolean): void {
    const hasInvalidDate = this.formFilter.get('period').errors != null
      || this.formFilter.get('periodFrom').errors != null
      || this.formFilter.get('periodTo').errors != null;
    let arrayBranchs = [];
    let arrayEvents = [];
    let arrayMotives = [];
    let arrayListStatus: Array<string> = [];
    let arrayEventsGroups: Array<string> = [];
    let period = '';
    let findPeriod = false;
    let findPeriodFrom = false;
    let findPeriodTo = false;
    let findBranch = false;
    let findEvent = false;
    let findMotive = false;
    let findListStatus = false;
    let findListEventsGroups = false;

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
      } else if (element.id === 'motive') {
        findMotive = true;
      } else if (element.id === 'listStatus') {
        findListStatus = true;
      } else if (element.id === 'filEventGroups') {
        findListEventsGroups = true;
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
      if (execute)  {
        period = period.replace('/', '');
        this.formFilter.patchValue({ period: period });
      }
    }
    if (!findPeriodFrom) {
      this.formFilter.patchValue({ periodFrom: undefined });
    } else {
      this.selectedFilters.map(element => {
        if (element.id === 'periodFrom' && execute) {
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
        if (element.id === 'periodTo' && execute) {
          this.formFilter.patchValue({
            periodTo: element.value,
          });
        }
      });
    }

    if (findBranch) {
      arrayBranchs = this.selectedFilters
        .filter(element => element.id === 'branch')
        .map(branch => branch.value);
    }

    if (findEvent) {
      arrayEvents = this.selectedFilters
        .filter(element => element.id === 'event')
        .map(event => event.value);
    }

    if (findMotive) {
      arrayMotives = this.selectedFilters
        .filter(element => element.id === 'motive')
        .map(motive => motive.value);
    }

    if (findListStatus) {
      arrayListStatus = this.selectedFilters
      .filter(element => element.id === 'listStatus')
      .map(listStatus => listStatus.value);
    }

    if (findListEventsGroups) {
      arrayEventsGroups = this.selectedFilters
      .filter(element => element.id === 'filEventGroups')
      .map(filEventGroups => filEventGroups.value);
    }

    this.formFilter.patchValue({ event: arrayEvents });
    this.formFilter.patchValue({ branch: arrayBranchs });
    this.formFilter.patchValue({ motive: arrayMotives });
    this.formFilter.patchValue({listStatus: arrayListStatus});
    this.formFilter.patchValue({filEventGroups: arrayEventsGroups});

    if (findBranch && !hasInvalidDate) {
      this.disableButtonApplyFilters = false;
    } else {
      this.disableButtonApplyFilters = true;
    }

    this.labelButtonFilter = this.literals['monitorFilters']['executeFilter'];
    this.showMotiveFilter = this.validFilterMotive();
  }

  public onClean(): void {
    this.formFilter.patchValue({
      branch: [''],
      period: '',
      periodFrom: '',
      periodTo: '',
      event: [''],
      motive: [''],
      listStatus: [''],
      filEventGroups: [''],
    });
  }

  public onRemoveEvents(event): void {

    switch(event.removedDisclaimer.id.valueOf()) {
      case 'branch':
        this.formFilter.patchValue({branch: ['']});
        break;
      case 'event':
        this.formFilter.patchValue({event: ['']});
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
      case 'motive':
        this.formFilter.patchValue({motive: ['']});
        break;
      case 'listStatus':
        this.formFilter.patchValue({listStatus: ['']});
        break;
      case 'filEventGroups':
        this.formFilter.patchValue({filEventGroups: ['']});
        break;
    }

    this.selectedFilters = event.currentDisclaimers;
  }

  public async onChangePeriod(event: string): Promise<void> {
    const date = this.formFilter.value.period ? this.formFilter.get('period').value : this.formFilter.value.period;
    const dates = date ? await this.setDates(date, date.length) : [];
    const newSelectedFilters = this.selectedFilters;

    this.selectedFilters = [];

    if (event !== '') {
      this.selectedFilters.push({
        value: date,
        id: 'period',
        label:
          this.literals['inssReport']['period'] + ': ' + date,
      });
    }

    newSelectedFilters.forEach(element => {
      if (element.id !== 'period') {
        this.selectedFilters.push(element);
      }
    });

    this.showMotiveFilter = this.validFilterMotive();

    if (event === '') {
      this.formFilter.patchValue({ periodFrom: '' });
      this.formFilter.patchValue({ periodTo: '' });
      this.onChangeNotPeriodics(null, 'periodFrom');
      this.onChangeNotPeriodics(null, 'periodTo');
    } else {
      await this.changePeriodNotPeriodics(dates);
    }
  }

  public async changePeriodNotPeriodics(dates: Array<number>): Promise<void> {
    const valuePeriodTo = this.formFilter.get('periodTo').value;
    const valuePeriodFrom = this.formFilter.get('periodFrom').value;

    if (dates.length > 0) {
      const dateFrom = new Date(
        Date.UTC(dates[0], dates[3] - 1, 2)
      ).toLocaleDateString('pt-BR');
      const dateTo = new Date(
        Date.UTC(dates[0], dates[1] - 1, dates[2] + 1)
      ).toLocaleDateString('pt-BR');

      if (dateFrom != "Invalid Date") {
        const positionPeriodFrom = this.verifyPositionArray(
          'periodFrom',
          this.selectedFilters
        );

        if (positionPeriodFrom >= 0) {
          this.selectedFilters[positionPeriodFrom] = {
            value: valuePeriodFrom.replace(/[/]/g, '-'),
            id: 'periodFrom',
            label: `${this.literals['monitorFilters']['periodFrom']
              } : ${dateFrom}`,
          };
        } else if (valuePeriodFrom !== undefined && valuePeriodFrom !== '') {
          this.selectedFilters.push({
            value: valuePeriodFrom.replace(/[/]/g, '-'),
            id: 'periodFrom',
            label: `${this.literals['monitorFilters']['periodFrom']
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
            label: `${this.literals['monitorFilters']['periodTo']} : ${dateTo}`,
          };
        } else if (valuePeriodTo !== undefined && valuePeriodTo !== '') {
          this.selectedFilters.push({
            value: valuePeriodTo.replace(/[/]/g, '-'),
            id: 'periodTo',
            label: `${this.literals['monitorFilters']['periodTo']} : ${dateTo}`,
          });
        }
      }
    }
  }

  public onChangeNotPeriodics(event: string, periodType: string): void {
    const positionPeriod = this.verifyPositionArray(
      periodType,
      this.selectedFilters
    );

    if (this.formFilter.get(periodType).errors != null && event)
      return

    if (event && periodType) {
      const year = event.substring(6, 10);
      const month = event.substring(3, 5);
      const day = event.substring(0, 2);

      if (positionPeriod >= 0) {
        this.selectedFilters.splice(positionPeriod, 1);
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['monitorFilters'][periodType]} : ${event}`,
        });
      } else {
        this.selectedFilters.push({
          value: `${year}-${month}-${day}`,
          id: periodType,
          label: `${this.literals['monitorFilters'][periodType]} : ${event}`,
        });
      }
    } else if (positionPeriod >= 0) {
      this.selectedFilters.splice(positionPeriod, 1);
    }
    if (this.selectedFilters) {
      this.saveParams(this.selectedFilters);
    }
  }

  private onLoadEvents(): void {
    const companyId = this.monitorService.getCompany();

    const params: EventRequest = {
      companyId
    };

    this.socialListEventService
      .getListEvents(params)
      .subscribe(
        response => {
          response.items.forEach(element => {
            const eventPermission = element.permissionEvent ?? true ? 'allEvents' : 'unauthorizedEvents';
            this.listEvent[eventPermission] = [...this.listEvent[eventPermission], {
              value: element.eventCode,
              label: this.isTAFFull ? element.eventCode + ' - ' + element.eventDescription : element.eventCode,
            }];
          });

          if (this.listEvent['unauthorizedEvents'].length) {
            this.hasUnauthorizedEvents = true;
            this.unauthorizedEventMessage = `${this.literals['monitorFilters']['unauthorizedEventMessage']}
              ${ this.listEvent['unauthorizedEvents'].map( item => item['value']).join(', ') }.`;
          }
        },
      );
  }

  private getBranches(): void {
    const companyId = this.monitorService.getCompany();
    const pageSize = 20;
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

  private getMotives(): void {
    const companyId = this.monitorService.getCompany();
    const pageSize = 50;

    const params: BranchRequest = {
      companyId,
      page: 1,
      pageSize,
    };

    this.motiveService
      .getListMotives(params).pipe(expand(response =>
        response.hasNext ? this.motiveService.getListMotives(params, ++params.page) : EMPTY
      )).subscribe(response => {
        response.items.forEach(item => {
          this.withdrawalMotive = [...this.withdrawalMotive, {
            label: `${item.motivesCode}-${item.motivesDescription}`,
            value: item.motivesCode,
          }];
        });
      });
  }

  public loadSavedParams(): void {
    const selectedFilters = this.socialUserFilterService.getUserFilter();

    if (selectedFilters) {
      this.selectedFilters = selectedFilters;
    }

    this.onChangeDisclaimerSelect(true);
  }

  public verifyPositionArray(
    id: string,
    array: Array<DisclaimerFilterMonitor>
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

  public showFilter(): void {
    this.showMoreFilter = !this.showMoreFilter;
    this.buttonTitle = this.showMoreFilter
      ? this.literals['monitorFilters']['lessFilters']
      : this.literals['monitorFilters']['moreFilters'];
  }

  public async setDates(date: any, size: number): Promise<Array<number>> {
    const lastday = function (yyyy, mm) {
      return new Date(yyyy, mm, 0).getDate();
    };
    const year = date.substring(0, 4);
    const dates = [];
    let month = date.substring(4);

    if (size === 4) {
      month = 12;
      this.formFilter.get('periodFrom').setValue(`${year}-${'01'}-${'01'}`);
      this.formFilter.get('periodTo').setValue(`${year}-${month}-${lastday(year, month)}`);
    } else {
      if (size === 6) {
        this.formFilter.patchValue({ periodFrom: `${year}-${month}-${'01'}` });
        this.formFilter.patchValue({ periodTo: `${year}-${month}-${lastday(year, month)}` });
      } else {
        this.formFilter.patchValue({ periodFrom: '' });
        this.formFilter.patchValue({ periodTo: '' });
        this.onChangeNotPeriodics(null, 'periodFrom');
        this.onChangeNotPeriodics(null, 'periodTo');
      }
    }

    if (this.formFilter.get('period').errors == null) {
      dates.push(parseInt(year, 10));
      dates.push(parseInt(month, 10));
      dates.push(lastday(year, month));
      dates.push(size === 4 ? 1 : month);
    }

    return dates;
  }

  public onCheckMinPeriod(): string {
    return this.formFilter.get('periodFrom').value;
  }

  public saveParams(selectedFilter: DisclaimerFilterMonitor[]): void {
    this.socialUserFilterService.setUserFilter(selectedFilter);
  }

  public validPeriod(event: object, periodType: string): void {
    let date: string = JSON.stringify(event);
    while (date.indexOf('"') >= 0) {
      date = date.replace('"', '');
    }
    if (date.length === 10) {
      this.onChangeNotPeriodics(date, periodType);
    }
  }

  public validFilterMotive(): boolean {
    let isValid = false;

    if (this.isTAFFull) {
      this.selectedFilters.forEach(element => {
        if (element.id === 'event' && element.value === 'S-2230') {
          isValid = true;
        }
      });

      if (!isValid) {
        const filter = this.selectedFilters.filter(row => row.id !== 'motive');

        this.selectedFilters = filter;
      }
    }

    return isValid;
  }
}
