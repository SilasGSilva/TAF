import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { PoModalAction } from '@po-ui/ng-components';
import { valueIsNull } from '../../../../util/util';
import { Feature } from './../../../models/feature';
import { LiteralService } from 'core/i18n/literal.service';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { getBranchLoggedIn } from '../../../../util/util';
import { DialogYesNoComponent } from 'shared/dialog-yes-no/dialog-yes-no.component';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { TsiDivergentDocumentsTableService } from './table/tsi-divergent-documents-table.service';
import { TsiDivergentDocumentsService } from './tsi-divergent-documents.service';
import { TsiDivergentDocumentsResponse } from '../models/tsi-divergent-documents-response';
import { TsiDivergentDocumentsRequest } from '../models/tsi-divergent-documents-request';
import { TsiDivergentDocumentsItem } from '../models/tsi-divergent-documents-item';
import { TsiDivergentDocumentsBody } from '../models/tsi-divergent-documents-body';
import { TsiDivergentDocumentsReinstateRequest } from '../models/tsi-divergent-documents-reinstate-request';

@Component({
  selector: 'app-divergent-documents',
  templateUrl: './tsi-divergent-documents.component.html',
  styleUrls: ['./tsi-divergent-documents.component.scss']
})
export class TsiDivergentDocumentsComponent implements OnInit {
  public companyId:string = getBranchLoggedIn();
  public literals = {};
  public headerTitle: string = '';
  public formFilter: UntypedFormGroup;
  public loadingDivergentDocumentsTable:boolean = false;
  public showDivergentDocumentsTable:boolean = false;
  public page:number = 1;
  public pageSize:number = 10;
  public hasNextDivergentDocuments:boolean;
  public tsiDivergentDocumentsTableItems:Array<TsiDivergentDocumentsItem> = [];
  public recordsInTable: number = 0;
  public totalRecords: number = 0;
  public textRemaning:string = '';
  public hasRemainingRecords:boolean = false;
  public showReinstateSelected: boolean = false;
  public showReinstateAll: boolean = false;
  public selectedItens: TsiDivergentDocumentsBody;
  public disableButtonReinstateAll:boolean = true;
  public loadingTsiTable: boolean = false;
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;

  @ViewChild(DialogYesNoComponent, { static: true }) modalYesNo: DialogYesNoComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(private literalService: LiteralService,
    private checkFeatureService: CheckFeaturesService,
    private tsiDivergentDocumentsTableService: TsiDivergentDocumentsTableService,
    private tsiDivergentDocumentsService: TsiDivergentDocumentsService,
  ) {
    this.literals = this.literalService.literalsTafFiscal;
    this.headerTitle = this.literals['tsiDivergentDocuments']['title'];
  }

  ngOnInit(): void {
    this.selectedItens = {
      reprocessAll: false,
      itemsV5R: [],
      itemsSFT: []
    }
  };

  public showMoreDivergentDocuments(): void {
    this.applyFilterDivergentDocumentsTable(false);
  }

  public showButtonReinst() {
    //Habilita botão de reintegração
    if (this.selectedItens.itemsSFT.length > 0 || this.selectedItens.itemsV5R.length > 0 ) {
      this.showReinstateSelected = true;
      this.showReinstateAll = false;
    } else {
      this.showReinstateSelected = false;
      this.showReinstateAll = true;
    }
  }

  public verifyApplyFilterDivergentDocuments(applyFilter: boolean, formFilter? : UntypedFormGroup ) {
    const featuresReturn: Feature = this.checkFeatureService.getFeature('tsiStamp');

    if (featuresReturn.access) {
      this.applyFilterDivergentDocumentsTable(applyFilter,formFilter);
    } else {
      this.messengerModal.onShowMessage(
        featuresReturn.message,
        false,
        false,
        this.literals['tsiDivergentDocuments']['unupdatedSystem']
      );
    }
  }

