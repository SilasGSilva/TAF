import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { PoModalAction, PoNotificationService } from '@po-ui/ng-components';
import { valueIsNull } from '../../../../util/util';
import { LiteralService } from 'core/i18n/literal.service';
import { getBranchLoggedIn } from '../../../../util/util';
import { TsiTableService } from './table/tsi-table.service';
import { TsiIntegrationErrorsResponse } from '../models/tsi-integrations-errors-response';
import { TsiIntegrationErrorsRequest } from '../models/tsi-integrations-errors-request';
import { TsiErrorItem } from '../models/tsi-error-item';
import { TsiReprocessBody } from '../models/tsi-reprocess-body';
import { TsiMonitorService } from './tsi-monitor.service';
import { TsiReprocessRequest } from '../models/tsi-reprocess-request';
import { DialogYesNoComponent } from 'shared/dialog-yes-no/dialog-yes-no.component';
import { MessengerComponent } from 'shared/messenger/messenger.component';
@Component({
  selector: 'app-tsi-monitor',
  templateUrl: './tsi-monitor.component.html',
  styleUrls: ['./tsi-monitor.component.scss']
})
export class TsiMonitorComponent implements OnInit {

  public literals = {};
  public companyId: string = getBranchLoggedIn();
  public hasNext: boolean;
  public hasRemainingRecords: boolean;
  public page: number = 1;
  public pageSize: number = 10;
  public loadingTsiTable: boolean = false;
  public tsiTableItems: Array<TsiErrorItem> = [];
  public buttonExportEnable: boolean = false;
  public formFilter: UntypedFormGroup;
  public buttonExportDisable: boolean = true;
  public showTable: boolean = false;
  public recordsInTable: number = 0;
  public totalRecords: number = 0;
  public textRemaning: string = '';
  public headerTitle: string = '';
  public showReprocessSelected: boolean = false;
  public showReprocessAll: boolean = false;
  public selectedItens: Array<number> = [];
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;
  //public messageErrorTable:string ='';
  //public showErroResultaTable:boolean = false;
  public disableButtonReprocessAll:boolean = true;
  public toolTipButtonAll:string =''

