import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDisclaimerGroupModule,
  PoFieldModule,
  PoPopoverModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { CatEnvironmentService } from './services/cat-enviroment.service';
import { CatServices } from './services/cat.service';
import { CatFilterComponent } from './cat-filter.component';

@NgModule({
    declarations: [CatFilterComponent],
    imports: [
        CommonModule,
        PoWidgetModule,
        PoFieldModule,
        PoButtonModule,
        PoDisclaimerGroupModule,
        FormsModule,
        ReactiveFormsModule,
        PoPopoverModule,
    ],
    exports: [CatFilterComponent],
    providers: [
        CatServices,
        CatEnvironmentService,
    ],
})
export class CatFilterModule {}
