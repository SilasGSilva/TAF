import { Component, OnInit, Input } from '@angular/core';
import { PoTableColumn, PoNotificationService } from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { ItemTableDetailsSecondMarketingByFarmer } from 'taf-fiscal/models/item-table-details-second-marketing-by-farmer';
import { ItemTableDetailsSecondResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsSecondResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-second-resources-received-by-the-sports-association';
import { TableDetailsSecondLevelService } from 'shared/table/table-details-second-level/table-details-second-level.service';
import { PayloadTableDetailsSecondLevel } from 'shared/table/table-details-second-level/payload-table-details-second-level';
import { getBranchLoggedIn } from '../../../../../util/util';
import { MasksPipe } from 'shared/pipe/masks.pipe';

@Component({
  selector: 'app-report-validation-table-detail-second-level',
  templateUrl: './report-validation-table-detail-second-level.component.html',
  styleUrls: ['./report-validation-table-detail-second-level.component.scss'],
})
export class ReportValidationTableDetailSecondLevelComponent implements OnInit {
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
    private poNotificationService: PoNotificationService,
    private masksPipe: MasksPipe,
    ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData(): void {
    this.tableDetailsSecondColumns = this.reportDetailsSecond(this.event);
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
      .getDetails(payload, 'eventsReport')
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

    //Se  for evento 5001 e 5011 e ID for 2020, formato numero de inscrição
    if (this.event.match(/R-5001|R-5011/)) {
      items.forEach(item => {
        switch (this.id) {
          case 'R-2020':
            item.registrationNumber = this.masksPipe.transform(item.registrationNumber);
            break;
        }
      }
      );
    }

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

  public reportDetailsSecond(event: string): Array<PoTableColumn> {
    if (event.match(/R-[0-9]{4}$/)) {
      let codEvent : string;

      if (event.match(/R-9001|R-9011/)) {
        //Altera o codigo do evento de 9??? p/ 5??? devido a alteração do código no layout 2.1.1 da reinf. (de R-5001/R-9011 para R-9001/R-9011 )
        codEvent = event.replace(/9/g,'5');
      } else {
        codEvent = event;
      }

      const eventFunctionName = codEvent.replace(/-/g, '_');
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

  public R_5001(): Array<PoTableColumn> {
    return [
      {
        property: this.id != "R-2020" && this.event.match(/R-5001|R-9001/) ? 'recipeCode' : 'registrationNumber',
        label: this.literals['tableDetailsSecondLevel'][this.id != "R-2020" && this.event.match(/R-5001|R-9001/) ? 'recipeCode' : 'registrationNumber'],
        type: 'string',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['tableDetailsSecondLevel']['tax'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'suspendedContribution',
        label: this.literals['tableDetailsSecondLevel']['suspendedContribution'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_5011(): Array<PoTableColumn> {
    return [
      {
        property: this.id != "R-2020" && this.event.match(/R-5011|R-9011/) ? 'recipeCode' : 'registrationNumber',
        label: this.literals['tableDetailsSecondLevel'][this.id != "R-2020" && this.event.match(/R-5011|R-9011/) ? 'recipeCode' : 'registrationNumber'],
        type: 'string',
      },
      {
        property: 'taxBase',
        label: this.literals['tableDetailsSecondLevel']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['tableDetailsSecondLevel']['tax'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'suspendedContribution',
        label: this.literals['tableDetailsSecondLevel']['suspendedContribution'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

}
