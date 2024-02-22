import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DedSuspStateServiceMock } from '../../../../../../../../../util/test/mock/ded-susp-state-service.mock';
import { SubscriptionMock } from '../../../../../../../../../util/test/mock/global/subscription-mock';
import { DedSusp, IndTpDeducaoEnum } from '../../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../../../models/labor-process.model';
import { DedSuspStateService } from '../service/ded-susp-state.service';
import { DedSuspView, DeductionsSuspendedEligibilityComponent } from './deductions-suspended-eligibility.component';

describe(DeductionsSuspendedEligibilityComponent.name, () => {
  let fb: UntypedFormBuilder;
  let dedSuspStateService: DedSuspStateService;

  let component: DeductionsSuspendedEligibilityComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    dedSuspStateService = new DedSuspStateServiceMock() as DedSuspStateService;

    component = new DeductionsSuspendedEligibilityComponent(fb, dedSuspStateService);

    component.currentFormGroup = fb.group({
      vlrRendSusp: null,
    });

    component.subFormGroup = fb.group({
      indTpDeducao: null,
      benefPen: null,
      vlrDedSusp: null,
    });
  });

  describe('isExcluded getter', () => {
    it('should return TRUE if "excluidoERP" is "S"', () => {
      component.excluidoERP = OptionsAnswer.Yes;

      const result = component.isExcluded;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "excluidoERP" is NOT "S"', () => {
      component.excluidoERP = OptionsAnswer.No;

      const result = component.isExcluded;

      expect(result).toBeFalse();
    });
  });

  describe('formArrayValue getter', () => {
    it('should return an empty array if the formArray value is null', () => {
      const result = component.formArrayValue;

      expect(result).toEqual([]);
    });

    it('should return the value of the formArray', () => {
      const value = [{}, {}] as DedSusp[];
      spyOn(dedSuspStateService, 'getData').and.returnValue(value);

      const result = component.formArrayValue;

      expect(result).toEqual(value);
    });
  });

  describe('canCreateNewItem getter', () => {
    it('should return TRUE if conditions are met', () => {
      component.isSelected = false;

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.canCreateNewItem;

      expect(result).toBeTrue();
    });

    it('should return FALSE if there are too many items', () => {
      component.isSelected = false;

      spyOnProperty(component, 'formArrayValue').and.returnValue(new Array(26));
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.canCreateNewItem;

      expect(result).toBeFalse();
    });

    it('should return FALSE if "isSelected" is TRUE', () => {
      component.isSelected = true;

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.canCreateNewItem;

      expect(result).toBeFalse();
    });

    it('should return FALSE if "isExcluded" is TRUE', () => {
      component.isSelected = false;

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.canCreateNewItem;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledVlrDedSusp getter', () => {
    it('should return TRUE when isFilledVlrRendSusp is FALSE', () => {
      spyOnProperty(component, 'isFilledVlrRendSusp').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrDedSusp;

      expect(result).toBeTrue();
    });

    it('should return TRUE when isExcluded is TRUE', () => {
      spyOnProperty(component, 'isFilledVlrRendSusp').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledVlrDedSusp;

      expect(result).toBeTrue();
    });

    it('should return FALSE when both conditions are FALSE', () => {
      spyOnProperty(component, 'isFilledVlrRendSusp').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrDedSusp;

      expect(result).toBeFalse();
    });
  });

  describe('isFilledVlrRendSusp getter', () => {
    it('should return TRUE when vlrRendSusp is not NULL and greater than 0', () => {
      component.currentFormGroup.get('vlrRendSusp').setValue(100);

      const result = component.isFilledVlrRendSusp;

      expect(result).toBeTrue();
    });

    it('should return false when vlrRendSusp is NULL', () => {
      component.currentFormGroup.get('vlrRendSusp').setValue(null);

      const result = component.isFilledVlrRendSusp;

      expect(result).toBeFalse();
    });

    it('should return false when vlrRendSusp is 0', () => {
      component.currentFormGroup.get('vlrRendSusp').setValue(0);

      const result = component.isFilledVlrRendSusp;

      expect(result).toBeFalse();
    });
  });

  describe('haveDefaultValueVlrDedSusp getter', () => {
    it('should return true when indTpDeducao is in defaultValueOptions and benefPen has elements', () => {
      component.subFormGroup.get('indTpDeducao').setValue(IndTpDeducaoEnum.penAlim);
      component.subFormGroup.get('benefPen').setValue([{}, {}]);

      const result = component.haveDefaultValueVlrDedSusp;

      expect(result).toBeTrue();
    });

    it('should return false when indTpDeducao is not in defaultValueOptions', () => {
      component.subFormGroup.get('indTpDeducao').setValue(IndTpDeducaoEnum.prevOficial);
      component.subFormGroup.get('benefPen').setValue([{}, {}]);

      const result = component.haveDefaultValueVlrDedSusp;

      expect(result).toBeFalse();
    });

    it('should return false when benefPen is empty', () => {
      component.subFormGroup.get('indTpDeducao').setValue(IndTpDeducaoEnum.penAlim);
      component.subFormGroup.get('benefPen').setValue([]);

      const result = component.haveDefaultValueVlrDedSusp;

      expect(result).toBeFalse();
    });
  });

  describe('errorMessageVlrDedSusp getter', () => {
    it('should return an error message when isWrongDefaultValueVlrDedSusp error is present', () => {
      const errors = { isWrongDefaultValueVlrDedSusp: true };
      component.subFormGroup.get('vlrDedSusp').setErrors(errors);

      spyOn<any>(component, 'makeDefaultValueVlrDedSusp').and.returnValue(100);

      const result = component.errorMessageVlrDedSusp;

      expect(result).toContain('O valor deve ser "R$');
      expect(result).toContain('100,00"');
    });

    it('should return an empty string when no error is present', () => {
      component.subFormGroup.get('vlrDedSusp').setErrors(null);

      const result = component.errorMessageVlrDedSusp;

      expect(result).toBe('');
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    it('should transformRows when state service changes', () => {
      spyOn<any>(component, 'transformRows');

      component.ngOnInit();
      dedSuspStateService.setData([]);

      expect(component['transformRows']).toHaveBeenCalled();
    });

    const validityFunctionsWithFields = {
      updateValueVlrDedSusp: ['benefPen'],
      updateValidityVlrDedSusp: ['vlrDedSusp'],
    };

    Object.entries(validityFunctionsWithFields).forEach(
      ([validationFunction, fields]) => {
        describe(`should invoke ${validationFunction} validation`, () => {
          fields.forEach((field: string) => {
            it(`when ${field} field changes`, () => {
              spyOn<any>(component, validationFunction);

              component.ngOnInit();
              component.subFormGroup.get(field).setValue('mockValue');

              expect(component[validationFunction]).toHaveBeenCalled();
            });
          });
        });
      }
    );
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.create.name, () => {
    it('should reset subFormGroup for a new item', () => {
      spyOn(component.subFormGroup, 'reset');

      component.create();

      expect(component.subFormGroup.reset).toHaveBeenCalled();
    });

    it('should open the form for a new item', () => {
      component.isSelected = false;
      component.isEdit = true;

      component.create();

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeFalse();
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.save.name, () => {
    it('should add the subFormGroup value to formArrayValue', () => {
      const subFormGroupValue = {} as DedSusp;
      component.subFormGroup.patchValue(subFormGroupValue);

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOn(dedSuspStateService, 'setData');

      component.save();

      expect(dedSuspStateService.setData).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.save();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.update.name, () => {
    it('should update the formArrayValue at the editIndex', () => {
      const subFormGroupValue = {};
      const editIndex = 1;
      const formArrayValue = [];
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(component.subFormGroup, 'value').and.returnValue(subFormGroupValue);
      spyOn(dedSuspStateService, 'setData');

      component.update();

      formArrayValue[editIndex] = subFormGroupValue;

      expect(dedSuspStateService.setData).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.update();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.cancel.name, () => {
    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.cancel();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.handleClickEdit.name, () => {
    it('should set editIndex, open the form for editing, and set subFormGroup value', () => {
      const item = {} as DedSuspView;
      const clickIndex = 0;
      spyOn(component.rows, 'findIndex').and.returnValue(clickIndex);
      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOn(component.subFormGroup, 'patchValue');

      component.handleClickEdit(item);

      expect(component.editIndex).toBe(clickIndex);
      expect(component.subFormGroup.patchValue).toHaveBeenCalledWith(component.formArrayValue[clickIndex]);
    });

    it('should open the form for editing item', () => {
      component.isSelected = false;
      component.isEdit = false;

      component.handleClickEdit({} as DedSuspView);

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeTrue();
    });
  });

  describe(DeductionsSuspendedEligibilityComponent.prototype.handleClickDelete.name, () => {
    it('should remove the item at the specified index', () => {
      const item = {} as DedSuspView;
      const clickIndex = 0;
      const formArrayValue = [];
      spyOn(component.rows, 'findIndex').and.returnValue(clickIndex);
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(dedSuspStateService, 'setData');

      component.handleClickDelete(item);

      formArrayValue.splice(clickIndex, 1);

      expect(dedSuspStateService.setData).toHaveBeenCalledWith(formArrayValue);
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.handleClickDelete({} as DedSuspView);

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });
});
