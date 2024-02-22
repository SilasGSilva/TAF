import { PoNotification } from '@po-ui/ng-components/lib/services/po-notification/po-notification.interface';

export class PoNotificationServiceMock {
  createToaster(): void {
    return;
  }
  warning(notification: PoNotification | string): void {
    return;
  }
  success(notification: PoNotification | string): void {
    return;
  }
  error(notification: PoNotification | string): void {
    return;
  }
}
