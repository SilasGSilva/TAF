import { Component, Input } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

@Component({
  selector: 'app-table-details-second-level',
  templateUrl: './table-details-second-level.component.html',
  styleUrls: ['./table-details-second-level.component.scss']
})
export class TableDetailsSecondLevelComponent {

  @Input('taf-loading') tableLoad: boolean;
  @Input('taf-table-details-columns') tableDetailsSecondLevelColumns: Array<PoTableColumn> = [];
  @Input('taf-table-details-items') tableDetailsSecondLevelItems: [];

  public handleTableLoad(isTableLoad: boolean): void {
    this.tableLoad = isTableLoad;
  }

}
