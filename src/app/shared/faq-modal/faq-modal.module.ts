import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoAccordionModule, PoContainerModule, PoLinkModule, PoModalModule } from '@po-ui/ng-components';
import { FaqModalComponent } from './faq-modal.component';

@NgModule({
  declarations: [FaqModalComponent],
  imports: [
      CommonModule,
      PoModalModule,
      PoAccordionModule,
      PoContainerModule,
      BrowserAnimationsModule,
      PoLinkModule
  ],
  exports: [FaqModalComponent],
})
export class FaqModalModule{}
