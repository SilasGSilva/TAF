import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LiteralService } from 'core/i18n/literal.service';
import { Monitoring } from '../../../../models/monitoring';
import { ListEventsReinf } from '../../../../models/list-events-reinf';
import { ListEventsReinfBlock20 } from '../../../../models/list-events-reinf-block-20';
import { ListEventsReinfBlock40 } from '../../../../models/list-events-reinf-block-40';

@Component({
  selector: 'app-periodic-reports',
  templateUrl: './periodic-reports.component.html',
  styleUrls: ['./periodic-reports.component.scss'],
})
export class PeriodicReportsComponent implements OnInit {
  public literals: object;
  public statusButton: string;
  public isHideWaitingReturn: boolean = true;
  public isHideReturnWithErrors: boolean = true;
  public disabledButton: boolean = false;
  public disabledNoPendingCard: boolean = false;
  public EVENTS_REINF = ListEventsReinf;
  public eventsBlock20 = ListEventsReinfBlock20;
  public eventsBlock40 = ListEventsReinfBlock40;

  @Input('taf-event') event: string;
  @Input('taf-descriptionEvent') descriptionEvent: string;
  @Input('taf-monitoring') monitoring: Array<Monitoring>;
  @Input('taf-statusMonitoring') statusMonitoring: number;
  @Input('taf-total') total: number;
  @Input('taf-totalInvoice') totalInvoice: number;
  @Input('taf-totalValidation') totalValidation: number;
  @Input('taf-totalNotValidation') totalNotValidation: number;
  @Input('taf-period') period: string;
  @Input('taf-metrics') metrics: string;
  @Input('taf-disabled-card-2099') disabledCard2099: boolean = false;
  @Input('taf-disabled-card-4099') disabledCard4099: boolean = false;
  @Input('taf-totalizer-literals') totalizerLiterals: string;

  constructor(private literalService: LiteralService, private router: Router) {
    this.literals = this.literalService.literalsShared;
  }

  ngOnInit() {
    this.getStatusButton();
    this.getTotalizerLiterals();
  }

  public getTotalTransmited(): number {
    let totalTransmited = 0;
    if (this.totalNotValidation === 0 && this.totalValidation > 0) {
      if (this.monitoring.length) {
        this.monitoring.forEach(element => {
          if (element.statusCode !== 0 && element.statusCode !== 7) {
            totalTransmited += element.quantity;
          }
        });
      }
    }
    return totalTransmited;
  }

  public getTotalizerLiterals(): void {
    if (this.event === 'R-4080') {
      this.totalizerLiterals = this.literals['periodicReports']['totalPayments'];
    } else {
      this.totalizerLiterals = this.literals['periodicReports']['totalInvoice'];
    }
  }

  public getStatusButton(): void {
    if (this.totalNotValidation > 0) {
      this.statusButton = `${
        this.literals['periodicReports']['pendingValidation']
      } (${this.totalNotValidation})`;
    } else {
      if (this.monitoring.length) {
        let totalFollow = 0
        this.monitoring.forEach(element => {
          if (
            this.totalNotValidation === 0 &&
            this.totalValidation > 0 &&
            this.statusMonitoring === 0
          ) {
            if (element.statusCode === 0) {
              this.statusButton = `${
                this.literals['periodicReports']['toTransmit']
              } (${element.quantity})`;
            }
          } else if (this.statusMonitoring === 2) {
            if (element.statusCode === 2 || element.statusCode === 3 ) {
              totalFollow += element.quantity
            }
            this.isHideWaitingReturn = false;
          } else if (this.statusMonitoring === 3) {
            if (element.statusCode === 2 || element.statusCode === 3 ) {
              totalFollow += element.quantity
            }
            this.isHideReturnWithErrors = false;
          } else {
            this.statusButton = this.literals['periodicReports']['noPending'];
            this.disabledButton = true;
          }
        });
        if ((this.statusMonitoring === 2) || (this.statusMonitoring === 3)) {
          this.statusButton = `${
          this.literals['periodicReports']['follow']
          } (${totalFollow})`;
        }
      } else {
        this.statusButton = this.literals['periodicReports']['noPending'];
        this.disabledButton = true;
      }
    }

    if (!this.EVENTS_REINF.hasOwnProperty(this.event)) {
      this.disabledButton = true;
      this.disabledNoPendingCard = true;
    }
  }
  public onClick(): void {
    const param = {
      event: this.event,
      period: this.period,
    };

    let transmission = false;

    if (this.totalNotValidation > 0) {
      this.router.navigate(['/eventsMonitor/validation'], {
        queryParams: param,
      });
    } else if (this.monitoring.length) {
      this.monitoring.forEach(element => {
        if (
          this.totalNotValidation === 0 &&
          this.totalValidation > 0 &&
          element.statusCode === 0
        ) {
          transmission = true;
        }
      });

      if (transmission) {
        this.router.navigate(['/eventsMonitor/transmission'], {
          queryParams: param,
        });
      } else {
        this.router.navigate(['/eventsMonitor/event-monitor'], {
          queryParams: param,
        });
      }
    }
  }

