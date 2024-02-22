import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { TpCREnum } from '../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { ExpensesLegalProceedingsComponent } from './expenses-legal-proceedings.component';

describe(ExpensesLegalProceedingsComponent.name, () => {
  let fb: UntypedFormBuilder;

  let component: ExpensesLegalProceedingsComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new ExpensesLegalProceedingsComponent();

    component.currentFormGroup = fb.group({
      tpCR: [null],
      infoRRA: fb.group({
        despProcJud: fb.group({
          vlrDespCustas: null,
          vlrDespAdvogados: null,
        }),
      }),
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

  describe(ExpensesLegalProceedingsComponent.prototype.ngOnInit.name, () => {
    it('should create subFormGroup', () => {
      component.ngOnInit();

      expect(component.subFormGroup).toBeDefined();
    });

    it('should add all of subscriptions', () => {
      const totalSubscriptions = 3;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    const validityFunctionsWithFields = {
      updateValidityVlrDespCustas: ['vlrDespCustas', 'vlrDespAdvogados'],
      updateValidityVlrDespAdvogados: ['vlrDespCustas', 'vlrDespAdvogados'],
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

  describe(ExpensesLegalProceedingsComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [new SubscriptionMock(), new SubscriptionMock()] as Subscription[];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();

        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
});
