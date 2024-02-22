import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModalModule, PoButtonModule, PoDropdownModule } from '@po-ui/ng-components';
import { CatServices } from './../cat-filter/services/cat.service';
import { CatPrintReportService } from './services/cat-print-report.service';
import { CatReportComponent } from './cat-report.component';
import { SafeUrlPdf } from './safe-url-pdf.pipe';

@NgModule({
  declarations: [
    CatReportComponent,
    SafeUrlPdf
  ],
  imports: [
    CommonModule,
    PoModalModule,
    PoButtonModule,
    PoDropdownModule
  ],
  exports: [
    CatReportComponent
  ],
  providers: [
    CatServices,
    CatPrintReportService
  ]
})
export class CatReportModule { }
