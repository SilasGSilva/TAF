import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PoTableColumn, PoTableLiterals, PoTableComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { TsiErrorItem } from './../../models/tsi-error-item';
@Component({
  selector: 'app-tsi-table',
  templateUrl: './tsi-table.component.html',
  styleUrls: ['./tsi-table.component.scss'],
})
export class TsiTableComponent implements OnInit {
  public literals: object;
  public height: number;
  public tsiTableColumns: Array<PoTableColumn>;
  public columnMesseger: string = 'errormessage';
  public columnKey: string = 'erpkey';
  public customLiterals: PoTableLiterals;

  @Input('tsi-table-hasNext') hasNext: boolean;
  @Input('tsi-table-loading') tableLoading: boolean;
  @Input('tsi-table-items') tsiTableItems: Array<TsiErrorItem>;
  @Output('tsi-table-showMore') tsiShowMore = new EventEmitter();
  @Output('tsi-items-selecteds') itemsSelecteds = new EventEmitter<Array<number>>();
  @Output('show-warning-message') showWarningMessage = new EventEmitter();

  @ViewChild(PoTableComponent) tableComponent: PoTableComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit() {
    this.setCustomLiterals();
    this.setColumns();
    this.height = this.calcTableSize(window.innerHeight);
  }

  public setCustomLiterals() {
    this.customLiterals = {
      noData: this.literals['tsiTable']['noData'],
    };
  }

  public showMoreRegisters() {
    this.tsiShowMore.emit();
  }

  public openMsg(message: string, title: string) {
    this.messengerModal.onShowMessage(message,
      true,
      false,
      title);
  }

  public setColumns() {
    this.tsiTableColumns = [
      {
        property: 'branchcode',
        label: this.literals['tsiTable']['branchcode'],
        type: 'string',
        width: '8%',
      },
      {
        property: 'layouterror',
        label: this.literals['tsiTable']['layouterror'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'integrationdate',
        label: this.literals['tsiTable']['integrationdate'],
        type: 'date',
        width: '10%',
      },
      {
        property: 'integrationtime',
        label: this.literals['tsiTable']['integrationtime'],
        type: 'string',
        width: '10%',
      },
      {
        property: 'regkey',
        label: this.literals['tsiTable']['regkey'],
        type: 'string',
        width: '10%',
        sortable: false
      },
      {
        property: 'erpkey',
        label: this.literals['tsiTable']['erpkey'],
        type: 'columnTemplate',
        width: '23%',
        sortable: false
      },
      {
        property: 'errormessage',
        label: this.literals['tsiTable']['errormessage'],
        type: 'columnTemplate',
        width: '27%',
        sortable: false
      }
    ];
  }

  public changeSelection() {
    let listKeysSelected: Array<number> = [];
    let showWarning = false;

    this.tableComponent.getSelectedRows().forEach((item: TsiErrorItem) => {

      if (!item.layouterror.match('C20')) {
        showWarning = true;
        item['$selected'] = false;
      } else {
        listKeysSelected.push(item.key);
      }

    });

    if (showWarning) {
      this.showWarningMessage.emit();
    }
    this.itemsSelecteds.emit(listKeysSelected);
  }

  public calcTableSize(size: number): number {

    if (size <= 633) {
      return size - 400;
    } else if (size <= 889) {
      return size - 390;
    } else {
      return size - 420;
    }
  }

}


