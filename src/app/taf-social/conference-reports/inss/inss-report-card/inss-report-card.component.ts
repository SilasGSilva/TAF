import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { InssReportParamsStoreService } from '../../services/stores/inss/inss-report-params-store/inss-report-params-store.service';

@Component({
  selector: 'app-inss-report-card',
  templateUrl: './inss-report-card.component.html',
  styleUrls: ['./inss-report-card.component.scss'],
})
export class InssReportCardComponent implements OnInit {
  public isConfiguredService: boolean;

  @Input() quantityInssRh: string;
  @Input() quantityInssGov: string;
  @Input() quantityInssTaf: string;
  @Input() isTAFFull: boolean;

  changeBackgroundRh: boolean;
  changeBackgroundTaf: boolean;
  changeBackgroundRet: boolean;

  primaryAction: PoModalAction;

  literals = {};

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(
    private literalService: LiteralService,
    private inssReportParamsStoreService: InssReportParamsStoreService
  ) {
    this.literals = this.literalService.literalsTafSocial;
  }

  ngOnInit() {
    this.inssReportParamsStoreService.isConfiguredService$.subscribe(
      isConfiguredService => (this.isConfiguredService = isConfiguredService)
    );
    this.primaryAction = {
      action: () => {
        this.poModal.close();
      },
      label: this.literals['inssReport']['close'],
    };
  }

  openSyntheticModal() {
    this.poModal.open();
  }
}
