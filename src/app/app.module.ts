import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AEIModule } from 'angular-erp-integration';
import { PoModule, PoPageModule } from '@po-ui/ng-components';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from 'shared/shared.module';
import { CoreModule } from 'core/core.module';
import { AuthModule } from 'auth/auth.module';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TafSocialModule } from './taf-social/taf-social.module';
import { InssModule } from './taf-social/conference-reports/inss/inss.module';
import { AppInitService } from './app-init.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PoModule,
    AEIModule,
    CoreModule,
    TafFiscalModule,
    TafSocialModule,
    InssModule,
    AuthModule,
    BrowserModule,
    PoPageModule,
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: AppInitService) => () => configService.initApp(),
      deps: [AppInitService],
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
