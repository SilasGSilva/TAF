import { Component, OnInit, Input } from '@angular/core';
import { PoTableColumn, PoNotificationService } from '@po-ui/ng-components';
import { getBranchLoggedIn } from '../../../../../util/util';
import { LiteralService } from 'core/i18n/literal.service';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { TableDetailsService } from 'shared/table/table-details/table-details.service';
import { ItemTableDetailsResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-received-by-the-sports-association';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-passed-on-the-by-the-sports-association';
import { ItemTableDetailsSocialSecurityContributionValidation } from 'taf-fiscal/models/item-table-details-social-security-contribution-validation';
import { ItemTableDetailsMarketingByFarmer } from 'taf-fiscal/models/item-table-details-marketing-by-farmer';
import { ItemTableDetailsProcess } from 'taf-fiscal/models/item-table-details-process';
import { ItemTableDetailsPaymentsOrCreditsToLegalEntityBeneficiary } from 'taf-fiscal/models/item-table-details-payments-or-credits-to-legal-entity-beneficiary';
import { ItemTableDetailsPayamentCreditPhysicalBeneficiary } from 'taf-fiscal/models/item-table-details-payments-credits-physical-beneficiary-validation';
import { ItemTableDetailsPaymentsOrCreditsToUnidentifiedBeneficiary } from 'taf-fiscal/models/item-table-details-payments-or-credits-to-unidentified-beneficiary';
import { ItemTableDetails } from 'taf-fiscal/models/item-table-details';
import { PayloadTableDetails } from '../../../../models/payload-table-details';

@Component({
  selector: 'app-report-validation-table-detail',
  templateUrl: './report-validation-table-detail.component.html',
  styleUrls: ['./report-validation-table-detail.component.scss'],
})
export class ReportValidationTableDetailComponent implements OnInit {
  public literals = {};
  public tableLoad: boolean;
  public path = 'eventsReport';
  public tableDetailsColumns: Array<PoTableColumn> = [];
  public tableDetailsItems: Array<
    | ItemTableDetails
    | ItemTableDetailsResourcesReceivedByTheSportsAssociation
    | ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation
    | ItemTableDetailsMarketingByFarmer
    | ItemTableDetailsSocialSecurityContributionValidation
    | ItemTableDetailsProcess
    | ItemTableDetailsPaymentsOrCreditsToLegalEntityBeneficiary
    | ItemTableDetailsPayamentCreditPhysicalBeneficiary
    | ItemTableDetailsPaymentsOrCreditsToUnidentifiedBeneficiary
  > = [];

  @Input('taf-event') event: string;
  @Input('taf-period') period: string;
  @Input('taf-id') id: string;
  @Input('taf-branch-id') branchId: string;
  @Input('taf-table-item') tableItem;

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
    this.tableDetailsColumns = this.reportDetails(this.event);
    this.getItems();
  }

  public async getItems(): Promise<void> {
    let nif: string = this.tableItem.nif ? this.tableItem.nif : '';
    let providerCode: string = this.tableItem.providerCode ? this.tableItem.providerCode : '';

    const payload: PayloadTableDetails = {
      id: this.id,
      branchId: this.branchId,
      event: this.event,
      period: this.period,
      companyId: await getBranchLoggedIn(),
      nif: nif.trim(),
      providerCode: providerCode.trim(),
    };

    this.handleTableLoad(true);

    this.tableDetailsService.getDetails(payload, 'eventsReport').subscribe(
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
      | ItemTableDetailsPaymentsOrCreditsToLegalEntityBeneficiary
      | ItemTableDetailsPayamentCreditPhysicalBeneficiary
      | ItemTableDetailsPaymentsOrCreditsToUnidentifiedBeneficiary
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

  public reportDetails(event: string): Array<PoTableColumn> {
    let codEvent : string;

    if (event.match(/R-9001|R-9011/)) {
      codEvent = event.replace(/9/g,'5');
    } else {
      codEvent = event;
    }

    const eventFunctionName = codEvent.replace(/-/g, '_');

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
        label: this.literals['detailTable']['suspensionCode'],
        type: 'string',
      },
      {
        property: 'suspensionIndicator',
        label: this.literals['detailTable']['suspensionIndicator'],
        type: 'string',
      },
      {
        property: 'decisionDate',
        label: this.literals['detailTable']['decisionDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
      },
      {
        property: 'depositIndicator',
        label: this.literals['detailTable']['depositIndicator'],
        type: 'string',
      },
    ];
  }

  public R_2010(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['detailTable']['type'],
        type: 'string',
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
      {
        property: 'serviceCode',
        label: this.literals['detailTable']['serviceCode'],
        type: 'string',
      },
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
        property: 'taxBase',
        label: this.literals['detailTable']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['detailTable']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2020(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['detailTable']['type'],
        type: 'string',
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
      {
        property: 'serviceCode',
        label: this.literals['detailTable']['serviceCode'],
        type: 'string',
      },
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
        property: 'taxBase',
        label: this.literals['detailTable']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['detailTable']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2030(): Array<PoTableColumn> {
    return [
      {
        property: 'sourceTaxNumber',
        label: this.literals['detailTable']['sourceTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'company',
        label: this.literals['detailTable']['company'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['detailTable']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalTransferAmount',
        label: this.literals['detailTable']['totalTransferAmount'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['detailTable']['totalGrossValue'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['detailTable']['totalTaxBase'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['detailTable']['totalTaxes'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2040(): Array<PoTableColumn> {
    return [
      {
        property: 'associationTaxNumber',
        label: this.literals['detailTable']['associationTaxNumber'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'company',
        label: this.literals['detailTable']['company'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'totalInvoice',
        label: this.literals['detailTable']['totalInvoice'],
        width: '10%',
        type: 'number',
      },
      {
        property: 'totalTransferAmount',
        label: this.literals['detailTable']['totalTransferAmount'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['detailTable']['totalGrossValue'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['detailTable']['totalTaxBase'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxes',
        label: this.literals['detailTable']['totalTaxes'],
        width: '15%',
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_2050(): Array<PoTableColumn> {
    return [
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
      {
        property: 'item',
        label: this.literals['detailTable']['item'],
        type: 'string',
      },
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
    ];
  }

  public R_5001(): Array<PoTableColumn> {
    return [
      {
        property: 'event',
        label: this.literals['detailTable']['event'],
        type: 'string',
      },
      {
        property: 'taxCalculationBase',
        label: this.literals['detailTable']['taxCalculationBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        format: '1.2-5',
      },

    ];
  }


  public R_5011(): Array<PoTableColumn> {
    return [
      {
        property: 'event',
        label: this.literals['detailTable']['event'],
        type: 'string',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        format: '1.2-5',
      },

    ];
  }

  public R_9005(): Array<PoTableColumn> {
    return [
      {
        property: 'event',
        label: this.literals['detailTable']['event'],
        type: 'string',
      },
      {
        property: 'recipeCode',
        label: this.literals['detailTable']['recipeCode'],
        type: 'string',
      },
      {
        property: 'taxBase',
        label: this.literals['detailTable']['taxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        format: '1.2-5',
      }
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
      {
        property: 'item',
        label: this.literals['detailTable']['item'],
        type: 'string',
      },
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
    ];
  }

  public R_2060(): Array<PoTableColumn> {
    return [
      {
        property: 'activityCode',
        label: this.literals['detailTable']['activityCode'],
        type: 'string',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['detailTable']['totalGrossValue'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'additionalValueOfAdjustment',
        label: this.literals['detailTable']['additionalValueOfAdjustment'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'exclusionValueOfAdjustment',
        label: this.literals['detailTable']['exclusionValueOfAdjustment'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'totalTaxBase',
        label: this.literals['detailTable']['totalTaxBase'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'aliquot',
        label: this.literals['detailTable']['aliquot'],
        type: 'number',
        format: '1.2-5',
      },
      {
        property: 'contributionValue',
        label: this.literals['detailTable']['contributionValue'],
        type: 'number',
        format: '1.2-5',
      },
    ];
  }

  public R_3010(): Array<PoTableColumn> {
    return [
      {
        property: 'income',
        label: this.literals['detailTable']['income'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'type',
        label: this.literals['detailTable']['type'],
        type: 'string',
        width: '20%',
      },
      {
        property: 'saleAmount',
        label: this.literals['detailTable']['saleAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'soldAmount',
        label: this.literals['detailTable']['soldAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'refundAmount',
        label: this.literals['detailTable']['refundAmount'],
        type: 'number',
        width: '12%',
      },
      {
        property: 'unitaryValue',
        label: this.literals['detailTable']['unitaryValue'],
        type: 'number',
        format: '1.2-5',
        width: '12%',
      },
      {
        property: 'totalGrossValue',
        label: this.literals['detailTable']['totalGrossValue'],
        type: 'number',
        format: '1.2-5',
        width: '12%',
      },
    ];
  }
  public R_9015(): Array<PoTableColumn> {
    return [
      {
        property: 'grossCode',
        label: this.literals['detailTable']['grossCode'],
        type: 'number',
        width: '25%',
      },
      {
        property: 'tax',
        label: this.literals['detailTable']['tax'],
        type: 'number',
        width: '25%',
        format: '1.2-5',
      },
      {
        property: '',
        label: '',
        type: 'number',
        width: '50%',
        format: '1.2-5',
        visible: true,
      },
    ];
  }

  public R_4010(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['detailTable']['type'],
        type: 'string',
        width: '5%',
      },
      {
        property: 'document',
        label: this.literals['detailTable']['invoice'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'series',
        label: this.literals['detailTable']['invoiceSeries'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'natureIncome',
        label: this.literals['detailTable']['natureIncome'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'date',
        label: this.literals['detailTable']['taxableDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
        width: '15%',
      },
      {
        property: 'grossValue',
        label: this.literals['detailTable']['grossAmount'],
        type: 'number',
        format: '1.2-5',
        width: '15%',
      },
      {
        property: 'taxBase',
        label: this.literals['detailTable']['irBase'],
        type: 'number',
        format: '1.2-5',
        width: '15%',
      },
      {
        property: 'taxAmount',
        label: this.literals['detailTable']['irValue'],
        type: 'number',
        format: '1.2-5',
        width: '15%',
      },
    ];
  }

  public R_4020(): Array<PoTableColumn> {
    return [
      {
        property: 'type',
        label: this.literals['detailTable']['type'],
        type: 'string',
        width: '5%',
      },
      {
        property: 'document',
        label: this.literals['detailTable']['invoice'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'series',
        label: this.literals['detailTable']['invoiceSeries'],
        type: 'string',
        width: '5%',
      },
      {
        property: 'natureIncome',
        label: this.literals['detailTable']['natureIncome'],
        type: 'string',
        width: '7%',
      },
      {
        property: 'date',
        label: this.literals['detailTable']['taxableDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
        width: '10%',
      },
      {
        property: 'grossValue',
        label: this.literals['detailTable']['grossAmount'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'irBase',
        label: this.literals['detailTable']['irBase'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'irValue',
        label: this.literals['detailTable']['irValue'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'pisValue',
        label: this.literals['detailTable']['pisValue'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'cofinsValue',
        label: this.literals['detailTable']['cofinsValue'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'csllValue',
        label: this.literals['detailTable']['csllValue'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
      {
        property: 'addedValue',
        label: this.literals['detailTable']['addedValue'],
        type: 'number',
        format: '1.2-5',
        width: '9%',
      },
    ];
  }

  public R_4080(): Array<PoTableColumn> {
    return [
      {
        property: 'document',
        label: this.literals['detailTable']['invoice'],
        type: 'string',
        width: '15%',
      },
      {
        property: 'natureIncome',
        label: this.literals['detailTable']['natureIncome'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'date',
        label: this.literals['detailTable']['paymentDate'],
        type: 'date',
        format: 'dd/MM/yyyy',
        width: '15%',
      },
      {
        property: 'netValue',
        label: this.literals['detailTable']['grossAmount'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
      {
        property: 'taxBase',
        label: this.literals['detailTable']['irBase'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
      {
        property: 'taxAmount',
        label: this.literals['detailTable']['irValue'],
        type: 'number',
        format: '1.2-5',
        width: '10%',
      },
    ];
  }
}
