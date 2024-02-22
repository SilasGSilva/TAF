import { Component, Input, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { PoNotificationService, PoI18nPipe } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { DownloadService } from 'shared/download/download.service';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { TsiIntegrationErrorsRequest } from '../../models/tsi-integrations-errors-request';
import { TsiErrorItem } from './../../models/tsi-error-item';
import { getBranchLoggedIn } from '../../../../../util/util';
import { TsiTableService } from './../table/tsi-table.service';

@Component({
  selector: 'app-tsi-export-report',
  templateUrl: './tsi-export-report.component.html',
  styleUrls: ['./tsi-export-report.component.scss'],
})

export class TsiExportReportComponent {
  public data = [];
  public sortData = [];
  public literals = {};
  public reportItems: Array<TsiErrorItem> = [];
  public isLoadingButton = false;
  public isHideLoading = false;
  public companyId = getBranchLoggedIn();

  @Input('tsi-form-filter') formFilter: UntypedFormGroup;
  @Input('tsi-disable-export') disableButtonExport:boolean = true;

  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  constructor(
    private literalService: LiteralService,
    private exportReportTsiService: TsiTableService,
    private poNotificationService: PoNotificationService,
    private poI18n: PoI18nPipe,
    private downloadService: DownloadService,
    private checkFeatureService: CheckFeaturesService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  public exportExcel(value: Array<object>): void {
    this.downloadService.download(
      this.poI18n.transform(this.literals['tsiExportReport']['filename'], ['tsi']),
      this.poI18n.transform(this.literals['tsiExportReport']['title'], ['tsi']),
      this.reportTsiData(),
      value
    );
  }

  public async getReportItems(): Promise<void> {
    this.isHideLoading = true;
    if (this.checkFeatureService.getFeature('downloadXLS').access) {
      this.isLoadingButton = true;

      const dateOf = this.formFilter.get('periodFrom').value;
      const dateUp = this.formFilter.get('periodTo').value;
      const branchCode = this.formFilter.get('branchCode').value;
      const typeFilter = this.formFilter.get('type').value;

      const payload: TsiIntegrationErrorsRequest = {
        companyId: this.companyId,
        branchCode: branchCode,
        dateOf: dateOf,
        dateUp: dateUp,
        typeFilter: typeFilter,
        page:1,
        pageSize:99999999
      };

      this.exportReportTsiService.getTsiErrors(payload).subscribe(
        response => {
          this.setDetailsItems(response.items);
          this.isLoadingButton = false;
          this.isHideLoading = false;
        },
        error => {
          /*if (!valueIsNull(err.error.message)) {
            errMsg = err.error.message
            this.poNotificationService.error(errMsg);
          }*/
          this.isLoadingButton = false;
          this.isHideLoading = false;
        }
      );
    } else {
      this.messengerModal.onShowMessage(
        this.checkFeatureService.getFeature('downloadXLS').message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }
  }

  public setDetailsItems( items: Array<TsiErrorItem> ): void {
    this.data = [];
    items.forEach(
      (item: TsiErrorItem) => {
        this.rearrange(item);
      }
    );
    this.exportExcel(this.data);
  }

  public reportTsiData(): Array<string> {
    return this.headersTsiTable();
  }

  public headersTsiTable(): Array<string> {
    return [
      this.literals['tsiTable']['branchcode'],
      this.literals['tsiTable']['layouterror'],
      this.literals['tsiTable']['integrationdate'],
      this.literals['tsiTable']['integrationtime'],
      this.literals['tsiTable']['regkey'],
      this.literals['tsiTable']['typeInvoice'],
      this.literals['tsiTable']['invoice'],
      this.literals['tsiTable']['serie'],
      this.literals['tsiTable']['dateInvoice'],
      this.literals['tsiTable']['codeParticipant'],
      this.literals['tsiTable']['errormessage'],
    ];
  }

  public rearrange(item: TsiErrorItem): void {
    this.rearrangeItens(item);
  }

  public rearrangeItens(item: TsiErrorItem): void {
    this.sortData = [
      item.branchcode,
      item.layouterror,
      item.integrationdate,
      item.integrationtime,
      item.regkey,
      item.typeInvoice,
      item.invoice,
      item.serie,
      item.dateInvoice,
      item.codeParticipant,
      item.errormessage,
    ];
    this.data.push(this.sortData);
  }
}
