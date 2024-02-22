import { Component, Input } from '@angular/core';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-fgts-report-card-synthetic-dashboard',
  templateUrl: './fgts-report-card-synthetic-dashboard.component.html',
  styleUrls: ['./fgts-report-card-synthetic-dashboard.component.scss']
})
export class FgtsReportCardSyntheticDashboardComponent {

  @Input() syntheticValues = [];
  @Input() syntheticBasis = [];
  @Input() taffull = false;

  literals: {};

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafSocial;
  }

}
