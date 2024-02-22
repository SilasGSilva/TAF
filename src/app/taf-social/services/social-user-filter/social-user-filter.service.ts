import { Injectable } from '@angular/core';
import { DisclaimerFilterMonitor } from '../../../taf-social/social-monitor/social-monitor-models/DisclaimerFilterMonitor';

@Injectable({
  providedIn: 'root',
})
export class SocialUserFilterService {
  private _userFilterValue: DisclaimerFilterMonitor[];

  constructor() {}

  public setUserFilter(userFilter: DisclaimerFilterMonitor[]): void {
    this._userFilterValue = userFilter;
  }

  public getUserFilter(): DisclaimerFilterMonitor[] {
    return this._userFilterValue;
  }
}
