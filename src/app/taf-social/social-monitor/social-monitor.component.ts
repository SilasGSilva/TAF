import { Component, OnInit, ViewChild } from '@angular/core';
import { LiteralService } from '../../core/i18n/literal.service';
import { CertificateValidityService } from '../../shared/certificate-validity/certificate-validity.service';
import { LegacyStatusEnvironmentModalComponent } from '../../shared/legacy-status-environment/legacy-status-environment-modal.component';
import { EventRequest } from '../models/EventRequest';
import { ListEventsTotalizer } from '../models/list-events-totalizer';
import { SocialListEventService } from '../services/social-list-event/social-list-event.service';
import { SocialUserFilterService } from '../services/social-user-filter/social-user-filter.service';
import { MonitorEventsCardsService } from './monitor-events-cards/monitor-events-cards.service';
import { DisclaimerFilterMonitor } from './social-monitor-models/DisclaimerFilterMonitor';
import { EsocialMonitorHomeCardsRequest } from './social-monitor-models/EsocialMonitorHomeCardsRequest';
import { Filter } from './social-monitor-models/Filter';
import { SocialMonitorService } from './social-monitor.service';

@Component({
  selector: 'app-social-monitor',
  templateUrl: './social-monitor.component.html',
  styleUrls: ['./social-monitor.component.scss'],
})
export class SocialMonitorComponent implements OnInit {
  public showDetails = false;
  public isShowLoading = false;
  public isHideLoadingTransmission = true;
  public isButtonTransmissionDisabled = true;
  public isLoadingExecuteFilter = false;
  public disableButtonApplyFilters = true;
  public literals = {};
  public totalizerCards = [];
  public eventCards = [];
  public totalizadores = [];
  public syntheticCards = [];
  public filters: Array<DisclaimerFilterMonitor>;
  public pageLink = '/esocialMonitor';
  public menuContext: string;
  public userFilter: string;
  public request: EsocialMonitorHomeCardsRequest = new EsocialMonitorHomeCardsRequest();
  public EVENTS_TOTALIZER = ListEventsTotalizer;
  public total: any;
  public isTAFFull: boolean;
  public sendRejected = false;
  public isShowNotificationCertificate: boolean;
  public isContextEsocial: boolean;
  public unauthorizedEventMessage: string;
  public hasUnauthorizedEvents = false;

  @ViewChild(LegacyStatusEnvironmentModalComponent, { static: true })
  legacyStatusEnvironment: LegacyStatusEnvironmentModalComponent;

  constructor(
    private literalsService: LiteralService,
    private cardEventsService: MonitorEventsCardsService,
    private monitorService: SocialMonitorService,
    private certificateValidityService: CertificateValidityService,
    private socialUserFilterService: SocialUserFilterService,
    private socialListEventService: SocialListEventService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.isContextEsocial = this.menuContext === 'esocial';
    this.getFilter();
    this.certificateValidityService.canShowCertificate();
  }

  public getFilter(): void {
    const userFilter = this.socialUserFilterService.getUserFilter();

    if (userFilter) {
      this.renderDetails(userFilter, true);
    }
  }

  public renderDetails(
    childParams: Array<DisclaimerFilterMonitor>,
    cache?: boolean
  ): void {
    const companyId = this.monitorService.getCompany();

    let hasEvent = false;
    let hasGroup = false;

    this.showDetails = false;

    this.filters = childParams;

    if (this.filters) {
      this.saveFilters(this.filters);
    }

    this.request.companyId = companyId;
    this.request.branches = [];
    this.request.events = [];
    this.request.period = '';
    this.request.periodTo = '';
    this.request.periodFrom = '';
    this.request.motiveCode = [];
    this.request.filterStatus = [];
    this.request.eventGroups = [];

    this.isLoadingExecuteFilter = true;

    this.filters.forEach(filter => {
      if (filter.id === 'branch') {
        this.request.branches.push(filter.value);
      } else if (filter.id === 'event') {
        hasEvent = true;
        this.request.events.push(filter.value);
      } else if (filter.id === 'period') {
        this.request.period = filter.value.replace('/', '');
      } else if (filter.id === 'periodTo') {
        this.request.periodTo = filter.value.replace(/[-]/g, '');
      } else if (filter.id === 'periodFrom') {
        this.request.periodFrom = filter.value.replace(/[-]/g, '');
      } else if (filter.id === 'motive') {
        this.request.motiveCode.push(filter.value);
      } else if (filter.id === 'listStatus') {
        this.request.filterStatus.push(filter.value);
      } else if (filter.id === 'filEventGroups') {
        hasGroup = true;
        this.request.eventGroups.push(filter.value);
      }
    });

    if (!hasEvent && !hasGroup) {
      const params: EventRequest = {
        companyId
      };

      this.socialListEventService
      .getListEvents(params)
      .subscribe(
        response => {
          response.items.forEach(element => {
            if (element.permissionEvent ?? true) {
              this.request.events.push(element.eventCode);
            }
          });

          this.onLoadEventsCards(this.request, cache);
          this.isShowLoading = false;
        }, error => {
          this.isShowLoading = false;
          this.isLoadingExecuteFilter = false;
          this.disableButtonApplyFilters = false;
        }
      );
    } else {
      this.onLoadEventsCards(this.request, cache);
      this.isShowLoading = false;
    }
  }

  private onLoadEventsCards(params: Filter, cache: boolean): void {
    this.cardEventsService
      .getEventsCards(params, this.menuContext, this.isTAFFull, cache)
      .subscribe(
        payload => {
          this.showDetails = true;
          this.deActivateTransmission();
          this.clearFilters();

          payload?.items?.forEach(card => {
            if (card) {
              card['checked'] = false;

              this.EVENTS_TOTALIZER.hasOwnProperty(card['eventCode'])
                ? this.totalizerCards.push(card)
                : this.eventCards.push(card);
            }
          });
          this.isLoadingExecuteFilter = false;
          this.disableButtonApplyFilters = false;
        }, error => {
          this.isLoadingExecuteFilter = false;
          this.disableButtonApplyFilters = false;
        }
      );
  }

  public clearFilters(): void {
    this.eventCards = [];
    this.totalizerCards = [];
    this.syntheticCards = [];
  }

  public getPageLink(): string {
    return this.pageLink;
  }

  public onSelectEvent(enableTransmission: boolean): void {
    enableTransmission
      ? this.activateTransmission()
      : this.deActivateTransmission();
  }

  public activateTransmission(): void {
    this.isButtonTransmissionDisabled = false;
  }

  public deActivateTransmission(): void {
    this.isButtonTransmissionDisabled = true;
  }

  public onStartTransmission(): void {
    this.disableButtonApplyFilters = true;
    this.isHideLoadingTransmission = false;
  }

  public onFinishTransmission(): void {
    this.disableButtonApplyFilters = false;
    this.isHideLoadingTransmission = true;
    this.eventCards.forEach(card => (card.checked = false));
    this.deActivateTransmission();
  }

  public saveFilters(filter: DisclaimerFilterMonitor[]): void {
    this.socialUserFilterService.setUserFilter(filter);
  }

  public outputTotal(total): void {
    this.total = total;
  }
}
