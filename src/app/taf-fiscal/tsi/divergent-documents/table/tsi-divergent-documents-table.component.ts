

import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PoTableColumn, PoTableComponent, PoTableLiterals } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { MessengerComponent } from './../../../../shared/messenger/messenger.component';
import { TsiDivergentDocumentsItem } from './../../models/tsi-divergent-documents-item';
import { TsiDivergentDocumentsItemBody } from 'taf-fiscal/tsi/models/tsi-divergent-documents-item-body';
import { TsiDivergentDocumentsBody } from 'taf-fiscal/tsi/models/tsi-divergent-documents-body';

@Component({
  selector: 'app-tsi-divergent-documents-table',
  templateUrl: './tsi-divergent-documents-table.component.html',
  styleUrls: ['./tsi-divergent-documents-table.component.scss']
})
export class TsiDivergentDocumentsTableComponent implements OnInit {
  public literals: object;
  public divergentDocumentsTableColumns: Array<PoTableColumn>;
  public customLiterals: PoTableLiterals;
  public operationType: string = '';
  public itemsSftBody: Array<TsiDivergentDocumentsItemBody> = [];
  public columnDetails: string = 'details';
  public height: number;

  @Input('divergent-document-table-items') divergentDocumentsTableItems: Array<TsiDivergentDocumentsItem>;
  @Input('divergent-document-table-loading') divergentDocumentTableLoading:boolean;
  @Input('divergent-document-table-hasNext') divergentDocumentTableHasNext: boolean;

  @Output('divergent-document-table-showMore') divergentDocumentShowMore = new EventEmitter();
  @Output('tsi-items-selecteds') itemsSelecteds = new EventEmitter<TsiDivergentDocumentsBody>();

  @ViewChild(PoTableComponent) tableComponent: PoTableComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(private literalService: LiteralService)
  {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit() {
    this.setCustomLiterals();
    this.setColumns();
    this.height = this.calcTableSize(window.innerHeight);
  }

  public setCustomLiterals() {
    this.customLiterals = {
      noData: this.literals['tsiDivergentDocuments']['noData'],
    };
  }

  public showMoreRegisters() {
    this.divergentDocumentShowMore.emit();
  }


  public openMsg(message: string, title: string) {
    this.messengerModal.onShowMessage(message,
      true,
      false,
      title);
  }

  public selectedItem(){
    let listKeysV5rSelected:Array<number> = [];
    this.itemsSftBody = [];
    this.tableComponent.getSelectedRows().forEach((item:TsiDivergentDocumentsItem)=>{
      if(item.operationtype === 'Entrada') {
        this.operationType = '0';
      } else {
        this.operationType = '1';
      }

      if (item.integrationerrorinv5r === "Sim") {
        listKeysV5rSelected.push(item.recnov5r);
      };

      this.itemsSftBody.push({
        branchcode: item.branchcode,
        operationtype: this.operationType,
        typingdate: item.typingdate,
        series: item.series,
        documentnumber: item.documentnumber,
        participantcode: item.participantcode,
        store: item.store,
      });
    });
    const tsiDivergentDocumentsBody: TsiDivergentDocumentsBody = {
      reprocessAll: false,
      itemsV5R: listKeysV5rSelected,
      itemsSFT: this.itemsSftBody,

    };
    this.itemsSelecteds.emit(tsiDivergentDocumentsBody);
  }

  public setColumns(){
    this.divergentDocumentsTableColumns = [
      {
        property: 'branchcode',
        label: this.literals['tsiDivergentDocumentsTable']['branchCode'],
        type: 'string',
        width: '5%',
        sortable:false,
      },
      {
        property: 'notefoundinsft',
        label: this.literals['tsiDivergentDocumentsTable']['noteFoundInSFT'],
        type: 'string',
        width: '4%',
        sortable:false,
      },
      {
        property: 'notefoundintaf',
        label: this.literals['tsiDivergentDocumentsTable']['noteFoundInTAF'],
        type: 'string',
        width: '4%',
        sortable:false,
      },
      {
        property: 'integrationerrorinv5r',
        label: this.literals['tsiDivergentDocumentsTable']['integrationErrorInV5R'],
        type: 'string',
        width: '4%',
        sortable:false,
      },
      {
        property: 'typingdate',
        label: this.literals['tsiDivergentDocumentsTable']['typingDate'],
        type: 'date',
        width: '7%',
        sortable:false,
      },
      {
        property: 'operationtype',
        label: this.literals['tsiDivergentDocumentsTable']['operationType'],
        type: 'string',
        width: '6%',
        sortable:false,
      },
      {
        property: 'documentnumber',
        label: this.literals['tsiDivergentDocumentsTable']['documentNumber'],
        type: 'string',
        width: '6%',
        sortable:false,
      }
      ,
      {
        property: 'series',
        label: this.literals['tsiDivergentDocumentsTable']['series'],
        type: 'string',
        width: '4%',
        sortable:false,
      }
      ,
      {
        property: 'participantcodeandname',
        label: this.literals['tsiDivergentDocumentsTable']['participantCodeAndName'],
        type: 'string',
        width: '10%',
        sortable:false,
      }
      ,
      {
        property: 'participantscnpj',
        label: this.literals['tsiDivergentDocumentsTable']['participantsCNPJ'],
        type: 'string',
        width: '6%',
        sortable:false,
      }
      ,
      {
        property: 'cancelederp',
        label: this.literals['tsiDivergentDocumentsTable']['canceledERP'],
        type: 'string',
        width: '6%',
        sortable:false,
      }
      ,
      {
        property: 'canceledtaf',
        label: this.literals['tsiDivergentDocumentsTable']['canceledTAF'],
        type: 'string',
        width: '6%',
        sortable:false,
      }
      ,
      {
        property: 'stampc20',
        label: this.literals['tsiDivergentDocumentsTable']['stampC20'],
        type: 'string',
        width: '8%',
        sortable:false,
      }
      ,
      {
        property: 'stampsft',
        label: this.literals['tsiDivergentDocumentsTable']['stampSFT'],
        type: 'string',
        width: '8%',
        sortable:false
      }
      ,
      {
        property: 'details',
        label: this.literals['tsiDivergentDocumentsTable']['details'],
        type: 'columnTemplate',
        //width: '7%',
        sortable:false
      }
    ];
  }

  public calcTableSize(size: number): number {
    if (size <= 633) {
      return size - 300;
    } else {
      return size - 320;
    }
  }

}
