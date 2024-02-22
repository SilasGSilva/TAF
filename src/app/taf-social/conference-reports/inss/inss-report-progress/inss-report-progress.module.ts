import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoProgressModule } from '@po-ui/ng-components';

import { InssReportProgressComponent } from './inss-report-progress.component';

@NgModule({
  declarations: [
    InssReportProgressComponent
  ],
  imports: [
    CommonModule,
    PoProgressModule
  ],
  exports: [
    InssReportProgressComponent
  ]
})
export class InssReportProgressModule { }
