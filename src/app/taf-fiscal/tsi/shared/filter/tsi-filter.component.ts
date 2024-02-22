import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { LiteralService } from 'literals';
import { TsiFilterService } from './tsi-filter.service';
import { getBranchCodeLoggedIn, getBranchLoggedIn } from '../../../../../util/util';
import { valueIsNull } from '../../../../../util/util';
import { TsiBranchesListing } from './../../models/tsi-branches-listing';
import { SmartViewFilterService } from '../../../smart-view/shared/filter/sv-filter.service';
import { SmartViewConfiguredListing } from '../../../smart-view/models/sv-configured-listing';

@Component({
  selector: 'app-tsi-filter',
  templateUrl: './tsi-filter.component.html',
  styleUrls: ['./tsi-filter.component.scss']
})
export class TsiFilterComponent implements OnInit {
  public literals: object;
  public branchesOptions: Array<PoSelectOption> = [];
  public typeOptions: Array<PoSelectOption> = [];
  public formFilter: UntypedFormGroup;
  public companyId = getBranchLoggedIn();
  public branchCode = getBranchCodeLoggedIn();
  public dateLabel: string = '';
  public svConfigured: boolean = false;
  public btnDisabled: boolean = false;
  public businessObject: string = 'fiscal.sv.taf.integrateddocuments';

  @Input('tsi-divergent') divergentDocuments: boolean = false;

  @Output('apply-filter-table') applyFilterTable = new EventEmitter<UntypedFormGroup>();

  constructor(private tsiFilterService: TsiFilterService,
    private smartViewFilterService: SmartViewFilterService,
    private literalService: LiteralService,
    private poNotificationService: PoNotificationService) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit() {
    this.setDefaultValues();
    this.getBranches();
    if (this.divergentDocuments) {
      this.getSmartView();
    }
  }

  public async getBranches() {
    const params: TsiBranchesListing = {
      companyId: this.companyId
    };
    this.tsiFilterService.getEventListing(params).subscribe(
      response => {
        this.branchesOptions.length = 0;
        this.setBranchesOption(response);
        this.formFilter.patchValue({ branchCode:  this.branchCode});
      }
    );
  }

  public async getSmartView() {
    const params: SmartViewConfiguredListing = {companyId: this.companyId};

    this.smartViewFilterService.getSmartViewConfiguredListing(params).subscribe(
      response => {this.svConfigured = response.configured});
  }

  public setDefaultValues(): void {
    this.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl(this.literals['tsiFilter']['branches'], [Validators.required]),
      periodFrom: new UntypedFormControl(this.literals['tsiFilter']['periodFrom'], []),
      periodTo: new UntypedFormControl(this.literals['tsiFilter']['periodTo'], []),
      type: new UntypedFormControl(this.literals['tsiFilter']['type'], []),
    });
    this.typeOptions = [
      { label: this.literals['tsiFilter']['all'], value: this.literals['tsiFilter']['all'] },
      { label: this.literals['tsiFilter']['records'], value: this.literals['tsiFilter']['records'] },
      { label: this.literals['tsiFilter']['moviments'], value: this.literals['tsiFilter']['moviments'] },
      { label: this.literals['tsiFilter']['apuration'], value: this.literals['tsiFilter']['apuration'] },
    ];
    this.formFilter.patchValue({ periodTo: '', periodFrom: '', type: this.literals['tsiFilter']['all'] });
  }

  //Função criada divido aos labels das datas serem diferentes para o Log de Processamentos e Documentos Divergêntes.
  public getDateLabel(datePeriod: string) {
    this.dateLabel = '';
    if (this.divergentDocuments) {
      this.dateLabel = this.literals['tsiDivergentDocuments'][datePeriod]
    } else {
      this.dateLabel = this.literals['tsiFilter'][datePeriod]
    }
    return this.dateLabel;
  }

  public setBranchesOption(responseBranches): void {
    responseBranches.branches.forEach(element => {
      const otherResult = this.branchesOptions.find(
        result => result.value === element.event
      );
      if (!otherResult) {
        this.branchesOptions.push({ label: element.branchCode, value: element.branchCode });
      }
    });
  }

  public applyFilter() {
    //Troco branch code de acordo com seleção do usuário se escolheu diferente de Todas
    const newBranchCode = this.formFilter.get('branchCode').value;
    if(newBranchCode != 'Todas'){
      this.setBranchCode(this.formFilter.get('branchCode').value);
    }else{
      this.setBranchCode(getBranchCodeLoggedIn());
    }

    this.applyFilterTable.emit(this.formFilter);
  }

  public setBranchCode(branchCode:string){
    this.branchCode = branchCode;
  }

  public callSmartView() {
    let objectAdvpl: string = '';
    this.btnDisabled = true;

    if (!valueIsNull(window['totvstec'])) {      
      if (window['totvstec'].internalPort !== undefined) {
        objectAdvpl = 'totvtec';        
      } else if (window['twebchannel'].internalPort !== undefined) {
        objectAdvpl = 'twebchannel';
      }

      if (objectAdvpl) {
        window[objectAdvpl].jsToAdvpl('callTafSmartView', this.businessObject);
        window[objectAdvpl].advplToJs = (codeType: string) => {this.execAdvplToJs(codeType)};
      } else {
        this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
        this.btnDisabled = false;
      }
    } else {
      this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
      this.btnDisabled = false;
    }
  }

  public execAdvplToJs(codeType: string) {
    if (codeType==="retTafSmartView") {
      this.btnDisabled = false;
    }
  }
}