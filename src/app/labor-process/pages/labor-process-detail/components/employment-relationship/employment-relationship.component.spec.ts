import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { ESocialVersionEnum, OptionsAnswer, PensAlimEnum, TpInscEnum, TpRegTrabEnum } from '../../../../../models/labor-process.model';
import { CustomValidators } from '../../../../validators/custom-validators';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { EmploymentRelationshipComponent } from './employment-relationship.component';

describe(EmploymentRelationshipComponent.name, () => {
  let formBuilder: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;

  let component: EmploymentRelationshipComponent;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    component = new EmploymentRelationshipComponent(formBuilder, laborProcessDataStateService);

    component.mainFormGroup = formBuilder.group({
      excluidoERP: [null],
      infoProcesso: formBuilder.group({
        dadosCompl: formBuilder.group({
          infoCCP: formBuilder.group({
            dtCCP: [null],
          }),
          infoProcJud: formBuilder.group({
            dtSent: [null],
          }),
        }),
      }),
    });
    component.currentFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        infoVinc: formBuilder.group({
          tpRegTrab: [null],
          dtAdm: [null],
          observacoes: formBuilder.array([]),
          infoDeslig: formBuilder.group({
            pensAlim: [null],
            vrAlim: [null],
            percAliment: [null],
            dtDeslig: [null],
            mtvDeslig: [null],
          }),
        }),
      }),
      codCateg: [null],
    });
  });

  it('formArray getter should return "infoCompl.infoVinc.observacoes" from "currentFormGroup"', () => {
    const currentFormGroup: UntypedFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        infoVinc: formBuilder.group({
          observacoes: formBuilder.array([
            formBuilder.group({
              observacao: ['1'],
            }),
            formBuilder.group({
              observacao: ['2'],
            }),
          ]),
        }),
      }),
    });
    component.currentFormGroup = currentFormGroup;
    expect(component.formArray).toEqual(currentFormGroup.get('infoCompl.infoVinc.observacoes') as UntypedFormControl);
  });

  describe('isTmpParcDisabled getter', () => {
    beforeEach(() => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            tpRegTrab: [null],
          }),
        }),
      });
    });

    it('should return TRUE when "tpRegTrab" is NOT "CLT"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(TpRegTrabEnum.EstatOuLegislEspec);

      expect(component.isTmpParcDisabled).toBeTrue();
    });

    it('should return FALSE when "tpRegTrab" is "CLT"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(TpRegTrabEnum.CLT);

      expect(component.isTmpParcDisabled).toBeFalse();
    });
  });

  describe('isExcluded getter', () => {
    it('should return TRUE when "excluidoERP" is "Yes"', () => {
      component.excluidoERP = OptionsAnswer.Yes;

      const result = component.isExcluded;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "excluidoERP" is NOT "Yes"', () => {
      component.excluidoERP = OptionsAnswer.No;

      const result = component.isExcluded;

      expect(result).toBeFalse();
    });
  });

  describe('isV1 getter', () => {
    it('should return true when "version" is "v1"', () => {
      component.version = ESocialVersionEnum.v1;

      const result = component.isV1;

      expect(result).toBeTrue();
    });

    it('should return false when "version" is NOT "v1"', () => {
      component.version = null;

      const result = component.isV1;

      expect(result).toBeFalse();
    });
  });

  describe('isDisabledPensAlim getter', () => {
    it('should return TRUE when "tpRegTrab" is NOT "CLT"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(TpRegTrabEnum.EstatOuLegislEspec);

      const result = component.isDisabledPensAlim;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "tpRegTrab" is "CLT"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(TpRegTrabEnum.CLT);

      const result = component.isDisabledPensAlim;

      expect(result).toBeFalse();
    });
  });

  describe('isOptionalPensAlim getter', () => {
    it('should return TRUE when "dtCCP" is less than "2024-01-22"', () => {
      const mockDtCCP = '2023-01-22';

      component.mainFormGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP').setValue(mockDtCCP);

      const result = component.isOptionalPensAlim;

      expect(result).toBeTrue();
    });

    it('should return TRUE when "dtSent" is less than "2024-01-22"', () => {
      const mockDtSent = '2023-01-22';

      component.mainFormGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent').setValue(mockDtSent);

      const result = component.isOptionalPensAlim;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "dtCCP" and "dtSent" are both greater than or equal "2024-01-22"', () => {
      const mockDtCCP = '2025-01-22';
      const mockDtSent = '2024-01-22';

      component.mainFormGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP').setValue(mockDtCCP);
      component.mainFormGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent').setValue(mockDtSent);

      const result = component.isOptionalPensAlim;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredPercAliment getter', () => {
    it('should return TRUE when "pensAlim" is in the list of required values', () => {
      const mockPensAlim = PensAlimEnum.percentPensao;

      component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').setValue(mockPensAlim);

      const result = component.isRequiredPercAliment;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "pensAlim" is NOT in the list of required values', () => {
      const mockPensAlim = PensAlimEnum.naoExistePensao;

      component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').setValue(mockPensAlim);


      const result = component.isRequiredPercAliment;

      expect(result).toBeFalse();
    });
  });

  describe('isRequiredVrAlim getter', () => {
    it('should return TRUE when "pensAlim" is in the list of required values', () => {
      const mockPensAlim = PensAlimEnum.valorPensao;

      component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').setValue(mockPensAlim);

      const result = component.isRequiredVrAlim;

      expect(result).toBeTrue();
    });

    it('should return FALSE when "pensAlim" is NOT in the list of required values', () => {
      const mockPensAlim = PensAlimEnum.percentPensao;

      component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.pensAlim').setValue(mockPensAlim);

      const result = component.isRequiredVrAlim;

      expect(result).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.create.name, () => {
    it('should reset the form', () => {
      component.subFormGroup = jasmine.createSpyObj('UntypedFormGroup', ['reset']);
      component.isSelected = false;
      component.isEdit = true;
      component.create();
      expect(component.subFormGroup.reset).toHaveBeenCalledTimes(1);
      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.ngOnInit.name, () => {
    xit('should add all of subscriptions', () => {
      const totalSubscriptions = 8;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    const validityFunctionsWithFields = {
      'handleChangesCodCateg': ['codCateg'],
      'updateValidityDtDeslig': ['infoCompl.infoVinc.dtAdm', 'infoCompl.infoVinc.infoDeslig.dtDeslig'],
      'updateValidityMtvDeslig': ['infoCompl.infoVinc.infoDeslig.mtvDeslig'],
      'updateValidityPensAlim': ['infoCompl.infoVinc.tpRegTrab', 'infoCompl.infoVinc.infoDeslig.pensAlim'],
      'handleChangesTpRegTrab': ['infoCompl.infoVinc.tpRegTrab'],
      'updateValidityDuracao': ['infoCompl.infoVinc.tpRegTrab'],
      'handleChangesPensAlim': ['infoCompl.infoVinc.infoDeslig.pensAlim'],
      'updateValidityPercAliment': ['infoCompl.infoVinc.infoDeslig.pensAlim'],
      'updateValidityVrAlim': ['infoCompl.infoVinc.infoDeslig.pensAlim'],
      'handleChangeTpContr': ['infoCompl.infoVinc.duracao.tpContr']
    }

    Object.entries(validityFunctionsWithFields).forEach(([validationFunction, fields]) => {
      describe(`should invoke ${validationFunction} validation`, () => {
        fields.forEach((field: string) => {
          xit(`when ${field} field changes`, () => {
            spyOn<any>(component, validationFunction);

            component.ngOnInit();
            component.currentFormGroup.get(field).setValue('mockValue');

            expect(component[validationFunction]).toHaveBeenCalled();
          });
        });
      });
    });

    xit('changes in formArray should call transformRows', fakeAsync(() => {
      component.ngOnInit();
      component.excluidoERP = 'S';
      component.mainFormGroup.patchValue({ excluidoERP: 'N' });
      component.currentFormGroup.patchValue({
        infoCompl: {
          infoVinc: { observacoes: [{ observacao: '1' }, { observacao: '2' }] },
        },
      });
      flushMicrotasks();
      expect(component.excluidoERP).toEqual('N');
    }));
  });

  describe(EmploymentRelationshipComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe the subscriptions', () => {
      const subscription: Subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.subscriptions = [subscription];
      component.ngOnDestroy();
      expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe(EmploymentRelationshipComponent.prototype.saveObservacao.name, () => {
    it('should insert a "observacao" in the list', () => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            observacoes: null,
          }),
        }),
      });
      const formValue = { observacao: '1' };
      component.subFormGroup.patchValue(formValue);
      component.isSelected = true;
      component.saveObservacao();
      expect(component.formArray.value.length).toEqual(1);
      expect(component.formArray.value[0]).toEqual(formValue);
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.updateObservacao.name, () => {
    it('should update the item list', () => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            observacoes: null,
          }),
        }),
      });
      const oldValue = { observacao: '-1' };
      const newValue = { observacao: '+1' };
      component.formArray.setValue([oldValue]);
      component.subFormGroup.setValue(newValue);
      component.editIndex = 0;
      component.isSelected = true;
      component.updateObservacao();
      expect(component.formArray.value[0]).toEqual(newValue);
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.clickToEditObservacao.name, () => {
    it('should set "observacao" to edit', () => {
      const observacao = { observacao: '-1' };
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            observacoes: null,
          }),
        }),
      });
      component.formArray.setValue([observacao]);
      component.clickToEditObservacao(observacao);
      expect(component.editIndex).toEqual(0);
      expect(component.isEdit).toBeTrue();
      expect(component.isSelected).toBeTrue();
      expect(component.subFormGroup.value).toEqual(component.formArray.value[0]);
    });
  });

  describe(EmploymentRelationshipComponent.prototype.deleteObservacao.name, () => {
    it('should delete the item', () => {
      const observacao = { observacao: '-1' };
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            observacoes: null,
          }),
        }),
      });
      component.formArray.setValue([observacao]);
      component.deleteObservacao(observacao);
      expect(component.formArray.value.length).toEqual(0);
      expect(component.isEdit).toBeFalse();
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.cancel.name, () => {
    it('should remove selection', () => {
      component.isSelected = true;
      component.cancel();
      expect(component.isSelected).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.changeTpInsc.name, () => {
    beforeEach(() => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            sucessaoVinc: formBuilder.group({
              tpInsc: [null],
              nrInsc: [null],
            }),
          }),
        }),
      });
    });
    it('when receive "Cnpj", should setValidators with CNPJ and not CPF on "nrInsc"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc').setValue(TpInscEnum.Cnpj);
      component.changeTpInsc();
      
      expect(
        component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cnpj)
        ).toBeTrue();
      expect(
        component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cpf)
        ).toBeFalse();
    });

    it('when receive "CPF", should setValidators with CPF and not CNPJ on "nrInsc"', () => {
      component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc').setValue(TpInscEnum.Cpf);
      component.changeTpInsc();
      
      expect(
        component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cpf)
        ).toBeTrue();
      expect(
        component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cnpj)
        ).toBeFalse();
    });
    it('when receive something other than "Cnpj" or "Cpf", be not cnpj and cpf validators on "nrInsc"', () => {
      const tpInscArray = Object.values(TpInscEnum)
      .filter(d => d !== TpInscEnum.Cnpj && TpInscEnum.Cpf)
      .map(m => m as TpInscEnum);
      tpInscArray.forEach(tpInsc => {
        component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.tpInsc').setValue(tpInsc);
        
        expect(
          component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cnpj)
          ).toBeFalse();
        expect(
          component.currentFormGroup.get('infoCompl.infoVinc.sucessaoVinc.nrInsc').hasValidator(CustomValidators.cpf)
          ).toBeFalse();
      })
    });
  });

  describe(EmploymentRelationshipComponent.prototype.updateTpRegTrab.name, () => {
    beforeEach(() => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            tpRegTrab: [null],
            tmpParc: [9, CustomValidators.requiredIgnoreWhiteSpace],
            infoDeslig: formBuilder.group({
              dtDeslig: [null],
              mtvDeslig: [null],
            }),
          }),
        }),
      });
      spyOn(component, 'handleResetMtvDesligAndTpRegTrab').and.stub();
    });

    afterEach(() => {
      expect(component.handleResetMtvDesligAndTpRegTrab).toHaveBeenCalledTimes(1);

      const field = component.currentFormGroup.get('infoCompl.infoVinc.tmpParc');
      expect(field.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeFalse();
      expect(component.currentFormGroup.value.infoCompl.infoVinc.tmpParc).toEqual(null);
    });

    it('when "tpRegTrab" is "CLT", should set "dtDeslig" and "mtvDeslig" as required', () => {
      component.currentFormGroup.patchValue({
        infoCompl: { infoVinc: { tpRegTrab: 1 } },
      });
      component.hasTpRegTrab = false;
      component.updateTpRegTrab();

      const dtDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig');
      const mtvDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');
      expect(dtDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      expect(mtvDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      expect(component.hasTpRegTrab).toBeTrue();
    });

    it('when "tpRegTrab" is "EstatOuLegislEspec", should set "dtDeslig" and "mtvDeslig" as required', () => {
      component.currentFormGroup.patchValue({
        infoCompl: { infoVinc: { tpRegTrab: 2 } },
      });
      component.hasTpRegTrab = false;
      component.updateTpRegTrab();

      const dtDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig');
      const mtvDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');
      expect(dtDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      expect(mtvDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      expect(component.hasTpRegTrab).toBeTrue();
    });

    it('when "tpRegTrab" is other than "CLT" or "EstatOuLegislEspec", should NOT set "dtDeslig" or "mtvDeslig" as required', () => {
      component.currentFormGroup.patchValue({
        infoCompl: { infoVinc: { tpRegTrab: 3 } },
      });
      component.hasTpRegTrab = true;
      component.updateTpRegTrab();

      const dtDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.dtDeslig');
      const mtvDesligField = component.currentFormGroup.get('infoCompl.infoVinc.infoDeslig.mtvDeslig');
      expect(dtDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeFalse();
      expect(mtvDesligField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeFalse();
      expect(component.hasTpRegTrab).toBeFalse();
    });
  });

  describe(EmploymentRelationshipComponent.prototype.handleResetMtvDesligAndTpRegTrab.name, () => {
    beforeEach(() => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            tpRegTrab: [null],
            infoDeslig: formBuilder.group({
              mtvDeslig: [null],
            }),
          }),
        }),
      });
    });

    it('when "mtvDeslig" is "", should set NULL', () => {
      component.currentFormGroup.patchValue({
        infoCompl: {
          infoVinc: { tpRegTrab: 1, infoDeslig: { mtvDeslig: '' } },
        },
      });
      component.handleResetMtvDesligAndTpRegTrab();
      expect(component.currentFormGroup.value.infoCompl.infoVinc.infoDeslig.mtvDeslig).toBeNull();
      expect(component.currentFormGroup.value.infoCompl.infoVinc.tpRegTrab).toEqual(1);
    });

    it('when "tpRegTrab" is "", should set NULL', () => {
      component.currentFormGroup.patchValue({
        infoCompl: {
          infoVinc: { tpRegTrab: '', infoDeslig: { mtvDeslig: 1 } },
        },
      });
      component.handleResetMtvDesligAndTpRegTrab();
      expect(component.currentFormGroup.value.infoCompl.infoVinc.tpRegTrab).toBeNull();
      expect(component.currentFormGroup.value.infoCompl.infoVinc.infoDeslig.mtvDeslig).toEqual(1);
    });
  });

  describe(EmploymentRelationshipComponent.prototype.handleChangeTpContr.name, () => {
    beforeEach(() => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          infoVinc: formBuilder.group({
            duracao: formBuilder.group({
              dtTerm: [null],
              objDet: [null],
            }),
          }),
        }),
      });
    });

    xit('when receive "2",should set "dtTerm" as required and "objDet" as NOT required', () => {
      component.currentFormGroup
        .get('infoCompl.infoVinc.duracao.objDet')
        .setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      //component.isObjDetRequired = true;
      //component.handleChangeTpContr(2);

      const dtTermField = component.currentFormGroup.get('infoCompl.infoVinc.duracao.dtTerm');
      const objDetField = component.currentFormGroup.get('infoCompl.infoVinc.duracao.objDet');
      expect(dtTermField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      //xpect(component.isDtTermRequired).toBeTrue();
      expect(objDetField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeFalse();
      //expect(component.isObjDetRequired).toBeFalse();
    });

    xit('when receive "3",should set "dtTerm" as NOT required and "objDet" as required', () => {
      component.currentFormGroup
        .get('infoCompl.infoVinc.duracao.dtTerm')
        .setValidators([CustomValidators.requiredIgnoreWhiteSpace]);
      //component.isDtTermRequired = true;
      //component.handleChangeTpContr(3);

      const dtTermField = component.currentFormGroup.get('infoCompl.infoVinc.duracao.dtTerm');
      const objDetField = component.currentFormGroup.get('infoCompl.infoVinc.duracao.objDet');
      expect(dtTermField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeFalse();
      //expect(component.isDtTermRequired).toBeFalse();
      expect(objDetField.hasValidator(CustomValidators.requiredIgnoreWhiteSpace)).toBeTrue();
      //expect(component.isObjDetRequired).toBeTrue();
    });
  });
});
