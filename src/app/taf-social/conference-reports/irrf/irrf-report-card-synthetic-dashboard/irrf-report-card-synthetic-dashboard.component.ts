import { Component, OnInit, Input } from '@angular/core';
import { LiteralService } from 'core/i18n/literal.service';
import { IrrfReportParamsStoreService } from '../../services/stores/irrf/irrf-report-params-store/irrf-report-params-store.service';

@Component({
  selector: 'app-irrf-report-card-synthetic-dashboard',
  templateUrl: './irrf-report-card-synthetic-dashboard.component.html',
  styleUrls: ['./irrf-report-card-synthetic-dashboard.component.scss']
})
export class IrrfReportCardSyntheticDashboardComponent implements OnInit {
  @Input('quantity-irrf-rh') quantityIrrfRh: string;
  @Input('quantity-irrf-gov') quantityIrrfGov: string;
  @Input('quantity-irrf-taf') quantityIrrfTaf: string;

  public literals = {};
  public isTAFFull: boolean;
  public isConfiguredService: boolean;

  constructor(
    private literalsService: LiteralService,
    private irrfReportParamsStoreService: IrrfReportParamsStoreService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    this.irrfReportParamsStoreService.isConfiguredService$.subscribe(
      isConfiguredService => (this.isConfiguredService = isConfiguredService)
    );
  }
}
