import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoTableModule } from '@po-ui/ng-components';

import { TableDetailsComponent } from './table-details.component';
import { TableDetailsSecondLevelModule } from '../table-details-second-level/table-details-second-level.module';
import { ValidationPendingTableDetailSecondLevelModule } from 'taf-fiscal/reinf/dashboard/validation/validation-pending-table-detail-second-level/validation-pending-table-detail-second-level.module';
import { TransmissionPendingTableDetailSecondLevelModule } from 'taf-fiscal/reinf/dashboard/transmission/transmission-pending-table-detail-second-level/transmission-pending-table-detail-second-level.module';
import { ReportValidationTableDetailSecondLevelModule } from 'taf-fiscal/reinf/reports/report-validation-table-detail-second-level/report-validation-table-detail-second-level.module';

@NgModule({
  declarations: [TableDetailsComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoTableModule,
    TableDetailsSecondLevelModule,
    ValidationPendingTableDetailSecondLevelModule,
    TransmissionPendingTableDetailSecondLevelModule,
    ReportValidationTableDetailSecondLevelModule
  ],
  exports: [TableDetailsComponent]
})
export class TableDetailsModule { }
