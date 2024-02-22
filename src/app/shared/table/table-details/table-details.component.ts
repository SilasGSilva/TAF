import { Component, Input } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

import { MasksPipe } from 'shared/pipe/masks.pipe';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss'],
  providers: [MasksPipe],
})
export class TableDetailsComponent {

  @Input('taf-path') path = ' ';
  @Input('taf-event') event: string;
  @Input('taf-period') period: string;
  @Input('taf-id') id: string;
  @Input('taf-branch-id') branchId: string;
  @Input('taf-loading') tableLoad: boolean;
  @Input('taf-table-details-columns') tableDetailsColumns: Array<
    PoTableColumn
  > = [];
  @Input('taf-table-details-items') tableDetailsItems: [];

  constructor() {
    this.setShowDetails = this.setShowDetails.bind(this);
  }

  public setShowDetails(): boolean {
    return this.event.match(/R-2030|R-2040|R-2050/) && this.path.match(/validation|eventsReport/)
      ? true
      : this.event.match(/R-2055|R-5001|R-5011|R-9001|R-9011/) && this.path.match(/eventsReport/)
      ? true
      : this.event.match(/R-2030|R-2040/) && this.path.match(/transmission/)
      ? true
      : false;
  }
}
