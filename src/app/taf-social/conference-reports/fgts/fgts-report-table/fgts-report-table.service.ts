import { Injectable } from '@angular/core';

import { LiteralService } from 'core/i18n/literal.service';

@Injectable({
  providedIn: 'root'
})
export class FgtsReportTableService {

  literals = {};

  constructor(private literalsService: LiteralService) {
    this.literals = this.literalsService.literalsTafSocial;
  }
}
