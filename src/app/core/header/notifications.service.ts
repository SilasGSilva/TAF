import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from 'core/services/http.service';
import { HeaderNotification, NotificationActions } from './header.notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpService) {}

  public getNotificationNumber(): Observable<HeaderNotification> {
    return this.http.get(
      '/wstaf018/api/centralNotification/v1/quantityofnotificationsnotread'
    );
  }
  public getNotifications(): Observable<NotificationActions> {
    return this.http.get(
      '/wstaf018/api/centralNotification/v1/notificationsnotread'
    );
  }
}
