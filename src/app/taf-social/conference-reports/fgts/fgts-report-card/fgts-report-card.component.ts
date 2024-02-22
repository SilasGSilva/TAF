import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-fgts-report-card',
  templateUrl: './fgts-report-card.component.html',
  styleUrls: ['./fgts-report-card.component.scss']
})

export class FgtsReportCardComponent implements OnInit {

  @Input() quantityFgtsRh: string;
  @Input() quantityFgtsGov: string;
  @Input() quantityFgtsTaf: string;
  @Input() taffull = false;

  @Input() syntheticValues = [];
  @Input() syntheticBasis = [];

  primaryAction: PoModalAction;

  literals = {};

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafSocial;
  }

  ngOnInit() {
    this.primaryAction = {
      action: () => {
      this.poModal.close();
      },
      label: this.literals['inssReport']['close']
    };
  }

  openSyntheticModal() {
    this.poModal.open();
  }

}
