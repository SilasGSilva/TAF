
import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

import {
  PoModalAction,
  PoNotificationService,
} from '@po-ui/ng-components';

import { DialogYesNoComponent } from 'shared/dialog-yes-no/dialog-yes-no.component';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { getBranchLoggedIn, valueIsNull } from '../../../../../util/util';
import { ReinfRemoveCompanyListing } from './../../../../models/reinf-remove-company-listing';
import { RemoveCompanyService } from './remove-company.service';

@Component({
  selector: 'app-remove-company',
  templateUrl: './remove-company.component.html',
})
export class RemoveCompanyComponent implements OnInit {
  public disableBtnRemove: boolean = false;
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;
  public literals = {};

  @Output('taf-remove-company-loading') loadingRemoveCompanyEmit = new EventEmitter<boolean>();

  @ViewChild(DialogYesNoComponent, { static: true }) modalYesNo: DialogYesNoComponent;
  @ViewChild(MessengerComponent, { static: true }) messengerModal: MessengerComponent;

  constructor(
    private removeCompanyService: RemoveCompanyService
    ,private poNotificationService: PoNotificationService
    ,private literalsService: LiteralService)
  {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
  }

  public removeCompany(): void {
    const title = this.literals['removeCompany']['title'];
    const question = this.literals['removeCompany']['question'];
    this.primaryAction = {
      action: async () => {
        this.modalYesNo.close();
        this.send();
      },
      label: this.literals['removeCompany']['yes'],
      danger: false,
      loading: false
    };
    this.secondaryAction = {
      action: () => {
        this.modalYesNo.close();
      },
      label: this.literals['removeCompany']['no'],
      danger: false,
      loading: false
    };
    this.modalYesNo.onOpenDialog( this.primaryAction, this.secondaryAction, title, question);
  }

  public async send(): Promise<void> {
    this.disableBtnRemove = true;
    this.loadingRemoveCompanyEmit.emit(true);
    const params: ReinfRemoveCompanyListing = {
      companyId: await getBranchLoggedIn()
    };
    this.removeCompanyService.send(params).subscribe(
      response => {
        this.loadingRemoveCompanyEmit.emit(false);
        if (response.statusReturn)
        {
          this.messengerModal.onShowMessage(
            response.messageReturn,
            false,
            false,
            this.literals['removeCompany']['ok']
          );
          this.disableBtnRemove = true;
        }
        else
        {
          this.disableBtnRemove = false;
          this.messengerModal.onShowMessage(
            response.messageReturn,
            false,
            false,
            this.literals['removeCompany']['failed']
          );
        }
      },
      error => {
        this.disableBtnRemove = false;
        this.loadingRemoveCompanyEmit.emit(false);
        if (!valueIsNull(error.error.errorMessage)) {
          this.poNotificationService.error(error.error.errorMessage);
        }else{
          this.poNotificationService.error(error)
        }
      }
    );
  }
}
