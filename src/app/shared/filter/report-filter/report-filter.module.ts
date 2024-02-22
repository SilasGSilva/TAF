import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { PoFieldModule, PoButtonModule, PoWidgetModule, PoLoadingModule } from '@po-ui/ng-components';

import { SharedModule } from 'shared/shared.module';
import { ReportFilterComponent } from './report-filter.component';
import { ReportFilterService } from './report-filter.service';

@NgModule({
  declarations: [ ReportFilterComponent ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    PoFieldModule,
    PoButtonModule,
    PoWidgetModule,
    PoLoadingModule,
    SharedModule
  ],
  exports: [ ReportFilterComponent ],
  providers: [ ReportFilterService ]
})

export class ReportFilterModule { }
