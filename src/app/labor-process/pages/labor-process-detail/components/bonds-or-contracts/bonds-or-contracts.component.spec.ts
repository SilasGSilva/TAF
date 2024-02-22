import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PoNotificationService } from '@po-ui/ng-components';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { PoNotificationServiceMock } from '../../../../../../util/test/mock/po-components/po-notification-service.mock';
import { BondsOrContractsComponent } from './bonds-or-contracts.component';

describe('BondsOrContractsComponent', () => {
  let fb: UntypedFormBuilder;
  let poNotificationService: PoNotificationService;
  let component: BondsOrContractsComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    poNotificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;
    component = new BondsOrContractsComponent(fb, poNotificationService);
  });

  it('when called ngOnInit', () => {
    spyOn(component, 'transformRows');
    spyOn(component, 'initializeTableActions');
    component.mainFormGroup = fb.group({ excluidoERP: [null] });
    component.currentFormGroup = fb.group({ matricula: [null], codCateg: [null], dtInicio: [null], unicContr: [null] });
    component.ngOnInit();
    void expect(component.transformRows).toHaveBeenCalled();
    void expect(component.initializeTableActions).toHaveBeenCalled();
  });

  describe('when called initializeTableActions', () => {
    it('with excluidoERP equal to "S"', () => {
      component.actions = null;
      component.excluidoERP = "S";
      component.initializeTableActions();
      void expect(component.actions).toBeNull();
    });

    it('with excluidoERP equal to "N"', () => {
      component.actions = null;
      component.excluidoERP = "N";
      component.initializeTableActions();
      void expect(component.actions).not.toBeNull();
    });
  });

  describe('when called transformRows', () => {
    it('with values in currentFormGroup.unicContr', () => {
      component.currentFormGroup = fb.group({ matricula: [null], codCateg: [null], dtInicio: [null], unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue([{
        matUnic: '1',
        codCateg: '2',
        dtInicio: new Date(),
        matricula: 'Mat'
      } as any]);
      component.transformRows();
      void expect(component.rows.length).toEqual(1);
    });

    it('with null in currentFormGroup.unicContr', () => {
      component.currentFormGroup = fb.group({ matricula: [null], codCateg: [null], dtInicio: [null], unicContr: [null] });
      component.transformRows();
      void expect(component.rows.length).toEqual(0);
    });
  });

  it('create', () => {
    component.subFormGroup = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null], matricula: [null] });
    component.isSelected = false;
    component.isEdit = true;
    spyOn(component.subFormGroup, 'reset');
    component.create();
    void expect(component.subFormGroup.reset).toHaveBeenCalled();
    void expect(component.isSelected).toBeTrue();
    void expect(component.isEdit).toBeFalse();
  });

  it('when called method createSubFormGroup', () => {
    component.currentFormGroup = fb.group({ matricula: [null], codCateg: [null], dtInicio: [null], unicContr: [null] });
    const resultValue = component['createSubFormGroup']();
    void expect(resultValue instanceof UntypedFormGroup).toBeTrue();
  });

  it('when called method clickToEditBoundOrContract', () => {
    const contract1Fb = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null], matricula: [null] });
    const contract2Fb = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null], matricula: [null] });
    const contract3Fb = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null], matricula: [null] });

    const contract1 = {
      matUnic: '1',
      codCateg: '2',
      dtInicio: new Date(),
      matricula: 'Mat'
    } as any;
    contract1Fb.setValue(contract1);

    const contract2 = {
      matUnic: '3',
      codCateg: '4',
      dtInicio: new Date(),
      matricula: 'Mat'
    } as any;
    contract2Fb.setValue(contract2);

    fb.group({ matUnic: [null], codCateg: [null], dtInicio: [], matricula: [] });
    const contract3 = {
      matUnic: '5',
      codCateg: '6',
      dtInicio: new Date(),
      matricula: 'Mat'
    } as any;
    contract3Fb.setValue(contract3);

    component.rows = [contract1, contract2, contract3];
    component.currentFormGroup = fb.group({ unicContr: [null] });
    component.currentFormGroup.get('unicContr').setValue([contract1, contract2, contract3]);
    component.subFormGroup = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null], matricula: [null] });

    component.clickToEditBoundOrContract(contract3);

    void expect(component.isEdit).toBeTrue();
    void expect(component.editIndex).toEqual(2);
    void expect(component.isSelected).toBeTrue();
    void expect(component.subFormGroup.value.matricula).toEqual(contract3.matricula);
  });

  describe('when called method deleteBoundOrContract', () => {
    const contract1 = {
      matUnic: '1',
      codCateg: '2',
      dtInicio: new Date()
    } as any;
    const contract2 = {
      matUnic: '3',
      codCateg: '4',
      dtInicio: new Date()
    } as any;

    beforeEach(() => {
      component.currentFormGroup = fb.group({ unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue([contract1, contract2]);
    });

    it('with found contract', () => {
      component.deleteBoundOrContract(contract1);
      void expect(component.currentFormGroup.get('unicContr').value.length).toEqual(1);
    });

    it('with null list contracts', () => {
      component.currentFormGroup.get('unicContr').setValue(null);
      component.deleteBoundOrContract(contract1);
      void expect(component.currentFormGroup.get('unicContr').value.length).toEqual(0);
    });
  });

  describe('when called method saveBoundOrContract', () => {
    it('with hasError is true', () => {
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(true);

      component.isSelected = true;
      component.saveBoundOrContract();
      void expect(component.isSelected).toBeTrue();
    });

    it('with hasError is false and formArray return null', () => {
      component.subFormGroup = fb.group({});
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(false);
      component.currentFormGroup = fb.group({ unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue(null);
      void expect(component.isSelected).toBeFalse();
    });

    it('with hasError is false and formArray return []', () => {
      component.subFormGroup = fb.group({});
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(false);
      component.currentFormGroup = fb.group({ unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue([]);
      void expect(component.isSelected).toBeFalse();
    });
  });

  describe('when called method updateBoundOrContract', () => {
    it('with hasError is true', () => {
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(true);
      component.isSelected = true;
      component.updateBoundOrContract();
      void expect(component.isSelected).toBeTrue();
    });

    it('with hasError is false and formArray return null', () => {
      component.subFormGroup = fb.group({});
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(false);
      component.currentFormGroup = fb.group({ unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue(null);
      component.updateBoundOrContract();
      void expect(component.isSelected).toBeFalse();
    });

    it('with hasError is false and formArray return []', () => {
      component.subFormGroup = fb.group({});
      spyOn(component, 'validateVinculoBoundOrContract').and.returnValue(false);
      component.currentFormGroup = fb.group({ unicContr: [null] });
      component.currentFormGroup.get('unicContr').setValue([]);
      component.updateBoundOrContract();
      void expect(component.isSelected).toBeFalse();
    });
  });

  describe('when called method validateVinculoBoundOrContract', () => {
    beforeEach(() => {
      component.subFormGroup = fb.group({ matUnic: [null], codCateg: [null], dtInicio: [null] });
    });

    it('with null values', () => {
      spyOn(poNotificationService, 'error');
      component.subFormGroup.get('matUnic').setValue(null);
      component.subFormGroup.get('codCateg').setValue(null);
      component.subFormGroup.get('dtInicio').setValue(null);
      const resultValue = component.validateVinculoBoundOrContract();
      void expect(poNotificationService.error).toHaveBeenCalled();
      void expect(resultValue).toBeTrue();
    });

    it('with empty values', () => {
      spyOn(poNotificationService, 'error');
      component.subFormGroup.get('matUnic').setValue('');
      component.subFormGroup.get('codCateg').setValue('');
      component.subFormGroup.get('dtInicio').setValue('');
      const resultValue = component.validateVinculoBoundOrContract();
      void expect(poNotificationService.error).toHaveBeenCalled();
      void expect(resultValue).toBeTrue();
    });

    describe('with informed', () => {
      it('matUnic and codCateg', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue('A');
        component.subFormGroup.get('codCateg').setValue('B');
        component.subFormGroup.get('dtInicio').setValue(null);
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue('A');
        component.subFormGroup.get('codCateg').setValue(null);
        component.subFormGroup.get('dtInicio').setValue('C');
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic, codCateg and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue('A');
        component.subFormGroup.get('codCateg').setValue('B');
        component.subFormGroup.get('dtInicio').setValue('C');
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic and not informed codCateg and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue('A');
        component.subFormGroup.get('codCateg').setValue(null);
        component.subFormGroup.get('dtInicio').setValue(null);
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).not.toHaveBeenCalled();
        void expect(resultValue).toBeFalse();
      });
    });

    describe('with not informed', () => {
      it('matUnic and codCateg', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue(null);
        component.subFormGroup.get('codCateg').setValue(null);
        component.subFormGroup.get('dtInicio').setValue('C');
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue(null);
        component.subFormGroup.get('codCateg').setValue('B');
        component.subFormGroup.get('dtInicio').setValue(null);
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic, codCateg and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue(null);
        component.subFormGroup.get('codCateg').setValue(null);
        component.subFormGroup.get('dtInicio').setValue(null);
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).toHaveBeenCalled();
        void expect(resultValue).toBeTrue();
      });

      it('matUnic and informed codCateg and dtInicio', () => {
        spyOn(poNotificationService, 'error');
        component.subFormGroup.get('matUnic').setValue(null);
        component.subFormGroup.get('codCateg').setValue('B');
        component.subFormGroup.get('dtInicio').setValue('C');
        const resultValue = component.validateVinculoBoundOrContract();
        void expect(poNotificationService.error).not.toHaveBeenCalled();
        void expect(resultValue).toBeFalse();
      });
    });
  });

  it('when called method cancel', () => {
    component.isSelected = true;
    component.cancel();
    void expect(component.isSelected).toBeFalse();
  });

  describe('when called method validateEqualMatricula', () => {
    let controlMatricula: AbstractControl;

    beforeEach(() => {
      component.currentFormGroup = fb.group({ matricula: [null] });
      controlMatricula = new AbstractControlMock() as unknown as AbstractControl;
    });

    it('with subFormGroup is null', () => {
      component.subFormGroup = null;
      controlMatricula.setValue('M');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is null', () => {
      component.currentFormGroup.get('matricula').setValue(1);
      controlMatricula.setValue(null);
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeUndefined();
    });

    it('with currentValue is empty', () => {
      component.currentFormGroup.get('matricula').setValue(1);
      controlMatricula.setValue('');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeUndefined();
    });

    it('with matricula is null', () => {
      component.currentFormGroup.get('matricula').setValue(null);
      controlMatricula.setValue('M');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeNull();
    });

    it('with matricula is empty', () => {
      component.currentFormGroup.get('matricula').setValue('');
      controlMatricula.setValue('M');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is not equal to matricula', () => {
      component.currentFormGroup.get('matricula').setValue('M');
      controlMatricula.setValue('X');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is equal to matricula', () => {
      component.currentFormGroup.get('matricula').setValue('M');
      controlMatricula.setValue('M');
      const resultValue = component.validateEqualMatricula(controlMatricula);
      void expect(resultValue).not.toBeNull();
      void expect(resultValue.matEqual).toBeTrue();
    });
  });

  describe('when called method validateEqualCod', () => {
    let controlCodCateg: AbstractControl;

    beforeEach(() => {
      component.currentFormGroup = fb.group({ codCateg: [null] });
      controlCodCateg = new AbstractControlMock() as unknown as AbstractControl;
    });

    it('with subFormGroup is null', () => {
      component.subFormGroup = null;
      controlCodCateg.setValue(1);
      const resultValue = component.validateEqualCod(controlCodCateg);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is null', () => {
      component.currentFormGroup.get('codCateg').setValue(1);
      controlCodCateg.setValue(null);
      const resultValue = component.validateEqualCod(controlCodCateg);
      void expect(resultValue).toBeNull();
    });

    it('with codCateg is null', () => {
      component.currentFormGroup.get('codCateg').setValue(null);
      controlCodCateg.setValue('9999-99-99');
      const resultValue = component.validateEqualCod(controlCodCateg);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is not equal to codCateg', () => {
      component.currentFormGroup.get('codCateg').setValue(1);
      controlCodCateg.setValue(2);
      const resultValue = component.validateEqualCod(controlCodCateg);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is equal to codCateg', () => {
      component.currentFormGroup.get('codCateg').setValue(1);
      controlCodCateg.setValue(1);
      const resultValue = component.validateEqualCod(controlCodCateg);
      void expect(resultValue).not.toBeNull();
      void expect(resultValue.codEqual).toBeTrue();
    });
  });

  describe('when called method validateEqualDate', () => {
    let controlDtInicio: AbstractControl;

    beforeEach(() => {
      component.currentFormGroup = fb.group({ dtInicio: [null] });
      controlDtInicio = new AbstractControlMock() as unknown as AbstractControl;
    });

    it('with subFormGroup is null', () => {
      component.subFormGroup = null;
      controlDtInicio.setValue('9999-99-99');
      const resultValue = component.validateEqualDate(controlDtInicio);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is null', () => {
      component.currentFormGroup.get('dtInicio').setValue('9999-99-99');
      controlDtInicio.setValue(null);
      const resultValue = component.validateEqualDate(controlDtInicio);
      void expect(resultValue).toBeNull();
    });

    it('with dtInicio is null', () => {
      component.currentFormGroup.get('dtInicio').setValue(null);
      controlDtInicio.setValue('9999-99-99');
      const resultValue = component.validateEqualDate(controlDtInicio);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is not equal to dtInicio', () => {
      component.currentFormGroup.get('dtInicio').setValue('8888-88-88');
      controlDtInicio.setValue('9999-99-99');
      const resultValue = component.validateEqualDate(controlDtInicio);
      void expect(resultValue).toBeNull();
    });

    it('with currentValue is equal to dtInicio', () => {
      component.currentFormGroup.get('dtInicio').setValue('9999-99-99');
      controlDtInicio.setValue('9999-99-99');
      const resultValue = component.validateEqualDate(controlDtInicio);
      void expect(resultValue).not.toBeNull();
      void expect(resultValue.dateEqual).toBeTrue();
    });
  });
});
