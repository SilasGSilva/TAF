import { Injectable } from '@angular/core';

import { PoI18nService } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class LiteralService {
  public literals = {};
  public literalsShared: {};
  public literalsCore: {};
  public literalsTafFiscal: {};
  public literalsTafSocial: {};
  public literalsAuth: {};

  constructor(private thfI18nService: PoI18nService) {
    this.thfI18nService.getLiterals({ language: navigator.language })
      .subscribe(response => this.literals = response);

    this.thfI18nService.getLiterals({ context: 'shared', language: navigator.language })
      .subscribe(response => this.literalsShared = response);

    this.thfI18nService.getLiterals({ context: 'core', language: navigator.language })
      .subscribe(response => this.literalsCore = response);

    this.thfI18nService.getLiterals({ context: 'tafFiscal', language: navigator.language })
      .subscribe(response => this.literalsTafFiscal = response);

    this.thfI18nService.getLiterals({ context: 'tafSocial', language: navigator.language })
      .subscribe(response => this.literalsTafSocial = response);

    this.thfI18nService.getLiterals({ context: 'auth', language: navigator.language })
      .subscribe(response => this.literalsAuth = response);
  }
}
