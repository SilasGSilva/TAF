import { Component, OnInit, Input } from '@angular/core';

import { PoTableColumn, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { ItemTableDetailsSecondMarketingByFarmer } from 'taf-fiscal/models/item-table-details-second-marketing-by-farmer';
import { ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-received-by-the-sports-association';
import { ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-passed-on-the-by-the-sports-association';
import { PayloadTableDetailsSecondLevel } from 'shared/table/table-details-second-level/payload-table-details-second-level';
import { TableDetailsSecondLevelService } from 'shared/table/table-details-second-level/table-details-second-level.service';
import { getBranchLoggedIn } from '../../../../../../util/util';

@Component({
  selector: 'app-validation-pending-table-detail-second-level',
  templateUrl: './validation-pending-table-detail-second-level.component.html',
  styleUrls: ['./validation-pending-table-detail-second-level.component.scss'],
})
export class ValidationPendingTableDetailSecondLevelComponent
  implements OnInit {
  public literals = {};
  public tableLoad: boolean;
  public tableDetailsSecondColumns: Array<PoTableColumn> = [];
  public tableDetailsSecondItems: Array<
    | ItemTableDetailsSecondMarketingByFarmer
    | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
    | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
  > = [];

  @Input('taf-event') event: string;
  @Input('taf-period') period: string;
  @Input('taf-path') path: string;
  @Input('taf-id') id: string;
  @Input('taf-item') item: string;
  @Input('taf-branch-id') branchId: string;
  @Input('taf-providerCode') providerCode: string;

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
    this.tableDetailsSecondColumns = this.validationDetailsSecond(this.event);
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
      providerCode: this.providerCode,
    };

    this.handleTableLoad(true);
    this.tableDetailsSecondLevelService
      .getDetails(payload, 'validation')
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
      | ItemTableDetailsSecondMarketingByFarmer
      | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
      | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
    >
  ): void {
    this.tableDetailsSecondItems.length = 0;
    items.forEach(
      (
        item:
          | ItemTableDetailsSecondMarketingByFarmer
          | ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation
          | ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation
      ) => this.tableDetailsSecondItems.push(item)
    );
  }

  public handleTableLoad(isTableLoad: boolean): void {
    this.tableLoad = isTableLoad;
  }

  public validationDetailsSecond(event: string): Array<PoTableColumn> {
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
        property: 'type',
        label: this.literals['tableDetailsSecondLevel']['type'],
        type: 'string',
      },
      {
        property: 'invoice',
        label: this.literals['tableDetailsSecondLevel']['invoice'],
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: this.literals['tableDetailsSecondLevel']['invoiceSeries'],
        type: 'string',
      },
      {
        property: 'item',
        label: this.literals['tableDetailsSecondLevel']['item'],
        type: 'string',
      },
      {
        property: 'typeOfTransfer',
        label: this.literals['tableDetailsSecondLevel']['typeOfTransfer'],
        type: 'string',
      },
      {
        property: 'issueDate',
        label: this.literals['tableDetailsSecondLevel']['issueDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: this.literals['tableDetailsSecondLevel']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['tableDetailsSecondLevel']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['tableDetailsSecondLevel']['tax'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['tableDetailsSecondLevel']['type'],
        type: 'string',
      },
      {
        property: 'invoice',
        label: this.literals['tableDetailsSecondLevel']['invoice'],
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: this.literals['tableDetailsSecondLevel']['invoiceSeries'],
        type: 'string',
      },
      {
        property: 'item',
        label: this.literals['tableDetailsSecondLevel']['item'],
        type: 'string',
      },
      {
        property: 'typeOfTransfer',
        label: this.literals['tableDetailsSecondLevel']['typeOfTransfer'],
        type: 'string',
      },
      {
        property: 'issueDate',
        label: this.literals['tableDetailsSecondLevel']['issueDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: this.literals['tableDetailsSecondLevel']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['tableDetailsSecondLevel']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['tableDetailsSecondLevel']['tax'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
      {
        property: 'taxDescription',
        label: this.literals['tableDetailsSecondLevel']['taxDescription'],
        type: 'string',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['tableDetailsSecondLevel']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'value',
        label: this.literals['tableDetailsSecondLevel']['value'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2055(): Array<PoTableColumn> {
    return [
      {
        property: 'taxDescription',
        label: this.literals['tableDetailsSecondLevel']['taxDescription'],
        type: 'string',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['tableDetailsSecondLevel']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'value',
        label: this.literals['tableDetailsSecondLevel']['value'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }
}
