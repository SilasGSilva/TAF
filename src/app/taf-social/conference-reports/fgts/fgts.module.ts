import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { LegacyStatusEnvironmentModalModule } from '../../../shared/legacy-status-environment/legacy-status-environment-modal.module';
import { FgtsReportCardModule } from './fgts-report-card/fgts-report-card.module';
import { FgtsReportFilterModule } from './fgts-report-filter/fgts-report-filter.module';
import { FgtsReportProgressModule } from './fgts-report-progress/fgts-report-progress.module';
import { FgtsReportTableModule } from './fgts-report-table/fgts-report-table.module';
import { FgtsComponent } from './fgts.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [FgtsComponent],
  imports: [
    BrowserModule,
    FgtsReportFilterModule,
    FgtsReportCardModule,
    FgtsReportProgressModule,
    FgtsReportTableModule,
    PoPageModule,
    CoreModule,
    LegacyStatusEnvironmentModalModule,
  ],
  exports: [FgtsComponent],
})
export class FgtsModule {}
