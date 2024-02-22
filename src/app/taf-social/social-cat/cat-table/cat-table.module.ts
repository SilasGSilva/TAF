import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PoButtonModule,
  PoFieldModule,
  PoTableModule
} from '@po-ui/ng-components';
import { PipeModule } from 'shared/pipe/pipe.module';
import { CatReportModule } from './../cat-report/cat-report.module';
import { CatTableComponent } from './cat-table.component';

@NgModule({
  declarations: [CatTableComponent],
  imports: [
    CommonModule,
    PoFieldModule,
    PoTableModule,
    PoButtonModule,
    CatReportModule,
    PipeModule
  ],
  exports: [CatTableComponent]
})
export class CatTableModule { }