  public isDisabled(): object {
    if (this.event === 'R-1070' ) {
      if (this.disabledCard2099 && this.disabledCard4099 || this.disabledNoPendingCard) {
        return { color: '#b6bdbf' };
      }
    } else {
      if ((this.eventsBlock20.hasOwnProperty(this.event) && this.disabledCard2099) || this.disabledNoPendingCard) {
        return { color: '#b6bdbf' };
      } else if ((this.eventsBlock40.hasOwnProperty(this.event) && this.disabledCard4099) || this.disabledNoPendingCard) {
        return { color: '#b6bdbf' };
      }
    }
  }

  public isButtonDisabled(): boolean {
    if (this.event === 'R-1070' ) {
      if (this.disabledCard2099 && this.disabledCard4099 || this.disabledButton) {
        return true;
      } else {
        return false;
      }
    } else {
      if ((this.eventsBlock20.hasOwnProperty(this.event) && this.disabledCard2099) || this.disabledButton) {
        return true;
      } else if ((this.eventsBlock40.hasOwnProperty(this.event) && this.disabledCard4099) || this.disabledButton) {
        return true;
      } else {
        return false;
      }
    }
  }

  public classValidated(): object {
    if (this.pendingTransmission()) {
      return { clickable: true };
    }
  }

  public classDeleted(): object {
    if (this.totalDeleted()) {
      return { clickable: true };
    }
  }

  public classTransmited(): object {
    if (this.totalTransmited()) {
      return { clickable: true };
    }
  }

  public goToTransmission(): void {
    const param = {
      event: this.event,
      period: this.period,
      filtered: false,
      eventSearch: '',
    };

    if (this.pendingTransmission()) {
      this.router.navigate(['/eventsMonitor/transmission'], {
        queryParams: param,
      });
    }
  }

  public goToTransmissionDel(): void {
    const param = {
      event: 'R-9000',
      period: this.period,
      eventSearch: this.event,
    };

    if (this.totalDeleted()) {
      this.router.navigate(['/eventsMonitor/transmission'], {
        queryParams: param,
      });
    }
  }

  public goToMonitoring(): void {
    const param = {
      event: this.event,
      period: this.period,
    };
    if (this.totalTransmited()) {
      this.router.navigate(['/eventsMonitor/event-monitor'], {
        queryParams: param,
      });
    }
  }

  public totalTransmited(): number {
    let totalTransmitedFiltered = 0;

    if (this.monitoring.length) {
      this.monitoring.forEach(element => {
        if (element.statusCode !== 0 && element.statusCode !== 7) {
          totalTransmitedFiltered += element.quantity;
        }
      });
    }

    return totalTransmitedFiltered;
  }

  public totalDeleted(): number {
    let totalDeletedFiltered = 0;

    if (this.monitoring.length) {
      this.monitoring.forEach(element => {
        if (element.statusCode === 7) {
          totalDeletedFiltered += element.quantity;
        }
      });
    }

    return totalDeletedFiltered;
  }

  public pendingTransmission(): number {
    let totalPendingFiltered = 0;

    if (this.monitoring.length) {
      this.monitoring.forEach(element => {
        if (element.statusCode === 0) {
          totalPendingFiltered = element.quantity;
        }
      });
    }

    return totalPendingFiltered;
  }
}
