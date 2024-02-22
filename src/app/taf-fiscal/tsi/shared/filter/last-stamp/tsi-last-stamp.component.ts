import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PoModalAction, PoModalComponent,  PoNotificationService } from '@po-ui/ng-components';
import { Subscription } from 'rxjs';
import { LiteralService } from 'core/i18n/literal.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { getBranchCodeLoggedIn, getBranchLoggedIn } from './../../../../../../util';
import { TsiLastStampRequest } from './../../../models/tsi-last-stamp-request';
import { TsiAtuStampRequest } from './../../../models/tsi-atu-stamp-request';
import { TsiLastStampService } from './tsi-last-stamp.service';

@Component({
  selector: 'app-tsi-last-stamp',
  templateUrl: './tsi-last-stamp.component.html',
  styleUrls: ['./tsi-last-stamp.component.scss']
})
export class TsiLastStampComponent implements OnInit {
  public labelTag: string = '';
  public lastStamp: string = '';
  public companyId: string = getBranchLoggedIn();
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;
  public minDate:Date = this.addDays(new Date(), 1);
  public formDateStamp: UntypedFormGroup;
  public loadingAtuStamp:boolean = false;
  public literals: object;
  private tafContext: string = sessionStorage.getItem('TAFContext');

  @Input('tsi-branch-code') branchCode = '';

  constructor(private literalsService: LiteralService,
    private tsiLastStampService: TsiLastStampService,
    private poNotificationService:PoNotificationService) {
      this.literals = this.literalsService.literalsTafFiscal;
    }

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  ngOnInit() {
    this.setDefaultValues();
    if (this.tafContext === 'reinf') {
      this.getLastStamp();
    }
  }

  public setDefaultValues(): void {
    this.branchCode = getBranchCodeLoggedIn();

    this.formDateStamp = new UntypedFormGroup({
      dateStamp: new UntypedFormControl('', [Validators.required]),
    });

    this.primaryAction = {
      label: this.literals['tsiLastStamp']['confirm'],
      action: () => {
        if (this.formDateStamp.valid) {
          this.postAtuStamp();
          this.poModal.close();
          this.resetValueForm();
        } else {
          this.messengerModal.onShowMessage(
            this.literals['tsiLastStamp']['helpDateInvalid'] + this.minDate.toLocaleDateString(),
            false,
            false,
            this.literals['tsiLastStamp']['titleDateInvalid']
          );
          this.resetValueForm();
        }
      }
    };

    this.secondaryAction = {
      label: this.literals['tsiLastStamp']['cancel'],
      action: () => {
        this.poModal.close();
        this.resetValueForm();
      }
    };
  }

  public resetValueForm(){
    this.formDateStamp.patchValue({ dateStamp:  ''});
  }

  public async getLastStamp() {
    let subscription: Subscription;
    const param: TsiLastStampRequest = {
      companyId: this.companyId,
      alias: 'C20',
      branchCode: this.branchCode
    };
    subscription = this.tsiLastStampService.getLastStamp(param).subscribe(
      async response => {
        this.setStamp(response.stamp);
        this.setLabel();
        //Faço o unsubscribe para não ficar com recursividade em outras rotas
        subscription.unsubscribe();
        await this.delay(10000);
        //Chama novamente a mesma função fazendo recursividade
        this.getLastStamp();
       ;
      },async error =>{
        this.setStamp('...');
        this.setLabel();
        //Faço o unsubscribe para não ficar com recursividade em outras rotas
        subscription.unsubscribe();
        await this.delay(15000);
        //Chama novamente a mesma função fazendo recursividade
        this.getLastStamp();
      }
    );
  }

  public setStamp(stamp: string) {
    if (stamp) {
      this.lastStamp = stamp;
    } else {
      this.lastStamp = '...';
    }
  }

  public async delay(milleseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milleseconds));
  }

  public postAtuStamp(){
    this.loadingAtuStamp = true;
    const param: TsiAtuStampRequest = {
      companyId: this.companyId,
      alias: 'C20',
      branchCode: this.branchCode,
      dateStamp: this.formDateStamp.get('dateStamp').value
    };
    this.tsiLastStampService.postAtuStamp(param).subscribe(
      response => {
        this.loadingAtuStamp = false;
        this.messengerModal.onShowMessage(
          response.message,
          false,
          false,
          this.literals['tsiLastStamp']['titleAtuStamp']
        );
      },
      error => {
        this.loadingAtuStamp = false;
        this.poNotificationService.error(error);
      }
    );
  }

  public setLabel() {
    this.labelTag = this.literals['tsiLastStamp']['labelTag'] + this.lastStamp + this.literals['tsiLastStamp']['fromBranch'] + this.branchCode;
  }

  public openModal() {
    this.poModal.open();
  }

  public addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
