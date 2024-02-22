import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoProgressModule } from '@po-ui/ng-components';

import { FgtsReportProgressComponent } from './fgts-report-progress.component';

@NgModule({
  declarations: [
    FgtsReportProgressComponent
  ],
  imports: [
    CommonModule,
    PoProgressModule
  ],
  exports: [
    FgtsReportProgressComponent
  ]
})
export class FgtsReportProgressModule { }
