import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  PoBreadcrumbModule,
  PoButtonModule,
  PoI18nConfig,
  PoI18nModule,
  PoMenuModule,
  PoModalModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';
import { MonitorStatusEnvironmentModule } from '../taf-social/social-monitor/monitor-status-environment/monitor-status-environment.module';

import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import { ButtonBackModule } from '../shared/button-back/button-back.module';
import { PageNotFoundModule } from './errors/page-not-found/page-not-found.module';
import { HeaderComponent } from './header/header.component';
import { authPt } from './i18n/auth-pt';
import { corePt } from './i18n/core-pt';
import { generalEn } from './i18n/general-en';
import { generalPt } from './i18n/general-pt';
import { LiteralService } from './i18n/literal.service';
import { sharedPt } from './i18n/shared-pt';
import { tafFiscalPt } from './i18n/taf-fiscal-pt';
import { tafSocialPt } from './i18n/taf-social-pt';
import { MenuComponent } from './menu/menu.component';
import { HttpService } from './services/http.service';
import { VersionComponent } from './version/version.component';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    general: {
      'pt-BR': generalPt,
      'en-US': generalEn,
    },
    shared: {
      'pt-BR': sharedPt,
    },
    core: {
      'pt-BR': corePt,
    },
    tafFiscal: {
      'pt-BR': tafFiscalPt,
    },
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
    auth: {
      'pt-BR': authPt,
    },
  },
};

@NgModule({
  declarations: [MenuComponent, HeaderComponent, VersionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoI18nModule.config(i18nConfig),
    PoMenuModule,
    PoToolbarModule,
    PoPageModule,
    PoButtonModule,
    PoModalModule,
    PageNotFoundModule,
    PoBreadcrumbModule,
    ProtheusLibCoreModule,
    ButtonBackModule,
    MonitorStatusEnvironmentModule,
  ],
  exports: [MenuComponent, HeaderComponent, VersionComponent],
  providers: [LiteralService, HttpService],
})
export class CoreModule {}
