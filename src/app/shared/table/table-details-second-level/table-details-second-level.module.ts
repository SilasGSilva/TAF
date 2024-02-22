import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { PoTableModule } from '@po-ui/ng-components';

import { TableDetailsSecondLevelComponent } from './table-details-second-level.component';

@NgModule({
  declarations: [TableDetailsSecondLevelComponent],
  imports: [
    CommonModule,
    BrowserModule,
    PoTableModule,
  ],
  exports: [ TableDetailsSecondLevelComponent ]
})
export class TableDetailsSecondLevelModule { }
