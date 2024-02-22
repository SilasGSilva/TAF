import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { Observable } from 'rxjs';
import { Event } from '../models/Event';
import { RequiredEventsService } from '../services/required-events/required-events.service';
import { SocialRestrictionListEventService } from '../services/social-restriction-list-event/social-restriction-list-event.service';
import { LiteralService } from './../../core/i18n/literal.service';
import { SocialMonitorService } from './../social-monitor/social-monitor.service';

@Injectable()
export class RestrictionByEventActivateGuard implements CanActivate {
  public literals: Object;
  public routeEvents: Array<Array<string>>;
  
  constructor(
    private literalsService: LiteralService,
    private socialMonitorService: SocialMonitorService,
    private socialRestrictionListEventService: SocialRestrictionListEventService,
    private requiredEventsService: RequiredEventsService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    const requiredEvents = this.requiredEventsService.requiredRouteEvents().map(event => event.events)
    let listEvents = [];
    
    requiredEvents.forEach(event => listEvents.push(...event))
  
    const  requestEvents = Array.from(new Set(listEvents))
  
    return !isTAFFull
      ? true
      : this.hasAccess(requestEvents, state.url).then(hasAccess => {
          if (hasAccess) {
            return true;
          } else {
            this.showMsgNoAccess();
            return false;
          }
        });
  }

  public async hasAccess(requestEvents: Array<string>, route: string): Promise<boolean> {
    this.routeEvents = this.requiredEventsService.requiredRouteEvents().filter(event => event.route === route).map(event => event.events);
    let userEvents: Array<Event>;

    await this.socialRestrictionListEventService
      .getRestrictionListEvents({
        companyId: this.socialMonitorService.getCompany(),
        eventsCheckPermissions: requestEvents.join('|'),
      })
      .toPromise()
      .then(response => {
        userEvents = response.items;
      });

    const permitedAccess = this.routeEvents[0].map(event => userEvents.filter(userEvent => userEvent.eventCode === event) )  

    if (   
      permitedAccess[0].length > 0 && 
      permitedAccess[0].every(eventItem => eventItem.permissionEvent)
      ) {
      return true;
    } else {
      return false;
    }
  }

  private showMsgNoAccess(): void {
    const message = `${this.literals['eventGuard']['unauthorizedAccess']}
      ${this.literals['eventGuard']['youNeedAccessToEvents']}
      ${this.routeEvents[0].join(', ')} ${
      this.literals['eventGuard']['toCanAccessIt']
    }.`;
    const intervalTime = 15000;
    const typeMessage = 'information';

    this.poNotificationService.setDefaultDuration(intervalTime);
    this.poNotificationService[typeMessage](message);
  }
}
