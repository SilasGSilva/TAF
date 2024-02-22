import { Component, OnInit, ViewChild } from '@angular/core';
import { LiteralService } from '../../../core/i18n/literal.service';
import { CertificateValidityService } from '../../../shared/certificate-validity/certificate-validity.service';
import { getBranchLoggedIn } from '../../../../util/util';
import { Events } from '../../../models/events';
import { Totalizer } from '../../../models/totalizer';
import { EventsNotPeriodics } from './../../../models/events-not-periodics';
import { ClosingEventComponent } from './closing-event/closing-event.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public literals = {};
  public isHideLoading = false;
  public eventsTotalizers: Array<Totalizer> = [];
  public eventsNotPeriodics: Array<EventsNotPeriodics> = [];
  public eventsPeriodics: Array<Events> = [];
  public errorMessage = false;
  public periodEmit: string;
  public isClosingEvent2099: boolean = false;
  public isClosingEvent4099: boolean = false;
  public disableButtonLogPeriodEmit = true;
  public isProductionRestrict = false;
  public isR1000Valid = false;
  public companyId = getBranchLoggedIn();
  public layoutReinf: string = '';
  public disableButtonClosingPeriod4099: boolean = true;
  private tafContext: string = sessionStorage.getItem('TAFContext');

  @ViewChild(ClosingEventComponent) closingEventComponent: ClosingEventComponent;

  constructor(
    private literalService: LiteralService,
    private certificateValidityService: CertificateValidityService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    if (this.tafContext === 'reinf') {
      this.certificateValidityService.canShowCertificate();
    }
  }

  public getEventsReinfTotalizer(event = []) {
    this.isHideLoading = true;
    this.eventsTotalizers.length = 0;

    for (let index = 0; index < event.length; index++) {
      this.eventsTotalizers.push(event[index]);
    }
  }

  public getEventsReinfNotPeriodics(event = []) {
    this.isHideLoading = true;
    this.eventsNotPeriodics.length = 0;

    for (let index = 0; index < event.length; index++) {
      this.eventsNotPeriodics.push(event[index]);
    }
  }

  public getEventsReinf(event = []) {
    this.eventsPeriodics.length = 0;
    this.errorMessage = false;

    for (let index = 0; index < event.length; index++) {
      this.eventsPeriodics.push(event[index]);
    }

    if (this.eventsPeriodics.length || this.eventsTotalizers.length) {
      this.isHideLoading = false;
    } else {
      this.errorMessage = true;
      this.isHideLoading = false;
    }
  }

  public hideClosingEvent(): boolean {
    return !(this.eventsTotalizers.length || this.eventsPeriodics.length);
  }

  public setStatusButtonLogPeriod(event): void {
    if (
      this.closingEventComponent != null &&
      this.closingEventComponent != undefined
    ) {
      this.closingEventComponent.setStatusButtonLogPeriod(event);
    }
  }

  public setStatusButtonClosingPeriod2099(disable): void {
    if (this.closingEventComponent != null && this.closingEventComponent != undefined ) {
      this.closingEventComponent.setStatusButtonClosingPeriod2099(disable);
    }
  }

  public setStatusButtonClosingPeriod4099(disable): void {
    this.disableButtonClosingPeriod4099 = disable;
  }

  public getStatusButtonLogPeriod(): boolean {
    return this.disableButtonLogPeriodEmit;
  }

  public setStatusPeriod(event): void {
    if (
      this.closingEventComponent != null &&
      this.closingEventComponent != undefined
    ) {
      this.closingEventComponent.setStatusPeriod(
        event.statusPeriod2099,
        event.protocol2099,
        event.statusPeriod4099,
        event.protocol4099
      );
    }
  }

  public setEnvironment(isProductionRestrict: boolean): void {
    this.isProductionRestrict = isProductionRestrict;
  }

  public setLayoutReinf(layoutReinf: string): void {
    this.layoutReinf = layoutReinf;
  }

  public setIsR1000(isR1000Valid: boolean): void {
    this.isR1000Valid = isR1000Valid;
  }

  public loadingRemoveCompany(loading: boolean) {
    this.isHideLoading = loading;
  }
}
