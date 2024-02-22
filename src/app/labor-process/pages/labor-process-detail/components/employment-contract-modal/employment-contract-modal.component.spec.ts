import { UntypedFormBuilder } from '@angular/forms';
import { OptionsAnswer, TypeContract } from '../../../../../models/labor-process.model';
import { EmploymentContractModalComponent } from './employment-contract-modal.component';

describe(EmploymentContractModalComponent.name, () => {
  let formBuilder: UntypedFormBuilder;
  let component: EmploymentContractModalComponent;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    component = new EmploymentContractModalComponent();
    component.poModal = jasmine.createSpyObj('PoModalComponent', [
      'open',
      'close',
    ]);
    component.currentFormGroup = formBuilder.group({
      tpContr: [null],
      indContr: [null],
      ideEstab: formBuilder.group({
        infoVlr: formBuilder.group({
          pagDiretoResc: null,
          vrBaseIndenFGTS: null,
          idePeriodo: [],
        }),
      }),
    });
  });

  describe('isDisabledEmploymentRelationship getter', () => {
    it('should return TRUE when "indContr" is not "N" or "tpContr" is "TrabSemVinculo"', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
  
      const result = component.isDisabledEmploymentRelationship;
  
      expect(result).toBeTrue();
    });
  
    it('should return FALSE when "indContr" is "N" and "tpContr" is not "TrabSemVinculo"', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('tpContr').setValue(TypeContract.TrabalhadorComVincSemAlt);
  
      const result = component.isDisabledEmploymentRelationship;
  
      expect(result).toBeFalse();
    });
  });

  describe(EmploymentContractModalComponent.prototype.openModal.name, () => {
    it('should open the modal', () => {
      component.openModal();

      expect(component.poModal.open).toHaveBeenCalledTimes(1);
    });

    it('should call "initializeVrBaseIndenFGTS"', () => {
      spyOn(component, 'initializeVrBaseIndenFGTS').and.stub();

      component.openModal();

      expect(component.initializeVrBaseIndenFGTS).toHaveBeenCalledTimes(1);
    });
  });

  describe(EmploymentContractModalComponent.prototype.initializeVrBaseIndenFGTS.name, () => {
    it('should set NULL to "vrBaseIndenFGTS" when "pagDiretoResc" is empty and "vrBaseIndenFGTS" is "0"', () => {
      const mockCurrentForm = {
        tpContr: 1,
        indContr: '',
        ideEstab: {
          infoVlr: {
            pagDiretoResc: '',
            vrBaseIndenFGTS: 0.0,
            idePeriodo: [],
          },
        },
      };

      component.currentFormGroup.setValue(mockCurrentForm);

      component.initializeVrBaseIndenFGTS();

      const value = component.currentFormGroup.value.ideEstab.infoVlr.vrBaseIndenFGTS;
      expect(value).toBeNull();
    });

    it('should NOT set NULL to "vrBaseIndenFGTS" when "pagDiretoResc" is NOT empty and "vrBaseIndenFGTS" is "0"', () => {
      const expectedValue = 10.0;
      const mockCurrentForm = {
        tpContr: 1,
        indContr: '',
        ideEstab: {
          infoVlr: {
            pagDiretoResc: 'x',
            vrBaseIndenFGTS: expectedValue,
            idePeriodo: [],
          },
        },
      };

      component.currentFormGroup.setValue(mockCurrentForm);

      component.initializeVrBaseIndenFGTS();

      const value = component.currentFormGroup.value.ideEstab.infoVlr.vrBaseIndenFGTS;
      expect(value).toEqual(expectedValue);
    });

    it('should NOT set NULL to "vrBaseIndenFGTS" when "pagDiretoResc" is empty and "vrBaseIndenFGTS" is NOT "0"', () => {
      const expectedValue = 10.0;
      const mockCurrentForm = {
        tpContr: 1,
        indContr: '',
        ideEstab: {
          infoVlr: {
            pagDiretoResc: '',
            vrBaseIndenFGTS: expectedValue,
            idePeriodo: [],
          },
        },
      };

      component.currentFormGroup.setValue(mockCurrentForm);

      component.initializeVrBaseIndenFGTS();

      const value = component.currentFormGroup.value.ideEstab.infoVlr.vrBaseIndenFGTS;
      expect(value).toEqual(expectedValue);
    });
  });

  describe(EmploymentContractModalComponent.prototype.closeModal.name, () => {
    it('should close the modal', () => {
      component.closeModal();
      expect(component.poModal.close).toHaveBeenCalledTimes(1);
    });
  });
});
