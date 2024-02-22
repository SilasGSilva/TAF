import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationPendingTableDetailComponent } from './validation-pending-table-detail.component';
import { TableDetailsModule } from 'shared/table/table-details/table-details.module';

@NgModule({
  declarations: [ValidationPendingTableDetailComponent],
  imports: [
    CommonModule,
    TableDetailsModule
  ],
  exports: [
    ValidationPendingTableDetailComponent
  ]
})
export class ValidationPendingTableDetailModule { }
