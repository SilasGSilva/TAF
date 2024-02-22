import { Component, ViewChild } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'literals';
import { EventDescriptionService } from 'shared/event-description/event-description.service';
import { Reports } from '../../models/reports';
import { ReportValidationTableComponent } from './report-validation-table/report-validation-table.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  public literals: object;
  public event = '';
  public path = 'eventsReport';
  public description: string;
  public filter: Reports;
  public reportListing = false;
  public emptyResultSet = true;

  @ViewChild(ReportValidationTableComponent) reportValidationTableComponent: ReportValidationTableComponent;

  constructor(private literalService: LiteralService,
              private eventDescriptionService: EventDescriptionService,
              private poNotificationService: PoNotificationService) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  public getDescription(filter: Reports): void {
    const eventDescription = {
      eventDesc: filter.event
    };

    this.reportListing = false;
    this.emptyResultSet = true;
    this.event = filter.event !== 'events' ? filter.event : '';
    this.filter = filter;

    this.eventDescriptionService.getDescription(eventDescription)
      .subscribe(
        response => this.description = response.description,
        error => this.poNotificationService.error(error)
      );
  }

  public getReportListing(event): void {
    this.emptyResultSet = event.eventDetail.length == 0 ? true : false;
    if (event === 'R-2060') {
      if (!event[0].hasOwnProperty('existProcId')) {
        this.reportListing = true;
        setTimeout(() => {
          this.reportValidationTableComponent.setTableItem(event.eventDetail,event.hasNext);
        }, 10);
      } else {
        this.reportListing = false;
      }
    } else {
      this.reportListing = true;
        setTimeout(() => {
          this.reportValidationTableComponent.setTableItem(event.eventDetail,event.hasNext);
        }, 10);
    }
  }
}
