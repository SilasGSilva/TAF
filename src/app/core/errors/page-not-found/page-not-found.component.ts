import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LiteralService } from '../../i18n/literal.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  public literals = {};

  constructor(private router: Router,
              private literalService: LiteralService) {
    this.literals = this.literalService.literalsCore;
   }

  public redirection(): void {
    this.router.navigate(['/eventsMonitor']);
  }

}
