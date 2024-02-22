import { Component, Input } from '@angular/core';

import { PoChartType } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-inss-report-synthetic-chart',
  templateUrl: './inss-report-synthetic-chart.component.html',
  styleUrls: ['./inss-report-synthetic-chart.component.scss']
})

export class InssReportSyntheticChartComponent {

  @Input() chartDashboardRhData = [];
  @Input() chartDashboardTafData = [];
  @Input() chartDashboardRetData = [];

  literals: {};

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafSocial;
  }

  syntheticChartType: PoChartType = PoChartType.Donut;

}
