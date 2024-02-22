import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';

import { PoNotificationService,PoSelectOption } from '@po-ui/ng-components';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LiteralService } from 'literals';
import { ReportFilterService } from './report-filter.service';
import { ListEventsReinf } from '../../../models/list-events-reinf';
import { getBranchLoggedIn, valueIsNull } from '../../../../util/util';
import { ReportReinfEventsResponse } from './../../../models/report-reinf-events-response';
import { ReportReinfEventsRequest } from './../../../models/report-reinf-events-request';
import { General } from './../../../models/general';
import { EventListing } from './../../../models/event-listing';

@Component({
  selector: 'app-report-filter',
  templateUrl: './report-filter.component.html',
  styleUrls: ['./report-filter.component.scss'],
})
export class ReportFilterComponent implements OnInit, OnDestroy {
  public literals: object;
  public literalsReinf: object;
  public groupTypeReport: number = 1;
  public formFilter = new UntypedFormGroup({
    period: new UntypedFormControl(this.getInicialPeriod(), [Validators.required]),
    event: new UntypedFormControl('Eventos', Validators.required),
    groupType: new UntypedFormControl(this.getInicialGroup(),),
    page: new UntypedFormControl('page',),
    pageSize: new UntypedFormControl('pageSize',),
  });

  public period = '';
  public isLoading = false;
  public loadingOverlay = false;
  public eventsOptions: Array<PoSelectOption> = [];
  public debounce: Subject<string> = new Subject<string>();
  public EVENTS_REINF = ListEventsReinf;
  public companyId: string = ' ';
  public pageSize: number = 20;
  public payload: EventListing;
  public groupOptions: Array<PoSelectOption> = [];
  public disableEvents: boolean = false;

  @Output('taf-filter') filter = new EventEmitter<string>();
  @Output('taf-report-listing') reportListing = new EventEmitter<any>();

  constructor(
    private reportFilterService: ReportFilterService,
    private datePipe: DatePipe,
    private literalService: LiteralService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsShared;
    this.literalsReinf = this.literalService.literalsTafFiscal;
  }

  async ngOnInit(): Promise<void> {
    this.companyId = await getBranchLoggedIn();
    this.setMultiOptionsField();
    this.findEvents();
  }

  public setMultiOptionsField(): void {
    this.groupOptions = [
      { label: this.literalsReinf['reinfFilter']['all']   , value: 1 },
      { label: this.literalsReinf['reinfFilter']['bloc20'], value: 2 },
      { label: this.literalsReinf['reinfFilter']['bloc40'], value: 3 },
    ];
  }

  public findEvents(): void {
    var filter = this.formFilter.getRawValue() as General;
    var params: ReportReinfEventsRequest = {
      companyId: this.companyId,
      groupType: filter.groupType,
    };

    this.disableEvents = true;
    this.loadingOverlay = true;

    this.reportFilterService.getReinfEvents(params).subscribe(response => {
      this.setEvents(response);

      this.loadingOverlay = false;
      this.disableEvents = false;
      this.emitFilter();
    });
  }

  public setEvents(events: ReportReinfEventsResponse): void {
    if(!valueIsNull(events) && !valueIsNull(events.eventsReinf)) {
      this.eventsOptions.length = 0;
      this.eventsOptions = [];
      events.eventsReinf.forEach(element => {
        this.eventsOptions.push({ label: element, value: element });
      });
    }
  }

  ngOnDestroy(): void {
    this.debounce.unsubscribe();
  }

  public getInicialPeriod(): string {
  return this.reportFilterService.getInputPeriod()
    ? this.reportFilterService.getInputPeriod()
    : this.datePipe.transform(this.getRegularDate(), 'MMyyyy');
  }

  public getRegularDate(): Date {
    const newDate = new Date();

    if (newDate.getMonth() === 0) {
      newDate.setFullYear(newDate.getFullYear() - 1);
      newDate.setMonth(11);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    return newDate;
  }

  public getInicialGroup(): number {
    this.groupTypeReport = this.reportFilterService.getInputGroupMonitor();
    return this.groupTypeReport;
  }

  public setEventsOption(events): void {

    events.eventsReinf.forEach(element => {
      const otherResult = this.eventsOptions.find(
        result => result.value === element.event
      );

      if (!otherResult) {
        this.eventsOptions.push({ label: element.event, value: element.event });
      }
    });

    events.eventsReinfTotalizers.forEach(element => {
      const otherResult = this.eventsOptions.find(
        result => result.value === element.event
      );

      if (!otherResult) {
        this.eventsOptions.push({ label: element.event, value: element.event });
      }
    });

    this.isLoading = false;
  }

  public ifFormValid(): boolean {
    return (
      !this.formFilter.valid ||
      !this.EVENTS_REINF.hasOwnProperty(this.formFilter.get('event').value)
    );
  }

  public getReportListing(): void {
    const filter = this.formFilter.getRawValue();
    const payload = {
      period: filter.period,
      event: filter.event,
      companyId: this.companyId,
      page: 1,
      pageSize: this.pageSize,
    };
    this.setStatusLoading(true);
    this.reportFilterService.getReportListing(payload).subscribe(response => {
      this.emitReportListing(response);
      this.storageInputs();
      this.setStatusLoading(false);
    });
  }

  public emitReportListing(eventDetail): void {
    this.reportListing.emit(eventDetail);
  }

  public emitFilter(): void {
    const filter = this.formFilter.getRawValue();
    this.filter.emit(filter);
  }

  public transformPeriod(period: string): string {
    return period.split('/').join('');
  }

  public setStatusLoading(status: boolean): void {
    this.loadingOverlay = status;
  }

  public storageInputs(): void {
    var filter: General = this.formFilter.getRawValue();
    this.reportFilterService.setInputGroupMonitor(filter.groupType);
  }
}
