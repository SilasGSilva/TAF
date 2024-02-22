import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PoNotificationService, PoDialogService } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { ActivatedRouteMock } from '../../../../util/test/mock/global/activated-route.mock';
import { RouterMock } from '../../../../util/test/mock/global/router.mock';
import { PoNotificationServiceMock } from '../../../../util/test/mock/po-components/po-notification-service.mock';
import { PoDialogServiceMock } from '../../../../util/test/mock/po-components/po-dialog.service.mock';
import { LaborProcessTaxInfoServiceMock } from '../../../../util/test/mock/labor-process-tax-info-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../../util/test/mock/labor-process-data-state-service.mock';
import { ProAppConfigServiceMock } from '../../../../util/test/mock/pro-app-config-service.mock';
import { AbstractControlMock } from '../../../../util/test/mock/global/abstract-control-mock';
import { ESocialVersionEnum, TotvsPage } from '../../../../app/models/labor-process.model';
import { ProcessTax, SimpleProcessTax } from '../../../../app/models/labor-process-taxes.model';
import { LaborProcessTaxInfoService } from '../../service/labor-process-tax-info.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { LaborProcessTaxListComponent } from './labor-process-tax-list.component';

describe(LaborProcessTaxListComponent.name, () => {
  let fb: UntypedFormBuilder;
  let laborProcessTaxInfoService: LaborProcessTaxInfoService;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let activatedroute: ActivatedRoute;
  let router: Router;
  let proAppconfigService: ProAppConfigService;
  let poNotificationService: PoNotificationService;
  let poDialogService: PoDialogService;
  let component: LaborProcessTaxListComponent;

  let store = {
    ERPAPPCONFIG: '{ "productLine": "protheus" }',
  };

  const simpleProcessTax: SimpleProcessTax = {
    id: 'id',
    nrProcTrab: 'npTrab',
    perApurPagto: 'paPagto'
  };

  beforeEach(() => {
    fb = new UntypedFormBuilder;
    laborProcessTaxInfoService = new LaborProcessTaxInfoServiceMock() as unknown as LaborProcessTaxInfoService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;
    activatedroute = new ActivatedRouteMock() as unknown as ActivatedRoute;
    router = new RouterMock() as unknown as Router;
    proAppconfigService = new ProAppConfigServiceMock() as unknown as ProAppConfigService;
    poNotificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;
    poDialogService = new PoDialogServiceMock() as unknown as PoDialogService;

    component = new LaborProcessTaxListComponent(
      fb,
      laborProcessTaxInfoService,
      laborProcessDataStateService,
      activatedroute,
      router,
      proAppconfigService,
      poNotificationService,
      poDialogService,
    );

    component.formGroup = fb.group({
      nrProcTrab: [null],
      perApurPagto: [null]
    });
  });

  describe(LaborProcessTaxListComponent.prototype.ngOnInit.name, () => {
    it('with isProtheus', async () => {
      component.profileActions = [];
      component.rows = [simpleProcessTax, simpleProcessTax, simpleProcessTax];
      component.page = 2;

      const totvsPage = {
        hasNext: false,
        items: [simpleProcessTax]
      } as TotvsPage<SimpleProcessTax>;
      sessionStorage.setItem('ERPAPPCONFIG', store["ERPAPPCONFIG"]);
      spyOn(laborProcessTaxInfoService, 'getAll').and.returnValue(of(totvsPage));

      await component.ngOnInit();
      expect(component.profileActions.length).toEqual(1);
      expect(component.rows.length).toEqual(1);
      expect(component.page).toEqual(1);
    });

    it('with test logout in protheus', async () => {
      component.profileActions = [];
      component.rows = [simpleProcessTax, simpleProcessTax, simpleProcessTax];
      component.page = 2;

      const totvsPage = {
        hasNext: false,
        items: [simpleProcessTax]
      } as TotvsPage<SimpleProcessTax>;
      sessionStorage.setItem('ERPAPPCONFIG', store["ERPAPPCONFIG"]);
      spyOn(laborProcessTaxInfoService, 'getAll').and.returnValue(of(totvsPage));

      await component.ngOnInit();
      expect(component.profileActions.length).toEqual(1);

      spyOn(proAppconfigService, 'callAppClose').withArgs(true);
      component.profileActions[0].action();
      expect(proAppconfigService.callAppClose).toHaveBeenCalled();
    });

    it('with not isProtheus and nrProcTrab is invalid', async () => {
      component.profileActions = [];
      component.rows = [simpleProcessTax, simpleProcessTax, simpleProcessTax];
      component.page = 2;

      const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;
      spyOnProperty(control, 'valid').and.returnValue(false);
      spyOn(component.formGroup, 'get').and.returnValue(control);

      const totvsPage = {
        hasNext: false,
        items: [simpleProcessTax]
      } as TotvsPage<SimpleProcessTax>;
      sessionStorage.setItem('ERPAPPCONFIG', '{ "productLine": "RM" }');
      spyOn(laborProcessTaxInfoService, 'getAll').and.returnValue(of(totvsPage));

      await component.ngOnInit();
      expect(component.profileActions.length).toEqual(0);
      expect(component.rows.length).toEqual(0);
      expect(component.page).toEqual(1);
    });
  });

  describe('hasVersion getter', () => {
    it('should return TRUE if version is defined', () => {
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(ESocialVersionEnum.v2);

      const result = component.hasVersion;

      expect(result).toBeTrue();
    });
  
    it('should return FALSE if version is NOT defined', () => {
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(null);

      const result = component.hasVersion;

      expect(result).toBeFalse();
    });
  });

  describe(LaborProcessTaxListComponent.prototype.onShowMore.name, () => {
    it('should update rows list and pagination states', () => {
      component.rows = [simpleProcessTax, simpleProcessTax, simpleProcessTax];
      const control: AbstractControl<any, any> = new AbstractControlMock() as unknown as AbstractControl;
      spyOnProperty(control, 'valid').and.returnValue(false);
      spyOn(component.formGroup, 'get').and.returnValue(control);

      component.hasNext = false;
      component.page = 1;
      component.onShowMore();
      expect(component.page).toEqual(1);
      expect(component.rows.length).toEqual(3);

      component.hasNext = true;
      component.onShowMore();
      expect(component.page).toEqual(2);
      expect(component.rows.length).toEqual(3);
    });
  });

  describe(LaborProcessTaxListComponent.prototype.onEdit.name, () => {
    it('should invoke navigate', () => {
      spyOn(router, 'navigate').and.stub();
      component.onEdit(simpleProcessTax);
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe(LaborProcessTaxListComponent.prototype.confirmDeleteDialog.name, () => {
    it('should confirm in "poDialogService"', () => {
      spyOn(poDialogService, 'confirm').and.stub();
      component.confirmDeleteDialog(simpleProcessTax);
      expect(poDialogService.confirm).toHaveBeenCalled();
    });
  });

  describe('when confirm delete dialog', () => {
    it('should success notification', done => {
      spyOn(laborProcessTaxInfoService, 'delete').and.returnValue(of({} as TotvsPage<ProcessTax>));
      spyOn(poNotificationService, 'success').and.stub();
      spyOn(laborProcessTaxInfoService, 'getAll').and.returnValue(of({ items: [simpleProcessTax] } as TotvsPage<SimpleProcessTax>));

      spyOn(poDialogService, 'confirm').and.callFake(async options => {
        expect(options.confirm).toBeDefined();
        await options.confirm();
        expect(poNotificationService.success).toHaveBeenCalled();
        done();
      });

      component.confirmDeleteDialog(simpleProcessTax);
    });

    it('should error notification', done => {
      spyOn(laborProcessTaxInfoService, 'delete').and.returnValue(of(null));
      spyOn(poNotificationService, 'error').and.stub();

      spyOn(poDialogService, 'confirm').and.callFake(async options => {
        expect(options.confirm).toBeDefined();
        await options.confirm();
        expect(poNotificationService.error).toHaveBeenCalled();
        done();
      });

      component.confirmDeleteDialog(simpleProcessTax);
    });
  });
});
