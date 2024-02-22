import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InfoValoresStateServiceMock } from '../../../../../../../../util/test/mock/info-valores-state-service.mock';
import { DedSuspStateServiceMock } from '../../../../../../../../util/test/mock/ded-susp-state-service.mock';
import { SubscriptionMock } from '../../../../../../../../util/test/mock/global/subscription-mock';
import { PoModalComponentMock } from '../../../../../../../../util/test/mock/po-components/po-modal-component.mock';
import { DedSusp, IndApuracaoEnum, InfoValores, TpProcRetEnum } from '../../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../../models/labor-process.model';
import { ModalFormGroupComponent } from '../../../../../../components/modal-form-group/modal-form-group.component';
import { InfoValoresStateService } from '../service/info-valores-state.service';
import { DedSuspStateService } from './service/ded-susp-state.service';
import { InfoValoresView, ValuesInformationComponent } from './values-information.component';

describe(ValuesInformationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let infoValoresStateService: InfoValoresStateService;
  let dedSuspStateService: DedSuspStateService;

  let component: ValuesInformationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    infoValoresStateService = new InfoValoresStateServiceMock() as InfoValoresStateService;
    dedSuspStateService = new DedSuspStateServiceMock() as DedSuspStateService;

    component = new ValuesInformationComponent(fb, infoValoresStateService, dedSuspStateService);

    component.modalFormGroup = new PoModalComponentMock() as ModalFormGroupComponent;

    component.mainFormGroup = fb.group({
      infoIR: fb.group({
        vrRendTrib: null,
        vrRendTrib13: null,
      }),
    });

    component.currentFormGroup = fb.group({
      tpProcRet: null,
    });

    component.subFormGroup = fb.group({
      dedSusp: null,
      indApuracao: null,
      vlrRendSusp: null,
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
      const value = [{}, {}] as InfoValores[];
      spyOn(infoValoresStateService, 'getData').and.returnValue(value);

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

      spyOnProperty(component, 'formArrayValue').and.returnValue(new Array(3));
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

  describe('valueLabelDedSusp getter', () => {
    it('should return "Nenhum incluído" when dedSusp is null or empty', () => {
      component.subFormGroup.get('dedSusp').setValue(null);

      const result = component.valueLabelDedSusp;

      expect(result).toBe('Nenhum incluído');
    });

    it('should return "1 incluído" when dedSusp has 1 item', () => {
      component.subFormGroup.get('dedSusp').setValue([{}]);

      const result = component.valueLabelDedSusp;

      expect(result).toBe('1 incluído');
    });

    it('should return "X incluídos" when dedSusp has X items (X > 1)', () => {
      component.subFormGroup.get('dedSusp').setValue([{}, {}, {}]);

      const result = component.valueLabelDedSusp;

      expect(result).toBe('3 incluídos');
    });
  });

  describe('isDisabledSaveDedSusp getter', () => {
    it('should return true when dedSusp is invalid', () => {
      spyOnProperty(component.subFormGroup.get('dedSusp'), 'invalid').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledSaveDedSusp;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      spyOnProperty(component.subFormGroup.get('dedSusp'), 'invalid').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledSaveDedSusp;

      expect(result).toBeTrue();
    });

    it('should return false when both conditions are false', () => {
      spyOnProperty(component.subFormGroup.get('dedSusp'), 'invalid').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledSaveDedSusp;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledVlrCmpAnoCal getter', () => {
    it('should return true when isTpProcRetJudicial is true', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrCmpAnoCal;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledVlrCmpAnoCal;

      expect(result).toBeTrue();
    });

    it('should return false when both conditions are false', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrCmpAnoCal;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledVlrCmpAnoAnt getter', () => {
    it('should return true when isTpProcRetJudicial is true', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(true);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrCmpAnoAnt;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledVlrCmpAnoAnt;

      expect(result).toBeTrue();
    });

    it('should return false when both conditions are false', () => {
      spyOnProperty<any>(component, 'isTpProcRetJudicial').and.returnValue(false);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVlrCmpAnoAnt;

      expect(result).toBeFalse();
    });
  });

  describe('isTpProcRetJudicial getter', () => {
    it('should return true when tpProcRet is TpProcRetEnum.judicial', () => {
      component.currentFormGroup.get('tpProcRet').setValue(TpProcRetEnum.judicial);

      const result = component['isTpProcRetJudicial'];

      expect(result).toBeTrue();
    });

    it('should return false when tpProcRet is not TpProcRetEnum.judicial', () => {
      component.currentFormGroup.get('tpProcRet').setValue(TpProcRetEnum.administrativo);

      const result = component['isTpProcRetJudicial'];

      expect(result).toBeFalse();
    });
  });

  describe('errorsVlrRendSusp getter', () => {
    it('should return null when indApuracao is null', () => {
      component.subFormGroup.get('indApuracao').setValue(null);
      component.subFormGroup.get('vlrRendSusp').setValue(1000);

      const result = component.errorsVlrRendSusp;

      expect(result).toBeNull();
    });

    it('should return { mustBeOverThanZero: true } when vlrRendSusp is 0', () => {
      component.subFormGroup.get('indApuracao').setValue(IndApuracaoEnum.mensal);
      component.subFormGroup.get('vlrRendSusp').setValue(0);

      const result = component.errorsVlrRendSusp;

      expect(result).toEqual({ mustBeOverThanZero: true });
    });

    it('should return { isOverThanVrRendTrib: true } when indApuracao is mensal and vlrRendSusp is greater than vrRendTrib', () => {
      component.subFormGroup.get('indApuracao').setValue(IndApuracaoEnum.mensal);
      component.subFormGroup.get('vlrRendSusp').setValue(1000);
      component.mainFormGroup.get('infoIR.vrRendTrib').setValue(900);

      const result = component.errorsVlrRendSusp;

      expect(result).toEqual({ isOverThanVrRendTrib: true });
    });

    it('should return { isOverThanVrRendTrib13: true } when indApuracao is anual and vlrRendSusp is greater than vrRendTrib13', () => {
      component.subFormGroup.get('indApuracao').setValue(IndApuracaoEnum.anual);
      component.subFormGroup.get('vlrRendSusp').setValue(2000);
      component.mainFormGroup.get('infoIR.vrRendTrib13').setValue(1500);

      const result = component.errorsVlrRendSusp;

      expect(result).toEqual({ isOverThanVrRendTrib13: true });
    });

    it('should return null when there are no validation errors', () => {
      component.subFormGroup.get('indApuracao').setValue(IndApuracaoEnum.mensal);
      component.subFormGroup.get('vlrRendSusp').setValue(500);
      component.mainFormGroup.get('infoIR.vrRendTrib').setValue(1000);

      const result = component.errorsVlrRendSusp;

      expect(result).toBeNull();
    });
  });

  describe('showErrorMessageVlrRendSusp getter', () => {
    it('should return false when there are no errors', () => {
      component.subFormGroup.get('vlrRendSusp').setErrors(null);

      const result = component.showErrorMessageVlrRendSusp;

      expect(result).toBeFalse();
    });

    it('should return true when errors match "isOverThanVrRendTrib"', () => {
      const errors = { isOverThanVrRendTrib: true };
      component.subFormGroup.get('vlrRendSusp').setErrors(errors);

      const result = component.showErrorMessageVlrRendSusp;

      expect(result).toBeTrue();
    });

    it('should return true when errors match "isOverThanVrRendTrib13"', () => {
      const errors = { isOverThanVrRendTrib13: true };
      component.subFormGroup.get('vlrRendSusp').setErrors(errors);

      const result = component.showErrorMessageVlrRendSusp;

      expect(result).toBeTrue();
    });
  });

  describe('errorMessageVlrRendSusp getter', () => {
    it('should return an empty string when showErrorMessageVlrRendSusp is false', () => {
      spyOnProperty(component, 'showErrorMessageVlrRendSusp').and.returnValue(false);

      const result = component.errorMessageVlrRendSusp;

      expect(result).toBe('');
    });

    it('should return an error message when errors match "isOverThanVrRendTrib"', () => {
      spyOnProperty(component, 'showErrorMessageVlrRendSusp').and.returnValue(true);
      component.subFormGroup.get('vlrRendSusp').setErrors({ isOverThanVrRendTrib: true });

      const result = component.errorMessageVlrRendSusp;

      expect(result).toBe('Valor não pode ser maior que "Valor do rendimento tributável mensal do Imposto de Renda"');
    });

    it('should return an error message when errors match "isOverThanVrRendTrib13"', () => {
      spyOnProperty(component, 'showErrorMessageVlrRendSusp').and.returnValue(true);
      component.subFormGroup.get('vlrRendSusp').setErrors({ isOverThanVrRendTrib13: true });

      const result = component.errorMessageVlrRendSusp;

      expect(result).toBe('Valor não pode ser maior que "Valor do rendimento tributável do Imposto de Renda referente ao 13º salário - Tributação exclusiva"');
    });
  });

  describe(ValuesInformationComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    it('should transformRows when state service changes', () => {
      spyOn<any>(component, 'transformRows');

      component.ngOnInit();
      infoValoresStateService.setData([]);

      expect(component['transformRows']).toHaveBeenCalled();
    });

    const validityFunctionsWithFields = {
      updateValidityVlrRendSusp: ['indApuracao', 'vlrRendSusp'],
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

  describe(ValuesInformationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe(ValuesInformationComponent.prototype.create.name, () => {
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

  describe(ValuesInformationComponent.prototype.save.name, () => {
    it('should add the subFormGroup value to formArrayValue', () => {
      const subFormGroupValue = {} as InfoValores;
      component.subFormGroup.patchValue(subFormGroupValue);

      spyOnProperty(component, 'formArrayValue').and.returnValue([]);
      spyOn(infoValoresStateService, 'setData');

      component.save();

      expect(infoValoresStateService.setData).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.save();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(ValuesInformationComponent.prototype.update.name, () => {
    it('should update the formArrayValue at the editIndex', () => {
      const subFormGroupValue = {};
      const editIndex = 1;
      const formArrayValue = [];
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(component.subFormGroup, 'value').and.returnValue(subFormGroupValue);
      spyOn(infoValoresStateService, 'setData');

      component.update();

      formArrayValue[editIndex] = subFormGroupValue;

      expect(infoValoresStateService.setData).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.update();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(ValuesInformationComponent.prototype.cancel.name, () => {
    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.cancel();

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(ValuesInformationComponent.prototype.handleClickEdit.name, () => {
    it('should set editIndex, open the form for editing, and set subFormGroup value', () => {
      const item = {} as InfoValoresView;
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

      component.handleClickEdit({} as InfoValoresView);

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeTrue();
    });
  });

  describe(ValuesInformationComponent.prototype.handleClickDelete.name, () => {
    it('should remove the item at the specified index', () => {
      const item = {} as InfoValoresView;
      const clickIndex = 0;
      const formArrayValue = [];
      spyOn(component.rows, 'findIndex').and.returnValue(clickIndex);
      spyOnProperty(component, 'formArrayValue').and.returnValue(formArrayValue);
      spyOn(infoValoresStateService, 'setData');

      component.handleClickDelete(item);

      formArrayValue.splice(clickIndex, 1);

      expect(infoValoresStateService.setData).toHaveBeenCalledWith(formArrayValue);
    });

    it('should close the form', () => {
      component.isSelected = true;
      component.editIndex = 1;

      component.handleClickDelete({} as InfoValoresView);

      expect(component.isSelected).toBeFalse();
      expect(component.editIndex).toBeNull();
    });
  });

  describe(ValuesInformationComponent.prototype.openModal.name, () => {
    it('should set infoValores data', () => {
      const subFormData = [{}, {}] as DedSusp[];
      component.subFormGroup.get('dedSusp').setValue(subFormData);

      spyOn(dedSuspStateService, 'setData');

      component.openModal();

      expect(dedSuspStateService.setData).toHaveBeenCalledWith(subFormData);
    });

    it('should open the modal', () => {
      spyOn(component.modalFormGroup, 'open');

      component.openModal();

      expect(component.modalFormGroup.open).toHaveBeenCalled();
    });
  });

  describe(ValuesInformationComponent.prototype.saveModal.name, () => {
    it('should set modalFormData to subFormGroup', () => {
      const modalFormData = [{}, {}] as DedSusp[];
      spyOn(dedSuspStateService, 'getData').and.returnValue(modalFormData);

      spyOn(component.subFormGroup.get('dedSusp'), 'setValue');

      component.saveModal();

      expect(component.subFormGroup.get('dedSusp').setValue).toHaveBeenCalledWith(modalFormData);
    });

    it('should clear modal data', () => {
      spyOn(dedSuspStateService, 'resetData')

      component.saveModal();

      expect(dedSuspStateService.resetData).toHaveBeenCalled();
    });
  });

  describe(ValuesInformationComponent.prototype.closeModal.name, () => {
    it('should clear modal data', () => {
      spyOn(dedSuspStateService, 'resetData')

      component.closeModal();

      expect(dedSuspStateService.resetData).toHaveBeenCalled();
    });
  });
});
