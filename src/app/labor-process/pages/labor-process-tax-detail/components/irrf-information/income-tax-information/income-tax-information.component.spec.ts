import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { TpCREnum } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { IncomeTaxInformationComponent } from './income-tax-information.component';

describe(IncomeTaxInformationComponent.name, () => {
  let fb: UntypedFormBuilder;

  let component: IncomeTaxInformationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new IncomeTaxInformationComponent();

    component.currentFormGroup = fb.group({
      tpCR: null,
      infoIR: fb.group({
        vrRendIsenNTrib: null,
      }),
    });

    component.subFormGroup = fb.group({
      vrRendIsenNTrib: null,
      vrRendTrib13: null,
      descIsenNTrib: null,
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

  describe('isDisabledVrRendTrib13 getter', () => {
    it('should return true when tpCR is IRRFRRA', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFRRA);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVrRendTrib13;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFDecisaoJustica);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledVrRendTrib13;

      expect(result).toBeTrue();
    });

    it('should return false when tpCR is not IRRFRRA and isExcluded is false', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFDecisaoJustica);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledVrRendTrib13;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledDescIsenNTrib getter', () => {
    it('should return true when vrRendIsenNTrib is less than or equal to 0', () => {
      component.subFormGroup.get('vrRendIsenNTrib').setValue(0);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledDescIsenNTrib;

      expect(result).toBeTrue();
    });

    it('should return true when isExcluded is true', () => {
      component.subFormGroup.get('vrRendIsenNTrib').setValue(10);
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      const result = component.isDisabledDescIsenNTrib;

      expect(result).toBeTrue();
    });

    it('should return false when vrRendIsenNTrib is greater than 0 and isExcluded is false', () => {
      component.subFormGroup.get('vrRendIsenNTrib').setValue(10);
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      const result = component.isDisabledDescIsenNTrib;

      expect(result).toBeFalse();
    });
  });

  describe(IncomeTaxInformationComponent.prototype.ngOnInit.name, () => {
    it('should create subFormGroup', () => {
      component.ngOnInit();

      expect(component.subFormGroup).toBeDefined();
    });

    const validityFunctionsWithFields = {
      handleChangesVrRendIsenNTrib: ['vrRendIsenNTrib'],
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

  describe(IncomeTaxInformationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('handleChangesTpCR', () => {
    it('should NOT reset vrRendTrib13 when isDisabledVrRendTrib13 is FALSE', () => {
      spyOnProperty(component, 'isDisabledVrRendTrib13').and.returnValue(false);
      spyOn(component.subFormGroup.get('vrRendTrib13'), 'reset');

      component['handleChangesTpCR']();

      expect(component.subFormGroup.get('vrRendTrib13').reset).not.toHaveBeenCalled();
    });

    it('should reset vrRendTrib13 when isDisabledVrRendTrib13 is TRUE', () => {
      spyOnProperty(component, 'isDisabledVrRendTrib13').and.returnValue(true);
      spyOn(component.subFormGroup.get('vrRendTrib13'), 'reset');

      component['handleChangesTpCR']();

      expect(component.subFormGroup.get('vrRendTrib13').reset).toHaveBeenCalled();
    });
  });

  describe('handleChangesVrRendIsenNTrib', () => {
    it('should NOT reset descIsenNTrib when isDisabledDescIsenNTrib is FALSE', () => {
      spyOnProperty(component, 'isDisabledDescIsenNTrib').and.returnValue(false);
      spyOn(component.subFormGroup.get('descIsenNTrib'), 'reset');

      component['handleChangesVrRendIsenNTrib']();

      expect(component.subFormGroup.get('descIsenNTrib').reset).not.toHaveBeenCalled();
    });

    it('should reset descIsenNTrib when isDisabledDescIsenNTrib is TRUE', () => {
      spyOnProperty(component, 'isDisabledDescIsenNTrib').and.returnValue(true);
      spyOn(component.subFormGroup.get('descIsenNTrib'), 'reset');

      component['handleChangesVrRendIsenNTrib']();

      expect(component.subFormGroup.get('descIsenNTrib').reset).toHaveBeenCalled();
    });
  });
});
