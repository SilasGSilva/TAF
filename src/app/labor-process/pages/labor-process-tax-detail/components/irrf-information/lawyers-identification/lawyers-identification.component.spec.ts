import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { IdeAdv, TpCREnum, TpInscEnum } from '../../../../../../models/labor-process-taxes.model';
import { IdeAdvView, LawyersIdentificationComponent } from './lawyers-identification.component';

describe(LawyersIdentificationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let component: LawyersIdentificationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new LawyersIdentificationComponent(fb);

    component.currentFormGroup = fb.group({
      tpCR: [null],
      infoRRA: fb.group({
        ideAdv: fb.control(null),
      }),
    });

    component.subFormGroup = fb.group({});
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
      const value = [{}, {}] as IdeAdv[];
      component.currentFormGroup.get('infoRRA.ideAdv').patchValue(value);

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

      spyOnProperty(component, 'formArrayValue').and.returnValue(new Array(100));
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

  describe('isDisabledInfoRRA getter', () => {
    it('should return TRUE if "infoRRA" is disabled', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFDecisaoJustica);

      const result = component.isDisabledInfoRRA;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "infoRRA" is NOT disabled', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFRRA);

      const result = component.isDisabledInfoRRA;

      expect(result).toBeFalse();
    });
  });

  describe('maskNrInsc getter', () => {
    it('should return CPF mask if "isTpInscCpf" is TRUE', () => {
      spyOnProperty(component, 'isTpInscCpf').and.returnValue(true);

      const result = component.maskNrInsc;

      expect(result).toBe('999.999.999-99');
    });

    it('should return CNPJ mask if "isTpInscCpf" is FALSE', () => {
      spyOnProperty(component, 'isTpInscCpf').and.returnValue(false);

      const result = component.maskNrInsc;

      expect(result).toBe('99.999.999/9999-99');
    });
  });

  describe('isTpInscCpf getter', () => {
    beforeEach(() => {
      component.subFormGroup = fb.group({ tpInsc: null });
    });

    it('should return TRUE if "tpInsc" is "Cpf"', () => {
      component.subFormGroup.patchValue({ tpInsc: TpInscEnum.cpf });

      const result = component.isTpInscCpf;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "tpInsc" is NOT "Cpf"', () => {
      component.subFormGroup.patchValue({ tpInsc: TpInscEnum.cnpj });

      const result = component.isTpInscCpf;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledNrInsc getter', () => {
    beforeEach(() => {
      component.subFormGroup = fb.group({ tpInsc: null });
    });

    it('should return TRUE if "tpInsc" is not set or "isExcluded" is TRUE', () => {
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledNrInsc;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "tpInsc" is set and "isExcluded" is FALSE', () => {
      component.subFormGroup.patchValue({ tpInsc: TpInscEnum.cnpj });

      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledNrInsc;

      expect(result).toBeFalse();
    });
  });

  describe(LawyersIdentificationComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    it('should transformRows when formArray changes', () => {
      spyOn<any>(component, 'transformRows');

      component.ngOnInit();
      component.currentFormGroup.get('infoRRA.ideAdv').setValue([]);

      expect(component['transformRows']).toHaveBeenCalled();
    });

    const validityFunctionsWithFields = {
      updateValidityTpInsc: ['tpInsc'],
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

  describe(LawyersIdentificationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe(LawyersIdentificationComponent.prototype.create.name, () => {
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

  describe(LawyersIdentificationComponent.prototype.save.name, () => {
    it('should add the subFormGroup value to formArrayValue', () => {
      const subFormGroupValue = {};
      component.subFormGroup.patchValue(subFormGroupValue);

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOn(component.formArray, 'setValue');

      component.save();

      expect(component.formArray.setValue).toHaveBeenCalledWith([subFormGroupValue]);
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.save();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(LawyersIdentificationComponent.prototype.update.name, () => {
    it('should update the formArrayValue at the editIndex', () => {
      const subFormGroupValue = {};
      const editIndex = 1;
      const formArrayValue = [];
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(component.subFormGroup, 'value').and.returnValue(subFormGroupValue);
      spyOn(component.formArray, 'setValue');

      component.update();

      formArrayValue[editIndex] = subFormGroupValue;

      expect(component.formArray.setValue).toHaveBeenCalledWith(formArrayValue);
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.update();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(LawyersIdentificationComponent.prototype.cancel.name, () => {
    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.cancel();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(LawyersIdentificationComponent.prototype.handleClickEdit.name, () => {
    it('should set editIndex, open the form for editing, and set subFormGroup value', () => {
      const item = {} as IdeAdvView;
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

      component.handleClickEdit({} as IdeAdvView);

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeTrue();
    });
  });

  describe(LawyersIdentificationComponent.prototype.handleClickDelete.name, () => {
    it('should remove the item at the specified index', () => {
      const item = {} as IdeAdvView;
      const clickIndex = 0;
      const formArrayValue = [];
      spyOn(component.rows, 'findIndex').and.returnValue(clickIndex);
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(component.formArray, 'setValue');

      component.handleClickDelete(item);

      formArrayValue.splice(clickIndex, 1);

      expect(component.formArray.setValue).toHaveBeenCalledWith(formArrayValue);
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.handleClickDelete({} as IdeAdvView);

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });
});
