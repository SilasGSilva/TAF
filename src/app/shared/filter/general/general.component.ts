import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { PoNotificationService, PoMultiselectOption, PoSelectOption } from '@po-ui/ng-components';
import { LiteralService } from '../../../core/i18n/literal.service';
import { getBranchLoggedIn, valueIsNull } from '../../../../util/util';
import { GeneralService } from './general.service';
import { General } from '../../../models/general';
import { ReinfEvents } from './../../../models/reinfEvents';
import { ReinfEventsResponse } from './../../../models/reinfEvents-response';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  public literals: object;
  public literalsReinf: object;
  public formFilter: UntypedFormGroup;
  public statusOptions: Array<PoSelectOption> = [];
  public eventTypeOptions: Array<PoMultiselectOption>;
  public eventsOptions = [];
  public period: string;
  public disableButtonLogPeriod = true;
  private tafContext: string = sessionStorage.getItem('TAFContext');
  public companyId:string = getBranchLoggedIn();
  public groupOptions: Array<PoSelectOption> = [];
  public disableEvents: boolean = true;
  public optionGroupType: number = 1;

  @Input('taf-layout-reinf') layoutReinf: string;
  @Output('taf-events-reinf') events_reinf = new EventEmitter<any>();
  @Output('taf-events-reinf-not-periodics') events_not_periorics = new EventEmitter<any>();
  @Output('taf-totalizer') totalizer = new EventEmitter<any>();
  @Output('taf-load') load = new EventEmitter<boolean>();
  @Output('taf-period') periodEmit = new EventEmitter<string>();
  @Output('taf-status') statusEmit = new EventEmitter<any>();
  @Output('taf-button-log-period') disableButtonLogPeriodEmit = new EventEmitter<boolean>();
  @Output('taf-status-button-closing-period-2099') statusButtonClosingPeriod2099Emit = new EventEmitter<boolean>();
  @Output('taf-status-button-closing-period-4099') statusButtonClosingPeriod4099Emit = new EventEmitter<boolean>();
  @Output('taf-r1000-valid') isR1000Valid = new EventEmitter<boolean>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private generalService: GeneralService,
    private poNotificationService: PoNotificationService,
    private literalService: LiteralService
  ) {
    this.literals = this.literalService.literalsShared;
    this.literalsReinf = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.setStandardFildsFilter();
    this.setMultiOptionsField();
    this.findEvents();
    this.generalService.clearLogValidation();
    this.getdashboard();
    this.emitDisableButtonLogPeriod();
  }

  public async setMultiOptionsField(): Promise<void> {
    this.statusOptions = [
      { label: this.literals['filter']['all'], value: 1 },
      { label: this.literals['filter']['pendingValidation'], value: 2 },
      { label: this.literals['filter']['validated'], value: 3 },
      { label: this.literals['filter']['pendingTransmission'], value: 4 },
      { label: this.literals['filter']['returnWithErrors'], value: 5 },
      { label: this.literals['filter']['transmitted'], value: 6 },
      { label: this.literals['filter']['waitingForReturn'], value: 7 },
      { label: this.literals['filter']['noPending'], value: 9 },
    ];

    this.eventTypeOptions = [
      { label: this.literals['filter']['tables'], value: 1 },
      { label: this.literals['filter']['regular'], value: 2 },
      { label: this.literals['filter']['nonRegular'], value: 3 },
      { label: this.literals['filter']['totalizers'], value: 4 },
    ];

    if (this.layoutReinf >= '2_01_01') {
      this.groupOptions = [
        { label: this.literalsReinf['reinfFilter']['all']   , value: 1 },
        { label: this.literalsReinf['reinfFilter']['bloc20'], value: 2 },
        { label: this.literalsReinf['reinfFilter']['bloc40'], value: 3 },
      ];
    } else {
      this.groupOptions = [
        { label: this.literalsReinf['reinfFilter']['bloc20'], value: 2 },
      ];
    }
  }

  public setStandardFildsFilter(): void {
    this.formFilter = this.formBuilder.group({
      period: [this.getInicialPeriod(), Validators.required],
      groupType: [this.getInicialGroup(),],
      status: [this.getInicialStatus(), [Validators.required]],
      events: [this.getInicialEvents()],
      eventType: [this.getInicialEventType()],
    });
  }

  public findEvents(): void {
    if (this.tafContext === 'reinf') {
      this.disableEvents = true;
      var filter: General = this.formFilter.getRawValue();

      this.storageInputs();

      const params: ReinfEvents = {
        companyId: this.companyId,
        groupType: filter.groupType,
      };

      this.generalService.getReinfEvents(params).subscribe(response => {
        this.disableEvents = false;
        this.setEvents(response);
      }, error => {
        this.poNotificationService.error(error);
      });
    }
  }

  public setEvents(events: ReinfEventsResponse): void {
    this.eventsOptions.splice(0);
    if (!valueIsNull(events) && !valueIsNull(events.eventsReinf)) {
      this.generalService.setReadyBloc40(events.readyBloc40);
      events.eventsReinf.forEach(element => {
        this.eventsOptions.push({ label: element, value: element });
      });
    }
    /*
      Foi necessário buscar os eventos selecionados na sessionStorage para atribuir na variavel events.
      Pois os eventos da Reinf só podem ser selecionados após o retorno da função getReinfEvents()
    */
    this.formFilter.patchValue({
      events: this.getInicialEvents(),
    });
  }

  public async findDashboard(): Promise<void> {
    this.emitDisableButtonLogPeriod();
    this.emitStatusButtonClosingPeriod2099();
    this.emitStatusButtonClosingPeriod4099();

    const filter = this.formFilter.getRawValue() as General;
    filter.companyId = await getBranchLoggedIn();
    this.emitLoad(true);
    this.emitPeriod(filter.period);
    if (filter.events.length === 0 || !filter.events[0]) {
      filter.events[0] = 'Todos';
    }
    if (filter.eventType.length === 0 || !filter.eventType[0]) {
      filter.eventType[0] = 0;
    }
    this.generalService.getFilterDashboard(filter).subscribe(
      res => {
        this.emitTotalizerInfo(res.eventsReinfTotalizers);
        this.emitEventsReinfNotPeriodics(res.eventsReinfNotPeriodics);
        this.emitEventsReinfInfo(res.eventsReinf);
        this.emitEnableButtonRemoveCompany(res.eventsReinf);
        this.statusEmit.emit({
          statusPeriod2099: res.statusPeriod2099,
          protocol2099: res.protocol2099,
          statusPeriod4099: res.statusPeriod4099,
          protocol4099: res.protocol4099,
        });
      },
      err => {
        this.emitLoad(false);
        let errMsg: string;
        // Só apresento o Toast se a propriedade do JSON estiver preenchida, caso contrátrio, o Toast já foi apresentado na falha na requisição do httpclient
        if (!valueIsNull(err.error.errorMessage)) {
          errMsg = err.error.errorMessage;
          this.poNotificationService.error(errMsg);
        }
      }
    );

    // Guardo no local storage os inputs quando o botão Consultar for pressionado
    this.storageInputs();
  }

  public storageInputs(): void {
    if (this.formFilter.valid) {
      const filter = this.formFilter.getRawValue() as General;

      // periodo
      const periodTransformed = this.transformPeriod(filter.period);
      this.generalService.setInputPeriodMonitor(periodTransformed);

      // status
      this.generalService.setInputStatusMonitor(filter.status);

      // groupType
      this.generalService.setInputGroupMonitor(filter.groupType);

      // tipo de eventos selecionados
      this.generalService.setInputEventTypeMonitor(filter.eventType);
    }
  }

  public getdashboard(): void {
    if (this.formFilter.valid) {
      this.findDashboard();
    }
  }

  public getInicialPeriod(): string {
    return this.generalService.getInputPeriodMonitor();
  }

  public getInicialStatus(): number {
    return this.generalService.getInputStatusMonitor()
      ? this.generalService.getInputStatusMonitor()
      : 1;
  }

  public getInicialGroup(): number {
    if (this.layoutReinf >= '2_01_01') {
      this.optionGroupType = this.generalService.getInputGroupMonitor();
      return this.optionGroupType
        ? this.optionGroupType
        : 1;
    } else {
      return this.optionGroupType = 2;
    }
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

  public getInicialEvents(): Array<string> {
    return [''];
  }

  public getInicialEventType(): Array<number> {
    return this.generalService.getInputEventTypeMonitor()
      ? this.generalService.getInputEventTypeMonitor()
      : [0];
  }

  public setEventsOption(events): void {
    if (!valueIsNull(events) && !valueIsNull(events.eventsReinf)) {
      events.eventsReinf.forEach(element => {
        const otherResult = this.eventsOptions.find(
          result => result.value === element.event
        );

        if (!otherResult) {
          this.eventsOptions.push({
            label: element.event,
            value: element.event,
          });
        }
      });
    }

    if (!valueIsNull(events) && !valueIsNull(events.eventsReinfTotalizers)) {
      events.eventsReinfTotalizers.forEach(element => {
        const otherResult = this.eventsOptions.find(
          result => result.value === element.event
        );

        if (!otherResult) {
          this.eventsOptions.push({
            label: element.event,
            value: element.event,
          });
        }
      });
    }

    if (!valueIsNull(events) && !valueIsNull(events.eventsReinfNotPeriodics)) {
      events.eventsReinfNotPeriodics.forEach(element => {
        const otherResult = this.eventsOptions.find(
          result => result.value === element.event
        );

        if (!otherResult) {
          this.eventsOptions.push({
            label: element.event,
            value: element.event,
          });
        }
      });
    }
  }

  public emitDisableButtonLogPeriod(): void {
    // Desabilita o botão de log de trasmissãso dos eventos R-2098 e R-2099 no component ClosingEventComponent .
    this.disableButtonLogPeriod = true;
    this.disableButtonLogPeriodEmit.emit(this.disableButtonLogPeriod);
  }

  public emitStatusButtonClosingPeriod2099(): void {
    let optionGroup: number = this.getInicialGroup();
    let disable: boolean = optionGroup === 3;

    this.statusButtonClosingPeriod2099Emit.emit(disable);
  }

  public emitStatusButtonClosingPeriod4099(): void {
    let optionGroup: number = this.getInicialGroup();
    let databaseReadyBloc40: boolean = this.generalService.getReadyBloc40();
    let disable: boolean = optionGroup === 2 || !databaseReadyBloc40;

    this.statusButtonClosingPeriod4099Emit.emit(disable);
  }

  public emitEnableButtonRemoveCompany(eventsReinf): void {
    if (
      !valueIsNull(eventsReinf) &&
      eventsReinf.length > 0 &&
      (eventsReinf[0]['totalMonitoring'] > 0 ||
        eventsReinf[0]['totalValidation'] > 0)
    ) {
      this.isR1000Valid.emit(true);
    } else {
      this.isR1000Valid.emit(false);
    }
  }

  public emitTotalizerInfo(eventsReinfTotalizer): void {
    this.totalizer.emit(eventsReinfTotalizer);
  }

  public emitEventsReinfInfo(eventsReinf): void {
    this.events_reinf.emit(eventsReinf);
  }

  public emitEventsReinfNotPeriodics(EventsNotPeriodics): void {
    this.events_not_periorics.emit(EventsNotPeriodics);
  }

  public emitLoad(isLoad: boolean): void {
    this.load.emit(isLoad);
  }

  public emitPeriod(period: string): void {
    this.periodEmit.emit(period);
  }

  public ifFormValid(): boolean {
    return !this.formFilter.valid;
  }
  public transformPeriod(period: string): string {
    return period.split('/').join('');
  }
}
