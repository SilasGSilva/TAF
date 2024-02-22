import { UntypedFormBuilder } from '@angular/forms';
import { OptionsAnswer } from '../../../../../models/labor-process.model';
import { WithholdingAndDependentInformationComponent } from './withholding-and-dependent-information.component';

describe(WithholdingAndDependentInformationComponent.name, () => {
  let fb: UntypedFormBuilder;

  let component: WithholdingAndDependentInformationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new WithholdingAndDependentInformationComponent();
  });

  describe(WithholdingAndDependentInformationComponent.prototype.ngOnInit.name, () => {
    beforeEach(() => {
      component.currentFormGroup = fb.group({
        infoIRComplem: null,
      });
    });

    it('should create subFormGroup', () => {
      component.ngOnInit();

      expect(component.subFormGroup).toBeDefined();
    });

    it('should disable subFormGroup if isExcluded', () => {
      spyOnProperty(component, 'isExcluded').and.returnValue(true);

      component.ngOnInit();

      expect(component.subFormGroup.disabled).toBeTrue();
    });

    it('should NOT disable subFormGroup if NOT isExcluded', () => {
      spyOnProperty(component, 'isExcluded').and.returnValue(false);

      component.ngOnInit();

      expect(component.subFormGroup.disabled).toBeFalse();
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
});
