import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { DedDepen, DespProcJud, IdeAdv, InfoCRIRRF, InfoIR, InfoRRA, PenAlim, TpCREnum, TpInscEnum, TpRendEnum } from '../../../../../models/labor-process-taxes.model';
import { ESocialVersionEnum } from '../../../../../models/labor-process.model';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { IrrfInformationComponent } from './irrf-information.component';

describe(IrrfInformationComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let component: IrrfInformationComponent;

  let rows: any[];

  const infoCRIRRF = {
    tpCR: 3 as TpCREnum,
    vrCR: 3.01,
    infoIR: {
      vrRendTrib: 0,
      vrRendTrib13: 0,
      vrRendMoleGrave: 0,
      vrRendIsen65: 0,
      vrJurosMora: 0,
      vrRendIsenNTrib: 0,
      descIsenNTrib: '',
      vrPrevOficial: 0,
    } as InfoIR,
    infoRRA: {
      descRRA: '',
      qtdMesesRRA: 0,
      despProcJud: {
        vlrDespCustas: 0,
        vlrDespAdvogados: 0,
      } as DespProcJud,
      ideAdv: [
        {
          tpInsc: 1 as TpInscEnum,
          nrInsc: '',
          vlrAdv: 0,
        } as IdeAdv,
      ],
    } as InfoRRA,
    dedDepen: [
      {
        tpRend: 1 as TpRendEnum,
        cpfDep: '',
        vlrDeducao: 0,
      } as DedDepen,
    ],
    penAlim: [
      {
        tpRend: 1 as TpRendEnum,
        cpfDep: '' as string,
        vlrPensao: 0,
      } as PenAlim,
    ],
  } as InfoCRIRRF;

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    laborProcessDataStateService = (new LaborProcessDataStateServiceMock() as unknown) as LaborProcessDataStateService;
    component = new IrrfInformationComponent(fb, laborProcessDataStateService);
    component.currentFormGroup = fb.group({
      infoCRIRRF: fb.control([]),
    });
    rows = [
      {
        ...infoCRIRRF,
        tpCR: 1,
        vrCR: 0.01,
      },
      {
        ...infoCRIRRF,
        tpCR: 2,
        vrCR: 0.02,
      },
    ];
    component.currentFormGroup.get('infoCRIRRF').setValue(rows);
    component.subFormGroup = component['createSubFormGroup']();
    component.rows = rows.map(m => {
      const value = {
        codigoReceitaLabel: m.tpCR,
        valorLabel: m.vrCR,
      } as any;
      return value;
    });
  });

  describe('isV1 getter', () => {
    it('should return TRUE if "version" is "v1"', () => {
      component.version = ESocialVersionEnum.v1;

      const result = component.isV1;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "version" is NOT "v1"', () => {
      component.version = ESocialVersionEnum.v2;

      const result = component.isV1;

      expect(result).toBeFalse();
    });
  });

  it('formArray getter', () => {
    expect(component.formArray).toBeDefined();
    component.currentFormGroup = null;
    expect(component.formArray).toBeUndefined();
  });

  it('formArrayValue getter', () => {
    component.currentFormGroup.get('infoCRIRRF').setValue(rows);
    expect(component.formArrayValue.length).toEqual(rows.length);
    component.formArray.setValue(null);
    expect(component.formArrayValue.length).toEqual(0);
  });

  describe('isDisabledWithholdingAndJudicialDeposits getter', () => {
    it('should return TRUE if "tpCR" disables InfoProcRet', () => {
      const tpCR = TpCREnum.IRRFRRA;
      component.subFormGroup.get('tpCR').setValue(tpCR);

      const result = component.isDisabledWithholdingAndJudicialDeposits;

      expect(result).toBeTrue();
    });

    it('should return FALSE if "tpCR" does NOT disable InfoProcRet', () => {
      const tpCR = TpCREnum.IRRFDecisaoJustica;
      component.subFormGroup.get('tpCR').setValue(tpCR);

      const result = component.isDisabledWithholdingAndJudicialDeposits;

      expect(result).toBeFalse();
    });
  });

  describe(IrrfInformationComponent.prototype.ngOnInit.name, () => {
    it('should actions is empty from excluidoERP equal to "S"', () => {
      const rows: InfoCRIRRF[] = component.currentFormGroup.get('infoCRIRRF').value;
      rows.push({} as InfoCRIRRF);
      component.excluidoERP = 'S';
      component.currentFormGroup.get('infoCRIRRF').setValue(rows);
      component.ngOnInit();
      expect(component.rows.length).toEqual(3);
      expect(component.actions.length).toEqual(1);
    });

    it('should actions edit and delete from excluidoERP equal to "N"', () => {
      const rows: InfoCRIRRF[] = component.currentFormGroup.get('infoCRIRRF').value;
      rows.push({} as InfoCRIRRF);
      component.excluidoERP = 'N';
      component.currentFormGroup.get('infoCRIRRF').setValue(rows);
      component.ngOnInit();
      expect(component.rows.length).toEqual(3);
      expect(component.actions.length).toEqual(2);
    });

    it('should actions edit and delete from excluidoERP equal to "N"', () => {
      component.ngOnInit();
      spyOn(component, 'transformRows').and.stub();

      const subscription = component.currentFormGroup.get('infoCRIRRF').valueChanges.subscribe(() => {
        expect(component.transformRows).toHaveBeenCalled();
      });

      component.currentFormGroup.get('infoCRIRRF').setValue([]);
      subscription.unsubscribe();
    });

    it('should add all of subscriptions', () => {
      const totalSubscriptions = 2;

      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(totalSubscriptions);
    });

    const validityFunctionsWithFields = {
      'handleChangesTpCR': ['tpCR'],
    }

    Object.entries(validityFunctionsWithFields).forEach(([validationFunction, fields]) => {
      describe(`should invoke ${validationFunction} validation`, () => {
        fields.forEach((field: string) => {
          it(`when ${field} field changes`, () => {
            spyOn<any>(component, validationFunction);
        
            component.ngOnInit();
            component.subFormGroup.get(field).setValue('mockValue');
        
            expect(component[validationFunction]).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe(IrrfInformationComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      component.subscriptions = [
        (new SubscriptionMock() as unknown) as Subscription,
      ];
      spyOn(component.subscriptions[0], 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscriptions[0].unsubscribe).toHaveBeenCalled();
    });
  });

  it(IrrfInformationComponent.prototype.create.name, () => {
    spyOn(component.subFormGroup, 'reset').and.stub();
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    expect(component.isSelected).toBeTrue();
    expect(component.isEdit).toBeFalse();
    expect(component.subFormGroup.reset).toHaveBeenCalled();
  });

  it('saveIrrf', () => {
    component.isSelected = true;
    component.subFormGroup.value.tpCr = 3;
    component.subFormGroup.value.vrCr = 3.01;
    component.save();
    expect(component.formArray.value.length).toEqual(3);
    expect(component.isSelected).toBeFalse();
  });

  it('updateIrrf', () => {
    component.isSelected = true;
    component.subFormGroup.patchValue(infoCRIRRF);
    component.editIndex = 1;

    component.update();
    expect(component.formArray.value[1].tpCR).toEqual(3);
    expect(component.isSelected).toBeFalse();
  });

  it('clickToEditIrrf', () => {
    component.isEdit = false;
    component.isSelected = false;
    component.editIndex = 0;

    component.handleClickEdit(component.rows[1]);
    expect(component.isEdit).toBeTrue();
    expect(component.editIndex).toEqual(1);
    expect(component.isSelected).toBeTrue();
    expect(component.subFormGroup.get('tpCR').value).toEqual(2);
  });

  it('deleteIrrf', () => {
    component.isEdit = true;
    component.isSelected = true;

    component.handleClickDelete(component.rows[1]);
    expect(component.formArray.value.length).toEqual(1);
    expect(component.isEdit).toBeFalse();
    expect(component.isSelected).toBeFalse();
  });

  it(IrrfInformationComponent.prototype.cancel.name, () => {
    component.isSelected = true;
    component.cancel();

    expect(component.isSelected).toBeFalse();
  });
});
