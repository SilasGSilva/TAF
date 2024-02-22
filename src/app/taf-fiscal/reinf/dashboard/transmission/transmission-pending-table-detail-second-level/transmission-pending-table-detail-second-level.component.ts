import { Component, OnInit, Input } from '@angular/core';
import { PoTableColumn, PoNotificationService } from '@po-ui/ng-components';

import { ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-received-by-the-sports-association';
import { TableDetailsSecondLevelService } from 'shared/table/table-details-second-level/table-details-second-level.service';
import { PayloadTableDetailsSecondLevel } from 'shared/table/table-details-second-level/payload-table-details-second-level';
import { LiteralService } from 'core/i18n/literal.service';
import { getBranchLoggedIn } from '../../../../../../util/util';

@Component({
  selector: 'app-transmission-pending-table-detail-second-level',
  templateUrl:
    './transmission-pending-table-detail-second-level.component.html',
  styleUrls: [
    './transmission-pending-table-detail-second-level.component.scss',
  ],
})
export class TransmissionPendingTableDetailSecondLevelComponent
  implements OnInit {
  public literals = {};
  public tableLoad: boolean;
  public tableDetailsSecondColumns: Array<PoTableColumn> = [];
  public tableDetailsSecondItems: Array<
    | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
    | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
  > = [];

  @Input('taf-id') id: string;
  @Input('taf-event') event: string;
  @Input('taf-period') period: string;
  @Input('taf-path') path: string;
  @Input('taf-item') item: string;
  @Input('taf-branch-id') branchId: string;
  @Input('taf-foreignResident') foreignResident: string;

  constructor(
    private literalService: LiteralService,
    private tableDetailsSecondLevelService: TableDetailsSecondLevelService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.tableDetailsSecondColumns = this.transmissionDetailsSecondLevel(
      this.event
    );
    this.getItems();
  }

  public async getItems(): Promise<void> {
    const payload: PayloadTableDetailsSecondLevel = {
      id: this.id,
      item: this.item,
      branchId: this.branchId,
      event: this.event,
      period: this.period,
      companyId: await getBranchLoggedIn(),
      foreignResident: this.foreignResident,
    };

    this.handleTableLoad(true);
    this.tableDetailsSecondLevelService
      .getDetails(payload, 'transmission')
      .subscribe(
        response => {
          this.setDetailsItems(response.tax);
          this.handleTableLoad(false);
        },
        error => {
          this.poNotificationService.error(error);
          this.handleTableLoad(false);
        }
      );
  }

  public setDetailsItems(
    items: Array<
      | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
      | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
    >
  ): void {
    this.tableDetailsSecondItems.length = 0;
    items.forEach(
      (
        item:
          | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
          | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
      ) => this.tableDetailsSecondItems.push(item)
    );
  }

  public handleTableLoad(isTableLoad: boolean): void {
    this.tableLoad = isTableLoad;
  }

  public transmissionDetailsSecondLevel(event: string): Array<PoTableColumn> {
    const eventFunctionName = event.replace(/-/g, '_');

    if (event.match(/R-[0-9]{4}$/)) {
      const eventFunction = this[eventFunctionName]();

      return eventFunction;
    } else {
      return [];
    }
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'typeOfTransfer',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'typeOfTransfer'
        ],
        type: 'string',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'grossValue'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'receivedAmount',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'receivedAmount'
        ],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'typeOfTransfer',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'typeOfTransfer'
        ],
        type: 'string',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'grossValue'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'receivedAmount',
        label: this.literals['transmissionTableDetailsSecondLevel'][
          'receivedAmount'
        ],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }
}
