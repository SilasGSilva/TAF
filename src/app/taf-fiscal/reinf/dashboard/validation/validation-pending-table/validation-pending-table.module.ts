import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PoModalModule, PoFieldModule } from '@po-ui/ng-components';

import { ValidationPendingTableComponent } from './validation-pending-table.component';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { TableModule } from 'shared/table/table.module';

@NgModule({
  declarations: [
    ValidationPendingTableComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    TableModule,
    PoModalModule,
    PoFieldModule,
    FormsModule
  ],
  exports: [
    ValidationPendingTableComponent
  ],
  providers: [MasksPipe]
})
export class ValidationPendingTableModule { }
