import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoPageLoginModule } from '@po-ui/ng-templates';

import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';

import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    PoPageLoginModule,
    ProtheusLibCoreModule
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }
