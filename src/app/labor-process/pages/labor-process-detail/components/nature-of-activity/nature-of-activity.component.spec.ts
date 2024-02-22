import { AbstractControl, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { CodCategEnum, MudCategAtiv, NatAtividadeEnum, OptionsAnswer } from '../../../../../models/labor-process.model';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { NatureOfActivityComponent } from './nature-of-activity.component';

describe(NatureOfActivityComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let component: NatureOfActivityComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;;
    component = new NatureOfActivityComponent(fb, laborProcessDataStateService);

    component.currentFormGroup = fb.group({
      codCateg: [null],
      indCateg: [null],
      indNatAtiv: [null],
      mudCategAtiv: fb.control([]),
    });

    component.subFormGroup = fb.group({
      codCateg: [null],
      natAtividade: [null],
      dtMudCategAtiv: [null]
    });

    component.mainFormGroup = fb.group({
      excluidoERP: [null]
    });
  });

  describe('when called getter isNatAtividadeRequired', () => {
    const categories = [
      CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar,
      CodCategEnum.Estagiario];

    it('should result true', () => {
      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      component.subFormGroup.get('codCateg').setValue(null);
      let resultValue: boolean = component.isNatAtividadeRequired;
      expect(resultValue).toBeTrue();

      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.Yes);
      component.subFormGroup.get('codCateg').setValue(null);
      resultValue = component.isNatAtividadeRequired;
      expect(resultValue).toBeTrue();

      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      Object.values(CodCategEnum).filter(category => !categories.find(f => f === category)).map(m => m as CodCategEnum).forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        resultValue = component.isNatAtividadeRequired;
        expect(resultValue).toBeTrue();
      });
    });

    it('should result false', () => {
      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      component.subFormGroup.get('codCateg').setValue(null);
      let resultValue: boolean = component.isNatAtividadeRequired;

      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      Object.values(CodCategEnum).filter(category => categories.find(f => f === category)).map(m => m as CodCategEnum).forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        resultValue = component.isNatAtividadeRequired;
        expect(resultValue).toBeFalse();
      });
    });
  });

  describe('when called getter isNatAtividadeDisabled', () => {
    const categories = [
      CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar,
      CodCategEnum.Estagiario];

    it('should result true', () => {
      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      component.subFormGroup.get('natAtividade').setValue('1');

      categories.forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        let resultValue: boolean = component.isNatAtividadeDisabled;
        expect(resultValue).toBeTrue();
        expect(component.subFormGroup.get('natAtividade').value).toBeNull();
      });
    });

    it('should result false', () => {
      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      component.subFormGroup.get('codCateg').setValue(null);
      let resultValue: boolean = component.isNatAtividadeDisabled;
      expect(resultValue).toBeFalse();

      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.Yes);
      component.subFormGroup.get('codCateg').setValue(null);
      resultValue = component.isNatAtividadeDisabled;
      expect(resultValue).toBeFalse();

      component.currentFormGroup.get('indCateg').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('indNatAtiv').setValue(OptionsAnswer.No);
      component.subFormGroup.get('natAtividade').setValue(null);
      Object.values(CodCategEnum).filter(category => !categories.find(f => f === category)).map(m => m as CodCategEnum).forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        resultValue = component.isNatAtividadeDisabled;
        expect(resultValue).toBeFalse();
      });
    });
  });

  describe('when called method ngOnInit', () => {
    it('should actions equals to Editar and Excluir', () => {
      component.mainFormGroup.get('excluidoERP').setValue(OptionsAnswer.No);
      component.excluidoERP = OptionsAnswer.No;

      component.ngOnInit();
      expect(component.subscriptions.length).toEqual(2);
      expect(component.actions.length).toEqual(2);
      expect(component.actions[0].label).toEqual('Editar');
      expect(component.actions[1].label).toEqual('Excluir');

      spyOn(component, 'initializeTableActions').and.stub();
      spyOn(component, 'transformRows').and.stub();

      const subscription1 = component.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
        expect(component.excluidoERP).toEqual("S");
        expect(component.initializeTableActions).toHaveBeenCalled();
      });
      component.mainFormGroup.get('excluidoERP').setValue("S");
      subscription1.unsubscribe();

      const subscription2 = component.currentFormGroup.get('mudCategAtiv').valueChanges.subscribe(() => {
        expect(component.transformRows).toHaveBeenCalled();
      });
      component.currentFormGroup.patchValue([
        {
          codCateg: 0 as CodCategEnum,
          natAtividade: 0 as NatAtividadeEnum,
          dtMudCategAtiv: new Date()
        }
      ] as MudCategAtiv[]);
      subscription2.unsubscribe();
    });

    it('should actions not equals to Editar and Excluir', () => {
      component.mainFormGroup.get('excluidoERP').setValue(OptionsAnswer.Yes);
      component.excluidoERP = OptionsAnswer.Yes;
      component.actions = [];

      component.ngOnInit();
      expect(component.subscriptions.length).toEqual(2);
      expect(component.actions.length).toEqual(0);
    });
  });

  it('when called method ngOnDestroy', () => {
    component.subscriptions = [new SubscriptionMock() as unknown as Subscription];
    spyOn(component.subscriptions[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
  });

  it('when called getter formArray', () => {
    component.currentFormGroup.get('mudCategAtiv').setValue([]);
    let resultValue: UntypedFormControl = component.formArray;
    expect(resultValue.value.length).toEqual(0);

    component.currentFormGroup = null;
    resultValue = component.formArray;
    expect(resultValue).toBeUndefined();
  });

  it('when called method create', () => {
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    expect(component.isSelected).toBeTrue();
    expect(component.isEdit).toBeFalse();
  });

  it('when called method createSubFormGroup', () => {
    spyOn(fb, 'group').and.stub();
    component.isSelected = false;
    component.isEdit = true;
    component['createSubFormGroup']();
    expect(fb.group).toHaveBeenCalled();
  });

  it('when called method clickToEditNatureOfActivity', () => {
    const rows = [{
      codCateg: 'cCateg1',
      natAtividade: 'nAtividade1',
      dtMudCategAtiv: new Date()
    } as any,
    {
      codCateg: 'cCateg2',
      natAtividade: 'nAtividade2',
      dtMudCategAtiv: new Date()
    } as any];

    component.currentFormGroup.get('mudCategAtiv').patchValue(rows);
    component.rows = rows;
    component.clickToEditNatureOfActivity(rows[1]);
    expect(component.isEdit).toBeTrue();
    expect(component.editIndex).toEqual(1);
    expect(component.isSelected).toBeTrue();
    expect(component.subFormGroup.get('codCateg').value).toEqual('cCateg2');
  });

  it('when called method deleteNatureOfActivity', () => {
    const rows = [{
      codCateg: 'cCateg1',
      natAtividade: 'nAtividade1',
      dtMudCategAtiv: new Date()
    } as any,
    {
      codCateg: 'cCateg2',
      natAtividade: 'nAtividade2',
      dtMudCategAtiv: new Date()
    } as any];

    component.currentFormGroup.get('mudCategAtiv').patchValue(rows);
    component.rows = rows;
    component.deleteNatureOfActivity(rows[1]);
    expect(component.isEdit).toBeFalse();
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('mudCategAtiv').value.length).toEqual(1);
  });

  it('when called method saveNatureOfActivity', () => {
    const rows = [{
      codCateg: 'cCateg1',
      natAtividade: 'nAtividade1',
      dtMudCategAtiv: new Date()
    } as any];

    component.subFormGroup.patchValue({
      codCateg: 'cCateg2',
      natAtividade: 'nAtividade2',
      dtMudCategAtiv: new Date()
    } as any);

    component.currentFormGroup.get('mudCategAtiv').patchValue(rows);
    component.rows = rows;
    component.saveNatureOfActivity();
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('mudCategAtiv').value.length).toEqual(2);
  });

  it('when called method updateNatureOfActivity', () => {
    const rows = [{
      codCateg: 'cCateg1',
      natAtividade: 'nAtividade1',
      dtMudCategAtiv: new Date()
    } as any,
    {
      codCateg: 'cCategN',
      natAtividade: 'nAtividadeN',
      dtMudCategAtiv: new Date()
    } as any];

    component.subFormGroup.patchValue({
      codCateg: 'cCateg2',
      natAtividade: 'nAtividade2',
      dtMudCategAtiv: new Date()
    } as any);

    component.currentFormGroup.get('mudCategAtiv').patchValue(rows);
    component.rows = rows;
    component.editIndex = 1;
    component.updateNatureOfActivity();
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('mudCategAtiv').value.length).toEqual(2);
    expect(component.currentFormGroup.get('mudCategAtiv').value[1].codCateg).toEqual('cCateg2');
  });

  describe('when called method validateCodAndNatureActivity', () => {
    const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should null or undefined', () => {
      component.subFormGroup.get('codCateg').setValue(null);
      control.setValue(null);
      expect(component.validateCodAndNatureActivity(control)).toBeNull();

      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      control.setValue(1);
      expect(component.validateCodAndNatureActivity(control)).toBeNull();

      component.subFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoRural);
      control.setValue(2);
      expect(component.validateCodAndNatureActivity(control)).toBeNull();

      Object.values(CodCategEnum).filter(f => f != CodCategEnum.Domestico && f != CodCategEnum.EmpregadoRural).map(m => m as CodCategEnum).forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        [1, 2].forEach(value => {
          control.setValue(1);
          expect(component.validateCodAndNatureActivity(control)).toBeNull();
        });
      });

      component.subFormGroup = null;
      expect(component.validateCodAndNatureActivity(control)).toBeNull();
    });

    it('should result is equal to { invalidValue1: true }', () => {
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      control.setValue(2);
      expect(component.validateCodAndNatureActivity(control).invalidValue1).toBeTrue();

      component.subFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoRural);
      control.setValue(1);
      expect(component.validateCodAndNatureActivity(control).invalidValue1).toBeTrue();
    });
  });

  it('when called method cancel', () => {
    component.isSelected = true;
    component.cancel();
    expect(component.isSelected).toBeFalse();
  });

  describe('when called method verifyDuplicateDate', () => {
    const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should null or undefined', () => {
      const date = new Date(2000, 1, 1);

      control.setValue(date);
      component.currentFormGroup.get('mudCategAtiv').setValue([]);
      expect(component.validateDtMudCategAtivDuplicate(control)).toBeNull();

      control.setValue(null);
      expect(component.validateDtMudCategAtivDuplicate(control)).toBeNull();

      component.currentFormGroup.get('mudCategAtiv').setValue(null);
      expect(component.validateDtMudCategAtivDuplicate(control)).toBeNull();

      component.isEdit = true;
      expect(component.validateDtMudCategAtivDuplicate(control)).toBeNull();

      component.subFormGroup = null;
      expect(component.validateDtMudCategAtivDuplicate(control)).toBeNull();
    });

    it('should result is equal to { duplicatedDate: true }', () => {
      const date = new Date(2000, 1, 1);
      control.setValue(date);
      component.currentFormGroup.get('mudCategAtiv').setValue([{ dtMudCategAtiv: date }]);
      expect(component.validateDtMudCategAtivDuplicate(control).duplicatedDate).toBeTrue();
    });
  });
});
