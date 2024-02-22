import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LaborProcessDataStateServiceMock } from '../../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { InfoDep } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { LaborProcessDataStateService } from '../../../../../service/labor-process-data-state.service';
import { DependentInformationComponent, InfoDepView } from './dependent-information.component';

describe(DependentInformationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let component: DependentInformationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    component = new DependentInformationComponent(fb, laborProcessDataStateService);

    component.currentFormGroup = fb.group({
      infoDep: fb.control(null),
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
      const value = [{}, {}] as InfoDep[];
      component.currentFormGroup.get('infoDep').patchValue(value);

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

      spyOnProperty(component, 'formArrayValue').and.returnValue(new Array(1_000));
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

  describe('errorMessageCpfDep getter', () => {
    beforeEach(() => {
      component.subFormGroup = fb.group({ cpfDep: null });
    });

    it('should return an empty string when there are no errors', () => {
      component.subFormGroup.get('cpfDep').setErrors(null);


      const result = component.errorMessageCpfDep;

      expect(result).toBe('');
    });

    it('should return "Campo obrigatório" when "required" error is present', () => {
      const errors = { required: true };
      component.subFormGroup.get('cpfDep').setErrors(errors);


      const result = component.errorMessageCpfDep;

      expect(result).toBe('Campo obrigatório');
    });

    it('should return "CPF inválido" when "cpf" error is present', () => {
      const errors = { cpf: true };
      component.subFormGroup.get('cpfDep').setErrors(errors);

      const result = component.errorMessageCpfDep;

      expect(result).toBe('CPF inválido');
    });

    it('should return "Mesmo CPF do trabalhador" when "isSameValueCpfTrab" error is present', () => {
      const errors = { isSameValueCpfTrab: true };
      component.subFormGroup.get('cpfDep').setErrors(errors);

      const result = component.errorMessageCpfDep;

      expect(result).toBe('Mesmo CPF do trabalhador');
    });

    it('should return "CPF já presente nas informações de dependentes" when "haveSameValueInCpfDep" error is present', () => {
      const errors = { haveSameValueInCpfDep: true };
      component.subFormGroup.get('cpfDep').setErrors(errors);

      const result = component.errorMessageCpfDep;

      expect(result).toBe('CPF já presente nas informações de dependentes');
    });
  });

  describe(DependentInformationComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    it('should transformRows when formArray changes', () => {
      spyOn<any>(component, 'transformRows');

      component.ngOnInit();
      component.currentFormGroup.get('infoDep').setValue([]);

      expect(component['transformRows']).toHaveBeenCalled();
    });

    const validityFunctionsWithFields = {
      updateValidityTpDep: ['depIRRF', 'tpDep'],
      handleChangesTpDep: ['tpDep'],
      updateValidityDescrDep: ['tpDep'],
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

  describe(DependentInformationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe(DependentInformationComponent.prototype.create.name, () => {
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

  describe(DependentInformationComponent.prototype.save.name, () => {
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

  describe(DependentInformationComponent.prototype.update.name, () => {
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

  describe(DependentInformationComponent.prototype.cancel.name, () => {
    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.cancel();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(DependentInformationComponent.prototype.handleClickEdit.name, () => {
    it('should set editIndex, open the form for editing, and set subFormGroup value', () => {
      const item = {} as InfoDepView;
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

      component.handleClickEdit({} as InfoDepView);

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeTrue();
    });
  });

  describe(DependentInformationComponent.prototype.handleClickDelete.name, () => {
    it('should remove the item at the specified index', () => {
      const item = {} as InfoDepView;
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

      component.handleClickDelete({} as InfoDepView);

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });
});
