import { Component } from '@angular/core';
import { LiteralService } from 'core/i18n/literal.service';
import { CatValuesResponse } from './social-cat-models/CatValuesResponse';
import { DisclaimerFilterCat } from './social-cat-models/DisclaimerFilterCat';

@Component({
  selector: 'app-social-cat',
  templateUrl: './social-cat.component.html',
  styleUrls: ['./social-cat.component.scss']
})

export class SocialCatComponent {
  public filters: Array<DisclaimerFilterCat>;
  public disabledInputs = false;
  public disableButtonApplyFilters = true;
  public emptyResult = false;
  public hasNext = false;
  public loadingTable = false;
  public progressSuccess = false;
  public showDetails = false;
  public showMore = false;
  public verifyRegisters = false;
  public itemsTable = [];
  public literals = {};
  public progressBarInfo = '';
  public progressBarValue = 0;

  constructor(
    private literalsService: LiteralService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  public loadProgressBar(progressBarValue: number): void {
    if (progressBarValue < 100) {
      this.disabledInputs = true;
      this.loadingTable = true;
    } else {
      this.disabledInputs = false;
      this.loadingTable = false;
      this.progressSuccess = true;
    }

    this.progressBarValue = progressBarValue;
    this.progressBarInfo = `${this.progressBarValue}%`;
  }

  public loadMainTable(payloadReportTable: CatValuesResponse): void {
    if (this.itemsTable == undefined) {
      this.itemsTable = payloadReportTable.items;
    } else {
      payloadReportTable.items.forEach(element => {
        this.itemsTable.push(element);
      });
    }

    this.verifyRegisters = true;
    this.showMore = undefined;
    this.hasNext = !payloadReportTable.hasNext;
    this.itemsTable = [...this.itemsTable];
    this.progressBarValue = undefined;

    if (this.itemsTable.length == 0) {
      this.emptyResult = true;
      this.verifyRegisters = false;
    }
  }

  public reset(): void {
    this.progressBarValue = undefined;
    this.progressSuccess = undefined;
    this.itemsTable = undefined;
    this.verifyRegisters = false;
    this.emptyResult = false;
  }

  public showMoreRegisters(showMore: boolean): void {
    this.showMore = showMore;
  }
}
