import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InfoValoresStateServiceMock } from '../../../../../../../util/test/mock/info-valores-state-service.mock';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { PoModalComponentMock } from '../../../../../../../util/test/mock/po-components/po-modal-component.mock';
import { InfoProcRet, InfoValores } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { ModalFormGroupComponent } from '../../../../../components/modal-form-group/modal-form-group.component';
import { InfoValoresStateService } from './service/info-valores-state.service';
import { InfoProcRetView, WithholdingAndJudicialDepositsComponent } from './withholding-and-judicial-deposits.component';

describe(WithholdingAndJudicialDepositsComponent.name, () => {
  let fb: UntypedFormBuilder;
  let infoValoresStateService: InfoValoresStateService;

  let component: WithholdingAndJudicialDepositsComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    infoValoresStateService = new InfoValoresStateServiceMock() as InfoValoresStateService;

    component = new WithholdingAndJudicialDepositsComponent(fb, infoValoresStateService);

    component.modalFormGroup = new PoModalComponentMock() as ModalFormGroupComponent;

    component.currentFormGroup = fb.group({
      tpCR: null,
      infoProcRet: null,
    });

    component.subFormGroup = fb.group({
      infoValores: null,
      nrProcRet: null,
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
      const value = [{}, {}] as InfoProcRet[];
      component.currentFormGroup.get('infoProcRet').patchValue(value);

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

      spyOnProperty(component, 'formArrayValue').and.returnValue(new Array(51));
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

  describe('valueLabelInfoValores getter', () => {
    it('should return "Nenhum incluído" when infoValores is null or empty', () => {
      component.subFormGroup.get('infoValores').setValue(null);

      const result = component.valueLabelInfoValores;

      expect(result).toBe('Nenhum incluído');
    });

    it('should return "1 incluído" when infoValores has 1 item', () => {
      component.subFormGroup.get('infoValores').setValue([{}]);

      const result = component.valueLabelInfoValores;

      expect(result).toBe('1 incluído');
    });

    it('should return "X incluídos" when infoValores has X items (X > 1)', () => {
      component.subFormGroup.get('infoValores').setValue([{}, {}, {}]);

      const result = component.valueLabelInfoValores;

      expect(result).toBe('3 incluídos');
    });
  });

  describe('isDisabledSaveInfoValores getter', () => {
    it('should return true when infoValores is invalid', () => {
      spyOnProperty(component.subFormGroup.get('infoValores'), 'invalid').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledSaveInfoValores;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      spyOnProperty(component.subFormGroup.get('infoValores'), 'invalid').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledSaveInfoValores;

      expect(result).toBeTrue();
    });

    it('should return false when both conditions are false', () => {
      spyOnProperty(component.subFormGroup.get('infoValores'), 'invalid').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledSaveInfoValores;

      expect(result).toBeFalse();
    });
  });

  describe('errorsNrProcRet getter', () => {
    it('should return an error object with isRequiredNrProcRet: true when nrProcRet is null', () => {
      component.subFormGroup.get('nrProcRet').setValue(null);

      const result = component.errorsNrProcRet;

      expect(result).toEqual({ isRequiredNrProcRet: true });
    });

    it('should return an error object with invalidLengthNrProcRet: true when nrProcRet is invalid', () => {
      component.subFormGroup.get('nrProcRet').setValue('123456');

      const result = component.errorsNrProcRet;

      expect(result).toEqual({ invalidLengthNrProcRet: true });
    });

    it('should return null when nrProcRet is valid', () => {
      component.subFormGroup.get('nrProcRet').setValue('12345678901234567890');

      const result = component.errorsNrProcRet;

      expect(result).toBeNull();
    });
  });

  describe('isValidNrProcRet getter', () => {
    it('should return true when nrProcRet has a valid length', () => {
      component.subFormGroup.get('nrProcRet').setValue('12345678901234567890');

      const result = component.isValidNrProcRet;

      expect(result).toBeTrue();
    });

    it('should return false when nrProcRet has an invalid length', () => {
      component.subFormGroup.get('nrProcRet').setValue('1234');

      const result = component.isValidNrProcRet;

      expect(result).toBeFalse();
    });

    it('should return false when nrProcRet is null', () => {
      component.subFormGroup.get('nrProcRet').setValue(null);

      const result = component.isValidNrProcRet;

      expect(result).toBeFalse();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    it('should transformRows when formArray changes', () => {
      spyOn<any>(component, 'transformRows');

      component.ngOnInit();
      component.currentFormGroup.get('infoProcRet').setValue([]);

      expect(component['transformRows']).toHaveBeenCalled();
    });

    const validityFunctionsWithFields = {
      updateValidityNrProcRet: ['nrProcRet'],
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

  describe(WithholdingAndJudicialDepositsComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.create.name, () => {
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

  describe(WithholdingAndJudicialDepositsComponent.prototype.save.name, () => {
    it('should add the subFormGroup value to formArrayValue', () => {
      const subFormGroupValue = {} as InfoProcRet;
      component.subFormGroup.patchValue(subFormGroupValue);

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOn(component.formArray, 'setValue');

      component.save();

      expect(component.formArray.setValue).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.save();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.update.name, () => {
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

  describe(WithholdingAndJudicialDepositsComponent.prototype.cancel.name, () => {
    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.cancel();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.handleClickEdit.name, () => {
    it('should set editIndex, open the form for editing, and set subFormGroup value', () => {
      const item = {} as InfoProcRetView;
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

      component.handleClickEdit({} as InfoProcRetView);

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeTrue();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.handleClickDelete.name, () => {
    it('should remove the item at the specified index', () => {
      const item = {} as InfoProcRetView;
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

      component.handleClickDelete({} as InfoProcRetView);

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.openModal.name, () => {
    it('should set infoValores data', () => {
      const subFormData = [{}, {}] as InfoValores[];
      component.subFormGroup.get('infoValores').setValue(subFormData);

      spyOn(infoValoresStateService, 'setData');

      component.openModal();

      expect(infoValoresStateService.setData).toHaveBeenCalledWith(subFormData);
    });

    it('should open the modal', () => {
      spyOn(component.modalFormGroup, 'open');

      component.openModal();

      expect(component.modalFormGroup.open).toHaveBeenCalled();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.saveModal.name, () => {
    it('should set modalFormData to subFormGroup', () => {
      const modalFormData = [{}, {}] as InfoValores[];
      spyOn(infoValoresStateService, 'getData').and.returnValue(modalFormData);

      spyOn(component.subFormGroup.get('infoValores'), 'setValue');

      component.saveModal();

      expect(component.subFormGroup.get('infoValores').setValue).toHaveBeenCalledWith(modalFormData);
    });

    it('should clear modal data', () => {
      spyOn(infoValoresStateService, 'resetData')

      component.saveModal();

      expect(infoValoresStateService.resetData).toHaveBeenCalled();
    });
  });

  describe(WithholdingAndJudicialDepositsComponent.prototype.closeModal.name, () => {
    it('should clear modal data', () => {
      spyOn(infoValoresStateService, 'resetData')

      component.closeModal();

      expect(infoValoresStateService.resetData).toHaveBeenCalled();
    });
  });
});
