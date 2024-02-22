import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { valueIsNull } from '../../../../../util/util';
import { getBranchLoggedIn } from '../../../../../util/util';
import { LiteralService } from 'literals';
import { SmartViewFilterService } from './sv-filter.service';
import { SvBusinessObjectListing } from '../../models/sv-business-object-listing';

@Component({
  selector: 'app-sv-filter',
  templateUrl: './sv-filter.component.html',
  styleUrls: ['./sv-filter.component.scss']
})
export class SmartViewFilterComponent implements OnInit {
  public literals: object;
  public svOptions: Array<PoSelectOption> = [];
  public listInfo: Array<string> = [];
  public formFilter: UntypedFormGroup;
  public companyId: string = getBranchLoggedIn();
  public scope: string = 'reinf';
  public comboDisabled: boolean = true;
  public btnDisabled: boolean = true;
  public loadingOverlay: boolean = false;
  public title: string = '';
  public tables: string = '';
  public mode: string = '';
  public name: string = '';
  public url: string = '';
  public description: string = '';
  public infoMsg : boolean = false;

  constructor(
    private smartViewFilterService: SmartViewFilterService,
    private literalService: LiteralService,
    private poNotificationService: PoNotificationService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit() {
    this.setDefaultValues();
    this.getBusinessObject();
  }

  public async getBusinessObject() {
    const params: SvBusinessObjectListing = {companyId: this.companyId, scope: this.scope};

    this.smartViewFilterService.getEventListing(params).subscribe(
      response => {
        this.loadingOverlay = false;
        this.setSvOption(response);
        this.formFilter.patchValue({svOptions: this.svOptions});
        this.comboDisabled = false;
      }
    );
  }

  public setDefaultValues(): void {
    this.svOptions = [];
    this.listInfo = [];
    this.svOptions.length = 0;
    this.listInfo.length = 0;
    this.title = '';
    this.name = '';
    this.mode = '';
    this.tables = '';
    this.url = '';
    this.description = '';
    this.loadingOverlay = true;

    this.formFilter = new UntypedFormGroup({
      svOptions: new UntypedFormControl(this.literals['svMonitor']['businessObject'], []),
    });
  }

  public setSvOption(responseOption): void {
    let typeOptions: Array<PoSelectOption> = [];
    responseOption.svOptions.forEach(element => {
        this.listInfo.push(element);
        typeOptions.push({label: element.id, value: element.object});
    });
    this.svOptions = typeOptions;
    typeOptions = [];
    typeOptions.length = 0;
  }

  public refreshBtn() {
    let cSelected = this.formFilter.get('svOptions').value;
    if(cSelected != "Selecione Objeto") {
      this.btnDisabled = false;
      this.refreshInfo();
    }
  }

  public refreshInfo(){
    let cSelected = this.formFilter.get('svOptions').value;

    this.infoMsg = true;
    
    const position = this.listInfo.findIndex(element => {
      return cSelected === element['object'];
    });

    if (position >= 0) {
      this.title = this.listInfo[position]['title'];
      this.name = this.listInfo[position]['name'];
      this.mode = this.listInfo[position]['mode'];
      this.tables = this.listInfo[position]['tables'];
      this.url = this.listInfo[position]['url'];
      this.description = this.listInfo[position]['description'];
    }
  }

  public callSmartView() {
    let objectAdvpl: string = '';
    let businessObject: string = this.formFilter.get('svOptions').value;

    this.refreshInfo();

    this.btnDisabled = true;

    if (!valueIsNull(window['totvstec'])) {
      if (window['totvstec'].internalPort !== undefined) {
        objectAdvpl = 'totvtec';
      } else if (window['twebchannel'].internalPort !== undefined) {
        objectAdvpl = 'twebchannel';
      }

      if (objectAdvpl) {
        this.loadingOverlay = false;
        window[objectAdvpl].jsToAdvpl('callTafSmartView', businessObject);
        window[objectAdvpl].advplToJs = (codeType: string) => {this.execAdvplToJs(codeType)};
      } else {
        this.loadingOverlay = false;
        this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
      }
    } else {
      this.loadingOverlay = false;
      this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
    }
  }

  public execAdvplToJs(codeType: string) {
    if (codeType==="retTafSmartView") {
      this.btnDisabled = false;
    }
  }
}