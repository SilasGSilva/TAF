import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { of, ReplaySubject } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { ActivatedRouteMock } from '../../../../util/test/mock/global/activated-route.mock';
import { RouterMock } from '../../../../util/test/mock/global/router.mock';
import { LaborProcessTaxInfoServiceMock } from '../../../../util/test/mock/labor-process-tax-info-service.mock';
import { PoNotificationServiceMock } from '../../../../util/test/mock/po-components/po-notification-service.mock';
import { LaborProcessServiceMock } from '../../../../util/test/mock/labor-process-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../../util/test/mock/labor-process-data-state-service.mock';
import { CalcTrib, InfoCRIRRF, ProcessTax, IdeProc, ProcessWorker, IdeTrab, TpCREnum } from '../../../../app/models/labor-process-taxes.model';
import { ESocialVersionEnum, OptionsAnswer, TotvsPage } from '../../../models/labor-process.model';
import { OptionalValuesFormatterUtils } from '../../utils/optional-values-formatter-utils';
import { LaborProcessTaxInfoService } from '../../service/labor-process-tax-info.service';
import { LaborProcessService } from '../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { WorkerModalComponent } from './components/worker-modal/worker-modal.component';
import { LaborProcessTaxDetailComponent } from './labor-process-tax-detail.component';

