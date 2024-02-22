import { SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FinancialInputComponent } from './financial-input.component';

describe(FinancialInputComponent.name, () => {
  let component: FinancialInputComponent;

  beforeEach(() => {
    component = new FinancialInputComponent();

    component.control = new FormControl();
  });

  describe('maxLength getter', () => {
    it('when is a number with 2 decimal between 100 and 999', () => {
      const expectedResult = 9;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 3;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });

    it('when is a number with 2 decimal with between 1_000 and 9_999', () => {
      const expectedResult = 11;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 4;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });

    it('when is a number with 2 decimal with between 10_000 and 99_999', () => {
      const expectedResult = 12;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 5;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });

    it('when is a number with 2 decimal with between 100_000 and 999_999', () => {
      const expectedResult = 13;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 6;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });

    it('when is a number with 2 decimal with between 1_000_000 and 9_999_999', () => {
      const expectedResult = 15;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 7;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });

    it('when is a number with 2 decimal with between 10_000_000 and 99_999_999', () => {
      const expectedResult = 16;
      const fakeDecimalLength = 2;
      const fakeIntegerLength = 8;

      component.decimalLength = fakeIntegerLength + fakeDecimalLength;

      const result = component.maxLength;

      expect(result).toEqual(expectedResult);
    });
  });

  describe('inputTitleText getter', () => {
    it('should return "inputTitle" if it exists', () => {
      const expectedTitle = 'fakeTitle';

      component.inputTitle = expectedTitle;
      component.fieldTitle = 'fakeField';

      const result = component.inputTitleText;

      expect(result).toEqual(expectedTitle);
    });

    it('should return "fieldTitle" if "inputTitle" not exists', () => {
      const expectedTitle = 'fakeField';

      component.inputTitle = null;
      component.fieldTitle = expectedTitle;

      const result = component.inputTitleText;

      expect(result).toEqual(expectedTitle);
    });
  });

  describe(FinancialInputComponent.prototype.ngOnChanges.name, () => {
    it('should disable the control when @isDisabled is changed to TRUE', () => {
      spyOn(component.control, 'disable');
      const mockChanges = { isDisabled: { currentValue: true } };
  
      component.ngOnChanges(mockChanges as unknown as SimpleChanges);
  
      expect(component.control.disable).toHaveBeenCalledOnceWith();
    });
  
    it('should enable the control when @isDisabled is changed to FALSE', () => {
      spyOn(component.control, 'enable');
      const mockChanges = { isDisabled: { currentValue: false } };
  
      component.ngOnChanges(mockChanges as unknown as SimpleChanges);
  
      expect(component.control.enable).toHaveBeenCalledOnceWith();
    });
  });
});
