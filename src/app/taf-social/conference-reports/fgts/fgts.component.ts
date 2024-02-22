import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PoDialogService, PoChartSerie } from '@po-ui/ng-components';
import { LiteralService } from '../../../core/i18n/literal.service';
import { DialogModalResponse } from '../../../shared/dialog-modal-response/dialog-modal-response.service';
import { MasksPipe } from '../../../shared/pipe/masks.pipe';
import { Basis } from '../conference-reports-models/Basis';
import { ESocialBaseConferFgtsValuesResponse } from '../conference-reports-models/ESocialBaseConferFgtsValuesResponse';
import { IReportsCanDeactivate } from '../guards/ireports-deactivate';

@Component({
  selector: 'app-fgts',
  templateUrl: './fgts.component.html',
  styleUrls: ['./fgts.component.scss'],
})
export class FgtsComponent implements OnInit, IReportsCanDeactivate {
  public progressBarValue = 0;
  public progressBarInfo = '';
  public quantityFgtsRh = '';
  public quantityFgtsGov = '';
  public quantityFgtsTaf = '';
  public disabledInputs = false;
  public progressSuccess = false;
  public loadingTable = false;
  public verifyRegisters = false;
  public emptyResult = false;
  public taffull = false;
  public showMore: boolean;
  public hasNext: boolean;
  public pageLink = '/fgtsReport';
  public literals = {};
  public itemsTable = [];
  public itemsTableBasis = [];
  public syntheticBasis: Basis[];
  public syntheticValues = [];
  public chartDashboardRhData = Array<PoChartSerie>();
  public chartDashboardTafData = Array<PoChartSerie>();
  public chartDashboardRetData = Array<PoChartSerie>();
  public isTAFFull: boolean;

