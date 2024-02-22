import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import {
  PoTableColumn,
  PoTableColumnSort,
  PoModalAction,
  PoTableComponent
} from '@po-ui/ng-components';
import { CatValuesResponse } from '../social-cat-models/CatValuesResponse';
import { LiteralService } from 'core/i18n/literal.service';
import { MessengerComponent } from '../../../shared/messenger/messenger.component';
import { CatReportComponent } from '../cat-report/cat-report.component';

@Component({
  selector: 'app-cat-table',
  templateUrl: './cat-table.component.html',
  styleUrls: ['./cat-table.component.scss'],
})
export class CatTableComponent implements OnInit {

  @Input() itemsTable: Array<CatValuesResponse>;
  @Input() loadingTable = false;
  @Input() hasNext = false;
  @Input() filterStatus = '';
  @Output('showMore') showMore = new EventEmitter();
  @ViewChild(CatReportComponent, { static: true }) catReport: CatReportComponent;
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;
  @ViewChild(MessengerComponent, { static: true })
  public branch: string;
  public cpf: string;
  public colorTag: string;
  public colorTagRGB: string;
  public deadlineDescription: string;
  public establishment: string;
  public event: string;
  public eventDate: string;
  public filter = '';
  public indApur: string;
  public name: string;
  public modalTitle: string;
  public receipt: string;
  public registration: string;
  public ruleDescription: string;
  public status: string;
  public transmissionDate: string;
  public transmissionDeadline: string;
  public transmissionObservation: string;
  public type: string;
  public columns: Array<PoTableColumn>;
  public debounce: Subject<string> = new Subject<string>();
  public isLoadingButton = false;
  public literals: Object = {};
  public messengerModal: MessengerComponent;
  public primaryAction: PoModalAction;
  public sub: Subscription;
  public urlPdf = '';
  public secondaryAction: PoModalAction;
  public selectedCatsKeys: Array<string> = [];
  public isLoadingPrint = false;
  public loadingShowMore: boolean = false;

  constructor(
    private literalsService: LiteralService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.columns = this.getColumns();
    this.debounce
      .pipe(debounceTime(300))
      .subscribe(filter => (this.filter = filter));
  }

  public showMoreRegisters(sortColumn: PoTableColumnSort): void {
    this.showMore.emit(!this.hasNext);
    this.loadingShowMore = true;
    this.sortColumnDetail(sortColumn);
  }

  private getColumns(): Array<PoTableColumn> {
    const columnsCat = [
      {
        property: 'eventType',
        label: this.literals['socialCat']['legend'],
        type: 'label',
        labels: [
          { value: 'Inclusão', color: 'color-11', label: 'Inclusão' },
          { value: 'Alteração', color: 'color-08', label: 'Alteração' },
        ]
      },
      {
        property: 'branch',
        label: this.literals['socialCat']['branchs'],
      },
      {
        property: 'cpf',
        label: this.literals['socialCat']['cpf'],
      },
      {
        property: 'name',
        label: this.literals['socialCat']['name'],
      },
      {
        property: 'catNumber',
        label: this.literals['socialCat']['catNumber'],
      },
      {
        property: 'accidentDate',
        label: this.literals['socialCat']['accidentDate'],
        type: 'date'
      },
      {
        property: 'predecessorType',
        label: this.literals['socialCat']['predecessorType'],
      },
      {
        property: 'catType',
        label: this.literals['socialCat']['catType'],
      },
      {
        property: 'situation',
        label: this.literals['socialCat']['situation'],
      },
    ];

    return columnsCat;
  }

  public onSelectCat(event: Array<{ key: string }> | { key: string }): void {
    if (Array.isArray(event)) {
      event.map(catEvent => this.selectedCatsKeys.push(catEvent['key']));
    } else {
      this.selectedCatsKeys.push(event['key']);
    }
  }

  public onUnselectCat(event: Array<{ key: string }> | { key: string }): void {
    if (Array.isArray(event)) {
      this.selectedCatsKeys.splice(0);
    } else {
      const position = this.selectedCatsKeys.indexOf(event['key']);
      this.selectedCatsKeys.splice(position, 1);
    }
  }

  public printOutCat(): void {
    const keys = (this.poTable.getUnselectedRows().length === 0) ? [] : this.selectedCatsKeys;

    this.catReport.preparePrintReport(keys);
  }

  public updateIsLoadingPrint(event: boolean): void {
    this.isLoadingPrint = event;
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
