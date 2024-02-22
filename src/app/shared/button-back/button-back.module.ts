import { NgModule, Injectable } from '@angular/core';

import { ButtonBackComponent } from './button-back.component';
import { PoButtonModule } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [ButtonBackComponent],
  imports: [PoButtonModule],
  exports: [ButtonBackComponent],
})
export class ButtonBackModule {}
