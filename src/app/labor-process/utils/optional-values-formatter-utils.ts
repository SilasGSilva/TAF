import { PoSelectOption } from "@po-ui/ng-components";

export class OptionalValuesFormatterUtils {
  static readonly DEFAULT_OPTIONAL_VALUE_STRING = '';
  static readonly DEFAULT_OPTIONAL_VALUE_DATE = '';
  static readonly DEFAULT_OPTIONAL_VALUE_NUMBER = -1;
  static readonly DEFAULT_OPTIONAL_VALUE_ARRAY = [];

  static readonly SELECT_DEFAULT_EMPTY_VALUE = 'select-default-empty-value';

  static readonly DEFAULT_OPTIONAL_VALUES_TO_CHANGE = [
    this.DEFAULT_OPTIONAL_VALUE_STRING,
    this.DEFAULT_OPTIONAL_VALUE_DATE,
    this.DEFAULT_OPTIONAL_VALUE_NUMBER,
  ];

  public static readonly EMPTY_SELECT_OPTION: PoSelectOption = {
    label: '',
    value: this.SELECT_DEFAULT_EMPTY_VALUE,
  }

  public static removeDefaultOptionalValues<T>(obj: T, defaultValues: any[] = this.DEFAULT_OPTIONAL_VALUES_TO_CHANGE): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeDefaultOptionalValues(item, defaultValues)) as any;
    }

    const updatedObject = { ...obj };

    for (const key in updatedObject) {
      if (defaultValues.includes(updatedObject[key])) {
        updatedObject[key] = null;
      } else if (typeof updatedObject[key] === 'object') {
        updatedObject[key] = this.removeDefaultOptionalValues(updatedObject[key], defaultValues);
      }
    }

    return updatedObject;
  }

  public static changeSelectEmptyValuesToNull<T>(obj: T): T {
    const defaultEmptyValue = [this.SELECT_DEFAULT_EMPTY_VALUE];

    return this.removeDefaultOptionalValues(obj, defaultEmptyValue);
  }
}
