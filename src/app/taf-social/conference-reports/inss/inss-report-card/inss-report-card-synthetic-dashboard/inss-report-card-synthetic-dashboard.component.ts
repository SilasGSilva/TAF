import { Component, Input } from '@angular/core';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-inss-report-card-synthetic-dashboard',
  templateUrl: './inss-report-card-synthetic-dashboard.component.html',
  styleUrls: ['./inss-report-card-synthetic-dashboard.component.scss']
})
export class InssReportCardSyntheticDashboardComponent {

  @Input() syntheticItems = [];
  @Input() taffull = false;

  @Input() chartDashboardRhData = [];
  @Input() chartDashboardTafData = [];
  @Input() chartDashboardRetData = [];

  literals: {};

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafSocial;
  }

}
