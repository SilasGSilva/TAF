import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  PoBreadcrumbModule,
  PoDisclaimerGroupModule,
  PoFieldModule,
  PoLoadingModule,
  PoPageModule,
} from '@po-ui/ng-components';
import { CoreModule } from '../../core/core.module';
import { ButtonBackModule } from '../../shared/button-back/button-back.module';
import { LegacyStatusEnvironmentModalModule } from '../../shared/legacy-status-environment/legacy-status-environment-modal.module';
import { LegacyStatusEnvironmentSocialService } from '../../shared/legacy-status-environment/services/legacy-status-environment.service';
import { MonitorEventsCardsModule } from './monitor-events-cards/monitor-events-cards.module';
import { MonitorFilterModule } from './monitor-filter/monitor-filter.module';
import { MonitorHeaderActionsModule } from './monitor-header-actions/monitor-header-actions.module';
import { MonitorStatusEnvironmentModule } from './monitor-status-environment/monitor-status-environment.module';
import { MonitorSyntheticCardModule } from './monitor-synthetic-card/monitor-synthetic-card.module';
import { MonitorTotalizerCardsModule } from './monitor-totalizer-cards/monitor-totalizer-cards.module';
import { SocialMonitorComponent } from './social-monitor.component';
import { SocialMonitorRoutingModule } from './social-monitor.routing.module';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [SocialMonitorComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    SocialMonitorRoutingModule,
    CoreModule,
    PoPageModule,
    PoBreadcrumbModule,
    PoDisclaimerGroupModule,
    PoLoadingModule,
    MonitorEventsCardsModule,
    MonitorFilterModule,
    MonitorSyntheticCardModule,
    MonitorHeaderActionsModule,
    MonitorTotalizerCardsModule,
    ButtonBackModule,
    LegacyStatusEnvironmentModalModule,
    PoFieldModule,
    MonitorStatusEnvironmentModule,
  ],
  providers: [LegacyStatusEnvironmentSocialService],
})
export class SocialMonitorModule {}
