import { Injectable } from '@angular/core';
import { LiteralService } from '../../../core/i18n/literal.service';
import { RequiredRouteEvents } from './RequiredRouteEvents';

@Injectable()
export class RequiredEventsService {
  public literals: Object;

  constructor(private literalsService: LiteralService) {
    this.literals = this.literalsService.literalsCore;
  }

  public requiredRouteEvents(): Array<RequiredRouteEvents> {
    return [
        {
          route: '/fgtsReport',
          events: ['S-1200', 'S-2299', 'S-2399', 'S-5003'],
        },
        {
          route: '/inssReport',
          events: ['S-1200', 'S-2299', 'S-2399', 'S-5001'],
        },
        {
          route: '/irrfReport',
          events: ['S-1200', 'S-1202', 'S-1207', 'S-2299', 'S-2399', 'S-5002'],
        },
        {
          route: '/socialCat',
          events: ['S-2210'],
        }
      ];
  }
}
