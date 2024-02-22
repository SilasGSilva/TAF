import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoFieldModule, PoButtonModule, PoDropdownModule, PoLoadingModule } from '@po-ui/ng-components';

import { ExportReportComponent } from './export-report.component';
import { ExportReportService } from './export-report.service';
import { MessengerModule } from 'shared/messenger/messenger.module';

@NgModule({
  declarations: [ExportReportComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoFieldModule,
    PoButtonModule,
    MessengerModule,
    PoDropdownModule ,
    PoLoadingModule,
  ],
  exports: [ExportReportComponent],
  providers: [ExportReportService, DecimalPipe, PercentPipe],
})
export class ExportReportModule {}
