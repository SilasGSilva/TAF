import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { LiteralService } from '../../core/i18n/literal.service';

@Component({
  selector: 'app-button-back',
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss'],
})
export class ButtonBackComponent {
  public literals = {};

  constructor(
    private location: Location,
    private literalService: LiteralService
  ) {
    this.literals = this.literalService.literalsShared;
  }

  public goBackNavigation(): void {
    this.location.back();
  }
}
