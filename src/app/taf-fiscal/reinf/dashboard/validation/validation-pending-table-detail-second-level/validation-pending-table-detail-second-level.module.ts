import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableDetailsSecondLevelModule } from 'shared/table/table-details-second-level/table-details-second-level.module';
import { ValidationPendingTableDetailSecondLevelComponent } from './validation-pending-table-detail-second-level.component';

@NgModule({
  declarations: [ValidationPendingTableDetailSecondLevelComponent],
  imports: [
    CommonModule,
    TableDetailsSecondLevelModule
  ],
  exports: [
    ValidationPendingTableDetailSecondLevelComponent
  ]
})
export class ValidationPendingTableDetailSecondLevelModule { }
