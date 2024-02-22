import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PoPageModule } from '@po-ui/ng-components';
import { CoreModule } from 'core/core.module';
import { SocialCatComponent } from './social-cat.component';
import { CatFilterModule } from './cat-filter/cat-filter.module';
import { CatTableModule } from './cat-table/cat-table.module';
import { CatProgressModule } from './cat-progress/cat-progress.module';

@NgModule({
  declarations: [SocialCatComponent],
  imports: [
    BrowserModule,
    PoPageModule,
    CoreModule,
    CatFilterModule,
    CatTableModule,
    CatProgressModule
  ]
})
export class TafSocialCatModule { }