  public applyFilterDivergentDocumentsTable(applyFilter: boolean, formFilter? : UntypedFormGroup ) {
    if (!valueIsNull(formFilter)) {
      this.formFilter = formFilter;
    }
    this.loadingDivergentDocumentsTable = true;
    this.showDivergentDocumentsTable = true;
    if(applyFilter) {
      this.selectedItens.itemsV5R = [];
      this.selectedItens.itemsSFT = [];
      this.showButtonReinst();
      this.page = 1;
    }else{
      this.page++;
    };
    const params: TsiDivergentDocumentsRequest = {
      companyId: this.companyId,
      dateOf: this.formFilter.get('periodFrom').value,
      dateUp: this.formFilter.get('periodTo').value,
      branchCode: this.formFilter.get('branchCode').value,
      page: this.page,
      pageSize: this.pageSize
    };
    this.hasNextDivergentDocuments = false;
    this.tsiDivergentDocumentsTableService.getTsiDivergentDocuments(params).subscribe(
      response => {
      this.setTsiDivergentDocumentsTable(response, applyFilter);
      this.loadingDivergentDocumentsTable = false;
      if(response.items.length > 0){
        this.disableButtonReinstateAll = false;
      }else{
        this.disableButtonReinstateAll = true;
      }
    },
      err => {
        let errMsg: string;
        /* if (!valueIsNull(err.error.message)) {
          errMsg = err.error.message
          this.poNotificationService.error(errMsg);
        }*/
        this.loadingDivergentDocumentsTable = false;
        this.showDivergentDocumentsTable = false;
    });
  }

  setTsiDivergentDocumentsTable(response: TsiDivergentDocumentsResponse, applyFilter:boolean) {
    if(!applyFilter){
      response.items.forEach(item => {
        this.tsiDivergentDocumentsTableItems.push(item);
      });
    }else{
      this.tsiDivergentDocumentsTableItems = [];
      this.tsiDivergentDocumentsTableItems = response.items;
    }
    this.tsiDivergentDocumentsTableItems = [...this.tsiDivergentDocumentsTableItems];
    this.recordsInTable = this.tsiDivergentDocumentsTableItems.length;
    if (!valueIsNull(response.remainingRecords)) {
      this.hasRemainingRecords = true;
      this.totalRecords = this.tsiDivergentDocumentsTableItems.length + response.remainingRecords;
      this.textRemaning = 'Exibindo ' + this.recordsInTable + ' de ' + this.totalRecords + ' registros ';
    } else{
      this.hasRemainingRecords = false;
    }
    this.hasNextDivergentDocuments = response.hasNext;
  }

  public reinstateAll() {
    const param: TsiDivergentDocumentsReinstateRequest = {
      companyId: this.companyId,
      branchCode: this.formFilter.get('branchCode').value,
      dateOf: this.formFilter.get('periodFrom').value,
      dateUp: this.formFilter.get('periodTo').value,
    };
    this.selectedItens.reprocessAll = true;
    this.selectedItens.itemsSFT = [];
    this.selectedItens.itemsV5R = [];
    const bodyJSON = JSON.stringify(this.selectedItens);
    this.reinstateDialog('Deseja reintegrar todos os ' + this.totalRecords + ' registros? ', bodyJSON, param);
  }

  public reinstateSelecteds() {
    const param: TsiDivergentDocumentsReinstateRequest = {
      companyId: this.companyId,
      branchCode: this.formFilter.get('branchCode').value,
      dateOf: this.formFilter.get('periodFrom').value,
      dateUp: this.formFilter.get('periodTo').value,
    };
    this.selectedItens.reprocessAll = false;
    const bodyJSON = JSON.stringify(this.selectedItens);
    this.reinstateDialog(this.literals['tsiDivergentDocuments']['labelReinstateSelecteds'], bodyJSON, param);
  }

  public setItemsSelecteds(tsiReinstateItens:TsiDivergentDocumentsBody) {
    this.selectedItens = tsiReinstateItens;
    this.showButtonReinst()
  }

  public reloadTable() {
    this.applyFilterDivergentDocumentsTable(true);
  }

  public reinstateDialog(question: string, body: string, param: TsiDivergentDocumentsReinstateRequest): void {
    const title = this.literals['tsiDivergentDocuments']['titleReinstate'];
    this.primaryAction = {
      action: async () => {
        this.loadingDivergentDocumentsTable = true;
        this.modalYesNo.close();
        this.postReinstateInvoices(body, param);
      },
      label: this.literals['tsiDivergentDocuments']['confirm'],
      danger: false,
      loading: false
    };
    this.secondaryAction = {
      action: () => {
        this.loadingDivergentDocumentsTable = false;
        this.modalYesNo.close();
      },
      label: this.literals['tsiDivergentDocuments']['cancel'],
      danger: false,
      loading: false
    };
    this.modalYesNo.onOpenDialog(this.primaryAction, this.secondaryAction, title, question);
  }

  public postReinstateInvoices(body: string, param: TsiDivergentDocumentsReinstateRequest) {
    this.tsiDivergentDocumentsService.postReinstateInvoices(body, param).subscribe(
      response => {
        this.reloadTable();
        this.messengerModal.onShowMessage(
          response.message,
          false,
          false,
          this.literals['tsiDivergentDocuments']['titleReinstate']
        );
      },
    );
  }
}
