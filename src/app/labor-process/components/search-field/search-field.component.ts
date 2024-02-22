import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent {

  private pValue?: string;

  @Input()
  placeholder?: string;

  @Input()
  showAdvancedSearch = false;

  @Input()
  disabled = false;

  @Input()
  label?: string;



  @Output()
  search = new EventEmitter<string | undefined>();

  @Output()
  searchAdvanced = new EventEmitter();

  @Input()
  readonly = false;

  get value(): string | undefined {
    return this.pValue;
  }

  @Input()
  set value(value: string | undefined) {
    this.setSearchValue(value);
  }

  private setSearchValue(value: string | undefined): void {
    value = value?.trim();
    value = value === '' ? undefined : value;
    if (value !== this.pValue) {
      this.pValue = value;
    }
  }

  onSubmit(): void {
    this.search.emit(this.value);
  }

}
