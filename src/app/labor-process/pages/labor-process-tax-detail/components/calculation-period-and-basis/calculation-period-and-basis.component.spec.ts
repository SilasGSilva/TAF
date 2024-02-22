import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { CalcTrib, InfoCRContrib, TpCREnum } from '../../../../../../app/models/labor-process-taxes.model';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { CalculationPeriodAndBasisComponent } from './calculation-period-and-basis.component';

describe(CalculationPeriodAndBasisComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  
  let component: CalculationPeriodAndBasisComponent;
  let rows: CalcTrib[];
  
  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    component = new CalculationPeriodAndBasisComponent(fb, laborProcessDataStateService);

    component.currentFormGroup = fb.group({
      calcTrib: fb.control([])
    });

    rows = [
      {
        perRef: 'r1',
        vrBcCpMensal: 1,
        vrBcCp13: 1,
        vrRendIRRF: 1,
        vrRendIRRF13: 1,
        infoCRContrib: [
          {
            tpCR: 1 as TpCREnum,
            vrCR: 2
          } as InfoCRContrib
        ]
      },
      {
        perRef: 'r2',
        vrBcCpMensal: 1,
        vrBcCp13: 1,
        vrRendIRRF: 1,
        vrRendIRRF13: 1,
        infoCRContrib: [
          {
            tpCR: 1 as TpCREnum,
            vrCR: 2
          } as InfoCRContrib
        ]
      }] as CalcTrib[];

    component.rows = rows.map(m => {
      const value = {
        periodoReferenciaLabel: m.perRef,
        baseContribMensalLabel: m.vrBcCpMensal,
        baseContribMensal13Label: m.vrBcCp13,
        rendimentoTribIRRFLabel: m.vrRendIRRF,
        rendimentoTribIRRF13Label: m.vrRendIRRF13
      } as any;
      return value;
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.ngOnInit.name, () => {
    it('should form view from excluidoERP equal to "S"', () => {
      spyOn(component.subFormGroup, 'disable').and.stub();
      component.excluidoERP = 'S';
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.ngOnInit();
      expect(component.rows.length).toEqual(2);
      expect(component.actions.length).toEqual(1);
      expect(component.subFormGroup.get('infoCRContrib')).not.toEqual(null);
    });

    it('should form edit from excluidoERP equal to "N"', () => {
      spyOn(component.subFormGroup, 'disable').and.stub();
      component.excluidoERP = 'N';
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.ngOnInit();
      expect(component.rows.length).toEqual(2);
      expect(component.actions.length).toEqual(2);
    });

    it('should update rows from change values', () => {
      spyOn(component, 'transformRows').and.stub();
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.ngOnInit();
      const subscription = component.formArray.valueChanges.subscribe(() => {
        expect(component.transformRows).toHaveBeenCalled();
      });
      component.currentFormGroup.get('calcTrib').setValue(rows);
      subscription.unsubscribe();
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.ngOnDestroy.name, () => {
    it('should remove subscriptions', () => {
      const subscription: Subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.subscriptions = [subscription];
      component.ngOnDestroy();
      expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.create.name, () => {
    it('should reset modal state', () => {
      spyOn(component.subFormGroup, 'reset').and.stub();
      component.isSelected = false;
      component.isEdit = true;
      component.create();
      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeFalse();
      expect(component.subFormGroup.reset).toHaveBeenCalled();
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.saveCalcTribPeriod.name, () => {
    it('when formArray is empty should result with one record"', () => {
      component.ngOnInit();
      component.isSelected = true;
      component.formArray.setValue([]);
      component.saveCalcTribPeriod();
      expect(component.formArray.value.length).toEqual(1);
      expect(component.isSelected).toBeFalse();
    });
    it('when formArray is filled with one should result with two record"', () => {
      component.ngOnInit();
      component.isSelected = true;
      component.formArray.setValue([{}]);
      component.saveCalcTribPeriod();
      expect(component.formArray.value.length).toEqual(2);
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.updateCalcTribPeriod.name, () => {
    it('should update "perRef" in formArray and update states', () => {
      component.ngOnInit();
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.isSelected = true;
      component.subFormGroup.setValue({
        perRef: 'r3',
        vrBcCpMensal: 1,
        vrBcCp13: 1,
        vrRendIRRF: 1,
        vrRendIRRF13: 1,
        infoCRContrib: [
          {
            tpCR: 1 as TpCREnum,
            vrCR: 2
          } as InfoCRContrib
        ]
      });
      component.editIndex = 1;

      component.updateCalcTribPeriod();
      expect(component.formArray.value[1].perRef).toEqual('r3');
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.clickToEditCalcTribPeriod.name, () => {
    it('should change states to edit "calcTrib" subForm', () => {
      component.ngOnInit();
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.isEdit = false;
      component.isSelected = false;
      component.editIndex = 0;

      component.clickToEditCalcTribPeriod(component.rows[1] as any);
      expect(component.isEdit).toBeTrue();
      expect(component.editIndex).toEqual(1);
      expect(component.isSelected).toBeTrue();
      expect(component.subFormGroup.get('perRef').value).toEqual('r2');
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.deleteCalcTribPeriod.name, () => {
    it('should remove picked "calcTrib"', () => {
      component.currentFormGroup.get('calcTrib').setValue(rows);
      component.isSelected = true;
      component.isEdit = true;
      component.editIndex = 1;

      component.deleteCalcTribPeriod(component.rows[1]);
      expect(component.formArray.value.length).toEqual(1);
      expect(component.isSelected).toBeFalse();
      expect(component.isEdit).toBeFalse();
    });
  });

  describe(CalculationPeriodAndBasisComponent.prototype.cancel.name, () => {
    it('should change selected state', () => {
      component.isSelected = true;
      component.cancel();

      expect(component.isSelected).toBeFalse();
    });
  });

  describe('formArrayValue getter', () => {
    it('should return correct state from "formArrayValue"', () => {
      component.currentFormGroup.get('calcTrib').setValue(rows);
      expect(component.formArrayValue.length).toEqual(rows.length);
      component.formArray.setValue(null);
      expect(component.formArrayValue.length).toEqual(0);
    })
  })
});
