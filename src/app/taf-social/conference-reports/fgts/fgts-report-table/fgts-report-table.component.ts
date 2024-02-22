import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { debounceTime, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import {
  PoTableColumn,
  PoTableColumnSort,
  PoModalComponent,
  PoModalAction,
} from '@po-ui/ng-components';

import { FgtsReportTableService } from './fgts-report-table.service';
import { LiteralService } from 'core/i18n/literal.service';
import { ESocialBaseConferFgtsValuesResponse } from '../../conference-reports-models/ESocialBaseConferFgtsValuesResponse';
import { ESocialBaseConferFgtsValues } from '../../conference-reports-models/ESocialBaseConferFgtsValues';
import { Basis } from '../../conference-reports-models/Basis';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { FgtsReportFilterService } from '../fgts-report-filter/fgts-report-filter.service';
import { ExportExcelEsocialReportsService } from '../../services/export-excel-esocial-reports.service';

@Component({
  selector: 'app-fgts-report-table',
  templateUrl: './fgts-report-table.component.html',
  styleUrls: ['./fgts-report-table.component.scss'],
})
export class FgtsReportTableComponent implements OnInit, OnDestroy {
  @Input() itemsTable: Array<ESocialBaseConferFgtsValuesResponse>;
  @Input() itemsTableBasis: Array<Basis>;
  @Input() loadingTable = false;
  @Input() loadingShowMore = false;
  @Input() hasNext: boolean;
  @Input() taffull = false;
  @Output('taf-showMore') showMore = new EventEmitter();

  literals = {};
  columns: Array<PoTableColumn>;
  columnsBasis: Array<PoTableColumn>;
  debounce: Subject<string> = new Subject<string>();
  filter = '';
  name: string;
  cpfNumberFormatted: string;
  esocialRegistration: string;
  esocialCategory: string;
  title: string;
  fgtsValue: number;
  fgtsRetValue: number;
  fgts13Value: number;
  fgts13RetValue: number;
  fgtsRescissionRetValue: number;
  fgtsRescissionValue: number;
  fgtsTafValue: number;
  fgts13TafValue: number;
  fgtsRescissionTafValue: number;
  primaryAction: PoModalAction;
  currentParams: Object;
  sub: Subscription;
  exportData = [];

  public isLoadingButton = false;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  constructor(
    public fgtsReportTable: FgtsReportTableService,
    private literalsService: LiteralService,
    private checkFeatureService: CheckFeaturesService,
    private fgtsReportFilterService: FgtsReportFilterService,
    private exportReportFilterService: ExportExcelEsocialReportsService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.primaryAction = {
      action: () => {
        this.poModal.close();
      },
      label: this.literals['fgtsReport']['close'],
    };

    this.columns = this.getColumns();
    this.columnsBasis = this.getColumnsBasis();

    this.debounce
      .pipe(debounceTime(300))
      .subscribe(filter => (this.filter = filter));

    this.sub = this.fgtsReportFilterService.currentParams.subscribe(params => {
      this.currentParams = params;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getColumns(): Array<PoTableColumn> {
    const columnsTable = [];

    columnsTable.push({
      property: 'name',
      label: 'Nome',
      type: 'link',
      width: '20%',
      action: (value, row) => {
        this.modalValues(value, row);
      },
    });

    columnsTable.push({
      property: 'cpfNumberFormatted',
      label: this.literals['fgtsReport']['cpf'],
      width: '15%',
    });
    columnsTable.push({
      property: 'esocialRegistration',
      label: this.literals['fgtsReport']['registration'],
    });
    columnsTable.push({
      property: 'esocialCategory',
      label: this.literals['fgtsReport']['categorie'],
    });
    columnsTable.push({
      property: 'fgtsValue',
      label: this.literals['fgtsReport']['fgtsDepositValueRH'],
      type: 'number',
    });

    if (this.taffull) {
      columnsTable.push({
        property: 'fgtsTafValue',
        label: this.literals['fgtsReport']['fgtsDepositValueTaf'],
        type: 'number',
      });
    }

    columnsTable.push({
      property: 'fgtsRetValue',
      label: this.literals['fgtsReport']['fgtsDepositValuegovernment'],
      type: 'number',
    });

    return columnsTable;
  }

  private getColumnsBasis(): Array<PoTableColumn> {
    const columnsTableBasis = [];

    columnsTableBasis.push({
      property: 'branchIdFormatted',
      label: this.literals['fgtsReport']['establishment'],
      width: '20%',
    });
    columnsTableBasis.push({
      property: 'lotationCode',
      label: this.literals['fgtsReport']['lotation'],
    });
    columnsTableBasis.push({
      property: 'fgtsBasis',
      label: this.literals['fgtsReport']['baseRh'],
      type: 'number',
    });

    if (this.taffull) {
      columnsTableBasis.push({
        property: 'fgtsTafBasis',
        label: this.literals['fgtsReport']['baseTaf'],
        type: 'number',
      });
    }

    columnsTableBasis.push({
      property: 'fgtsRetBasis',
      label: this.literals['fgtsReport']['baseGovernment'],
      type: 'number',
    });
    columnsTableBasis.push({
      property: 'fgts13Basis',
      label: this.literals['fgtsReport']['baseRh13'],
      type: 'number',
    });

    if (this.taffull) {
      columnsTableBasis.push({
        property: 'fgts13TafBasis',
        label: this.literals['fgtsReport']['baseTaf13'],
        type: 'number',
      });
    }

    columnsTableBasis.push({
      property: 'fgts13RetBasis',
      label: this.literals['fgtsReport']['baseGovernment13'],
      type: 'number',
    });
    columnsTableBasis.push({
      property: 'fgtsRescissionBasis',
      label: this.literals['fgtsReport']['rescissionRh'],
      type: 'number',
    });

    if (this.taffull) {
      columnsTableBasis.push({
        property: 'fgtsRescissionTafBasis',
        label: this.literals['fgtsReport']['rescissionTaf'],
        type: 'number',
      });
    }
    columnsTableBasis.push({
      property: 'fgtsRescissionRetBasis',
      label: this.literals['fgtsReport']['rescissionGovernment'],
      type: 'number',
    });

    return columnsTableBasis;
  }

  modalValues(value: string, row: ESocialBaseConferFgtsValues): void {
    this.title = this.literals['fgtsReport']['conferValuesFGTS'];
    this.name = value;
    this.cpfNumberFormatted = row.cpfNumberFormatted;
    this.esocialRegistration = row.esocialRegistration;
    this.esocialCategory = row.esocialCategory;
    this.fgtsValue = row.fgtsValue;

    if (this.taffull) {
      this.fgtsTafValue = row.fgtsTafValue;
    }

    this.fgtsRetValue = row.fgtsRetValue;
    this.fgts13Value = row.fgts13Value;
    this.fgts13RetValue = row.fgts13RetValue;

    if (this.taffull) {
      this.fgts13TafValue = row.fgts13TafValue;
    }

    this.fgtsRescissionValue = row.fgtsRescissionValue;

    if (this.taffull) {
      this.fgtsRescissionTafValue = row.fgtsRescissionTafValue;
    }

    this.fgtsRescissionRetValue = row.fgtsRescissionRetValue;

    this.itemsTableBasis = row.basis;
    this.poModal.open();
  }

  showMoreRegisters(sortColumn: PoTableColumnSort): void {
    this.showMore.emit(!this.hasNext);
    this.sortColumnDetail(sortColumn);
  }

  public async exportReport() {
    const featuresReturn = this.checkFeatureService.getFeature('downloadXLS');
    if (featuresReturn.access) {
      this.isLoadingButton = true;
      await this.exportReportFilterService.PrintReport(
        'FGTS',
        this.currentParams
      );
      this.isLoadingButton = false;
    } else {
      this.messengerModal.onShowMessage(
        featuresReturn.message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }
  }

  private sortColumnDetail(sortColumn: PoTableColumnSort): void {
    if (sortColumn) {
      this.itemsTable.sort((a, b) => {
        if (sortColumn.type === 'ascending') {
          return a[sortColumn.column.property] < b[sortColumn.column.property] ? -1 : 0;
        }

        return a[sortColumn.column.property] > b[sortColumn.column.property] ? -1 : 0;
      });
    }
  }
}
