import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-fgts-report-synthetic-table',
  templateUrl: './fgts-report-synthetic-table.component.html',
  styleUrls: ['./fgts-report-synthetic-table.component.scss']
})

export class FgtsReportSyntheticTableComponent implements OnInit {

  @Input() syntheticValues = [];
  @Input() syntheticBasis = [];
  @Input() taffull = false;

  fgtsValue: string;
  fgtsTafValue: string;
  fgtsRetValue: string;

  fgts13Value: string;
  fgts13TafValue: string;
  fgts13RetValue: string;

  fgtsRescissionValue: string;
  fgtsRescissionTafValue: string;
  fgtsRescissionRetValue: string;

  syntheticItems = [];

  columnsSynthetic: Array<PoTableColumn>;

  literals: {};

  constructor(private literalService: LiteralService,
              private currencyPipe: CurrencyPipe,
  ){
    this.literals = this.literalService.literalsTafSocial;
  }

  ngOnInit() {

    this.columnsSynthetic = this.getColumnsSyntheticBasis();

    if (this.taffull) {
      this.fgtsTafValue = this.convertReal(this.syntheticValues[0].fgtsTafValue);
      this.fgts13TafValue = this.convertReal(this.syntheticValues[0].fgts13TafValue);
      this.fgtsRescissionTafValue = this.convertReal(this.syntheticValues[0].fgtsRescissionTafValue);
    }

    this.fgtsValue = this.convertReal(this.syntheticValues[0].fgtsValue);
    this.fgtsRetValue = this.convertReal(this.syntheticValues[0].fgtsRetValue);

    this.fgts13Value = this.convertReal(this.syntheticValues[0].fgts13Value);
    this.fgts13RetValue = this.convertReal(this.syntheticValues[0].fgts13RetValue);

    this.fgtsRescissionValue = this.convertReal(this.syntheticValues[0].fgtsRescissionValue);
    this.fgtsRescissionRetValue = this.convertReal(this.syntheticValues[0].fgtsRescissionRetValue);

  }

  private getColumnsSyntheticBasis(): Array<PoTableColumn> {

    const columnsSyntheticTable = [];

    columnsSyntheticTable.push({ property: 'fgtsBasis',              label: this.literals['fgtsReport']['baseRh'],               type: 'number' });

    if (this.taffull) {
      columnsSyntheticTable.push({ property: 'fgtsTafBasis',           label: this.literals['fgtsReport']['baseTaf'],              type: 'number' });
    }

    columnsSyntheticTable.push({ property: 'fgtsRetBasis',           label: this.literals['fgtsReport']['baseGovernment'],       type: 'number' });
    columnsSyntheticTable.push({ property: 'fgts13Basis',            label: this.literals['fgtsReport']['baseRh13'],             type: 'number' });

    if (this.taffull) {
      columnsSyntheticTable.push({ property: 'fgts13TafBasis',         label: this.literals['fgtsReport']['baseTaf13'],            type: 'number' });
    }

    columnsSyntheticTable.push({ property: 'fgts13RetBasis',         label: this.literals['fgtsReport']['baseGovernment13'],     type: 'number' });
    columnsSyntheticTable.push({ property: 'fgtsRescissionBasis',    label: this.literals['fgtsReport']['rescissionRh'],         type: 'number' });

    if (this.taffull) {
      columnsSyntheticTable.push({ property: 'fgtsRescissionTafBasis', label: this.literals['fgtsReport']['rescissionTaf'],        type: 'number' });
    }

    columnsSyntheticTable.push({ property: 'fgtsRescissionRetBasis', label: this.literals['fgtsReport']['rescissionGovernment'], type: 'number' });

    return columnsSyntheticTable;

  }

  private convertReal(value: number): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt');
  }

}