  constructor(
    private literalsService: LiteralService,
    private masksPipe: MasksPipe,
    private dialogModalResponse: DialogModalResponse,
    private poDialogService: PoDialogService,
    private currencyPipe: CurrencyPipe,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));
  }

  public loadBar(progressBarValue: number): void {
    if (progressBarValue < 100) {
      this.disabledInputs = true;
      this.loadingTable = true;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
    } else {
      this.disabledInputs = false;
      this.progressBarValue = progressBarValue;
      this.progressBarInfo = `${this.progressBarValue}%`;
      this.progressSuccess = true;
    }
  }

  public showMoreRegisters(showMore: boolean): void {
    this.showMore = showMore;
  }

  public loadCard(
    payloadReportCard: ESocialBaseConferFgtsValuesResponse
  ): void {
    if (payloadReportCard.items.length > 0) {
      const propertyFgtsTafValue = this.isTAFFull
        ? 'fgtsTotTafValue' : 'fgtsTafValue';
      const propertyFgtsValue = this.isTAFFull
        ? 'fgtsTotValue' : 'fgtsValue';
      const propertyFgtsRetValue = this.isTAFFull
        ? 'fgtsTotRetValue' : 'fgtsRetValue';

      if (payloadReportCard.items[0].hasOwnProperty(propertyFgtsTafValue)) {
        this.quantityFgtsTaf = this.convertReal(
          payloadReportCard.items[0][propertyFgtsTafValue]
        );
        this.taffull = true;
      }

      this.quantityFgtsRh = this.convertReal(
        payloadReportCard.items[0][propertyFgtsValue]
      );
      this.quantityFgtsGov = this.convertReal(
        payloadReportCard.items[0][propertyFgtsRetValue]
      );

      if (this.quantityFgtsGov > '0' && this.quantityFgtsRh > '0') {
        this.verifyRegisters = true;
      }
      this.syntheticValues = payloadReportCard.items;
      this.syntheticBasis = this.loadBasis(payloadReportCard.items[0].basis);
    } else {
      this.emptyResult = true;
    }
  }

  public loadTable(
    payloadReportTable: ESocialBaseConferFgtsValuesResponse
  ): void {
    let itemTableNew = [];

    if (this.itemsTable !== undefined) {
      itemTableNew = this.changeArrayItems(payloadReportTable);
      itemTableNew.forEach(element => {
        this.itemsTable.push(element);
      });
    } else {
      this.itemsTable = this.changeArrayItems(payloadReportTable);
    }
    this.showMore = undefined;
    this.hasNext = !payloadReportTable.hasNext;
    this.itemsTable = [...this.itemsTable];
    this.progressBarValue = undefined;
  }

  private changeArrayItems(
    payloadReportTable
  ): Array<ESocialBaseConferFgtsValuesResponse> {
    payloadReportTable.items.forEach(item => {
      item.basis = this.loadBasis(item.basis);
      item.fgtsValue = this.convertReal(item.fgtsValue);
      item.cpfNumberFormatted = this.masksPipe.transform(
        item.cpfNumber ? item.cpfNumber : ''
      );

      if (this.taffull) {
        item.fgtsTafValue = this.convertReal(item.fgtsTafValue);
        item.fgtsRescissionTafValue = this.convertReal(
          item.fgtsRescissionTafValue
        );
        item.fgts13TafValue = this.convertReal(item.fgts13TafValue);
      }

      item.fgtsRetValue = this.convertReal(item.fgtsRetValue);
      item.fgts13Value = this.convertReal(item.fgts13Value);
      item.fgts13RetValue = this.convertReal(item.fgts13RetValue);
      item.fgtsRescissionValue = this.convertReal(item.fgtsRescissionValue);
      item.fgtsRescissionRetValue = this.convertReal(
        item.fgtsRescissionRetValue
      );

      this.changeBasisArray(item.basis);
    });

    this.loadingTable = false;

    return payloadReportTable.items;
  }

  private changeBasisArray(basis): void {
    basis.map(item => {
      item.branchIdFormatted = this.masksPipe.transform(
        item.branchId ? item.branchId : ''
      );
    });
  }

  private loadBasis(item): Array<Basis> {
    const basis = [];

    if (item !== null) {
      if (item.length > 1) {
        item.forEach(element => {
          if (this.taffull) {
            basis.push({
              branchId: element.branchId,
              lotationCode: element.lotationCode,
              fgtsBasis: this.convertReal(element.fgtsBasis),
              fgtsTafBasis: this.convertReal(element.fgtsTafBasis),
              fgtsRetBasis: this.convertReal(element.fgtsRetBasis),
              fgts13Basis: this.convertReal(element.fgts13Basis),
              fgts13TafBasis: this.convertReal(element.fgts13TafBasis),
              fgts13RetBasis: this.convertReal(element.fgts13RetBasis),
              fgtsRescissionBasis: this.convertReal(
                element.fgtsRescissionBasis
              ),
              fgtsRescissionTafBasis: this.convertReal(
                element.fgtsRescissionTafBasis
              ),
              fgtsRescissionRetBasis: this.convertReal(
                element.fgtsRescissionRetBasis
              ),
            });
          } else {
            basis.push({
              branchId: element.branchId,
              lotationCode: element.lotationCode,
              fgtsBasis: this.convertReal(element.fgtsBasis),
              fgtsRetBasis: this.convertReal(element.fgtsRetBasis),
              fgts13Basis: this.convertReal(element.fgts13Basis),
              fgts13RetBasis: this.convertReal(element.fgts13RetBasis),
              fgtsRescissionBasis: this.convertReal(
                element.fgtsRescissionBasis
              ),
              fgtsRescissionRetBasis: this.convertReal(
                element.fgtsRescissionRetBasis
              ),
            });
          }
        });
      } else {
        if (item.length !== 0) {
          if (this.taffull) {
            basis.push({
              branchId: item[0].branchId,
              lotationCode: item[0].lotationCode,
              fgtsBasis: this.convertReal(item[0].fgtsBasis),
              fgtsTafBasis: this.convertReal(item[0].fgtsTafBasis),
              fgtsRetBasis: this.convertReal(item[0].fgtsRetBasis),
              fgts13Basis: this.convertReal(item[0].fgts13Basis),
              fgts13TafBasis: this.convertReal(item[0].fgts13TafBasis),
              fgts13RetBasis: this.convertReal(item[0].fgts13RetBasis),
              fgtsRescissionBasis: this.convertReal(
                item[0].fgtsRescissionBasis
              ),
              fgtsRescissionTafBasis: this.convertReal(
                item[0].fgtsRescissionTafBasis
              ),
              fgtsRescissionRetBasis: this.convertReal(
                item[0].fgtsRescissionRetBasis
              ),
            });
          } else {
            basis.push({
              branchId: item[0].branchId,
              lotationCode: item[0].lotationCode,
              fgtsBasis: this.convertReal(item[0].fgtsBasis),
              fgtsRetBasis: this.convertReal(item[0].fgtsRetBasis),
              fgts13Basis: this.convertReal(item[0].fgts13Basis),
              fgts13RetBasis: this.convertReal(item[0].fgts13RetBasis),
              fgtsRescissionBasis: this.convertReal(
                item[0].fgtsRescissionBasis
              ),
              fgtsRescissionRetBasis: this.convertReal(
                item[0].fgtsRescissionRetBasis
              ),
            });
          }
        }
      }
    }
    return basis;
  }

  public reset(): void {
    this.progressBarValue = undefined;
    this.progressSuccess = undefined;
    this.quantityFgtsRh = '';
    this.quantityFgtsGov = '';
    this.itemsTable = undefined;
    this.verifyRegisters = false;
    this.emptyResult = false;
  }

  public discardReport(): boolean {
    if (this.disabledInputs) {
      return true;
    }

    return false;
  }

  public discardReportDialog(): void {
    this.poDialogService.confirm({
      literals: {
        cancel: this.literals['fgtsReport']['cancel'],
        confirm: this.literals['fgtsReport']['confirm'],
      },
      title: this.literals['fgtsReport']['titleReport'],
      message: this.literals['fgtsReport']['tafDiscardReport'],
      confirm: () => {
        this.dialogModalResponse.dialogResponse(true);
      },
      cancel: () => {
        this.dialogModalResponse.dialogResponse(false);
      },
    });
  }

  public convertReal(value: number): string {
    return this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2', 'pt');
  }

  public getPageLink(): string {
    return this.pageLink;
  }
}
