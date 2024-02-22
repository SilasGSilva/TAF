import { AbstractControl, UntypedFormBuilder, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { Dependente, ESocialVersionEnum, OptionsAnswer, TpDepEnum } from '../../../../../models/labor-process.model';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { LaborerInformationComponent } from './laborer-information.component';

describe(LaborerInformationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let component: LaborerInformationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    component = new LaborerInformationComponent(fb, laborProcessDataStateService);

    component.subFormGroup = fb.group({
      cpfDep: [null],
      tpDep: [null],
      descDep: [null]
    });
    component.formGroup = fb.group({
      excluidoERP: [null],
      ideTrab: fb.group({
        cpfTrab: [null],
        nmTrab: [null],
        dtNascto: [null],
        dependente: fb.control([]),
        infoContr: fb.control([]),
      }),
      infoProcesso: fb.group({
        ideResp: fb.group({
          nrInsc: [null]
        })
      })
    });
  });

  it('formArray getter should be UNDEFINED if formGroup is NULL', () => {
    component.formGroup = null;
    expect(component.formArray).toBeUndefined();
  });

  it('dependents getter should return no dependents if dependente is NULL', () => {
    component.formGroup?.get('ideTrab.dependente').setValue(null);
    expect(component.dependents.length).toEqual(0);
  });

  describe('isV1 getter', () => {
    it('should return TRUE if is v1', () => {
      component.version = ESocialVersionEnum.v1;

      const result = component.isV1;

      expect(result).toBeTrue();
    });

    it('should return FALSE if version is not v1', () => {
      component.version = null;

      const result = component.isV1;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredIdeTrabCondicionalFields getter', () => {
    it('should return TRUE when none of the "infoContr" items have indContr as "S"', () => {
      component.formGroup.get('ideTrab.infoContr').setValue([
        { indContr: OptionsAnswer.No },
        { indContr: OptionsAnswer.No },
        { indContr: OptionsAnswer.No }
      ]);
  
      const result = component.isRequiredIdeTrabCondicionalFields;
  
      expect(result).toBeTrue();
    });
  
    it('should return FALSE when at least one infoContr item has "indContr" as "S"', () => {
      component.formGroup.get('ideTrab.infoContr').setValue([
        { indContr: OptionsAnswer.No },
        { indContr: OptionsAnswer.Yes },
        { indContr: OptionsAnswer.No }
      ]);
  
      const result = component.isRequiredIdeTrabCondicionalFields;
  
      expect(result).toBeFalse();
    });
  });

  it(LaborerInformationComponent.prototype.create.name, () => {
    spyOn(component.subFormGroup, 'reset');
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    expect(component.subFormGroup.reset).toHaveBeenCalled();
    expect(component.isSelected).toBeTrue();
    expect(component.isEdit).toBeFalse();
  });

  it('createSubFormGroup should call fb.group', () => {
    spyOn(fb, 'group');
    component['createSubFormGroup']();
    expect(fb.group).toHaveBeenCalled();
  });

  describe(LaborerInformationComponent.prototype.ngOnInit.name, () => {
    it('should set version', () => {
      const mockVersion = ESocialVersionEnum.v2;

      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(mockVersion);
      component.ngOnInit();

      expect(component.version).toEqual(mockVersion);
    });

    it(`should call ${LaborerInformationComponent.prototype.transformRows.name}`, () => {
      spyOn(component, 'transformRows');
      component.ngOnInit();
      expect(component.transformRows).toHaveBeenCalled();
    });

    it(`with update value dependente should call ${LaborerInformationComponent.prototype.transformRows.name} without v2`, done => {
      component.ngOnInit();
      spyOn(component, 'transformRows').and.stub();
      component.formGroup.get('ideTrab.dependente').valueChanges.subscribe(() => {
        expect(component.transformRows).toHaveBeenCalledTimes(1);
        done();
      });
      component.formGroup.get('ideTrab.dependente').setValue('?');
    });

    it(`with update value dependente should call ${LaborerInformationComponent.prototype.transformRows.name} with v2`, done => {
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(ESocialVersionEnum.v2);
      component.ngOnInit();
      spyOn(component, 'transformRows').and.stub();
      component.formGroup.get('ideTrab.dependente').valueChanges.subscribe(() => {
        expect(component.transformRows).toHaveBeenCalledTimes(1);
        done();
      });
      component.formGroup.get('ideTrab.dependente').setValue('?');
    });

    describe('with update value excluidoERP should update property excluidoERP', () => {
      it('by "S"', done => {
        component.ngOnInit();
        component.formGroup.get('excluidoERP').valueChanges.subscribe(() => {
          expect(component.excluidoERP).toEqual(OptionsAnswer.Yes);
          done();
        });
        component.formGroup.get('excluidoERP').setValue('S');
      });

      it('by "N"', done => {
        component.ngOnInit();
        component.formGroup.get('excluidoERP').valueChanges.subscribe(() => {
          expect(component.excluidoERP).toEqual(OptionsAnswer.No);
          done();
        });
        component.formGroup.get('excluidoERP').setValue('N');
      });
    });
  });

  it(LaborerInformationComponent.prototype.ngOnDestroy.name, () => {
    component.subscriptions = [new SubscriptionMock() as unknown as Subscription];
    spyOn(component.subscriptions[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
  });

  it(LaborerInformationComponent.prototype.transformRows.name, () => {
    const dependents: Dependente[] = [
      { cpfDep: '001', tpDep: TpDepEnum.Conjuge, descDep: 'dsc01' },
      { cpfDep: '002', tpDep: TpDepEnum.CompanheiroComFilho, descDep: 'dsc02' },
      { cpfDep: '003', tpDep: TpDepEnum.Filho, descDep: 'dsc03' },
      { cpfDep: '004', tpDep: TpDepEnum.FilhoOuEnteadoUniversitário, descDep: 'dsc04' },
      { cpfDep: '006', tpDep: TpDepEnum.IrmaoNetoBisnetoSemArrimoComGuardaJudicial, descDep: 'dsc06' },
      { cpfDep: '007', tpDep: TpDepEnum.IrmaoNetoBisnetoSemArrimoUniversitario, descDep: 'dsc07' },
      { cpfDep: '009', tpDep: TpDepEnum.PaisAvosBisavos, descDep: 'dsc09' },
      { cpfDep: '010', tpDep: TpDepEnum.MenorGuardaJudicial, descDep: 'dsc10' },
      { cpfDep: '011', tpDep: TpDepEnum.PessoaIncapaz, descDep: 'dsc11' },
      { cpfDep: '012', tpDep: TpDepEnum.ExConjuge, descDep: 'dsc12' },
      { cpfDep: '099', tpDep: TpDepEnum.AgregadoOutros, descDep: 'dsc99' }];
    component.formGroup.get('ideTrab.dependente').setValue(dependents);
    component.transformRows();
    expect(component.rows.length).toEqual(dependents.length);
  });

  describe(LaborerInformationComponent.prototype.changeValueNullToCorrectType.name, () => {
    it('with descDep is NOT NULL', () => {
      component.subFormGroup.get('descDep').setValue('dsc');
      component.changeValueNullToCorrectType();
      expect(component.subFormGroup.get('descDep').value).toEqual('dsc');
    });

    it('with descDep is NULL', () => {
      component.subFormGroup.get('descDep').setValue(null);
      component.changeValueNullToCorrectType();
      expect(component.subFormGroup.value.descDep).toEqual('');
    });
  });

  it(LaborerInformationComponent.prototype.saveDependent.name, () => {
    const dependents: Dependente[] = [{ cpfDep: '001', tpDep: TpDepEnum.Conjuge, descDep: 'dsc01' }];
    component.formGroup.get('ideTrab.dependente').setValue(dependents);
    component.subFormGroup.get('cpfDep').setValue('002');
    component.subFormGroup.get('tpDep').setValue('02');
    component.subFormGroup.get('descDep').setValue('dsc02');
    component.saveDependent();
    expect(component.formGroup.get('ideTrab.dependente').value.length).toEqual(2);
  });

  it(LaborerInformationComponent.prototype.updateDependent.name, () => {
    const dependents: Dependente[] = [
      { cpfDep: '001', tpDep: TpDepEnum.Conjuge, descDep: 'dsc01' },
      { cpfDep: '099', tpDep: TpDepEnum.AgregadoOutros, descDep: 'dsc99' },
      { cpfDep: '003', tpDep: TpDepEnum.Filho, descDep: 'dsc03' }];
    component.formGroup.get('ideTrab.dependente').setValue(dependents);
    component.subFormGroup.get('cpfDep').setValue('002');
    component.subFormGroup.get('tpDep').setValue('02');
    component.subFormGroup.get('descDep').setValue('dsc02');
    component.editIndex = 1;

    component.updateDependent();
    expect(component.formGroup.get('ideTrab.dependente').value.length).toEqual(3);
    expect(component.formGroup.get('ideTrab.dependente').value[1].cpfDep).toEqual('002');
    expect(component.formGroup.get('ideTrab.dependente').value[1].tpDep).toEqual('02');
    expect(component.formGroup.get('ideTrab.dependente').value[1].descDep).toEqual('dsc02');
  });

  it(LaborerInformationComponent.prototype.clickToEditDependent.name, () => {
    const dependents: Dependente[] = [
      { cpfDep: '001', tpDep: TpDepEnum.PessoaIncapaz, descDep: 'dsc01' },
      { cpfDep: '002', tpDep: TpDepEnum.ExConjuge, descDep: 'dsc02' },
      { cpfDep: '003', tpDep: TpDepEnum.AgregadoOutros, descDep: 'dsc03' }];
    component.formGroup.get('ideTrab.dependente').setValue(dependents);
    component.rows = dependents;
    component.subFormGroup.setValue({ cpfDep: '001', tpDep: '01', descDep: 'dsc01' });
    component.editIndex = 1;

    component.clickToEditDependent(dependents[1]);
    expect(component.isEdit).toBeTrue();
    expect(component.editIndex).toEqual(1);
    expect(component.isSelected).toBeTrue();
    expect(component.subFormGroup.get('cpfDep').value).toEqual(dependents[1].cpfDep);
    expect(component.subFormGroup.get('tpDep').value).toEqual(dependents[1].tpDep);
    expect(component.subFormGroup.get('descDep').value).toEqual(dependents[1].descDep);
  });

  it(LaborerInformationComponent.prototype.deleteDependent.name, () => {
    const dependents: Dependente[] = [
      { cpfDep: '001', tpDep: TpDepEnum.Conjuge, descDep: 'dsc01' },
      { cpfDep: '002', tpDep: TpDepEnum.CompanheiroComFilho, descDep: 'dsc02' },
      { cpfDep: '003', tpDep: TpDepEnum.Filho, descDep: 'dsc03' }];
    component.formGroup.get('ideTrab.dependente').setValue(dependents);
    component.rows = dependents;

    component.deleteDependent(dependents[1]);
    expect(component.isEdit).toBeFalse();
    expect(component.isSelected).toBeFalse();
    expect(component.formGroup.get('ideTrab.dependente').value.length).toEqual(2);
    expect(component.formGroup.get('ideTrab.dependente').value[0].cpfDep).toEqual('001');
    expect(component.formGroup.get('ideTrab.dependente').value[1].cpfDep).toEqual('003');
  });

  it(LaborerInformationComponent.prototype.cancel.name, () => {
    component.isSelected = true;
    component.cancel();
    expect(component.isSelected).toBeFalse();
  });

  describe(LaborerInformationComponent.prototype.showDuplicatedNrCpfMessage.name, () => {
    it('with erros is NULL', () => {
      spyOn(component.subFormGroup, 'get').and.returnValue({ errors: null as ValidationErrors } as any);
      expect(component.showDuplicatedNrCpfMessage()).toBeUndefined();
    });

    it('with cpfEqualityInternal is FALSE', () => {
      spyOn(component.subFormGroup, 'get').and.returnValue({ errors: { cpfEqualityInternal: false } as ValidationErrors } as any);
      expect(component.showDuplicatedNrCpfMessage()).toBeFalse();
    });

    it('with cpfDep is EMPTY', () => {
      spyOn(component.subFormGroup, 'get').and.returnValue({ errors: { cpfEqualityInternal: true }, value: '' } as any);
      expect(component.showDuplicatedNrCpfMessage()).toBeFalse();
    });

    it('with cpfDep is NULL', () => {
      spyOn(component.subFormGroup, 'get').and.returnValue({ errors: { cpfEqualityInternal: true }, value: null } as any);
      expect(component.showDuplicatedNrCpfMessage()).toBeFalse();
    });

    it('with cpfDep is FILLED', () => {
      spyOn(component.subFormGroup, 'get').and.returnValue({ errors: { cpfEqualityInternal: true }, value: '001' } as any);
      expect(component.showDuplicatedNrCpfMessage()).toBeTrue();
    });
  });

  describe('validateNrCpfSame', () => {
    let nrCpf: AbstractControl = new AbstractControlMock as unknown as AbstractControl;

    beforeEach(() => {
      component.isEditMode = false;
      component.isEdit = false;
    });

    it('with formGroup is null', () => {
      component.formGroup = null;
      expect(component['validateNrCpfSame'](nrCpf)).toBeNull();
    });

    it('with duplicate NrInsc', () => {
      nrCpf.setValue('11111111111');
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('11111111111');
      expect(component['validateNrCpfSame'](nrCpf).cpfEqualityInternal).toBeTrue();
    });

    it('with duplicate NrCpf and cpfTrab', () => {
      nrCpf.setValue('11111111111');
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('');
      component.formGroup.get('ideTrab.cpfTrab').setValue('11111111111');
      expect(component['validateNrCpfSame'](nrCpf).cpfEqualityInternal).toBeTrue();
    });

    it('with duplicate NrCpf and cpfDep', () => {
      nrCpf.setValue('11111111111');
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('');
      component.formGroup.get('ideTrab.cpfTrab').setValue('');
      component.formGroup.get('ideTrab.dependente').setValue([{ cpfDep: '11111111111' }])
      expect(component['validateNrCpfSame'](nrCpf).cpfEqualityInternal).toBeTrue();
    });

    it('with no duplicate', () => {
      nrCpf.setValue('11111111111');
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('');
      component.formGroup.get('ideTrab.cpfTrab').setValue('');
      component.formGroup.get('ideTrab.dependente').setValue([{ cpfDep: '' }])
      expect(component['validateNrCpfSame'](nrCpf)).toBeNull();
    });
  });

  describe('updateNmTrabValidity', () => {
    it('should update "nmTrab" errors when "ideTrab" condicional fields is required', () => {
      const expectedErrors = { isRequiredNmTrab: true };
      
      spyOnProperty(component, 'isRequiredIdeTrabCondicionalFields').and.returnValue(true);
      
      component['updateNmTrabValidity']();
      
      expect(component.formGroup.get('ideTrab.nmTrab').errors).toEqual(expectedErrors);
    });
  
    it('should remove "nmTrab" errors when "ideTrab" condicional fields is NOT required', () => {
      spyOnProperty(component, 'isRequiredIdeTrabCondicionalFields').and.returnValue(false);
      
      component['updateNmTrabValidity']();
      
      expect(component.formGroup.get('ideTrab.nmTrab').errors).toBeNull();
    });
  });

  describe('updateDtNasctoValidity', () => {
    it('should update "dtNascto" errors when "ideTrab" condicional fields is required', () => {
      const expectedErrors = { isRequiredDtNascto: true };
      
      spyOnProperty(component, 'isRequiredIdeTrabCondicionalFields').and.returnValue(true);
      
      component['updateDtNasctoValidity']();
      
      expect(component.formGroup.get('ideTrab.dtNascto').errors).toEqual(expectedErrors);
    });
  
    it('should remove "dtNascto" errors when "ideTrab" condicional fields is NOT required', () => {
      spyOnProperty(component, 'isRequiredIdeTrabCondicionalFields').and.returnValue(false);
      
      component['updateDtNasctoValidity']();
      
      expect(component.formGroup.get('ideTrab.dtNascto').errors).toBeNull();
    });
  });
});
