import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../../util/test/mock/global/subscription-mock';
import { TpCREnum } from './../../../../../../models/labor-process-taxes.model';
import { OptionsAnswer } from '../../../../../../models/labor-process.model';
import { AdditionalInformationRraComponent } from './additional-information-rra.component';

describe(AdditionalInformationRraComponent.name, () => {
  let fb: UntypedFormBuilder;

  let component: AdditionalInformationRraComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new AdditionalInformationRraComponent();

    component.currentFormGroup = fb.group({
      tpCR: null,
      infoRRA: fb.group({
        descRRA: null,
        qtdMesesRRA: null,
      }),
    });
    component.subFormGroup = fb.group({
      descRRA: [null],
      qtdMesesRRA: [null],
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

  describe('isRequiredInfoRRA getter', () => {
    it('should return FALSE if "infoRRA" is disabled', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFDecisaoJustica);

      const result = component.isRequiredInfoRRA;

      expect(result).toBeFalse();
    });

    it('should return TRUE if "infoRRA" is NOT disabled', () => {
      component.currentFormGroup.get('tpCR').setValue(TpCREnum.IRRFRRA);

      const result = component.isRequiredInfoRRA;

      expect(result).toBeTrue();
    });
  });

  describe(AdditionalInformationRraComponent.prototype.ngOnInit.name, () => {
    it('should create subFormGroup', () => {
      component.ngOnInit();

      expect(component.subFormGroup).toBeDefined();
    });

    it('should add all of subscriptions', () => {
      const totalSubscriptions = 1;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });
  });

  describe(AdditionalInformationRraComponent.prototype.ngOnDestroy.name, () => {
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
    it('should reset subFormGroup fields when is NOT required "infoRRA"', () => {
      component.subFormGroup.patchValue({
        descRRA: 'mockValue',
        qtdMesesRRA: '4242',
      });

      component['handleChangesTpCR']();

      expect(component.subFormGroup.get('descRRA').value).toBeNull();
      expect(component.subFormGroup.get('qtdMesesRRA').value).toBeNull();
    });
  });
});
