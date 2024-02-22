import { Component, OnInit, Input } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-inss-report-synthetic-table',
  templateUrl: './inss-report-synthetic-table.component.html',
  styleUrls: ['./inss-report-synthetic-table.component.scss']
})

export class InssReportSyntheticTableComponent implements OnInit {

  @Input() syntheticItems = [];
  @Input() taffull = false;

  columnsSynthetic: Array<PoTableColumn>;

  literals: {};

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafSocial;
  }

  ngOnInit() {
    this.columnsSynthetic = this.getColumns();
  }

  private getColumns(): Array<PoTableColumn> {

    const columnsSyntheticInss = [];

     columnsSyntheticInss.push({ property: 'type',         label: this.literals['inssReport']['inss']});
     columnsSyntheticInss.push({ property: 'baseRh',       label: this.literals['inssReport']['rhBase'],           type: 'number' });

    if (this.taffull) {
     columnsSyntheticInss.push({ property: 'baseTaf',      label: this.literals['inssReport']['tafBase'],          type: 'number' });
    }

    columnsSyntheticInss.push({ property: 'baseGoverno',  label: this.literals['inssReport']['governmentBase'],   type: 'number' });
    columnsSyntheticInss.push({ property: 'valorRh',      label: this.literals['inssReport']['rhValue'],          type: 'number' });

    if (this.taffull) {
     columnsSyntheticInss.push({ property: 'valorTaf',     label: this.literals['inssReport']['tafValue'],         type: 'number' });
    }

    columnsSyntheticInss.push({ property: 'valorGoverno', label: this.literals['inssReport']['governmentValue'],  type: 'number' });

    return columnsSyntheticInss;
  }
}
