import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoProgressModule } from '@po-ui/ng-components';
import { CatProgressComponent } from './cat-progress.componet';

@NgModule({
  declarations: [CatProgressComponent],
  imports: [CommonModule, PoProgressModule ],
  exports: [CatProgressComponent]
})
export class CatProgressModule { }
