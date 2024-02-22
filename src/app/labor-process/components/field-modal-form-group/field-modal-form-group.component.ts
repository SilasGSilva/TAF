import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-field-modal-form-group',
  templateUrl: './field-modal-form-group.component.html',
  styleUrls: ['./field-modal-form-group.component.scss']
})
export class FieldModalFormGroupComponent {
  @Input() label: string;
  @Input() value: string;

  @Output() buttonClicked = new EventEmitter<void>();

  constructor() { }

  handleClick(): void {
    this.buttonClicked.emit();
  }
}
