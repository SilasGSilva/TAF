import { Component, ViewChild } from '@angular/core';
import { PoCheckboxGroupOption, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-dialog-yes-no',
  templateUrl: './dialog-yes-no.component.html',
  styleUrls: ['./dialog-yes-no.component.scss'],
})
export class DialogYesNoComponent {
  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  public titleMessage: string;
  public textMessage: string;
  public message: string;
  public literals = {};
  public isLoadingButton = false;
  public primaryAction: PoModalAction;
  public secondaryAction: PoModalAction;

  constructor(
    private literalsService: LiteralService,
  ) {
    this.literals = this.literalsService.literalsTafFiscal;
  }

  ngOnInit(): void {
  }

  public onOpenDialog(action:PoModalAction, secondaryAction:PoModalAction, title:string, text:string): void {
    this.primaryAction = action;
    this.secondaryAction = secondaryAction;
    this.titleMessage = title;
    this.textMessage = text;
    this.poModal.open();
  }

  public close():void{
    this.poModal.close();
  }
}