import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-financial-input',
  templateUrl: './financial-input.component.html',
  styleUrls: ['./financial-input.component.scss']
})
export class FinancialInputComponent implements OnChanges {
  @Input() control: FormControl;
  @Input() fieldTitle: string;
  @Input() inputTitle?: string;
  @Input() componentClass: string = 'po-pb-1';
  @Input() inputClass: string = 'po-mt-1';
  @Input() isRequired: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() decimalLength: number = 14;

  maskOptions = {
    prefix: 'R$ ',
    thousands: '.',
    decimal: ',',
  };

  get maxLength(): number {
    const { prefix, thousands, decimal } = this.maskOptions;

    const integerLength = this.decimalLength - 2;
    const separatorQuantity = Math.floor((integerLength - 1) / 3);

    return this.decimalLength + prefix.length + decimal.length + (thousands.length * separatorQuantity);
  }

  get inputTitleText(): string {
    return this.inputTitle || this.fieldTitle;
  }

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDisabled) {
      const isDisabledNewStatus = changes.isDisabled.currentValue;

      isDisabledNewStatus ? this.control.disable() : this.control.enable();
    }
  }
}
