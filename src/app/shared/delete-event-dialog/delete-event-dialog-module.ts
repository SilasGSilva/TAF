import { NgModule, Injectable } from '@angular/core';

import { PoModalModule, PoButtonModule, PoWidgetModule} from '@po-ui/ng-components';
import { DeleteEventDialogComponent } from './delete-event-dialog.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [DeleteEventDialogComponent],
  imports: [
    PoModalModule,
    PoButtonModule,
    PoWidgetModule],
  exports: [DeleteEventDialogComponent],
})
export class DeleteEventDialogModule {}
