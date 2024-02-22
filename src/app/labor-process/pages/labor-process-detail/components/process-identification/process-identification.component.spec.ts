import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { DocumentTypeEnum, OptionsAnswer, OrigemEnum, TpCCPEnum, TpInscEnum } from '../../../../../models/labor-process.model';
import { FormUtils } from '../../../../validators/form-utils';
import { CustomValidators } from '../../../../validators/custom-validators';
import { ProcessIdentificationComponent } from './process-identification.component';

describe(ProcessIdentificationComponent.name, () => {
  let component: ProcessIdentificationComponent;

  let fb: UntypedFormBuilder;

  beforeEach(() => {
    component = new ProcessIdentificationComponent();

    fb = new UntypedFormBuilder();

    component.formGroup = fb.group({
      excluidoERP: [null],
      infoProcesso: fb.group({
        ideResp: fb.group({
          tpInsc: [null],
          nrInsc: [null]
        }),
        nrProcTrab: [null],
        dadosCompl: fb.group({
          infoCCP: fb.group({
            tpCCP: [null],
          }),
        }),
        origem: [null],
      }),
    });
  });

  describe(ProcessIdentificationComponent.prototype.ngOnInit.name, () => {
    it('should excluidoERP equal to OptionsAnswer.Yes and maskNrInsc is equal to "99.999.999/9999-99"', () => {
      component.ngOnInit();
      const subscription = component.formGroup.valueChanges.subscribe(() => {
        expect(component.excluidoERP).toEqual(OptionsAnswer.Yes);
        expect(component.maskNrInsc).toEqual('99.999.999/9999-99');
      });
      component.formGroup.patchValue({ excluidoERP: 'S', infoProcesso: { ideResp: { tpInsc: 1, nrInsc: '' }, nrProcTrab: null } });
      subscription.unsubscribe();
    });

    it('should excluidoERP equal to OptionsAnswer.No and maskNrInsc is equal to "999.999.999-99"', () => {
      component.ngOnInit();
      const subscription = component.formGroup.valueChanges.subscribe(() => {
        expect(component.excluidoERP).toEqual(OptionsAnswer.No);
        expect(component.maskNrInsc).toEqual('999.999.999-99');
      });
      component.formGroup.patchValue({ excluidoERP: 'N', infoProcesso: { ideResp: { tpInsc: 2, nrInsc: '' }, nrProcTrab: null } });
      subscription.unsubscribe();
    });
  });

  describe(ProcessIdentificationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.ngOnInit();
      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
      })

      component.ngOnDestroy();

      component.subscriptions.forEach(subscription => {
        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
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

  describe('isDisabledInfoProcJud getter', () => {
    it('should return TRUE if origem is NOT "1"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.demandaSubm);

      const result = component.isDisabledInfoProcJud;

      expect(result).toBeTrue();
    });

    it('should return FALSE if origem is "1"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.procJud);

      const result = component.isDisabledInfoProcJud;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledInfoCCP getter', () => {
    it('should return TRUE if origem is NOT "2"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.procJud);

      const result = component.isDisabledInfoCCP;

      expect(result).toBeTrue();
    });

    it('should return FALSE if origem is "2"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.demandaSubm);

      const result = component.isDisabledInfoCCP;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredCnpjCCP getter', () => {
    it('should return TRUE if "tpCCP" is in [CCPAmbitoSindicato, NINTER]', () => {
      const tpCCP = TpCCPEnum.CCPAmbitoSindicato;

      component.formGroup.get('infoProcesso.dadosCompl.infoCCP.tpCCP').setValue(tpCCP);

      const result = component.isRequiredCnpjCCP;

      expect(result).toBeTrue();
    });

    it('should return TRUE if "tpCCP" is NOT in [CCPAmbitoSindicato, NINTER]', () => {
      const tpCCP = TpCCPEnum.CCPAmbitoEmpresa;

      component.formGroup.get('infoProcesso.dadosCompl.infoCCP.tpCCP').setValue(tpCCP);

      const result = component.isRequiredCnpjCCP;

      expect(result).toBeFalse();
    });
  });

  describe('origem getter', () => {
    it('should return "origem" value', () => {
      const origem = OrigemEnum.demandaSubm;

      component.formGroup.get('infoProcesso.origem').setValue(origem);

      const result = component.origem;

      expect(result).toEqual(origem);
    });
  });

  describe('fieldLengthNrProcTrab getter', () => {
    it('should return 20 if origem is "procJud"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.procJud);

      const result = component.fieldLengthNrProcTrab;

      expect(result).toBe(20);
    });

    it('should return 15 if origem is NOT "procJud"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.demandaSubm);

      const result = component.fieldLengthNrProcTrab;

      expect(result).toBe(15);
    });
  });

  describe('fieldLengthNrProcTrab getter', () => {
    it('should return message for 20 characters if origem is "procJud"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.procJud);

      const result = component.tooltipMessageNrProcTrab;

      expect(result).toBe('Este campo deve ser preenchido com 20 caracteres');
    });

    it('should return message for 15 characters if origem is NOT "procJud"', () => {
      spyOnProperty(component, 'origem').and.returnValue(OrigemEnum.demandaSubm);

      const result = component.tooltipMessageNrProcTrab;

      expect(result).toBe('Este campo deve ser preenchido com 15 caracteres');
    });
  });

  describe('maskNrInsc getter', () => {
    it('should return CNPJ mask if "tpInsc" is "Cnpj"', () => {
      const tpInsc = TpInscEnum.Cnpj;

      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(tpInsc);

      const result = component.maskNrInsc;

      expect(result).toBe('99.999.999/9999-99');
    });

    it('should return CPF mask if "tpInsc" is NOT "Cnpj"', () => {
      const tpInsc = TpInscEnum.Cpf;

      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(tpInsc);

      const result = component.maskNrInsc;

      expect(result).toBe('999.999.999-99');
    });
  });

  describe(ProcessIdentificationComponent.prototype.changeTpInsc.name, () => {
    it('should setValidators with CNPJ and not CPF', () => {
      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(TpInscEnum.Cnpj);
      component.changeTpInsc();

      expect(
        component.formGroup.get('infoProcesso.ideResp.nrInsc').hasValidator(CustomValidators.cnpj)
        ).toBeTrue();
      expect(
        component.formGroup.get('infoProcesso.ideResp.nrInsc').hasValidator(CustomValidators.cpf)
        ).toBeFalse();
    });

    it('should setValidators with CPF and not CNPJ', () => {
      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(TpInscEnum.Cpf);
      component.changeTpInsc();

      expect(
        component.formGroup.get('infoProcesso.ideResp.nrInsc').hasValidator(CustomValidators.cpf)
        ).toBeTrue();
      expect(
        component.formGroup.get('infoProcesso.ideResp.nrInsc').hasValidator(CustomValidators.cnpj)
        ).toBeFalse();
    });
  });

  describe(ProcessIdentificationComponent.prototype.handleChangeOrigem.name, () => {
    it('should reset infoProcesso.nrProcTrab when changing "origem"' , () => {
      component.ngOnInit();

      component.formGroup.get('infoProcesso.origem').setValue(1);
      spyOn(component, 'handleChangeOrigem');

      component.formGroup.get('infoProcesso.origem').setValue(2);
      expect(component.handleChangeOrigem).toHaveBeenCalled();
   });

    it('should not reset infoProcesso.nrProcTrab when not changing "origem"', () => {
      component.ngOnInit();

      component.formGroup.get('infoProcesso.origem').setValue(1);
      spyOn(component, 'handleChangeOrigem');

      component.formGroup.get('infoProcesso.origem').setValue(1);
      expect(component.handleChangeOrigem).not.toHaveBeenCalled();
    });
  });
});
