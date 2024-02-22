import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PoBreadcrumbModule, PoButtonModule, PoDisclaimerGroupModule, PoFieldModule, PoLoadingModule, PoModalModule, PoPageModule, PoTableModule, PoDropdownModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { EditorXMLModule } from '../../editor-xml/editor-xml.module';
import { CatReportModule } from './../../social-cat/cat-report/cat-report.module';
import { MonitorHeaderActionsModule } from '../monitor-header-actions/monitor-header-actions.module';
import { SocialMonitorRoutingModule } from '../social-monitor.routing.module';
import { MonitorDetailComponent } from './monitor-detail.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [MonitorDetailComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    SocialMonitorRoutingModule,
    MonitorHeaderActionsModule,
    CoreModule,
    PoPageModule,
    PoBreadcrumbModule,
    PoDisclaimerGroupModule,
    PoLoadingModule,
    PoTableModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    EditorXMLModule,
    CatReportModule,
    PoDropdownModule
  ],
})
export class MonitorDetailModule {}
