import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from '../../../../../core/i18n/literal.service';
import { getBranchLoggedIn} from '../../../../../../util/util';
import { TsiStatusService } from './tsi-status.service';
import { TsiStatusRequest } from './../../../models/tsi-status-request';

@Component({
  selector: 'app-tsi-status',
  templateUrl: './tsi-status.component.html',
  styleUrls: ['./tsi-status.component.scss']
})
export class TsiStatusComponent implements OnInit {

  public literals:object;
  public statusConfigured:boolean;
  public statusActive:boolean;
  public companyId:string = getBranchLoggedIn();
  public formStatus: UntypedFormGroup;
  public showStatus:boolean = false;
  public toolTipStatusService: string;
  public labelStatusServiceOff:string;
  public labelStatusServiceOn:string;


  constructor(
    private tsiStatusService: TsiStatusService,
    private formBuilder: UntypedFormBuilder,
    private poNotificationService: PoNotificationService,
    private literalService: LiteralService) {
      this.literals = this.literalService.literalsTafFiscal;
     }

  ngOnInit(): void {
    this.labelStatusServiceOff = this.literals['tsiStatus']['inactiveService'];
    this.labelStatusServiceOn = this.literals['tsiStatus']['configuredService'];
    this.toolTipStatusService = this.literals['tsiStatus']['toolTipStatusService'];
    this.setStandardFormStatus();
    this.getStatus();
  }

  public async getStatus() {
    const params: TsiStatusRequest = { companyId: this.companyId };

    this.tsiStatusService.getTsiStatus(params).subscribe(
      response => {
        this.statusConfigured = response.status.configuredService;
        this.statusActive = response.status.activeService;
        this.fakeClick();
        this.showStatus = true;
        if (this.statusConfigured && this.statusActive){
          this.labelStatusServiceOn = this.literals['tsiStatus']['activeService'];
        } else if (this.statusConfigured && !this.statusActive){
          this.labelStatusServiceOn = this.literals['tsiStatus']['configuredService'];
        }
      },
      err => {
        let errMsg: string;
        /*if (!valueIsNull(err.error.message)) {
          errMsg = err.error.message;
          this.poNotificationService.error(errMsg);
        }*/
        this.showStatus = true;
      }
    );
  }

  public setStandardFormStatus() {
    this.formStatus = this.formBuilder.group({
      tsiStatusService: [false],
    });
  }

  public fakeClick(){
    this.formStatus.patchValue({ tsiStatusService: this.statusConfigured });
  }

}


