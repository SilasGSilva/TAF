import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoPageModule, PoButtonModule } from '@po-ui/ng-components';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [CommonModule, PoPageModule, PoButtonModule],
})
export class PageNotFoundModule {}
