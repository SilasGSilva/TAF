import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { MasksPipe } from './masks.pipe';

@NgModule({
  declarations: [
    MasksPipe,
    FilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [FilterPipe]
})
export class PipeModule { }
