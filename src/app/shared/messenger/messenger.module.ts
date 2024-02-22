import { NgModule, Injectable } from '@angular/core';

import { PoModalModule } from '@po-ui/ng-components';

import { MessengerComponent } from 'shared/messenger/messenger.component';

@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [MessengerComponent],
  imports: [PoModalModule],
  exports: [MessengerComponent],
})
export class MessengerModule {}
