import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CodCategEnum, OptionsAnswer, Remuneracao, TypeContract, UndSalFixoEnum } from '../../../../../models/labor-process.model';
import { AdditionalInformationEmploymentContractComponent } from './additional-information-employment-contract.component';

describe(AdditionalInformationEmploymentContractComponent.name, () => {
  let formBuilder: UntypedFormBuilder;
  let component: AdditionalInformationEmploymentContractComponent;

  beforeEach(() => {
    formBuilder = new UntypedFormBuilder();
    component = new AdditionalInformationEmploymentContractComponent(formBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isRequiredCodCBO getter', () => {
    it('should return TRUE if "codCBO" is required', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [null],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredCodCBO).toBeTrue();
    });

    it('should return FALSE if "codCBO" is NOT required', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.Estagiario],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredCodCBO).toBeFalse();
    });
  });

  describe('isDisabledNatAtividade getter', () => {
    it('should return TRUE if "natAtividade" is disabled', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.ContribuinteIndivDiretorComFgts],
      });
      expect(component.isDisabledNatAtividade).toBeTrue();
    });

    it('should return FALSE if "natAtividade" is NOT disabled', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [null],
      });
      expect(component.isDisabledNatAtividade).toBeFalse();
    });
  });

  describe('isRequiredNatAtividade getter', () => {
    it('deve retornar false quando codCateg igual ContribuinteIndivDiretorComFgts', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.ContribuinteIndivDiretorComFgts],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredNatAtividade).toBeFalse();
    });

    it('deve retornar false quando codCateg igual ContribuinteIndivDiretorSemFgts', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.ContribuinteIndivDiretorSemFgts],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredNatAtividade).toBeFalse();
    });

    it('deve retornar false quando codCateg igual ContribuinteIndivConsTutelar', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.ContribuinteIndivConsTutelar],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredNatAtividade).toBeFalse();
    });

    it('deve retornar false quando codCateg igual Estagiario', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.Estagiario],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredNatAtividade).toBeFalse();
    });

    it('deve retornar true', () => {
      component.currentFormGroup = formBuilder.group({
        codCateg: [CodCategEnum.AgentePublico],
        indContr: [OptionsAnswer.No],
      });
      expect(component.isRequiredNatAtividade).toBeTrue();
    });
  });

  describe('isRequiredMtvDesligTSV getter', () => {
    it('deve retornar false quando mtvDesligTSV não for obrigatório', () => {
      component.currentFormGroup = formBuilder.group({
        indContr: [OptionsAnswer.No],
        tpContr: [TypeContract.TrabSemVinculo],
        codCateg: [CodCategEnum.Auxiliar],
      });
      expect(component.isRequiredMtvDesligTSV).toBeFalse();
    });

    it('deve retornar true quando mtvDesligTSV for obrigatório', () => {
      component.currentFormGroup = formBuilder.group({
        indContr: [OptionsAnswer.No],
        tpContr: [TypeContract.TrabSemVinculo],
        codCateg: [CodCategEnum.ContribuinteIndivDiretorComFgts],
      });
      expect(component.isRequiredMtvDesligTSV).toBeTrue();
    });
  });

  describe('isDisabledInfoTerm getter', () => {
    it('deve retornar true quando infoContr/tpContr for diferente de 6', () => {
      component.currentFormGroup = formBuilder.group({
        indContr: [OptionsAnswer.No],
        tpContr: [TypeContract.RespIndireta],
      });
      expect(component.isDisabledInfoTerm).toBeTrue();
    });

    it('deve retornar false quando infoContr/tpContr for igual a 6', () => {
      component.currentFormGroup = formBuilder.group({
        indContr: [OptionsAnswer.No],
        tpContr: [TypeContract.TrabSemVinculo],
      });
      expect(component.isDisabledInfoTerm).toBeFalse();
    });
    
    it('deve retornar true quando indContr for igual a S', () => {
      component.currentFormGroup = formBuilder.group({
        indContr: [OptionsAnswer.Yes],
        tpContr: [TypeContract.TrabSemVinculo],
      });
      expect(component.isDisabledInfoTerm).toBeTrue();
    });
  });

  describe('isExcluded getter', () => {
    it('deve retornar true quando excluidoERP igual à "S"', () => {
      component.excluidoERP = 'S';
      expect(component.isExcluded).toBeTrue();
    });

    it('deve retornar false quando excluidoERP deferente de "S"', () => {
      component.excluidoERP = 'N';
      expect(component.isExcluded).toBeFalse();
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'initializeTableActions').and.stub();
      spyOn(component, 'transformRows').and.stub();
      component.mainFormGroup = formBuilder.group({ excluidoERP: [null] });
      component.currentFormGroup = formBuilder.group({
        tpContr: [null],
        codCateg: [null],
        infoCompl: formBuilder.group({
          codCBO: [null],
          natAtividade: [null],
          infoTerm: formBuilder.group({
            dtTerm: [null],
            mtvDesligTSV: [null],
          }),
          remuneracao: formBuilder.array([]),
        }),
      });
    });

    it('deve chamar inicializações', () => {
      component.ngOnInit();
      expect(component.transformRows).toHaveBeenCalledTimes(1);
      expect(component.initializeTableActions).toHaveBeenCalledTimes(1);
      expect(component.subscriptions.length).toEqual(7);
    });

    it('subscrição de alterações em excluidoERP no mainFormGroup deve alterar excluidoERP e chamar initializeTableActions', fakeAsync(() => {
      component.ngOnInit();
      component.excluidoERP = 'S';
      component.mainFormGroup.patchValue({ excluidoERP: 'N' });
      flushMicrotasks();
      expect(component.excluidoERP).toEqual('N');
      expect(component.initializeTableActions).toHaveBeenCalledTimes(2);
    }));

    it('subscrição de alterações no formArray deve chamar transformRows', fakeAsync(() => {
      component.ngOnInit();
      component.currentFormGroup.patchValue({
        infoCompl: { remuneracao: [{}, {}] },
      });
      flushMicrotasks();
      expect(component.transformRows).toHaveBeenCalledTimes(2);
    }));
  });

  it('ngOnDestroy deve chamar unsubscribe na lista de subscriptions', () => {
    const subscription: Subscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.subscriptions = [subscription];
    component.ngOnDestroy();
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  describe('initializeTableActions', () => {
    it('deve inicializar actions quando excluidoERP igual à "S"', () => {
      component.excluidoERP = 'S';
      component.initializeTableActions();
      expect(component.actions.length).toEqual(1);
      expect(component.actions[0].label).toEqual('Ver');
    });

    it('deve inicializar actions quando excluidoERP diferente de "S"', () => {
      component.excluidoERP = 'N';
      component.initializeTableActions();
      expect(component.actions.length).toEqual(2);
      expect(component.actions[0].label).toEqual('Editar');
      expect(component.actions[1].label).toEqual('Excluir');
    });
  });

  describe('transformRows', () => {
    it('quando valor de formArray igual à null, deve inicializar rows com lista vazia', () => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          remuneracao: null,
        }),
      });
      component.transformRows();
      expect(component.rows).toEqual([]);
    });

    it('deve inicializar rows', () => {
      const remuneracao = {
        dtRemunLabel: new Date(),
        vrSalFxLabel: 0.123,
        undSalFixoLabel: 'Por mês',
        dscSalVarLabel: '',
      };
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          remuneracao: formBuilder.array([
            formBuilder.group({
              dtRemun: [remuneracao.dtRemunLabel],
              vrSalFx: [remuneracao.vrSalFxLabel],
              undSalFixo: [UndSalFixoEnum.mes],
              dscSalVar: [remuneracao.dscSalVarLabel],
            }),
          ]),
        }),
      });
      component.transformRows();
      expect(component.rows).toEqual([remuneracao]);
    });
  });

  it('formArray deve retornar infoCompl.remuneracao do currentFormGroup', () => {
    const currentFormGroup: UntypedFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        remuneracao: formBuilder.array([
          formBuilder.group({
            dtRemun: [new Date()],
            vrSalFx: [0.123],
            undSalFixo: [UndSalFixoEnum.mes],
            dscSalVar: [''],
          }),
        ]),
      }),
    });
    component.currentFormGroup = currentFormGroup;
    expect(component.formArray).toEqual(currentFormGroup.get(
      'infoCompl.remuneracao'
    ) as UntypedFormControl);
  });

  it('create deve resetar form', () => {
    component.subFormGroup = jasmine.createSpyObj('UntypedFormGroup', [
      'reset',
    ]);
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    expect(component.subFormGroup.reset).toHaveBeenCalledTimes(1);
    expect(component.isSelected).toBeTrue();
    expect(component.isEdit).toBeFalse();
  });

  describe('changeValueNullToCorrectType', () => {
    it('deve tratar valores de dscSalVar e vrSalFx quando nulos', () => {
      component.subFormGroup.patchValue({
        dscSalVar: null,
        vrSalFx: null,
      });
      component.changeValueNullToCorrectType();
      expect(component.subFormGroup.value.dscSalVar).toEqual('');
      expect(component.subFormGroup.value.vrSalFx).toEqual(0);
    });
  });

  it('saveAdditionalInformation deve chamar changeValueNullToCorrectType e mesclar com subFormGroup', () => {
    spyOn(component, 'changeValueNullToCorrectType').and.stub();
    component.currentFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        remuneracao: null,
      }),
    });
    const formValue: Remuneracao = {
      dtRemun: new Date(),
      vrSalFx: 1.975,
      undSalFixo: UndSalFixoEnum.mes,
      dscSalVar: '',
    };
    component.subFormGroup.patchValue({
      dtRemun: formValue.dtRemun,
      vrSalFx: formValue.vrSalFx,
      undSalFixo: formValue.undSalFixo,
      dscSalVar: formValue.dscSalVar,
    });
    component.saveAdditionalInformation();
    expect(component.changeValueNullToCorrectType).toHaveBeenCalledTimes(
      1
    );
    expect(component.formArray.value.length).toEqual(1);
    expect(component.formArray.value[0]).toEqual(formValue);
    expect(component.isSelected).toBeFalse();
  });

  it('clickToEditAdditionalInformation deve setar item para edição', () => {
    const remuneracao = {
      dtRemunLabel: new Date(),
      vrSalFxLabel: 0.123,
      undSalFixoLabel: 'Por mês',
      dscSalVarLabel: '',
    };
    component.currentFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        remuneracao: formBuilder.array([
          formBuilder.group({
            dtRemun: [remuneracao.dtRemunLabel],
            vrSalFx: [remuneracao.vrSalFxLabel],
            undSalFixo: [UndSalFixoEnum.mes],
            dscSalVar: [''],
          }),
        ]),
      }),
    });
    component.rows = [remuneracao];
    component.clickToEditAdditionalInformation(remuneracao);
    expect(component.editIndex).toEqual(0);
    expect(component.isEdit).toBeTrue();
    expect(component.isSelected).toBeTrue();
    expect(component.subFormGroup.value).toEqual(
      component.formArray.value[0]
    );
  });

  it('deleteAdditionalInformation deve deletar item da lista', () => {
    const remuneracao = {
      dtRemunLabel: new Date(),
      vrSalFxLabel: 0.123,
      undSalFixoLabel: 'Por mês',
      dscSalVarLabel: '',
    };
    component.currentFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        remuneracao: null,
      }),
    });
    component.formArray.setValue([
      {
        dtRemun: remuneracao.dtRemunLabel,
        vrSalFx: remuneracao.vrSalFxLabel,
        undSalFixo: UndSalFixoEnum.mes,
        dscSalVar: '',
      },
    ]);
    component.rows = [remuneracao];
    component.deleteAdditionalInformation(remuneracao);
    expect(component.formArray.value.length).toEqual(0);
    expect(component.isEdit).toBeFalse();
    expect(component.isSelected).toBeFalse();
  });

  it('updateAdditionalInformation deve atualizar item na lista', () => {
    spyOn(component, 'changeValueNullToCorrectType').and.stub();
    component.currentFormGroup = formBuilder.group({
      infoCompl: formBuilder.group({
        remuneracao: null,
      }),
    });
    const oldValue = {
      dtRemun: new Date(),
      vrSalFx: 0.123,
      undSalFixo: UndSalFixoEnum.mes,
      dscSalVar: '',
    };
    const newValue = { ...oldValue, vrSalFx: 10245.62 };
    component.formArray.setValue([oldValue]);
    component.subFormGroup.setValue(newValue);
    component.editIndex = 0;
    component.isSelected = true;
    component.updateAdditionalInformation();
    expect(component.changeValueNullToCorrectType).toHaveBeenCalledTimes(
      1
    );
    expect(component.formArray.value[0]).toEqual(newValue);
    expect(component.isSelected).toBeFalse();
  });

  it('cancel deve remover seleção', () => {
    component.isSelected = true;
    component.cancel();
    expect(component.isSelected).toBeFalse();
  });

  describe('setValueToSal', () => {
    it('deve zerar o valor de vrSalFx quando undSalFixo igual à NaoAplicavel', () => {
      component.subFormGroup.patchValue({
        undSalFixo: UndSalFixoEnum.naoAplicavel,
        vrSalFx: 1.973,
      });
      component.setValueToSal();
      expect(component.subFormGroup.value.vrSalFx).toEqual(0);
    });

    it('NÃO deve zerar o valor de vrSalFx quando undSalFixo diferente de NaoAplicavel', () => {
      component.subFormGroup.patchValue({
        undSalFixo: UndSalFixoEnum.mes,
        vrSalFx: 10156.973,
      });
      component.setValueToSal();
      expect(component.subFormGroup.value.vrSalFx).toEqual(10156.973);
    });
  });

  describe('verifyIsZero', () => {
    it('deve retornar null quando subFormGroup igual à null', () => {
      component.subFormGroup = null;
      expect(component.verifyIsZero(null)).toBeNull();
    });

    it('deve retornar undefined quando currentValue igual à null', () => {
      component.subFormGroup.patchValue({ undSalFixo: 'Por mês' });
      const control: AbstractControl = formBuilder.control(null);
      expect(component.verifyIsZero(control)).toBeNull();
    });

    it('deve retornar undefined quando undSalFixo igual à null', () => {
      component.subFormGroup.patchValue({ undSalFixo: null });
      const control: AbstractControl = formBuilder.control(
        UndSalFixoEnum.naoAplicavel
      );
      expect(component.verifyIsZero(control)).toBeNull();
    });

    it('deve retornar undefined quando undSalFixo igual à NaoAplicavel e currentValue igual à zero', () => {
      component.subFormGroup.patchValue({
        undSalFixo: UndSalFixoEnum.naoAplicavel,
      });
      const control: AbstractControl = formBuilder.control(0);
      expect(component.verifyIsZero(control)).toBeNull();
    });

    it('deve retornar {valueZero: true} quando undSalFixo igual à NaoAplicavel e currentValue diferente de zero', () => {
      component.subFormGroup.patchValue({
        undSalFixo: UndSalFixoEnum.naoAplicavel,
      });
      const control: AbstractControl = formBuilder.control(1);
      expect(component.verifyIsZero(control)).toEqual({ valueZero: true });
    });
  });

  describe('verifyDuplicateDate', () => {
    it('deve retornar null quando subFormGroup igual à null', () => {
      component.subFormGroup = null;
      expect(component.verifyDuplicateDate(null)).toBeNull();
    });

    it('deve retornar null quando isEdit igual à true', () => {
      component.isEdit = true;
      expect(component.verifyDuplicateDate(null)).toBeNull();
    });

    it('deve retornar null quando formArray igual à null', () => {
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          remuneracao: null,
        }),
      });
      const control: AbstractControl = formBuilder.control(new Date());
      expect(component.verifyDuplicateDate(control)).toBeNull();
    });

    it('deve retornar undefined quando a data não for duplicada', () => {
      const dateReference: Date = new Date();
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          remuneracao: formBuilder.array([
            formBuilder.group({
              dtRemun: [
                new Date(
                  dateReference.getFullYear(),
                  dateReference.getMonth(),
                  dateReference.getDay() - 1
                ),
              ],
              vrSalFx: [null],
              undSalFixo: [null],
              dscSalVar: [null],
            }),
          ]),
        }),
      });
      const control: AbstractControl = formBuilder.control(dateReference);
      expect(component.verifyDuplicateDate(control)).toBeNull();
    });

    it('deve retornar { duplicatedDate: true } quando a data for duplicada', () => {
      const dateReference: Date = new Date();
      component.currentFormGroup = formBuilder.group({
        infoCompl: formBuilder.group({
          remuneracao: formBuilder.array([
            formBuilder.group({
              dtRemun: [dateReference],
              vrSalFx: [null],
              undSalFixo: [null],
              dscSalVar: [null],
            }),
          ]),
        }),
      });
      const control: AbstractControl = formBuilder.control(dateReference);
      expect(component.verifyDuplicateDate(control)).toEqual({
        duplicatedDate: true,
      });
    });
  });
});
