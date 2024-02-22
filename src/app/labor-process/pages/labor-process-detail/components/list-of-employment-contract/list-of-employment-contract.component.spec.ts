import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { CodCategEnum, InfoContrSimple, InfoContr, OptionsAnswer, TypeContract } from '../../../../../../app/models/labor-process.model';
import { AbstractControlMock } from '../../../../../../util/test/mock/global/abstract-control-mock';
import { EmploymentContractModalComponentMock } from '../../../../../../util/test/mock/employment-contract-modal-component.mock';
import { PoNotificationServiceMock } from '../../../../../../util/test/mock/po-components/po-notification-service.mock';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { EmploymentContractModalComponent } from '../employment-contract-modal/employment-contract-modal.component';
import { ListOfEmploymentContractComponent } from './list-of-employment-contract.component';


describe(ListOfEmploymentContractComponent.name, () => {
  let fb: UntypedFormBuilder;
  let notificationService: PoNotificationService;
  let laborProcessDataStateService: LaborProcessDataStateService;

  let component: ListOfEmploymentContractComponent;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    notificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    component = new ListOfEmploymentContractComponent(fb, notificationService, laborProcessDataStateService);

    component.employmentContractModal = new EmploymentContractModalComponentMock() as unknown as EmploymentContractModalComponent;

    component.formGroup = fb.group({
      excluidoERP: [null],
      ideTrab: fb.group({
        cpfTrab: [null],
        dependente: fb.control([]),
        infoContr: fb.control([])
      }),
      infoProcesso: fb.group({
        ideResp: fb.group({
          tpInsc: [null],
          nrInsc: [null]
        })
      })
    });

    component.subFormGroup = fb.group({
      tpContr: [null],
      indContr: [null],
      dtAdmOrig: [null],
      indReint: [null],
      indCateg: [null],
      indNatAtiv: [null],
      indMotDeslig: [null],
      indUnic: [null],
      matricula: [null],
      codCateg: [null],
      dtInicio: [null],
      ideEstab: fb.group({
        tpInsc: [null],
        nrInsc: [null],
        infoVlr: fb.group({
          compIni: [null],
          compFim: [null],
          repercProc: [null],
          indenSD: [null],
          indenAbono: [null],
          abono: fb.control([]),
          vrRemun: [null],
          vrAPI: [null],
          vr13API: [null],
          vrInden: [null],
          vrBaseIndenFGTS: [null],
          pagDiretoResc: [null],
          idePeriodo: fb.control([]),
        }),
      }),
      mudCategAtiv: fb.control([]),
      unicContr: fb.control([]),
      infoCompl: fb.group({
        codCBO: [null],
        natAtividade: [null],
        infoTerm: fb.group({
          dtTerm: [null],
          mtvDesligTSV: [null],
        }),
        remuneracao: fb.control([]),
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
          observacoes: fb.control([]),
        }),
      }),
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.ngOnInit.name, () => {
    const employmentContracts = [
      {
        tpContr: 0 as TypeContract,
        indContr: '',
        indCateg: '',
        indNatAtiv: '',
        indMotDeslig: ''
      } as InfoContrSimple
    ];

    describe('with excluidoERP etual to "S"', () => {
      beforeEach(() => {
        component.formGroup.get('ideTrab.infoContr').setValue(employmentContracts);
        component.formGroup.get('excluidoERP').setValue('S');
        component.excluidoERP = OptionsAnswer.Yes;
      });

      it('add subscriptions', () => {
        component.ngOnInit();
        expect(component.rows.length).toEqual(1);
        expect(component.subscriptions.length).toEqual(2);
      });

      it('value changes by infoContr', done => {
        component.excluidoERP = OptionsAnswer.No;
        component.ngOnInit();
        spyOn(component, 'transformRows').and.stub();
        spyOn(component, 'initializeTableActions').and.stub();
        component.formGroup.get('ideTrab.infoContr').valueChanges.subscribe(() => {
          expect(component.transformRows).toHaveBeenCalledTimes(1);
          expect(component.initializeTableActions).toHaveBeenCalledTimes(1);
          expect(component.excluidoERP).toEqual(OptionsAnswer.Yes);
          done();
        });
        component.formGroup.get('ideTrab.infoContr').setValue(employmentContracts);
      });
    });

    describe('with excluidoERP etual to "N"', () => {
      beforeEach(() => {
        component.formGroup.get('ideTrab.infoContr').setValue(employmentContracts);
        component.formGroup.get('excluidoERP').setValue('N');
        component.excluidoERP = OptionsAnswer.No;
      });

      it('add subscriptions', () => {
        component.ngOnInit();
        expect(component.rows.length).toEqual(1);
        expect(component.subscriptions.length).toEqual(2);
      });

      it('value changes by infoContr', done => {
        component.excluidoERP = OptionsAnswer.Yes;
        component.ngOnInit();
        spyOn(component, 'transformRows').and.stub();
        spyOn(component, 'initializeTableActions').and.stub();
        component.formGroup.get('ideTrab.infoContr').valueChanges.subscribe(() => {
          expect(component.transformRows).toHaveBeenCalledTimes(1);
          expect(component.initializeTableActions).toHaveBeenCalledTimes(1);
          expect(component.excluidoERP).toEqual(OptionsAnswer.No);
          done();
        });
        component.formGroup.get('ideTrab.infoContr').setValue(employmentContracts);
      });
    });
  });

  it(ListOfEmploymentContractComponent.prototype.ngOnDestroy.name, () => {
    component.subscriptions = [new SubscriptionMock() as unknown as Subscription];
    spyOn(component.subscriptions[0], 'unsubscribe');
    component.ngOnDestroy();
    expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
  });

  it('createSubFormGroup', () => {
    const resultValue = component['createSubFormGroup']();
    expect(resultValue).not.toBeUndefined();
    expect(resultValue).not.toBeNull();
  });

  it('formArray getter', () => {
    expect(component.formArray).not.toBeUndefined();
    component.formGroup = fb.group({ ideTrab: [null] });
    expect(component.formArray).toBeNull();
  });

  it(ListOfEmploymentContractComponent.prototype.clickToEditContract.name, () => {
    component.subFormGroup = fb.group({
      tpContr: [null],
      indContr: [null],
      indUnic: [null],
      matricula: [null],
      ideEstab: fb.group({
        infoVlr: fb.group({
          repercProc: [null],
          vrRemun: [null],
          indReperc: [null],
          indenSD: [null],
          indenAbono: [null],
          abono: fb.control([]),
        }),
      }),
      infoCompl: fb.group({
        infoVinc: fb.group({
          infoDeslig: fb.group({
            pensAlim: [null],
            percAliment: [null],
            vrAlim: [null],
          }),
        }),
      }),
    });

    const contracts: InfoContr[] = [
      {
        tpContr: 1,
        indContr: '1',
        matricula: 'm1',
        ideEstab: { infoVlr: { } },
        infoCompl: { infoVinc: { infoDeslig: { } } }
      },
      {
        tpContr: 2,
        indContr: '2',
        matricula: 'm2',
        ideEstab: { infoVlr: { } },
        infoCompl: { infoVinc: { infoDeslig: { } } }
      },
      {
        tpContr: 3,
        indContr: '3',
        matricula: 'm3',
        ideEstab: { infoVlr: { } },
        infoCompl: { infoVinc: { infoDeslig: { } } }
      },
    ] as unknown as InfoContr[];
    component.formGroup.get('ideTrab.infoContr').setValue(contracts);
    component.rows = contracts as any;
    component.subFormGroup.get('tpContr').setValue(2);
    component.subFormGroup.get('indContr').setValue('2');
    component.subFormGroup.get('matricula').setValue('m2');
    component.editIndex = 1;
    spyOn(component.employmentContractModal, 'openModal').and.stub();

    component.clickToEditContract(contracts[1] as any);
    expect(component.isEdit).toBeTrue();
    expect(component.editIndex).toEqual(1);
    expect(component.subFormGroup.get('tpContr').value).toEqual(2);
    expect(component.subFormGroup.get('indContr').value).toEqual('2');
    expect(component.subFormGroup.get('matricula').value).toEqual('m2');
    expect(component.subFormGroup.get('indUnic').value).toBeNull();
    expect(component.subFormGroup.get('ideEstab.infoVlr.indReperc').value).toBeNull();
    expect(component.subFormGroup.get('ideEstab.infoVlr.indenSD').value).toBeNull();
    expect(component.subFormGroup.get('ideEstab.infoVlr.indenAbono').value).toBeNull();
    expect(component.subFormGroup.get('ideEstab.infoVlr.abono').value).toEqual([]);
    expect(component.employmentContractModal.openModal).toHaveBeenCalled();
  });

  it(ListOfEmploymentContractComponent.prototype.deleteContract.name, () => {
    const contracts: InfoContr[] = [
      { tpContr: 1, indContr: '1', matricula: 'm1' },
      { tpContr: 2, indContr: '2', matricula: 'm2' },
      { tpContr: 3, indContr: '3', matricula: 'm3' },
    ] as unknown as InfoContr[];
    component.formGroup.get('ideTrab.infoContr').setValue(contracts);
    component.rows = contracts as any;

    component.deleteContract(contracts[1]);
    expect(component.isEdit).toBeFalse();
    expect(component.formGroup.get('ideTrab.infoContr').value.length).toEqual(2);
    expect(component.formGroup.get('ideTrab.infoContr').value[0].tpContr).toEqual(1);
    expect(component.formGroup.get('ideTrab.infoContr').value[1].tpContr).toEqual(3);
  });

  it(ListOfEmploymentContractComponent.prototype.onClickCreate.name, () => {
    spyOn(component.employmentContractModal, 'openModal').and.stub();
    component.onClickCreate();
    expect(component.employmentContractModal.openModal).toHaveBeenCalled();
    expect(component.isEdit).toBeFalse();
  });

  it('create', () => {
    spyOn(component.employmentContractModal, 'closeModal').and.stub();
    const contracts: InfoContr[] = [
      { tpContr: 1, indContr: '1', matricula: 'm1' },
  ] as unknown as InfoContr[];
    component.formGroup.get('ideTrab.infoContr').setValue(contracts);
    component.subFormGroup.get('tpContr').setValue(2);
    component.subFormGroup.get('indContr').setValue('2');
    component.subFormGroup.get('matricula').setValue('m2');
    component['create']();
    expect(component.formGroup.get('ideTrab.infoContr').value.length).toEqual(2);
    expect(component.employmentContractModal.closeModal).toHaveBeenCalled();
  });

  it(ListOfEmploymentContractComponent.prototype.update.name, () => {
    const contracts: InfoContr[] = [
      { tpContr: 1, indContr: '1', matricula: 'm1' },
      { tpContr: 0, indContr: '0', matricula: 'm0' },
      { tpContr: 3, indContr: '3', matricula: 'm3' },
    ] as unknown as InfoContr[];
    component.formGroup.get('ideTrab.infoContr').setValue(contracts);
    component.subFormGroup.get('tpContr').setValue(2);
    component.subFormGroup.get('indContr').setValue('2');
    component.subFormGroup.get('matricula').setValue('m2');
    component.editIndex = 1;

    component.update();
    expect(component.formGroup.get('ideTrab.infoContr').value.length).toEqual(3);
    expect(component.formGroup.get('ideTrab.infoContr').value[1].tpContr).toEqual(2);
    expect(component.formGroup.get('ideTrab.infoContr').value[1].indContr).toEqual('2');
    expect(component.formGroup.get('ideTrab.infoContr').value[1].matricula).toEqual('m2');
  });

  it(ListOfEmploymentContractComponent.prototype.cancel.name, () => {
    spyOn(component.employmentContractModal, 'closeModal').and.stub();
    component.cancel();
    expect(component.employmentContractModal.closeModal).toHaveBeenCalled();
  });

  it('clearControlPagDiretoResc', () => {
    component.subFormGroup.get('ideEstab.infoVlr.pagDiretoResc').setValue(null);
    component['clearControlPagDiretoResc']();
    expect(component.subFormGroup.get('ideEstab.infoVlr.pagDiretoResc').value).toEqual('');
  });

  describe(ListOfEmploymentContractComponent.prototype.onSaveClicked.name, () => {
    it('with not can save', () => {
      spyOn(component, 'canSave').and.returnValue(false);
      spyOn(component, 'update').and.stub();
      spyOn(component, 'create' as any).and.stub();

      component.onSaveClicked();
      expect(component.update).not.toHaveBeenCalled();
      expect(component['create']).not.toHaveBeenCalled();
    });

    it('with can save and edit', () => {
      spyOn(component, 'canSave').and.returnValue(true);
      spyOn(component, 'update').and.stub();
      spyOn(component, 'create' as any).and.stub();
      component.isEdit = true;

      component.onSaveClicked();
      expect(component.update).toHaveBeenCalled();
      expect(component['create']).not.toHaveBeenCalled();
    });

    it('with can save and create', () => {
      spyOn(component, 'canSave').and.returnValue(true);
      spyOn(component, 'update').and.stub();
      spyOn(component, 'create' as any).and.stub();
      component.isEdit = false;

      component.onSaveClicked();
      expect(component.update).not.toHaveBeenCalled();
      expect(component['create']).toHaveBeenCalled();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.isUnqualifiedInfoComplRemuneracao.name, () => {
    it('with tpContr not equal to 6 and tpRegTrab equalt to 2', () => {
      component.subFormGroup.get('tpContr').setValue(0);
      component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(2)
      const resultValue = component.isUnqualifiedInfoComplRemuneracao();
      expect(resultValue).toBeTrue();
    });

    it('with tpContr equal to 6 and tpRegTrab equalt to 2', () => {
      component.subFormGroup.get('tpContr').setValue(6);
      component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(2)
      const resultValue = component.isUnqualifiedInfoComplRemuneracao();
      expect(resultValue).toBeFalse();
    });

    it('with tpContr not equal to 6 and tpRegTrab not equal to 2', () => {
      component.subFormGroup.get('tpContr').setValue(0);
      component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(1)
      const resultValue = component.isUnqualifiedInfoComplRemuneracao();
      expect(resultValue).toBeFalse();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.isRequiredInfoComplRemuneracao.name, () => {
    it('should result is true', () => {
      const categories: CodCategEnum[] = [CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar];
      const typeContracts = Object.values(TypeContract).filter(c => c != TypeContract.TrabSemVinculo).map(m => m as TypeContract);

      component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(1);

      categories.forEach(category => {
        typeContracts.forEach(contract => {
          component.subFormGroup.get('codCateg').setValue(category);
          component.subFormGroup.get('tpContr').setValue(contract);
          component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(1);
          const resultValue = component.isRequiredInfoComplRemuneracao();
          expect(resultValue).toBeTrue();
        });
      });
    });

    it('should result is false', () => {
      const ignoreCategories: CodCategEnum[] = [CodCategEnum.ContribuinteIndivDiretorComFgts,
      CodCategEnum.ContribuinteIndivDiretorSemFgts,
      CodCategEnum.ContribuinteIndivConsTutelar];
      const categories = Object.values(CodCategEnum).filter(c => !ignoreCategories.find(f => f == c)).map(m => m as CodCategEnum);

      component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(1);

      categories.forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
        component.subFormGroup.get('infoCompl.infoVinc.tpRegTrab').setValue(2);
        const resultValue = component.isRequiredInfoComplRemuneracao();
        expect(resultValue).toBeFalse();
      });
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.canSave.name, () => {
    it('should result is true', () => {
      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(false);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(false);
      const resultValue = component.canSave();
      expect(resultValue).toBeTrue();
    });

    it('should result is false', () => {
      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(true);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(true);
      component.subFormGroup.get('infoCompl.remuneracao').setValue([]);
      let resultValue: boolean = component.canSave();
      expect(resultValue).toBeFalse();

      component.subFormGroup.get('infoCompl.remuneracao').setValue([{}]);
      resultValue = component.canSave();
      expect(resultValue).toBeFalse();
    });

    it('should the result be true when editing the item with indContr "N" without changing indContr', () => {
      component.formGroup = fb.group({
        ideTrab: fb.group({
          infoContr: fb.control([])
        })
      });

      const infoContrs: InfoContr[] = [
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.No
        },
      ] as InfoContr[];
      component.formGroup.get('ideTrab.infoContr').patchValue(infoContrs);

      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(false);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(false);
      spyOnProperty(component, 'isV1').and.returnValue(false);
      component.isEdit = true;
      component.editIndex = 2;

      component.subFormGroup = fb.group({
        indContr: [null]
      });
      
      const newContract: InfoContr = 
        {
          indContr: OptionsAnswer.No
        } as InfoContr;
      component.subFormGroup.patchValue(newContract);

      const resultValue = component.canSave();
      expect(resultValue).toBeTrue();
    });

    it('should the result be true when is creating the item with indContr "N" and there is no other indContr equal to "N"', () => {
      component.formGroup = fb.group({
        ideTrab: fb.group({
          infoContr: fb.control([])
        })
      });

      const infoContrs: InfoContr[] = [
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.Yes
        }
      ] as InfoContr[];
      component.formGroup.get('ideTrab.infoContr').patchValue(infoContrs);

      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(false);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(false);
      spyOnProperty(component, 'isV1').and.returnValue(false);
      component.isEdit = false;

      component.subFormGroup = fb.group({
        indContr: [null]
      });
      
      const newContract: InfoContr = 
        {
          indContr: OptionsAnswer.No
        } as InfoContr;
      component.subFormGroup.patchValue(newContract);

      const resultValue = component.canSave();
      expect(resultValue).toBeTrue();
    });
    
    it('should the result be false when is editing the item indContr to "N" and there is other indContr equal to "N"', () => {
      component.formGroup = fb.group({
        ideTrab: fb.group({
          infoContr: fb.control([])
        })
      });

      const infoContrs: InfoContr[] = [
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.No
        },
      ] as InfoContr[];
      component.formGroup.get('ideTrab.infoContr').patchValue(infoContrs);

      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(false);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(false);
      spyOnProperty(component, 'isV1').and.returnValue(false);
      component.isEdit = true;
      component.editIndex = 1;

      component.subFormGroup = fb.group({
        indContr: [null]
      });
      
      const newContract: InfoContr = 
        {
          indContr: OptionsAnswer.No
        } as InfoContr;
      component.subFormGroup.patchValue(newContract);

      const resultValue = component.canSave();
      expect(resultValue).toBeFalse();
    });
    
    it('should the result be false when is creating the item with indContr "N" and there is other indContr equal to "N"', () => {
      component.formGroup = fb.group({
        ideTrab: fb.group({
          infoContr: fb.control([])
        })
      });

      const infoContrs: InfoContr[] = [
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.Yes
        },
        {
          indContr: OptionsAnswer.No
        },
      ] as InfoContr[];
      component.formGroup.get('ideTrab.infoContr').patchValue(infoContrs);

      spyOn(component, 'isRequiredInfoComplRemuneracao').and.returnValue(false);
      spyOn(component, 'isUnqualifiedInfoComplRemuneracao').and.returnValue(false);
      spyOnProperty(component, 'isV1').and.returnValue(false);
      component.isEdit = false;

      component.subFormGroup = fb.group({
        indContr: [null]
      });

      const newContract: InfoContr = 
        {
          indContr: OptionsAnswer.No
        } as InfoContr;
      component.subFormGroup.patchValue(newContract);

      const resultValue = component.canSave();
      expect(resultValue).toBeFalse();
    });
  });

  it('showError', () => {
    spyOn(notificationService, 'error').and.stub();
    component['showError']('msg');
    expect(notificationService.error).toHaveBeenCalled();
  });

  describe('showError', () => {
    it('should result "Sim"', () => {
      expect(component.convertValueToLabelOption(OptionsAnswer.Yes)).toEqual('Sim');
    });

    it('should result "Não"', () => {
      expect(component.convertValueToLabelOption(OptionsAnswer.No)).toEqual('Não');
    });

    it('should result undefined', () => {
      expect(component.convertValueToLabelOption('OptionsAnswer.No')).toBeUndefined();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.convertOptionsTpContr.name, () => {
    it('should result string', () => {
      [1, 2, 3, 4, 5, 6].forEach(value => {
        expect(component.convertOptionsTpContr(value).length > 0).toBeTrue();
      });
    });

    it('should result undefined', () => {
      expect(component.convertOptionsTpContr(0 as TypeContract)).toEqual('');
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.validateIdeRespInCont.name, () => {
    let ideRespInCont: AbstractControl = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null', () => {
      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(null);
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue(null);
      ideRespInCont.setValue(OptionsAnswer.No);
      expect(component.validateIdeRespInCont(ideRespInCont)).toBeNull();

      component.formGroup = null
      expect(component.validateIdeRespInCont(ideRespInCont)).toBeNull();
    });

    it('should result is { notPermitted: true } ', () => {
      component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue('1');
      component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('2');
      ideRespInCont.setValue(OptionsAnswer.Yes);
      expect(component.validateIdeRespInCont(ideRespInCont).notPermitted).toBeTrue();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.validateRepercusao.name, () => {
    let repercProc: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null when is not v1', () => {
      component.subFormGroup.get('ideEstab.infoVlr.repercProc').setValue(null);

      expect(component.validateRepercusao(repercProc)).toBeNull();
    });

    it('should result is null', () => {
      component.subFormGroup.get('ideEstab.infoVlr.repercProc').setValue(null);
      spyOnProperty(component, 'isV1').and.returnValue(true);
      repercProc.setValue(0);
      expect(component.validateRepercusao(repercProc)).toBeNull();

      component.formGroup = null
      expect(component.validateRepercusao(repercProc)).toBeNull();
    });

    it('should result is equal to { invalidValue1: true } ', () => {
      component.subFormGroup.get('ideEstab.infoVlr.repercProc').setValue(1);
      spyOnProperty(component, 'isV1').and.returnValue(true);
      repercProc.setValue(0);
      const resultValue = component.validateRepercusao(repercProc);
      expect(resultValue.invalidValue1).toBeTrue();
    });

    it('should result is equal to { invalidValue2: true } ', () => {
      component.subFormGroup.get('ideEstab.infoVlr.repercProc').setValue(2);
      spyOnProperty(component, 'isV1').and.returnValue(true);
      repercProc.setValue(1);
      const resultValue = component.validateRepercusao(repercProc);
      expect(resultValue.invalidValue2).toBeTrue();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.verifyIfTheCorrectValue.name, () => {
    let tpRegTrab: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null', () => {
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      expect(component.verifyIfTheCorrectValue(tpRegTrab)).toBeNull();

      component.subFormGroup.get('indContr').setValue('S');
      component.subFormGroup.get('tpContr').setValue(TypeContract.EmpregadoComReconhecimentoVinc);
      expect(component.verifyIfTheCorrectValue(tpRegTrab)).toBeNull();

      component.formGroup = null
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      expect(component.verifyIfTheCorrectValue(tpRegTrab)).toBeNull();
    });

    xit('should result is equal to { invalidValue1: true }', () => {
      // todo: Este teste não pode ser realizado pois existe um erro de lógica no código onde um IF anula o outro
      expect(true).toBeFalse();
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.verifyIfTheCorrectValueRegPrev.name, () => {
    let tpRegPrev: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null', () => {
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev)).toBeNull();

      component.subFormGroup.get('indContr').setValue('S');
      const typeContracts = Object.values(TypeContract).filter(f => f != TypeContract.TrabSemVinculo).map(m => m as TypeContract);
      typeContracts.forEach(contract => {
        component.subFormGroup.get('tpContr').setValue(contract);
        expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev)).toBeNull();
      });

      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(null);
      tpRegPrev.setValue(null);
      typeContracts.forEach(contract => {
        component.subFormGroup.get('tpContr').setValue(contract);
        expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev)).toBeNull();
      });


      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      tpRegPrev.setValue(1);
      expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev)).toBeNull();

      component.formGroup = null
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev)).toBeNull();
    });

    it('should result is equal to { invalidValue1: true }', () => {
      component.subFormGroup.get('indContr').setValue('N');
      const typeContracts = Object.values(TypeContract).filter(f => f != TypeContract.TrabSemVinculo).map(m => m as TypeContract);

      typeContracts.forEach(typeContract => {
        component.subFormGroup.get('tpContr').setValue(typeContract);

        [2, 3].forEach(value => {
          component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
          tpRegPrev.setValue(value);
          expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev).invalidValue1).toBeTrue();
        });

        const categories = [
          CodCategEnum.EmpregadoGeral,
          CodCategEnum.EmpregadoRural,
          CodCategEnum.Aprendiz,
          CodCategEnum.ContratoTermoFirmado,
          CodCategEnum.TrabTemporario,
          CodCategEnum.ContrVerdeAmarelo,
          CodCategEnum.ContrVerdeAmareloComAcordo,
          CodCategEnum.Intermitente];

        categories.forEach(category => {
          component.subFormGroup.get('codCateg').setValue(category);
          tpRegPrev.setValue(2);
          expect(component.verifyIfTheCorrectValueRegPrev(tpRegPrev).invalidValue1).toBeTrue();
        });
      });
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.verifyValueTempParc.name, () => {
    let tmpParc: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null', () => {
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      expect(component.verifyValueTempParc(tmpParc)).toBeNull();

      component.subFormGroup.get('indContr').setValue('S');
      const typeContracts = Object.values(TypeContract).filter(f => f != TypeContract.TrabSemVinculo).map(m => m as TypeContract);
      typeContracts.forEach(contract => {
        component.subFormGroup.get('tpContr').setValue(contract);
        expect(component.verifyValueTempParc(tmpParc)).toBeNull();
      });

      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(null);
      tmpParc.setValue(null);
      typeContracts.forEach(contract => {
        component.subFormGroup.get('tpContr').setValue(contract);
        expect(component.verifyValueTempParc(tmpParc)).toBeNull();
      });

      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      tmpParc.setValue(1);
      expect(component.verifyValueTempParc(tmpParc)).toBeNull();

      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      component.subFormGroup.get('indContr').setValue('N');
      const categories = Object.values(CodCategEnum).filter(f => f !== CodCategEnum.Domestico).map(m => m as CodCategEnum);
      categories.forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);
        tmpParc.setValue(2);
        expect(component.verifyValueTempParc(tmpParc)).toBeNull();
      });

      component.formGroup = null
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('tpContr').setValue(TypeContract.TrabSemVinculo);
      expect(component.verifyValueTempParc(tmpParc)).toBeNull();
    });

    it('should result is equal to { invalidValue1: true }', () => {
      component.subFormGroup.get('indContr').setValue('N');
      const typeContracts = Object.values(TypeContract).filter(f => f != TypeContract.TrabSemVinculo).map(m => m as TypeContract);

      typeContracts.forEach(typeContract => {
        component.subFormGroup.get('tpContr').setValue(typeContract);

        [2, 3].forEach(value => {
          component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
          tmpParc.setValue(value);
          expect(component.verifyValueTempParc(tmpParc).invalidValue1).toBeTrue();
        });

        const categories = Object.values(CodCategEnum).filter(f => f !== CodCategEnum.Domestico).map(m => m as CodCategEnum);

        categories.forEach(category => {
          component.subFormGroup.get('codCateg').setValue(category);
          tmpParc.setValue(1);
          expect(component.verifyValueTempParc(tmpParc).invalidValue1).toBeTrue();
        });
      });
    });
  });

  describe(ListOfEmploymentContractComponent.prototype.verifyValueNatAtiv.name, () => {
    let natAtiv: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;

    it('should result is null', () => {
      component.subFormGroup.get('indContr').setValue('S');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoRural);
      natAtiv.setValue(1);
      expect(component.verifyValueNatAtiv(natAtiv)).toBeNull();

      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      natAtiv.setValue(1);
      expect(component.verifyValueNatAtiv(natAtiv)).toBeNull();

      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoRural);
      natAtiv.setValue(2);
      expect(component.verifyValueNatAtiv(natAtiv)).toBeNull();

      component.subFormGroup.get('indContr').setValue('N');
      const categories = Object.values(CodCategEnum).filter(f => f != CodCategEnum.Domestico && f != CodCategEnum.EmpregadoRural).map(m => m as CodCategEnum);
      categories.forEach(category => {
        component.subFormGroup.get('codCateg').setValue(category);

        [1, 2].forEach(value => {
          natAtiv.setValue(value);
          expect(component.verifyValueNatAtiv(natAtiv)).toBeNull();
        });
      });

      component.subFormGroup.get('indContr').setValue('N');
      natAtiv.setValue(null);
      expect(component.verifyValueNatAtiv(natAtiv)).toBeNull();
    });

    it('should result is equal to { invalidValue1: true }', () => {
      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.Domestico);
      natAtiv.setValue(2);
      expect(component.verifyValueNatAtiv(natAtiv).invalidValue1).toBeTrue();

      component.subFormGroup.get('indContr').setValue('N');
      component.subFormGroup.get('codCateg').setValue(CodCategEnum.EmpregadoRural);
      natAtiv.setValue(1);
      expect(component.verifyValueNatAtiv(natAtiv).invalidValue1).toBeTrue();
    });
  });
});
