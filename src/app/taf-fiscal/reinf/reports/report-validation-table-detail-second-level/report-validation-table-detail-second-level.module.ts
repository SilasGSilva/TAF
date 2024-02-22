import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableDetailsSecondLevelModule } from 'shared/table/table-details-second-level/table-details-second-level.module';
import { ReportValidationTableDetailSecondLevelComponent } from './report-validation-table-detail-second-level.component';

@NgModule({
  declarations: [ReportValidationTableDetailSecondLevelComponent],
  imports: [
    CommonModule,
    TableDetailsSecondLevelModule
  ],
  exports: [
    ReportValidationTableDetailSecondLevelComponent
  ]
})
export class ReportValidationTableDetailSecondLevelModule { }