  @ViewChild(DialogYesNoComponent, { static: true }) modalYesNo: DialogYesNoComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(private literalService: LiteralService,
    private tsiTableService: TsiTableService,
    private tsiMonitorService: TsiMonitorService,
    private poNotificationService: PoNotificationService,
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit() {
    this.setValueLiterals();
    this.disableButtonReprocessAll = true;
  }

  private setValueLiterals(){
    this.headerTitle = this.literals['tsiMonitor']['title'];
    this.toolTipButtonAll = this.literals['tsiMonitor']['tooltipButtonAll'];
  }

  public showWarningMessage(){
    this.poNotificationService.warning(this.literals['tsiMonitor']['labelWarning']);
  }

  public showMoreRegisters(): void {
    this.applyFilterTable(false);
  }

  public showButtonReproc() {
    //Habilita botão de reprocessamento
    if (this.selectedItens.length > 0) {
      this.showReprocessSelected = true;
      this.showReprocessAll = false;
    } else {
      this.showReprocessSelected = false;
      this.showReprocessAll = true;
    }

  }

  public applyFilterTable(applyFilter: boolean, formFilter?: UntypedFormGroup) {
    if (applyFilter) {
      //Zero itens selecionados
      this.selectedItens = [];
      this.showButtonReproc();
    }

    if (!valueIsNull(formFilter)) {
      this.formFilter = formFilter;
      this.enableButtonReprocessAll();
    }

    this.loadingTsiTable = true;
    this.showTable = true;
    if (applyFilter) {
      this.page = 1;
    } else {
      this.page++;
    }

    const params: TsiIntegrationErrorsRequest = {
      companyId: this.companyId,
      dateOf: this.formFilter.get('periodFrom').value,
      dateUp: this.formFilter.get('periodTo').value,
      branchCode: this.formFilter.get('branchCode').value,
      typeFilter: this.formFilter.get('type').value,
      page: this.page,
      pageSize: this.pageSize
    };
    //Desabilito botão de carregar mais para evitar duplo clique
    this.hasNext = false;
    this.tsiTableService.getTsiErrors(params).subscribe(
      response => {
        //this.showErroResultaTable = false;
        this.setErrosTable(response, applyFilter);
        this.loadingTsiTable = false;
        this.buttonExportDisable = false;
      },
      err => {
        let errMsg;
        /*if (!valueIsNull(err.message)) {
          errMsg = err.message
          this.messageErrorTable = errMsg;
        }*/
        this.loadingTsiTable = false;
        this.buttonExportDisable = true;
        this.showTable = false;
      });

  }
  public setErrosTable(response: TsiIntegrationErrorsResponse, applyFilter: boolean) {
    //Se vier do botão Carregar Mais, não apago tabela
    if (!applyFilter) {
      response.items.forEach(itemV5R => {
        this.tsiTableItems.push(itemV5R);
      });
    } else {
      this.tsiTableItems = [];
      this.tsiTableItems = response.items;
    }
    this.tsiTableItems = [...this.tsiTableItems]
    this.recordsInTable = this.tsiTableItems.length;
    if (!valueIsNull(response.remainingRecords)) {
      this.hasRemainingRecords = true;
      this.totalRecords = this.tsiTableItems.length + response.remainingRecords;
      this.textRemaning = 'Exibindo ' + this.recordsInTable + ' de ' + this.totalRecords + ' registros ';
    } else {
      this.hasRemainingRecords = false;
    }
    this.hasNext = response.hasNext;
  }
  public goToDocumentation() {
    window.open(this.literals['tsiMonitor']['linkDoc'], '_blank');
  }
  public goToSatisfactionSurvey(){
    window.open(this.literals['tsiMonitor']['linkSatisfactionSurvey'], '_blank');
  }

  public reprocessDialog(question: string, body: string, param: TsiReprocessRequest): void {
    const title = this.literals['tsiMonitor']['titleReprocess'];
    this.primaryAction = {
      action: async () => {
        this.loadingTsiTable = true;
        this.modalYesNo.close();
        this.postReprocessInvoices(body, param);
      },
      label: this.literals['tsiMonitor']['confirm'],
      danger: false,
      loading: false
    };
    this.secondaryAction = {
      action: () => {
        this.loadingTsiTable = false;
        this.modalYesNo.close();
      },
      label: this.literals['tsiMonitor']['cancel'],
      danger: false,
      loading: false
    };
    this.modalYesNo.onOpenDialog(this.primaryAction, this.secondaryAction, title, question);
  }

  public reprocessAllInvoices() {
    const bodyReprocess: TsiReprocessBody = {
      reprocessAll: true,
      items: []
    };
    const param: TsiReprocessRequest = {
      companyId: this.companyId
    };
    const bodyJSON = JSON.stringify(bodyReprocess);
    this.reprocessDialog(this.literals['tsiMonitor']['labelReprocessAll'], bodyJSON, param);

  }

  public reprocessSelecteds() {
    const bodyReprocess: TsiReprocessBody = {
      reprocessAll: false,
      items: this.selectedItens
    };

    const param: TsiReprocessRequest = {
      companyId: this.companyId
    };
    const bodyJSON = JSON.stringify(bodyReprocess);
    this.reprocessDialog(this.literals['tsiMonitor']['labelReprocessSelecteds'], bodyJSON, param);

  }

  public postReprocessInvoices(body: string, param: TsiReprocessRequest) {
    this.tsiMonitorService.postReprocessInvoices(body, param).subscribe(
      response => {
        this.reloadTable();
        this.messengerModal.onShowMessage(
          response.message,
          false,
          false,
          this.literals['tsiMonitor']['titleReprocess']
        );
      }
    );
  }



  public setItemsSelecteds(items: Array<number>) {
    this.selectedItens = items;
    this.showButtonReproc()
  }

  public reloadTable() {
    this.applyFilterTable(true);
  }

  public enableButtonReprocessAll(){
    const params: TsiIntegrationErrorsRequest = {
      companyId: this.companyId,
      dateOf: this.formFilter.get('periodFrom').value,
      dateUp: this.formFilter.get('periodTo').value,
      branchCode: this.formFilter.get('branchCode').value,
      typeFilter: 'Movimentos',
      page: 1,
      pageSize: 1
    };

    this.tsiTableService.getTsiErrors(params).subscribe(
      response => {
        if(response.items.length > 0){
          this.disableButtonReprocessAll = false;
        }else{
          this.disableButtonReprocessAll = true;
        }
      },
      err => {
        this.disableButtonReprocessAll = true;
      });
  }

}
