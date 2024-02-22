import { PoToolbarActionsComponent } from '@po-ui/ng-components/lib/components/po-toolbar/po-toolbar-actions/po-toolbar-actions.component';
import { PoToolbarAction } from '@po-ui/ng-components';

export class HeaderNotification extends PoToolbarActionsComponent {
  public items: HeaderNotification;
}

export interface NotificationActions extends PoToolbarAction {
  items: Array<NotificationActions>;
  label: string;
  url: string;
}
