import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PoModalModule, PoWidgetModule, PoDisclaimerGroupModule, PoButtonModule, PoFieldModule } from '@po-ui/ng-components';

import { FgtsReportFilterComponent } from './fgts-report-filter.component';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [
    FgtsReportFilterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoButtonModule,
    PoDisclaimerGroupModule,
    PoWidgetModule,
    PoModalModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    FgtsReportFilterComponent
  ]
})
export class FgtsReportFilterModule { }
