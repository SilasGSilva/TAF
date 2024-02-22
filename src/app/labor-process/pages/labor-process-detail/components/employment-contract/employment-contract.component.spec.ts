import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Abono, DocumentTypeEnum, IndRepercEnum, OptionsAnswer, IdePeriodo, TypeContract } from '../../../../../../app/models/labor-process.model';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { FormUtils } from '../../../../validators/form-utils';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { CustomValidators } from '../../../../validators/custom-validators';
import { EmploymentContractComponent } from './employment-contract.component';

describe(EmploymentContractComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;

  let component: EmploymentContractComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = (new LaborProcessDataStateServiceMock() as unknown) as LaborProcessDataStateService;

    component = new EmploymentContractComponent(laborProcessDataStateService);
    component.mainFormGroup = fb.group({
      excluidoERP: [null],
    });
    component.currentFormGroup = fb.group({
      tpContr: [null],
      indContr: [null],
      indUnic: [null],
      matricula: [null],
      codCateg: [null],
      dtInicio: [null],
      dtAdmOrig: [null],
      mudCategAtiv: [null],
      indCateg: [null],
      indNatAtiv: [null],
      indMotDeslig: [null],
      ideEstab: fb.group({
        tpInsc: [null],
        nrInsc: [null],
        infoVlr: fb.group({
          compIni: [null],
          compFim: [null],
          indReperc: [null],
          indenAbono: [null],
          abono: fb.control([]),
          repercProc: [null],
          vrRemun: [null],
          vrAPI: [null],
          vr13API: [null],
          vrInden: [null],
          vrBaseIndenFGTS: [null],
          pagDiretoResc: [null],
          idePeriodo: fb.control([]),
        }),
      }),
      ideTrab: fb.group({ dtNascto: [null] }),
      infoCompl: fb.group({
        codCBO: [null],
        natAtividade: [null],
        infoTerm: fb.group({
          dtTerm: [null],
          mtvDesligTSV: [null],
        }),
        remuneracao: [null],
        infoVinc: fb.group({
          tpRegTrab: [null],
          tpRegPrev: [null],
          dtAdm: [null],
          tmpParc: [null],
          duracao: fb.group({
            tpContr: [null],
            dtTerm: [null],
            clauAssec: [null],
            objDet: [null],
          }),
          sucessaoVinc: fb.group({
            tpInsc: [null],
            nrInsc: [null],
            matricAnt: [null],
            dtTransf: [null],
          }),
          infoDeslig: fb.group({
            dtDeslig: [null],
            mtvDeslig: [null],
            dtProjFimAPI: [null],
          }),
          observacoes: [null],
        }),
      }),
    });
  });

  describe(EmploymentContractComponent.prototype.ngOnInit.name, () => {
    it('should add all of subscriptions', () => {
      const totalSubscriptions = 14;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    const validityFunctionsWithFields = {
      updateValidityDtInicio: ['tpContr', 'indContr', 'dtInicio'],
      handleChangesIndContr: ['indContr'],
      handleChangesIndCateg: ['indCateg'],
      handleChangesIndNatAtiv: ['indNatAtiv'],
      updateValidityIdePeriodo: ['ideEstab.infoVlr.idePeriodo', 'ideEstab.infoVlr.repercProc', 'ideEstab.infoVlr.indReperc'],
      updateValidityAbono: ['ideEstab.infoVlr.indenAbono'],
      updateValidityCodCateg: ['indContr', 'matricula'],
      updateValidityMatricula: ['indUnic'],
    };

    Object.entries(validityFunctionsWithFields).forEach(
      ([validationFunction, fields]) => {
        describe(`should invoke ${validationFunction} validation`, () => {
          fields.forEach((field: string) => {
            it(`when ${field} field changes`, () => {
              spyOn<any>(component, validationFunction);

              component.ngOnInit();
              component.currentFormGroup.get(field).setValue('mockValue');

              expect(component[validationFunction]).toHaveBeenCalled();
            });
          });
        });
      }
    );
  });

  it(EmploymentContractComponent.prototype.ngOnDestroy.name, () => {
    component.subscriptions = [
      (new SubscriptionMock() as unknown) as Subscription,
    ];
    spyOn(component.subscriptions[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
  });

  describe('isRequiredCodCateg getter', () => {
    it('should return TRUE when indContr is "No" and matricula is FALSY', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('matricula').setValue(null);

      const result = component.isRequiredCodCateg;

      expect(result).toBeTrue();
    });

    it('should return TRUE when indContr is "No" and matricula is TRUTHY', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.No);
      component.currentFormGroup.get('matricula').setValue('ABC123');

      const result = component.isRequiredCodCateg;

      expect(result).toBeTrue();
    });

    it('should return TRUE when indContr is not "No" and matricula is FALSY', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('matricula').setValue('');

      const result = component.isRequiredCodCateg;

      expect(result).toBeTrue();
    });

    it('should return FALSE when indContr is not "No" and matricula is TRUTHY', () => {
      component.currentFormGroup.get('indContr').setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('matricula').setValue('ABC123');

      const result = component.isRequiredCodCateg;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredMatricula getter', () => {
    it('should return TRUE when "indUnic" is "S"', () => {
      component.currentFormGroup.get('indUnic').setValue(OptionsAnswer.Yes);

      const result = component.isRequiredMatricula;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "indUnic" is not "S"', () => {
      component.currentFormGroup.get('indUnic').setValue(OptionsAnswer.No);

      const result = component.isRequiredMatricula;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledBondsOrContracts getter', () => {
    it('should return TRUE when when at least one of the conditions is met', () => {
      component.currentFormGroup.get('tpContr').setValue(null);

      const result = component.isDisabledBondsOrContracts;

      expect(result).toBeTrue();
    });

    it('should return FALSE when when at least one of the conditions is met in V2', () => {
      component.currentFormGroup.get('tpContr').setValue(9);
      spyOnProperty(component, 'isV1').and.returnValue(false);

      const result = component.isDisabledBondsOrContracts;

      expect(result).toBeFalse();
    });

    it('should return FALSE when none of the conditions are met in V1', () => {
      component.currentFormGroup.get('tpContr').setValue('mockValue');
      component.currentFormGroup.get('indUnic').setValue('S');
      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.isDisabledBondsOrContracts;

      expect(result).toBeFalse();
    });

    it('should return FALSE when none of the conditions are met in V1', () => {
      component.currentFormGroup.get('tpContr').setValue('mockValue');
      component.currentFormGroup.get('indUnic').setValue('N');
      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.isDisabledBondsOrContracts;

      expect(result).toBeTrue();
    });
  });

  describe('isDisabledPeriodIdentification getter', () => {
    it('should return TRUE when any of the conditions are met', () => {
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue(null);

      const result = component.isDisabledPeriodIdentification;

      expect(result).toBeTrue();
    });

    it('should return FALSE when none of the conditions are met', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.compIni')
        .setValue('AlgumValor');
      component.currentFormGroup
        .get('ideEstab.infoVlr.compFim')
        .setValue('AlgumValor');
      spyOnProperty(component, 'isV1').and.returnValue(true);
      component.currentFormGroup
        .get('ideEstab.infoVlr.repercProc')
        .setValue('AlgumValor');
      component.currentFormGroup.get('ideEstab.infoVlr.vrInden').setValue(100);
      component.currentFormGroup.get('ideEstab.infoVlr.vr13API').setValue(200);
      component.currentFormGroup.get('ideEstab.infoVlr.vrAPI').setValue(300);
      component.currentFormGroup.get('ideEstab.infoVlr.vrRemun').setValue(400);

      const result = component.isDisabledPeriodIdentification;

      expect(result).toBeFalse();
    });
  });

  describe(
    EmploymentContractComponent.prototype.updateDisabledInputs.name,
    () => {
      beforeEach(() => {
        spyOnProperty(component, 'isV1').and.returnValue(true);

        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.vrRemun'),
          'disable'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.vrAPI'),
          'disable'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.vr13API'),
          'disable'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.vrInden'),
          'disable'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS'),
          'disable'
        );
      });

      it('and excluidoERP equals to "N"', () => {
        component.excluidoERP = OptionsAnswer.No;
        component.updateDisabledInputs();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrRemun').disable
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrAPI').disable
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vr13API').disable
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrInden').disable
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS')
            .disable
        ).not.toHaveBeenCalled();
      });

      it('and excluidoERP equals to "S"', () => {
        component.excluidoERP = OptionsAnswer.Yes;
        component.updateDisabledInputs();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrRemun').disable
        ).toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrAPI').disable
        ).toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vr13API').disable
        ).toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrInden').disable
        ).toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.vrBaseIndenFGTS')
            .disable
        ).toHaveBeenCalled();
      });
    }
  );

  describe(EmploymentContractComponent.prototype.validateCompIni.name, () => {
    let compIniControl: AbstractControl<
      any,
      any
    > = (new AbstractControlMock() as unknown) as AbstractControl;

    beforeEach(() => {
      spyOn(compIniControl, 'setErrors');
      spyOn(FormUtils, 'getFormControl').and.returnValue(compIniControl);
    });

    describe('with dtAdmOrig is not null', () => {
      describe('and tpContr equals to TrabalhadorComVincSemAlt', () => {
        it('with compIni less than dtAdmOrig another year', () => {
          component.currentFormGroup.get('dtAdmOrig').setValue('9999-99-99');
          component.currentFormGroup
            .get('ideEstab.infoVlr.compIni')
            .setValue('8888-88-88');
          component.currentFormGroup
            .get('tpContr')
            .setValue(TypeContract.TrabalhadorComVincSemAlt);
          component.validateCompIni();
          expect(compIniControl.setErrors).toHaveBeenCalled();
        });

        it('with compIni less than dtAdmOrig same year', () => {
          component.currentFormGroup.get('dtAdmOrig').setValue('9999-99-99');
          component.currentFormGroup
            .get('ideEstab.infoVlr.compIni')
            .setValue('9999-88-88');
          component.currentFormGroup
            .get('tpContr')
            .setValue(TypeContract.TrabalhadorComVincSemAlt);
          component.validateCompIni();
          expect(compIniControl.setErrors).toHaveBeenCalled();
        });
      });

      describe('and tpContr equals to TrabalhadorComVincComAlt or EmpregadoComReconhecimentoVinc or TrabalhadorComVincComAltData', () => {
        [
          TypeContract.TrabalhadorComVincComAlt,
          TypeContract.EmpregadoComReconhecimentoVinc,
          TypeContract.TrabalhadorComVincComAltData,
        ].forEach(typeContract => {
          it('with years not equals', () => {
            component.currentFormGroup.get('dtAdmOrig').setValue('9999-99-99');
            component.currentFormGroup
              .get('ideEstab.infoVlr.compIni')
              .setValue('8888-99-99');
            component.currentFormGroup
              .get('tpContr')
              .setValue(TypeContract.TrabalhadorComVincSemAlt);
            component.validateCompIni();
            expect(compIniControl.setErrors).toHaveBeenCalled();
          });

          it('with years equals and months not equals', () => {
            component.currentFormGroup.get('dtAdmOrig').setValue('9999-99-99');
            component.currentFormGroup
              .get('ideEstab.infoVlr.compIni')
              .setValue('9999-88-88');
            component.currentFormGroup
              .get('tpContr')
              .setValue(TypeContract.TrabalhadorComVincSemAlt);
            component.validateCompIni();
            expect(compIniControl.setErrors).toHaveBeenCalled();
          });
        });
      });
    });

    describe('with dtInicio is not null', () => {
      describe('and TypeContract equals to TrabSemVinculo', () => {
        it('with compIni less than dtAdmOrig another year', () => {
          component.currentFormGroup.get('dtInicio').setValue('9999-99-99');
          component.currentFormGroup
            .get('ideEstab.infoVlr.compIni')
            .setValue('8888-88-88');
          component.currentFormGroup
            .get('tpContr')
            .setValue(TypeContract.TrabSemVinculo);
          component.validateCompIni();
          expect(compIniControl.setErrors).toHaveBeenCalled();
        });

        it('with compIni less than dtAdmOrig same year', () => {
          component.currentFormGroup.get('dtInicio').setValue('9999-99-99');
          component.currentFormGroup
            .get('ideEstab.infoVlr.compIni')
            .setValue('9999-88-88');
          component.currentFormGroup
            .get('tpContr')
            .setValue(TypeContract.TrabSemVinculo);
          component.validateCompIni();
          expect(compIniControl.setErrors).toHaveBeenCalled();
        });
      });
    });

    it('with dtAdmOrig, dtInicio is null', () => {
      component.currentFormGroup.get('dtAdmOrig').setValue(null);
      component.currentFormGroup.get('dtInicio').setValue(null);
      component.validateCompFim();
      expect(compIniControl.setErrors).not.toHaveBeenCalled();
    });
  });

  describe(EmploymentContractComponent.prototype.validateCompFim.name, () => {
    let compFimControl: AbstractControl<
      any,
      any
    > = (new AbstractControlMock() as unknown) as AbstractControl;

    beforeEach(() => {
      spyOn(compFimControl, 'setErrors');
      spyOn(FormUtils, 'getFormControl').and.returnValue(compFimControl);
    });

    describe('with compFim and dtIni is not nulls', () => {
      it('with compFim < compIni another year', () => {
        component.currentFormGroup
          .get('ideEstab.infoVlr.compFim')
          .setValue('8888-88-88');
        component.currentFormGroup
          .get('ideEstab.infoVlr.compIni')
          .setValue('9999-99-99');
        component.currentFormGroup
          .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
          .setValue(null);
        component.validateCompFim();
        expect(compFimControl.setErrors).toHaveBeenCalled();
      });

      it('with compFim < compIni and same year', () => {
        component.currentFormGroup
          .get('ideEstab.infoVlr.compFim')
          .setValue('9999-88-88');
        component.currentFormGroup
          .get('ideEstab.infoVlr.compIni')
          .setValue('9999-99-99');
        component.currentFormGroup
          .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
          .setValue(null);
        component.validateCompFim();
        expect(compFimControl.setErrors).toHaveBeenCalled();
      });
    });

    describe('with compFim and dtDeslig is not null and dtIni is null', () => {
      describe('and typeContract is TrabSemVinculo or TrabalhadorComVincComAlt', () => {
        [
          TypeContract.TrabalhadorComVincSemAlt,
          TypeContract.TrabalhadorComVincComAlt,
        ].forEach(typecontract => {
          it('and compFim > datTerm another year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('8888-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });

          it('and compFim > datTerm same year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('9999-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });
        });
      });

      describe('and typeContract is TrabalhadorComVincComInclAlt or TrabalhadorComVincComAltData or EmpregadoComReconhecimentoVinc', () => {
        [
          TypeContract.TrabalhadorComVincComInclAlt,
          TypeContract.TrabalhadorComVincComAltData,
          TypeContract.EmpregadoComReconhecimentoVinc,
        ].forEach(typecontract => {
          it('and compFim > datTerm another year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('8888-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });

          it('and compFim > datTerm same year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('9999-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });
        });
      });

      describe('and typeContract is TrabSemVinculo and dtTerm is not null', () => {
        [TypeContract.TrabSemVinculo].forEach(typecontract => {
          it('and compFim > dtTerm another year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoTerm.dtTerm')
              .setValue('8888-88-88');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('8888-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });

          it('and compFim > dtTerm same year', () => {
            component.currentFormGroup.get('tpContr').setValue(typecontract);
            component.currentFormGroup
              .get('ideEstab.infoVlr.compFim')
              .setValue('9999-99-99');
            component.currentFormGroup
              .get('infoCompl.infoTerm.dtTerm')
              .setValue('9999-88-88');
            component.currentFormGroup
              .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
              .setValue('8888-88-88');
            component.validateCompFim();
            expect(compFimControl.setErrors).toHaveBeenCalled();
          });
        });
      });
    });

    it('with compFin, compIni and dtDeslig is null', () => {
      component.currentFormGroup.get('ideEstab.infoVlr.compFim').setValue(null);
      component.currentFormGroup.get('ideEstab.infoVlr.compIni').setValue(null);
      component.currentFormGroup
        .get('infoCompl.infoVinc.infoDeslig.dtDeslig')
        .setValue(null);
      component.validateCompFim();
      expect(compFimControl.setErrors).not.toHaveBeenCalled();
    });
  });

  describe(EmploymentContractComponent.prototype.changeTpInsc.name, () => {
    it('with documentType is equal to DocumentTypeEnum.cnpj', () => {
      component.currentFormGroup.get('ideEstab.tpInsc').setValue(DocumentTypeEnum.Cnpj);

      component.changeTpInsc();
      expect(
        component.currentFormGroup.get('ideEstab.nrInsc').hasValidator(CustomValidators.requiredIgnoreWhiteSpace)
      ).toBeTrue();
      expect(
        component.currentFormGroup.get('ideEstab.nrInsc').hasValidator(CustomValidators.cnpj)
      ).toBeTrue();
    });

    it('when receive something other than "Cnpj" or "Cpf", be not cnpj and cpf validators on "nrInsc"', () => {
      const documentTypeArray = Object.values(DocumentTypeEnum)
      .filter(d => d !== DocumentTypeEnum.Cnpj && DocumentTypeEnum.Cpf)
      .map(m => m as DocumentTypeEnum);
      documentTypeArray.forEach(documentType => {
        component.currentFormGroup.get('ideEstab.tpInsc').setValue(documentType);

      expect(
        component.currentFormGroup.get('ideEstab.nrInsc').hasValidator(CustomValidators.cnpj)
      ).toBeFalse();
      expect(
        component.currentFormGroup.get('ideEstab.nrInsc').hasValidator(CustomValidators.cpf)
      ).toBeFalse();
      })
    });
  });
  describe(EmploymentContractComponent.prototype.changeVrBaseIndenFGTS.name, () => {
      beforeEach(() => {
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc'),
          'clearValidators'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc'),
          'setValidators'
        );
        spyOn(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc'),
          'updateValueAndValidity'
        );
        component.currentFormGroup
          .get('ideEstab.infoVlr.pagDiretoResc')
          .setValue('N');
      });

      it('with vrBaseIndenFGTS is valid', () => {
        component.currentFormGroup
          .get('ideEstab.infoVlr.vrBaseIndenFGTS')
          .setValue(1.0);
        component.changeVrBaseIndenFGTS();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc')
            .setValidators
        ).toHaveBeenCalled();
      });

      it('with vrBaseIndenFGTS is empty', () => {
        component.currentFormGroup
          .get('ideEstab.infoVlr.vrBaseIndenFGTS')
          .setValue('');
        component.changeVrBaseIndenFGTS();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc')
            .setValidators
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc').value
        ).toBeNull();
      });

      it('with vrBaseIndenFGTS is null', () => {
        component.currentFormGroup
          .get('ideEstab.infoVlr.vrBaseIndenFGTS')
          .setValue(null);
        component.changeVrBaseIndenFGTS();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc')
            .setValidators
        ).not.toHaveBeenCalled();
        expect(
          component.currentFormGroup.get('ideEstab.infoVlr.pagDiretoResc').value
        ).toBeNull();
      });
    }
  );

  describe('isDisabledDtInicio getter', () => {
    it('and invalid matricula', () => {
      component.currentFormGroup.get('tpContr').setValue(null);
      component.currentFormGroup.get('indContr').setValue(null);
      component.currentFormGroup.get('matricula').setValue(null);
      const resultValue = component.isDisabledDtInicio;
      expect(resultValue).toBeFalse();
    });

    it('and tpContr equal to TypeContract.TrabSemVinculo and indContr equal to "N" and valid matricula', () => {
      component.currentFormGroup
        .get('tpContr')
        .setValue(TypeContract.TrabSemVinculo);
      component.currentFormGroup.get('indContr').setValue('N');
      component.currentFormGroup.get('matricula').setValue('MAT');
      component.currentFormGroup.get('ideTrab.dtNascto').setValue(null);
      const resultValue = component.isDisabledDtInicio;
      expect(resultValue).toBeFalse();
    });

    it('and tpContr not equal to TypeContract.TrabSemVinculo and valid matricula', () => {
      component.currentFormGroup.get('tpContr').setValue(null);
      component.currentFormGroup.get('matricula').setValue('MAT');
      component.currentFormGroup.get('ideTrab.dtNascto').setValue(null);
      const resultValue = component.isDisabledDtInicio;
      expect(resultValue).toBeTrue();
    });

    it('and indContr not equal to "N" and valid matricula', () => {
      component.currentFormGroup
        .get('tpContr')
        .setValue(TypeContract.TrabSemVinculo);
      component.currentFormGroup.get('indContr').setValue('S');
      component.currentFormGroup.get('matricula').setValue('MAT');
      component.currentFormGroup.get('ideTrab.dtNascto').setValue(null);
      const resultValue = component.isDisabledDtInicio;
      expect(resultValue).toBeTrue();
    });
  });

  describe('isEditing getter', () => {
    it('with isEditMode is true and isEdit is true', () => {
      component.isEditMode = true;
      component.isEdit = true;
      expect(component.isEditing).toBeTrue();
    });

    it('with isEditMode is false and isEdit is true', () => {
      component.isEditMode = false;
      component.isEdit = true;
      expect(component.isEditing).toBeFalse();
    });

    it('with isEditMode is true and isEdit is false', () => {
      component.isEditMode = true;
      component.isEdit = false;
      expect(component.isEditing).toBeFalse();
    });
  });

  it('isExcluded getter', () => {
    component.excluidoERP = 'S';
    expect(component.isExcluded).toBeTrue();
  });

  describe('disableMudCategAtiv getter', () => {
    it('get disableMudCategAtiv should return true', () => {
      expect(component.disableMudCategAtiv).toBeTrue();
    });

    it('get disableMudCategAtiv should return false when infoContr is filled and indCateg and indNatAtiv are "S"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('S');
      component.currentFormGroup.get('indNatAtiv').setValue('S');
      expect(component.disableMudCategAtiv).toBeFalse();
    });

    it('get disableMudCategAtiv should return false when infoContr is filled and only indCateg is "S"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('S');
      component.currentFormGroup.get('indNatAtiv').setValue('N');
      expect(component.disableMudCategAtiv).toBeFalse();
    });

    it('get disableMudCategAtiv should return false when infoContr is filled and only indNatAtiv is "S"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('N');
      component.currentFormGroup.get('indNatAtiv').setValue('S');
      expect(component.disableMudCategAtiv).toBeFalse();
    });

    it('get disableMudCategAtiv should return true when infoContr is filled and indCateg and indNatAtiv are "N"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('N');
      component.currentFormGroup.get('indNatAtiv').setValue('N');
      expect(component.disableMudCategAtiv).toBeTrue();
    });
  });

  describe('when mudCategAtiv is filled', () => {
    it('then mudCategAtiv should keep filled when edit but indNatAtiv or mudCategAtiv is "S"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('S');
      component.currentFormGroup.get('indNatAtiv').setValue('S');
      component.currentFormGroup.get('mudCategAtiv').setValue(['item']);
      component.ngOnInit();
      component.currentFormGroup.get('indCateg').setValue('S');
      component.currentFormGroup.get('indNatAtiv').setValue('N');

      expect(component.currentFormGroup.get('mudCategAtiv').value).toEqual(['item']);
    });
    
    it('then mudCategAtiv should be reseted when edit and indNatAtiv and mudCategAtiv is "N"', () => {
      component.currentFormGroup.get('tpContr').setValue('1');
      component.currentFormGroup.get('indContr').setValue('1');
      component.currentFormGroup.get('indMotDeslig').setValue('1');
      component.currentFormGroup.get('indCateg').setValue('S');
      component.currentFormGroup.get('indNatAtiv').setValue('S');
      component.currentFormGroup.get('mudCategAtiv').setValue(['item']);
      component.ngOnInit();
      component.currentFormGroup.get('indCateg').setValue('N');
      component.currentFormGroup.get('indNatAtiv').setValue('N');

      expect(component.currentFormGroup.get('mudCategAtiv').value).toEqual(null);
    });
  });

  describe('isRequiredYearsBaseIndemnity', () => {
    it('should return TRUE when "indenAbono" is "S"', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.indenAbono')
        .setValue(OptionsAnswer.Yes);

      const result = component.isRequiredYearsBaseIndemnity;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "indenAbono" is not "S"', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.indenAbono')
        .setValue(OptionsAnswer.No);

      const result = component.isRequiredYearsBaseIndemnity;

      expect(result).toBeFalse();
    });
  });

  describe('isInvalidYearsBaseIndemnity getter', () => {
    it('should return true when "isV1" is FALSE, indenAbono is "S", and "abonoItems" is empty', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.indenAbono')
        .setValue(OptionsAnswer.Yes);
      component.currentFormGroup.get('ideEstab.infoVlr.abono').setValue([]);
      spyOnProperty(component, 'isV1').and.returnValue(false);

      const result = component.isInvalidYearsBaseIndemnity;

      expect(result).toBeTrue();
    });

    it('should return false when "isV1" is TRUE', () => {
      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.isInvalidYearsBaseIndemnity;

      expect(result).toBeFalse();
    });

    it('should return FALSE when indenAbono is not "S"', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.indenAbono')
        .setValue(OptionsAnswer.No);

      const result = component.isInvalidYearsBaseIndemnity;

      expect(result).toBeFalse();
    });

    it('should return FALSE when abonoItems is not empty', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.abono')
        .setValue([{} as Abono]);

      const result = component.isInvalidYearsBaseIndemnity;

      expect(result).toBeFalse();
    });
  });

  describe('isIdePeriodoInvalid getter', () => {
    it('should return true when idePeriodoItems is empty and required conditions are met', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.idePeriodo')
        .setValue([]);
      component.currentFormGroup.get('ideEstab.infoVlr.repercProc').setValue(1);
      component.currentFormGroup
        .get('ideEstab.infoVlr.indReperc')
        .setValue(IndRepercEnum.DecisComRepercTrib);
      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.isIdePeriodoInvalid;

      expect(result).toBeTrue();
    });

    it('should return false when idePeriodoItems is not empty', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.idePeriodo')
        .setValue([{} as IdePeriodo]);

      const result = component.isIdePeriodoInvalid;

      expect(result).toBeFalse();
    });

    it('should return false when required conditions are not met', () => {
      component.currentFormGroup
        .get('ideEstab.infoVlr.idePeriodo')
        .setValue([]);
      component.currentFormGroup.get('ideEstab.infoVlr.repercProc').setValue(2);
      component.currentFormGroup
        .get('ideEstab.infoVlr.indReperc')
        .setValue(IndRepercEnum.DecisSemRepercTrib);
      spyOnProperty(component, 'isV1').and.returnValue(true);

      const result = component.isIdePeriodoInvalid;

      expect(result).toBeFalse();
    });
  });

  describe('updateValidityIdePeriodo', () => {
    it('should update "idePeriodo" errors when "idePeriodo" is invalid', () => {
      const expectedErrors = { mustHaveAtLeastOne: true };

      spyOnProperty(component, 'isIdePeriodoInvalid').and.returnValue(true);

      component['updateValidityIdePeriodo']();

      expect(
        component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').errors
      ).toEqual(expectedErrors);
    });

    it('should remove "idePeriodo" errors when "idePeriodo" is valid', () => {
      spyOnProperty(component, 'isIdePeriodoInvalid').and.returnValue(false);

      component['updateValidityIdePeriodo']();

      expect(
        component.currentFormGroup.get('ideEstab.infoVlr.idePeriodo').errors
      ).toBeNull();
    });
  });

  describe('updateValidityCodCateg', () => {
    it('should update "codCateg" errors when "codCateg" is required but is empty', () => {
      const expectedErrors = { isRequiredCodCateg: true };

      spyOnProperty(component, 'isRequiredCodCateg').and.returnValue(true);

      component['updateValidityCodCateg']();

      expect(component.currentFormGroup.get('codCateg').errors).toEqual(
        expectedErrors
      );
    });

    it('should remove "codCateg" errors when "codCateg" is not required', () => {
      spyOnProperty(component, 'isRequiredCodCateg').and.returnValue(false);

      component['updateValidityCodCateg']();

      expect(component.currentFormGroup.get('codCateg').errors).toBeNull();
    });

    it('should remove "codCateg" errors when "codCateg" has a value', () => {
      spyOnProperty(component, 'isRequiredCodCateg').and.returnValue(true);
      component.currentFormGroup.get('codCateg').setValue('mockValue');

      component['updateValidityCodCateg']();

      expect(component.currentFormGroup.get('codCateg').errors).toBeNull();
    });
  });

  describe('updateValidityMatricula', () => {
    it('should update "indUnic" errors when "matricula" is required but "indUnic" is empty', () => {
      const expectedErrors = { isRequiredIndUnic: true };

      spyOnProperty(component, 'isRequiredMatricula').and.returnValue(true);
      spyOnProperty(component, 'isV1').and.returnValue(true);
      component.currentFormGroup.get('indUnic').setValue('');

      component['updateValidityMatricula']();

      expect(component.currentFormGroup.get('indUnic').errors).toEqual(
        expectedErrors
      );
    });

    it('should remove "indUnic" errors when "matricula" is not required', () => {
      spyOnProperty(component, 'isRequiredMatricula').and.returnValue(false);
      spyOnProperty(component, 'isV1').and.returnValue(true);

      component['updateValidityMatricula']();

      expect(component.currentFormGroup.get('indUnic').errors).toBeNull();
    });

    it('should remove "indUnic" errors when "matricula" is required and "indUnic" has a value', () => {
      spyOnProperty(component, 'isRequiredMatricula').and.returnValue(true);
      spyOnProperty(component, 'isV1').and.returnValue(true);
      component.currentFormGroup.get('indUnic').setValue('mockValue');

      component['updateValidityMatricula']();

      expect(component.currentFormGroup.get('indUnic').errors).toBeNull();
    });
  });

  describe('updateValidityAbono', () => {
    it('should update "abono" errors when "yearsBaseIndemnity" is invalid', () => {
      const expectedErrors = { isRequiredAbono: true };

      spyOnProperty(component, 'isInvalidYearsBaseIndemnity').and.returnValue(
        true
      );

      component['updateValidityAbono']();

      expect(
        component.currentFormGroup.get('ideEstab.infoVlr.abono').errors
      ).toEqual(expectedErrors);
    });

    it('should remove "abono" errors when "yearsBaseIndemnity" is valid', () => {
      spyOnProperty(component, 'isInvalidYearsBaseIndemnity').and.returnValue(
        false
      );

      component['updateValidityAbono']();

      expect(
        component.currentFormGroup.get('ideEstab.infoVlr.abono').errors
      ).toBeNull();
    });
  });
});
