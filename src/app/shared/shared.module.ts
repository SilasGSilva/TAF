import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import {
  PoFieldModule,
  PoWidgetModule,
  PoTableModule,
  PoBreadcrumbModule,
  PoPageModule,
  PoButtonModule,
  PoContainerModule,
  PoDropdownModule,
} from '@po-ui/ng-components';

import { GeneralService } from './filter/general/general.service';
import { CardComponent } from './card/card.component';
import { PeriodicReportsComponent } from './card/events/periodic-reports/periodic-reports.component';
import { TotalizerComponent } from './card/events/totalizer/totalizer.component';
import { NotPeriodicsComponent } from './card/events/not-periodics/not-periodics.component';
import { GeneralComponent } from './filter/general/general.component';
import { CoreModule } from './../core/core.module';
import { VmessageComponent } from './vmessage/vmessage.component';
import { StepperComponent } from './stepper/stepper.component';
import { CheckFeaturesService } from './check-features/check-features.service';
import { ButtonBackModule } from './button-back/button-back.module';
import { PipeModule } from './pipe/pipe.module';
import { DeleteEventDialogModule } from './delete-event-dialog/delete-event-dialog-module';

@NgModule({
  declarations: [
    CardComponent,
    GeneralComponent,
    TotalizerComponent,
    NotPeriodicsComponent,
    PeriodicReportsComponent,
    VmessageComponent,
    StepperComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoWidgetModule,
    PoFieldModule,
    PoButtonModule,
    PoTableModule,
    PoContainerModule,
    PoBreadcrumbModule,
    PoPageModule,
    CoreModule,
    ButtonBackModule,
    PipeModule,
    DeleteEventDialogModule,
    PoDropdownModule ,
  ],
  exports: [
    CardComponent,
    GeneralComponent,
    TotalizerComponent,
    NotPeriodicsComponent,
    PeriodicReportsComponent,
    VmessageComponent,
    StepperComponent,
  ],
  providers: [GeneralService, CheckFeaturesService],
})
export class SharedModule {}
