import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { PoDropdownAction, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { CatServices } from './../cat-filter/services/cat.service';

@Component({
  selector: 'app-cat-report',
  templateUrl: './cat-report.component.html',
  styleUrls: ['./cat-report.component.scss']
})
export class CatReportComponent implements OnInit {
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;
  public urlPdf = '';
  public literals = {};
  public optionsSavingCAT: Array<PoDropdownAction>;

  @Output('loading-report-view') loadingReportView = new EventEmitter<boolean>();
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(
    private catServices: CatServices,
    private literalsService: LiteralService,
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.optionsSavingCAT = this.getOptionsSavingCAT();
  }

  public preparePrintReport(keys: Array<string>, companyId?: string): void {
    this.loadingReportView.emit(true);

    if (companyId) {
      this.catServices
      .printCatReportMonitor(keys, companyId)
      .subscribe(response => {
        this.urlPdf = response;
        this.loadingReportView.emit(false);
        this.poModal.open();
      });
    } else {
      this.catServices
      .printCatReport(keys)
      .subscribe(response => {
        this.urlPdf = response;
        this.loadingReportView.emit(false);
        this.poModal.open();
      });
    }
  }

  private getOptionsSavingCAT(): Array<PoDropdownAction> {
    return [
      {
        label: this.literals['catReport']['mergedCats'],
        action: this.choosePrintMode.bind(this, 'mixed'),
        icon: 'po-icon po-icon-document'
      },
      {
        label: this.literals['catReport']['individualizedCats'],
        action: this.choosePrintMode.bind(this, 'separate'),
        icon: 'po-icon po-icon-document-double'
      }
    ];
  }

  private choosePrintMode(printMode: string): void {
    this.catServices.downloadCatReport(printMode);
  }
}
