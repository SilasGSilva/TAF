import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PoButtonModule, PoLoadingModule, PoModalModule, PoWidgetModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { MessengerModule } from 'shared/messenger/messenger.module';
import { MonitorHeaderActionsComponent } from './monitor-header-actions.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [MonitorHeaderActionsComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    CoreModule,
    PoButtonModule,
    PoWidgetModule,
    PoModalModule,
    MessengerModule,
    PoLoadingModule
  ],
  exports: [MonitorHeaderActionsComponent]
})
export class MonitorHeaderActionsModule {}