describe(LaborProcessTaxDetailComponent.name, () => {
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let fb: UntypedFormBuilder;
  let service: LaborProcessTaxInfoService;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let laborProcessService: LaborProcessService;
  let notificationService: PoNotificationService;

  let component: LaborProcessTaxDetailComponent;

  let store = {
    ERPAPPCONFIG: {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
      multiProtocolPort: false,
    },
  };

  beforeEach(() => {
    router = new RouterMock() as unknown as Router;
    activatedRoute = new ActivatedRouteMock() as unknown as ActivatedRoute;
    fb = new UntypedFormBuilder();
    service = new LaborProcessTaxInfoServiceMock() as unknown as LaborProcessTaxInfoService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;
    laborProcessService = new LaborProcessServiceMock() as unknown as LaborProcessService;
    notificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;

    component = new LaborProcessTaxDetailComponent(
      router,
      activatedRoute,
      fb,
      service,
      laborProcessDataStateService,
      notificationService
    );
    component.subscriptions = [];

    component.workerModal = new WorkerModalComponent(
      fb,
      laborProcessService,
      laborProcessDataStateService,
      notificationService, );
  });

  describe(LaborProcessTaxDetailComponent.prototype.ngOnInit.name, () => {
    let paramsSubject: ReplaySubject<Params>;
    const processTax = {
      excluidoERP: 'S',
      branchId: '2',
      companyId: '1',
      ideTrab: [{
        cpfTrab: '1',
        infoCRIRRF: [{ tpCR: TpCREnum.CPAdicional, vrCR: 0 } as InfoCRIRRF],
        calcTrib: [{} as CalcTrib]
      } as IdeTrab],
      ideProc: {
        perApurPgto: '',
        obs: '',
        nrProcTrab: ''
      } as IdeProc
    } as ProcessTax;

    beforeEach(() => {
      sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(store.ERPAPPCONFIG));
      paramsSubject = new ReplaySubject(1);
      spyOnProperty(activatedRoute, 'params').and.returnValue(paramsSubject.asObservable());
      component.actions = [];
    });

    it('should initialized variables', () => {
      component.ngOnInit();

      expect(component.subscriptions.length).toEqual(3);
      expect(component.subscriptions.length).toEqual(3);
    });

    it('should is edit if id found', fakeAsync(() => {
      spyOn(service, 'get').and.returnValue(of({ hasNext: false, items: [processTax] } as TotvsPage<ProcessTax>));
      component.excluidoERP = OptionsAnswer.No;

      component.ngOnInit();

      paramsSubject.next({
        id: '1',
      });
      flushMicrotasks();

      expect(component.isEdit).toBeTrue();
      expect(component.actions.length).toEqual(1);
    }));

    it('should is not edit if id undefined', fakeAsync(() => {
      spyOn(service, 'get').and.returnValue(of({ hasNext: false, items: [processTax] } as TotvsPage<ProcessTax>));
      component.excluidoERP = OptionsAnswer.Yes;

      component.ngOnInit();

      paramsSubject.next({
        id: undefined,
      });
      flushMicrotasks();

      expect(component.isEdit).toBeFalse();
      expect(component.actions.length).toEqual(1);
    }));

    it('should call updateFormValidity from update formGroup', () => {
      spyOn(component, 'updateFormValidity' as any).and.stub();
      component.ngOnInit();
      component.formGroup.get('ideProc.obs').setValue('a');
      expect(component['updateFormValidity']).toHaveBeenCalled();
    });

    it('should call updateFormValidity from update formGroup.ideTrab', () => {
      spyOn(component, 'updateTableStatus' as any).and.stub();
      spyOn(component, 'updateFormValidity' as any).and.stub();
      component.ngOnInit();
      component.formGroup.get('ideTrab').setValue([]);
      expect(component['updateTableStatus']).toHaveBeenCalled();
      expect(component['updateFormValidity']).toHaveBeenCalled();
    });

    describe('when get eSocial version', () => {
      it('should update component version when return a correct version', () => {
        const mockVersion = ESocialVersionEnum.v2;

        spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(mockVersion);

        component.ngOnInit();

        expect(component.version).toEqual(mockVersion);
      });

      it('should navigate to process tax list when return a incorrect version', () => {
        const mockVersion = null;

        spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(mockVersion);
        spyOn(router, 'navigate');

        component.ngOnInit();

        expect(component.version).toEqual(mockVersion);
        expect(router.navigate).toHaveBeenCalledOnceWith(['labor-process/tax']);
      });
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.ngOnDestroy.name, () => {
    it('should unsubscribe subscriptions', () => {
      let paramsSubject: ReplaySubject<Params>;
      sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(store.ERPAPPCONFIG));
      paramsSubject = new ReplaySubject(1);
      spyOnProperty(activatedRoute, 'params').and.returnValue(paramsSubject.asObservable());
      component.actions = [];

      component.ngOnInit();
      component.subscriptions.forEach(subscription => spyOn(subscription, 'unsubscribe').and.stub());

      component.ngOnDestroy();
      component.subscriptions.forEach(subscription => expect(subscription.unsubscribe).toHaveBeenCalled());
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.goToPreviousPage.name, () => {
    it('should return to labor process tax list', async () => {
      spyOn(router, 'navigate').withArgs(['labor-process/tax']).and.stub();
      await component.goToPreviousPage();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.getWorkers.name, () => {
    it('should resultWorkers not updated', async () => {
      component.resultWorkers = [];
      spyOnProperty(component.formGroup.get('ideProc.nrProcTrab'), 'valid').and.returnValue(false);
      await component.getWorkers();
      expect(component.resultWorkers.length).toEqual(0);
    });

    it('should resultWorkers filled', async () => {
      component.resultWorkers = [];
      const page: TotvsPage<ProcessWorker> = {
        hasNext: false,
        items: [{
          cpfTrab: '86771581039',
          nmTrab: 'Name',
          dtNascto: new Date(2000, 1, 1)
        } as ProcessWorker]
      } as TotvsPage<ProcessWorker>;
      spyOnProperty(component.formGroup.get('ideProc.nrProcTrab'), 'valid').and.returnValue(true);
      spyOn(service, 'getProcessWorkers').and.returnValue(of(page));
      await component.getWorkers();
      expect(component.resultWorkers.length).toEqual(1);
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.clickToEditWorker.name, () => {
    it('should open modal to edit worker', () => {
      const rows = [
        {
          cpfTrab: '86771581039',
          nmTrab: 'Name 1',
          dtNascto: new Date(2000, 1, 1)
        } as ProcessWorker,
        {
          cpfTrab: '89984579034',
          nmTrab: 'Name 2',
          dtNascto: new Date(2000, 1, 2)
        } as ProcessWorker,
      ];
      const mockForm = fb.control([]);
      mockForm.setValue(rows);
      const clickIndex = 1;

      spyOn(component.formGroup, 'get').withArgs('ideTrab').and.returnValue(mockForm);
      spyOn(OptionalValuesFormatterUtils, 'removeDefaultOptionalValues').withArgs(rows[clickIndex]).and.returnValue(rows[clickIndex]);
      spyOn(component.workerModal, 'openModal').and.stub();

      component.clickToEditWorker(rows[clickIndex]);
      expect(component.workerModal.openModal).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.clickToEditWorker.name, () => {
    it('should close the modal and update the form', () => {
      const formGroup = component.createWorkerFormGroup(
        {
          cpfTrab: '89984579034',
          nmTrab: 'Name 2',
          dtNascto: new Date(2000, 1, 2),
          calcTrib: null,
          infoCRIRRF: null
        } as any
      );

      const rows: any[] = [
        {
          cpfTrab: '86771581039',
          nmTrab: 'Name 1',
          dtNascto: new Date(2000, 1, 1),
          calcTrib: null,
          infoCRIRRF: null
        },
        {
          cpfTrab: '89984579034',
          nmTrab: 'Name X',
          dtNascto: new Date(1999, 6, 6),
          calcTrib: null,
          infoCRIRRF: null
        },
      ];

      const formArray = component.formGroup.get('ideTrab') as UntypedFormArray;
      formArray.push(component.createWorkerFormGroup(rows[0]));
      formArray.push(component.createWorkerFormGroup(rows[1]));

      spyOn(component.workerModal, 'onClose').and.stub();

      component.onModalSave(formGroup);
      expect(component.workerModal.onClose).toHaveBeenCalled();
      expect(component.formGroup.get('ideTrab').value[1].nmTrab).toEqual('Name 2');
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.createWorkerFormGroup.name, () => {
    it('should create form group', () => {
      const resultValue = component.createWorkerFormGroup({
        cpfTrab: '86771581039',
        nmTrab: 'Name 1',
        dtNascto: new Date(2000, 1, 1)
      } as ProcessWorker);
      expect(resultValue).toBeDefined();
    });
  });

  describe('updateTableStatus', () => {
    it('should update "resultWorkers" with form data', () => {
      const rows: any[] = [
        {
          cpfTrab: '86771581039',
          nmTrab: 'Name 1',
          dtNascto: new Date(2000, 1, 1),
          calcTrib: null,
          infoCRIRRF: null
        },
        {
          cpfTrab: '89984579034',
          nmTrab: 'Name X',
          dtNascto: new Date(1999, 6, 6),
          calcTrib: null,
          infoCRIRRF: null
        },
        {
          cpfTrab: '00214381021',
          nmTrab: 'Name X',
          dtNascto: new Date(1999, 6, 6),
          calcTrib: null,
          infoCRIRRF: null
        }
      ];
      const workers: ProcessWorker[] = [
        {
          cpfTrab: '86771581039',
          nmTrab: 'Name 1',
          dtNascto: new Date(2000, 1, 1),
          hasCalculationPeriod: ''
        } as ProcessWorker,
        {
          cpfTrab: '89984579034',
          nmTrab: 'Name 2',
          dtNascto: new Date(2000, 1, 2)
        } as ProcessWorker,
        {
          cpfTrab: '31962331032',
          nmTrab: 'Name 3',
          dtNascto: new Date(2000, 1, 3)
        } as ProcessWorker
      ];

      const formArray = component.formGroup.get('ideTrab') as UntypedFormArray;
      formArray.push(component.createWorkerFormGroup(rows[0]));
      formArray.push(component.createWorkerFormGroup(rows[1]));

      component.resultWorkers = workers;

      component['updateTableStatus']();
      expect(component.resultWorkers.length).toEqual(3);
    });
  });

  describe('updateFormValidity', () => {
    it('should result is true', () => {
      component.resultWorkers = [{ hasCalculationPeriod: ['hasValidPeriod'] }];
      spyOnProperty(component.formGroup, 'valid').and.returnValue(true);
      component.excluidoERP = OptionsAnswer.No;
      component['updateFormValidity']();
      expect(component.isFormValid).toBeTrue();
    });

    it('should result is false from excluirERP equals to OptionsAnswer.Yes', () => {
      component.resultWorkers = [{ hasCalculationPeriod: ['hasValidPeriod'] }];
      spyOnProperty(component.formGroup, 'valid').and.returnValue(true);
      component.excluidoERP = OptionsAnswer.Yes;
      component['updateFormValidity']();
      expect(component.isFormValid).toBeFalse();
    });

    it('should result is false from formGroup is invalid', () => {
      component.resultWorkers = [{ hasCalculationPeriod: ['hasValidPeriod'] }];
      spyOnProperty(component.formGroup, 'valid').and.returnValue(false);
      component.excluidoERP = OptionsAnswer.No;
      component['updateFormValidity']();
      expect(component.isFormValid).toBeFalse();
    });

    it('should result is false from hasCalculationPeriod not found hasValidPeriod', () => {
      component.resultWorkers = [{ hasCalculationPeriod: [''] }];
      spyOnProperty(component, 'isV1').and.returnValue(true);
      spyOnProperty(component.formGroup, 'valid').and.returnValue(true);
      component.excluidoERP = OptionsAnswer.No;
      component['updateFormValidity']();
      expect(component.isFormValid).toBeFalse();
    });
  });

  describe(LaborProcessTaxDetailComponent.prototype.savePayment.name, () => {
    beforeEach(() => {
      spyOn(notificationService, 'success').and.stub();
      spyOn(notificationService, 'error').and.stub();
    });

    it('should create process tax in V1', async () => {
      const resultCreate = { hasNext: false, items: [] } as TotvsPage<ProcessTax>
      spyOn(service, 'create').and.returnValue(of(resultCreate));
      spyOnProperty(component, 'isV1').and.returnValue(true);
      component.isEdit = false;
      await component.savePayment();
      expect(service.create).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalled();
    });

    it('should create process tax', async () => {
      const resultCreate = { hasNext: false, items: [] } as TotvsPage<ProcessTax>
      spyOn(service, 'create').and.returnValue(of(resultCreate));
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(ESocialVersionEnum.v2);
      component.isEdit = false;
      await component.savePayment();
      expect(service.create).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalled();
    });

    it('should edit process tax', async () => {
      const resultCreate = { hasNext: false, items: [] } as TotvsPage<ProcessTax>
      spyOn(service, 'edit').and.returnValue(of(resultCreate));
      component.isEdit = true;
      await component.savePayment();
      expect(service.edit).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalled();
    });

    it('should error create from result is null', async () => {
      spyOn(service, 'create').and.returnValue(of(null));
      component.isEdit = false;
      await component.savePayment();
      expect(service.create).toHaveBeenCalled();
      expect(notificationService.error).toHaveBeenCalled();
    });

    it('should error edit from result is null', async () => {
      spyOn(service, 'edit').and.returnValue(of(null));
      component.isEdit = true;
      await component.savePayment();
      expect(service.edit).toHaveBeenCalled();
      expect(notificationService.error).toHaveBeenCalled();
    });

    it('should catch error create from service', async () => {
      spyOn(service, 'create').and.throwError(new Error(''));
      component.isEdit = false;
      await component.savePayment();
      expect(service.create).toHaveBeenCalled();
      expect(notificationService.error).toHaveBeenCalled();
    });

    it('should catch error edit from service', async () => {
      spyOn(service, 'edit').and.throwError(new Error(''));
      component.isEdit = true;
      await component.savePayment();
      expect(service.edit).toHaveBeenCalled();
      expect(notificationService.error).toHaveBeenCalled();
    });
  });
});
