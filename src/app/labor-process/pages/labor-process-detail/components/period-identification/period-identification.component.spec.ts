import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { CodCategEnum, GrauExpEnum, IdePeriodo, OptionsAnswer } from '../.../../../../../../models/labor-process.model';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { PoNotificationServiceMock } from '../../../../../../util/test/mock/po-components/po-notification-service.mock';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { PeriodIdentificationComponent } from './period-identification.component';

describe(PeriodIdentificationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let notificationService: PoNotificationService;

  let component: PeriodIdentificationComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;
    notificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;

    component = new PeriodIdentificationComponent(fb, laborProcessDataStateService, notificationService);

    component.mainFormGroup = fb.group({
      excluidoERP: [null]
    });

    component.currentFormGroup = fb.group({
      codCateg: [null],
      ideEstab: fb.group({
        infoVlr: fb.group({
          compIni: [null],
          compFim: [null],
          repercProc: [null],
          idePeriodo: fb.control([])
        })
      })
    });

    component.subFormGroup = component['createSubFormGroup']();
  });

  describe(PeriodIdentificationComponent.prototype.ngOnInit.name, () => {
    it('should actions is [ver]', async () => {
      component.excluidoERP = OptionsAnswer.Yes;
      component.ngOnInit();
      expect(component.actions.length).toEqual(1);
      expect(component.actions[0].label).toEqual('Ver');

      spyOn(component.subFormGroup, 'disable').and.stub();
      const subscription = component.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
        expect(component.actions.length).toEqual(2);
        expect(component.actions[0].label).toEqual('Editar');
        expect(component.actions[1].label).toEqual('Excluir');
        expect(component.subFormGroup.disable).not.toHaveBeenCalled();
      });
      component.mainFormGroup.get('excluidoERP').setValue("N");
      subscription.unsubscribe();
    });

    it('should actions is [Editar, Excluir]', async () => {
      component.excluidoERP = OptionsAnswer.No;
      component.ngOnInit();
      expect(component.actions.length).toEqual(2);
      expect(component.actions[0].label).toEqual('Editar');
      expect(component.actions[1].label).toEqual('Excluir');

      spyOn(component.subFormGroup, 'disable').and.stub();
      const subscription = component.mainFormGroup.get('excluidoERP').valueChanges.subscribe(() => {
        expect(component.actions.length).toEqual(1);
        expect(component.actions[0].label).toEqual('Ver');
        expect(component.subFormGroup.disable).toHaveBeenCalled();
      });
      component.mainFormGroup.get('excluidoERP').setValue("S");
      subscription.unsubscribe();
    });
  });

  it(PeriodIdentificationComponent.prototype.ngOnDestroy.name, () => {
    component.subscription = new SubscriptionMock() as unknown as Subscription;
    spyOn(component.subscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  describe('isRequiredPerRef getter', () => {
    it('should return TRUE when "isV1" is TRUE and "repercProc" is 1', () => {
      component.currentFormGroup.get('ideEstab.infoVlr.repercProc').setValue(1);
      spyOnProperty(component, 'isV1').and.returnValue(true);
  
      const result = component.isRequiredPerRef;
  
      expect(result).toBeTrue();
    });
  
    it('should return FALSE when "isV1" is FALSE', () => {
      spyOnProperty(component, 'isV1').and.returnValue(false);
  
      const result = component.isRequiredPerRef;
  
      expect(result).toBeFalse();
    });
  
    it('should return FALSE when "repercProc" is not 1', () => {
      component.currentFormGroup.get('ideEstab.infoVlr.repercProc').setValue(2);
      spyOnProperty(component, 'isV1').and.returnValue(true);
  
      const result = component.isRequiredPerRef;
  
      expect(result).toBeFalse();
    });
  });

  describe('isRequiredGrauExp getter', () => {
    it('should return TRUE when "codCateg" is a required one', () => {
      component.currentFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoGeral);

      const result = component.isRequiredGrauExp;

      expect(result).toBeTrue();
    });
  
    it('should return FALSE when "codCateg" is not a required one', () => {
      component.currentFormGroup.get('codCateg').setValue(CodCategEnum.Bolsista);

      const result = component.isRequiredGrauExp;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredV1InfoFGTSFields getter', () => {
    it('should return TRUE when at least one required field has a value', () => {
      component.subFormGroup.get('infoFGTS.vrBcFgtsGuia').setValue(0.01);

      const result = component.isRequiredV1InfoFGTSFields;

      expect(result).toBeTrue();
    });

    it('should return FALSE when all required fields are NULL', () => {
      component.subFormGroup.get('infoFGTS.vrBcFgtsGuia').setValue(null);
      component.subFormGroup.get('infoFGTS.vrBcFgts13Guia').setValue(null);
      component.subFormGroup.get('infoFGTS.pagDireto').setValue(null);

      const result = component.isRequiredV1InfoFGTSFields;

      expect(result).toBeFalse();
    });
  });
  
  describe('isRequiredVrBcFGTSProcTrab getter', () => {
    it('should return true when at least one required field has a value', () => {
      component.subFormGroup.get('infoFGTS.vrBcFGTSSefip').setValue(0.42);

      const result = component.isRequiredVrBcFGTSProcTrab;

      expect(result).toBeTrue();
    });

    it('should return false when all required fields are NULL', () => {
      component.subFormGroup.get('infoFGTS.vrBcFGTSSefip').setValue(null);
      component.subFormGroup.get('infoFGTS.vrBcFGTSDecAnt').setValue(null);

      const result = component.isRequiredVrBcFGTSProcTrab;

      expect(result).toBeFalse();
    });
  });

  describe('baseCalculoSubtitle getter', () => {
    it('should return correct text when is v1', () => {
      const expectedText = 'Bases de cálculo de contribuição previdenciária e FGTS decorrentes de processo trabalhista e ainda não declaradas';

      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.baseCalculoSubtitle;

      expect(result).toEqual(expectedText);
    });

    it('should return correct text when NOT is v1', () => {
      const expectedText = 'Bases de cálculo de contribuição previdenciária decorrentes de processo trabalhista e ainda não declaradas';

      spyOnProperty(component, 'isV1').and.returnValue(false);

      const result = component.baseCalculoSubtitle;

      expect(result).toEqual(expectedText);
    });
  });

  it('formArray getter', () => {
    component.currentFormGroup = null;
    expect(component.formArray).toBeUndefined();
    component.currentFormGroup = fb.group({ ideTrab: [null] });
    expect(component.formArray).toBeDefined();
  });

  it(PeriodIdentificationComponent.prototype.create.name, () => {
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    expect(component.isSelected).toBeTrue();
    expect(component.isEdit).toBeFalse();
  });

  it(PeriodIdentificationComponent.prototype.cancel.name, () => {
    component.isSelected = true;
    component.cancel();
    expect(component.isSelected).toBeFalse();
  });

  it('createSubFormGroup', () => {
    spyOn(fb, 'group').and.stub();
    component['createSubFormGroup']();
    expect(fb.group).toHaveBeenCalled();
  });

  it(PeriodIdentificationComponent.prototype.clickToEditPeriod.name, () => {
    const rows: IdePeriodo[] = [{
      perRef: 'pRef1',
      baseCalculo: {
        vrBcCpMensal: 0.01,
        vrBcCp13: 0.01,
        vrBcFgts: 0.01,
        vrBcFgts13: 0.01,
        infoAgNocivo: {
          grauExp: GrauExpEnum.ensejadorAponEsp06,
        },
      },
      infoFGTS: {
        vrBcFgtsGuia: 0.01,
        vrBcFgts13Guia: 0.01,
        pagDireto: OptionsAnswer.No,
        vrBcFGTSProcTrab: 0.01,
        vrBcFGTSSefip: 0.01,
        vrBcFGTSDecAnt: 0.01,
      },
      baseMudCateg: {
        codCateg: CodCategEnum.ContribuinteIndivTransportadorAP,
        vrBcCPrev: 0.01,
      }
    },
    {
      perRef: 'pRef2',
      baseCalculo: {
        vrBcCpMensal: 0.01,
        vrBcCp13: 0.01,
        vrBcFgts: 0.01,
        vrBcFgts13: 0.01,
        infoAgNocivo: {
          grauExp: GrauExpEnum.ensejadorAponEsp09,
        },
      },
      infoFGTS: {
        vrBcFgtsGuia: 0.02,
        vrBcFgts13Guia: 0.02,
        pagDireto: OptionsAnswer.No,
        vrBcFGTSProcTrab: 0.02,
        vrBcFGTSSefip: 0.02,
        vrBcFGTSDecAnt: 0.02,
      },
      baseMudCateg: {
        codCateg: CodCategEnum.ContrVerdeAmareloComAcordo,
        vrBcCPrev: 0.02,
      }
    }];

    component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').patchValue(rows);

    component.clickToEditPeriod(rows[1]);
    expect(component.isEdit).toBeTrue();
    expect(component.editIndex).toEqual(1);
    expect(component.isSelected).toBeTrue();
    expect(component.subFormGroup.get('perRef').value).toEqual('pRef2');
  });

  it(PeriodIdentificationComponent.prototype.savePeriod.name, () => {
    const rows = [{
      perRef: 'pRef1',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any];

    component.subFormGroup.patchValue({
      perRef: 'pRef2',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any);

    component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').patchValue(rows);

    component.savePeriod();
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value.length).toEqual(2);
  });

  it(PeriodIdentificationComponent.prototype.updatePeriod.name, () => {
    const rows = [{
      perRef: 'pRef1',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any,
    {
      perRef: 'pRefN',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any];

    component.subFormGroup.patchValue({
      perRef: 'pRef2',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any);

    component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').patchValue(rows);
    component.editIndex = 1;

    component.updatePeriod();
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value.length).toEqual(2);
    expect(component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value[1].perRef).toEqual('pRef2');
  });

  it(PeriodIdentificationComponent.prototype.deletePeriod.name, () => {
    const rows = [{
      perRef: 'pRef1',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any,
    {
      perRef: 'pRef2',
      baseCalculo: null,
      infoFGTS: null,
      baseMudCateg: null
    } as any];

    component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').patchValue(rows);

    component.deletePeriod(rows[1]);
    expect(component.isSelected).toBeFalse();
    expect(component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value.length).toEqual(1);
    expect(component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').value[0].perRef).toEqual('pRef1');
  });

  describe(PeriodIdentificationComponent.prototype.verifyPeriodInterval.name, () => {
    const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should null or undefined', () => {
      control.setValue('06/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue(null);
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue(null);
      expect(component.verifyPeriodInterval(control)).toBeNull();

      control.setValue(null);
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue('01/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue('12/2000');
      expect(component.verifyPeriodInterval(control)).toBeNull();

      control.setValue('06/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue('01/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue('12/2000');
      expect(component.verifyPeriodInterval(control)).toBeNull();

      component.currentFormGroup = null;
      expect(component.verifyPeriodInterval(control)).toBeNull();
    });

    it('should result is equal to { invalidPeriod: true }', () => {
      control.setValue('12/1999');
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue('01/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue('12/2000');
      expect(component.verifyPeriodInterval(control).invalidPeriod).toBeTrue();

      control.setValue('01/2001');
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue('01/2000');
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue('12/2000');
      expect(component.verifyPeriodInterval(control).invalidPeriod).toBeTrue();
    });
  });

  describe(PeriodIdentificationComponent.prototype.verifyDuplicatePeriod.name, () => {
    const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should null or undefined', () => {
      component.currentFormGroup?.get('ideEstab.infoVlr.idePeriodo').setValue([{ perRef: '2' }]);
      control.setValue('1');
      expect(component.verifyDuplicatePeriod(control)).toBeNull();

      control.setValue(null);
      expect(component.verifyDuplicatePeriod(control)).toBeNull();

      component.currentFormGroup?.get('ideEstab.infoVlr.idePeriodo').setValue(null);
      expect(component.verifyDuplicatePeriod(control)).toBeNull();

      component.isEdit = true;
      expect(component.verifyDuplicatePeriod(control)).toBeNull();

      component.isEdit = false;
      component.subFormGroup = null;
      expect(component.verifyDuplicatePeriod(control)).toBeNull();
    });

    it('should result is equal to { duplicatedPeriod: true }', () => {
      component.currentFormGroup?.get('ideEstab.infoVlr.idePeriodo').setValue([{ perRef: '2' }]);
      control.setValue('2');
      expect(component.verifyDuplicatePeriod(control).duplicatedPeriod).toBeTrue();
    });
  });
});
