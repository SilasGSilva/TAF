import { Component, ViewChild } from '@angular/core';
import { PoCheckboxGroupOption, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';

@Component({
  selector: 'app-delete-event-dialog',
  templateUrl: './delete-event-dialog.component.html',
  styleUrls: ['./delete-event-dialog.component.scss'],
})
export class DeleteEventDialogComponent {
  @ViewChild(PoModalComponent) poModal: PoModalComponent;
  public titleMessage: string;
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

  public onOpenDialog(action:PoModalAction, secondaryAction:PoModalAction, title:string): void {
    this.primaryAction = action;
    this.secondaryAction = secondaryAction;
    this.titleMessage = title;
    this.poModal.open();
  }

  public close():void{
    this.poModal.close();
  }
}
