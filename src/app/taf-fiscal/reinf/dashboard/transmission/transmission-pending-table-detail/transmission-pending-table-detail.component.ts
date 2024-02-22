import { Component, OnInit, Input } from '@angular/core';

import { PoTableColumn, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { TableDetailsService } from 'shared/table/table-details/table-details.service';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ItemTableDetails } from 'taf-fiscal/models/item-table-details';
import { ItemTableDetailsMarketingByFarmer } from 'taf-fiscal/models/item-table-details-marketing-by-farmer';
import { ItemTableDetailsSocialSecurityContributionValidation } from 'taf-fiscal/models/item-table-details-social-security-contribution-validation';
import { ItemTableDetailsResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-received-by-the-sports-association';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsProcess } from 'taf-fiscal/models/item-table-details-process';
import { ItemTableDetailsEventByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-event-by-the-sports-association';
import { PayloadTableDetails } from '../../../../../models/payload-table-details';
import { getBranchLoggedIn } from '../../../../../../util/util';

@Component({
  selector: 'app-transmission-pending-table-detail',
  templateUrl: './transmission-pending-table-detail.component.html',
  styleUrls: ['./transmission-pending-table-detail.component.scss'],
})
export class TransmissionPendingTableDetailComponent implements OnInit {
  public literals = {};
  public tableLoad: boolean;
  public path = 'transmission';
  public tableDetailsColumns: Array<PoTableColumn> = [];
  public tableDetailsItems: Array<
    | ItemTableDetails
    | ItemTableDetailsResourcesReceivedByTheSportsAssociation
    | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation
    | ItemTableDetailsMarketingByFarmer
    | ItemTableDetailsSocialSecurityContributionValidation
    | ItemTableDetailsProcess
    | ItemTableDetailsEventByTheSportsAssociation
  > = [];

  @Input('taf-event') event: string;
  @Input('taf-period') period: string;
  @Input('taf-id') id: string;
  @Input('taf-branch-id') branchId: string;

  constructor(
    private literalService: LiteralService,
    private tableDetailsService: TableDetailsService,
    private poNotificationService: PoNotificationService,
    private masksPipe: MasksPipe
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.tableDetailsColumns = this.transmissionDetails(this.event);
    this.getItems();
  }

  public async getItems(): Promise<void> {
    const payload: PayloadTableDetails = {
      id: this.id,
      branchId: this.branchId,
      event: this.event,
      period: this.period,
      companyId: await getBranchLoggedIn(),
    };

    this.handleTableLoad(true);

    this.tableDetailsService.getDetails(payload, 'transmission').subscribe(
      response => {
        this.setDetailsItems(response['invoices']);
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
      | ItemTableDetails
      | ItemTableDetailsResourcesReceivedByTheSportsAssociation
      | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation
      | ItemTableDetailsMarketingByFarmer
      | ItemTableDetailsSocialSecurityContributionValidation
      | ItemTableDetailsProcess
      | ItemTableDetailsEventByTheSportsAssociation
    >
  ): void {
    this.tableDetailsItems.length = 0;
    items.forEach(item => {
      item['sourceTaxNumber'] = this.masksPipe.transform(
        item['sourceTaxNumber'] ? item['sourceTaxNumber'] : ''
      );
      item['associationTaxNumber'] = this.masksPipe.transform(
        item['associationTaxNumber']
      );
      this.tableDetailsItems.push(item);
    });
  }

  public handleTableLoad(isTableLoad: boolean): void {
    this.tableLoad = isTableLoad;
  }

  public transmissionDetails(event: string): Array<PoTableColumn> {
    const eventFunctionName = event.replace(/-/g, '_');

    if (event.match(/R-[0-9]{4}$/)) {
      const eventFunction = this[eventFunctionName]();

      return eventFunction;
    } else {
      return [];
    }
  }

  public R_1070(): Array<PoTableColumn> {
    return [
      {
        property: 'suspensionCode',
        label: this.literals['transmissionPendingTableDetail'][
          'suspensionCode'
        ],
        type: 'string',
      },
      {
        property: 'suspensionIndicator',
        label: this.literals['transmissionPendingTableDetail'][
          'suspensionIndicator'
        ],
        type: 'string',
      },
      {
        property: 'decisionDate',
        label: this.literals['transmissionPendingTableDetail']['decisionDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'depositIndicator',
        label: this.literals['transmissionPendingTableDetail'][
          'depositIndicator'
        ],
        type: 'string',
      },
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['transmissionPendingTableDetail']['type'],
        type: 'string',
      },
      {
        property: 'invoice',
        label: this.literals['transmissionPendingTableDetail']['invoice'],
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: this.literals['transmissionPendingTableDetail']['invoiceSeries'],
        type: 'string',
      },
      {
        property: 'serviceCode',
        label: this.literals['transmissionPendingTableDetail']['serviceCode'],
        type: 'string',
      },
      {
        property: 'issueDate',
        label: this.literals['transmissionPendingTableDetail']['issueDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: this.literals['transmissionPendingTableDetail']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['transmissionPendingTableDetail']['tax'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'note',
        label: this.literals['transmissionPendingTableDetail']['note'],
        type: 'string',
        format: '1.2-5',
      },
    ];
  }

  public R_2020(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['transmissionPendingTableDetail']['type'],
        type: 'string',
      },
      {
        property: 'invoice',
        label: this.literals['transmissionPendingTableDetail']['invoice'],
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: this.literals['transmissionPendingTableDetail']['invoiceSeries'],
        type: 'string',
      },
      {
        property: 'serviceCode',
        label: this.literals['transmissionPendingTableDetail']['serviceCode'],
        type: 'string',
      },
      {
        property: 'issueDate',
        label: this.literals['transmissionPendingTableDetail']['issueDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: this.literals['transmissionPendingTableDetail']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['transmissionPendingTableDetail']['tax'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'note',
        label: this.literals['transmissionPendingTableDetail']['note'],
        type: 'string',
        format: '1.2-5',
      },
    ];
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'sourceTaxNumber',
        label: this.literals['transmissionPendingTableDetail'][
          'sourceTaxNumber'
        ],
        type: 'string',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'receivedAmount',
        label: this.literals['transmissionPendingTableDetail'][
          'receivedAmount'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['transmissionPendingTableDetail'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'sourceTaxNumber',
        label: this.literals['transmissionPendingTableDetail'][
          'associationTaxNumber'
        ],
        type: 'string',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'receivedAmount',
        label: this.literals['transmissionPendingTableDetail'][
          'receivedAmount'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalValueOfRetentionWithSuspendedLiability',
        label: this.literals['transmissionPendingTableDetail'][
          'totalValueOfRetentionWithSuspendedLiability'
        ],
        type: 'number',
        format: '1.2-5',
        visible: false,
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
      {
        property: 'typeOfTrading',
        label: this.literals['transmissionPendingTableDetail']['typeOfTrading'],
        type: 'string',
        format: '1.2-5',
        width: '75%',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
        width: '25%',
      },
    ];
  }
  
  public R_2055(): Array<PoTableColumn> {
    return [
      {
        property: 'typeinvoice',
        label: this.literals['detailTable']['type'],
        type: 'string',
        width: '8%',
      },
      {
        property: 'invoice',
        label: this.literals['detailTable']['invoice'],
        type: 'string',
      },
      {
        property: 'invoiceSeries',
        label: this.literals['detailTable']['invoiceSeries'],
        type: 'string',
      },
      /*{
        property: 'item',
        label: this.literals['detailTable']['item'],
        type: 'string',
      },*/
      {
        property: 'issueDate',
        label: this.literals['detailTable']['issueDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'grossValue',
        label: this.literals['detailTable']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueGilRat',
        label: this.literals['detailTable']['valueGilRat'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueSenar',
        label: this.literals['detailTable']['valueSenar'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'valueINSS',
        label: this.literals['detailTable']['valueINSS'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'activityCode',
        label: this.literals['transmissionPendingTableDetail']['activityCode'],
        type: 'string',
      },
      {
        property: 'grossValue',
        label: this.literals['transmissionPendingTableDetail']['grossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'additionalValueOfAdjustment',
        label: this.literals['transmissionPendingTableDetail'][
          'additionalValueOfAdjustment'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'exclusionValueOfAdjustment',
        label: this.literals['transmissionPendingTableDetail'][
          'exclusionValueOfAdjustment'
        ],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'taxBase',
        label: this.literals['transmissionPendingTableDetail']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['transmissionPendingTableDetail']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'contributionValue',
        label: this.literals['transmissionPendingTableDetail'][
          'contributionValue'
        ],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_3010(): Array<PoTableColumn> {
    return [
      {
        property: 'income',
        label: this.literals['transmissionPendingTableDetail']['income'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'type',
        label: this.literals['transmissionPendingTableDetail']['type'],
        type: 'string',
        width: '25%',
      },
      {
        property: 'saleAmount',
        label: this.literals['transmissionPendingTableDetail']['saleAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'soldAmount',
        label: this.literals['transmissionPendingTableDetail']['soldAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'refundAmount',
        label: this.literals['transmissionPendingTableDetail']['refundAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'unitaryValue',
        label: this.literals['transmissionPendingTableDetail']['unitaryValue'],
        type: 'number',
        format: '1.2-5',
        width: '12%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['transmissionPendingTableDetail'][
          'totalGrossValue'
        ],
        type: 'number',
        format: '1.2-5',
        width: '12%',
      },
    ];
  }
}
