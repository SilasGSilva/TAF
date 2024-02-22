import { NgModule, Injectable } from '@angular/core';

import { PoModalModule, PoButtonModule, PoWidgetModule} from '@po-ui/ng-components';
import { DialogYesNoComponent } from './dialog-yes-no.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [DialogYesNoComponent],
  imports: [
    PoModalModule,
    PoButtonModule,
    PoWidgetModule],
  exports: [DialogYesNoComponent],
})
export class DialogYesNoModule {}
