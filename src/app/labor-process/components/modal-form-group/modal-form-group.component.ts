import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction } from '@po-ui/ng-components';

@Component({
  selector: 'app-modal-form-group',
  templateUrl: './modal-form-group.component.html',
  styleUrls: ['./modal-form-group.component.scss']
})
export class ModalFormGroupComponent implements OnInit {
  @ViewChild(PoModalComponent) poModal: PoModalComponent;

  @Input() title: string;
  @Input() isDisabledPrimaryAction: boolean = false;
  @Input() labelPrimaryAction: string = 'Salvar';
  @Input() labelSecondaryAction: string = 'Fechar';

  @Output() primaryActionClicked = new EventEmitter<void>();
  @Output() secondaryActionClicked = new EventEmitter<void>();

  primaryAction: PoModalAction;
  secondaryAction: PoModalAction;

  constructor() { }

  ngOnInit(): void {
    this.initializeModalActions();
  }

  initializeModalActions(): void {
    this.primaryAction = {
      action: this.save.bind(this),
      label: this.labelPrimaryAction,
      disabled: this.isDisabledPrimaryAction,
    }

    this.secondaryAction = {
      action: this.close.bind(this),
      label: this.labelSecondaryAction,
    }
  }

  open(): void {
    this.poModal.open();
  }

  save(): void {
    this.primaryActionClicked.emit();

    this.poModal.close();
  }

  close(): void {
    this.secondaryActionClicked.emit();

    this.poModal.close();
  }
}
