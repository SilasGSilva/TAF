import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { PoDialogService, PoNotificationService, PoToasterOrientation } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { ActivatedRouteMock } from '../../../../util/test/mock/global/activated-route.mock';
import { RouterMock } from '../../../../util/test/mock/global/router.mock';
import { LaborProcessServiceMock } from '../../../../util/test/mock/labor-process-service.mock';
import { PoDialogServiceMock } from '../../../../util/test/mock/po-components/po-dialog.service.mock';
import { PoNotificationServiceMock } from '../../../../util/test/mock/po-components/po-notification-service.mock';
import { ProAppConfigServiceMock } from '../../../../util/test/mock/pro-app-config-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../../util/test/mock/labor-process-data-state-service.mock';
import { LaborProcessService } from '../../../../app/labor-process/service/labor-process.service';
import { ESocialVersionEnum, LaborProcess, TotvsPage } from '../../../../app/models/labor-process.model';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { DELAY_TO_GET_ERP_RESPONSE_MS, LaborProcessListComponent } from './labor-process-list.component';

describe(LaborProcessListComponent.name, () => {
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let service: LaborProcessService;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let dialogService: PoDialogService;
  let configService: ProAppConfigService;
  let notificationService: PoNotificationService;
  let component: LaborProcessListComponent;

  let fb: UntypedFormBuilder;

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
    router = (new RouterMock() as unknown) as Router;
    activatedRoute = (new ActivatedRouteMock() as unknown) as ActivatedRoute;
    service = (new LaborProcessServiceMock() as unknown) as LaborProcessService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as LaborProcessDataStateService;
    dialogService = (new PoDialogServiceMock() as unknown) as PoDialogService;
    configService = (new ProAppConfigServiceMock() as unknown) as ProAppConfigService;
    notificationService = (new PoNotificationServiceMock() as unknown) as PoNotificationService;

    component = new LaborProcessListComponent(
      router,
      activatedRoute,
      service,
      laborProcessDataStateService,
      dialogService,
      configService,
      notificationService
    );

    fb = new UntypedFormBuilder();

    component.queryFieldNrProcess = fb.control(null);
    component.queryFieldCpf = fb.control(null);
  });

  describe('hasVersion getter', () => {
    it('should return TRUE when version is defined', () => {
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(ESocialVersionEnum.v2);

      const result = component.hasVersion;

      expect(result).toBeTrue();
    });

    it('should return FALSE when version is NOT defined', () => {
      spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(null);

      const result = component.hasVersion;

      expect(result).toBeFalse();
    });
  });

  describe(LaborProcessListComponent.prototype.ngOnInit.name, async () => {
    const clock = jasmine.clock();

    beforeEach(() => {
      sessionStorage.setItem('ERPAPPCONFIG', JSON.stringify(store.ERPAPPCONFIG));

      clock.install();
    });

    afterEach(() => {
      clock.uninstall();
    });

    it('should fill profileActions if productLine is equal to Protheus', async () => {
      component.profileActions = [];
      component.result = [{}];
      component.page = 2;

      await component.ngOnInit();
      clock.tick(DELAY_TO_GET_ERP_RESPONSE_MS);
      expect(component.profileActions.length).toEqual(1);
      expect(component.isLoading).toBeTrue();
      expect(component.result.length).toEqual(1);
      expect(component.page).toEqual(2);

      spyOn(configService, 'callAppClose').withArgs(true);
      component.profileActions[0].action();
      expect(configService.callAppClose).toHaveBeenCalled();
    });

    describe('when verify setData', () => {
      it('should try set the data', async () => {
        spyOn(laborProcessDataStateService, 'setData');
        await component.ngOnInit();
        clock.tick(DELAY_TO_GET_ERP_RESPONSE_MS);

        expect(laborProcessDataStateService.setData).toHaveBeenCalledOnceWith();
      });

      it('should show notification if setVersion throws exception', async () => {
        const mockErrorMessage = 'Error to get version';
        const mockError = new HttpErrorResponse({
          error: {
            Message: mockErrorMessage,
          },
        });
        const expectedToaster = {
          message: mockErrorMessage,
          orientation: PoToasterOrientation.Top,
        };

        spyOn(laborProcessDataStateService, 'setData').and.throwError(mockError);
        spyOn(notificationService, 'error');
        await component.ngOnInit();
        clock.tick(DELAY_TO_GET_ERP_RESPONSE_MS);

        expect(notificationService.error).toHaveBeenCalledOnceWith(expectedToaster);
      });
    });
  });

  it(`${LaborProcessListComponent.prototype.onShowMore.name} should load more data`, async () => {
    component.page = 1;
    spyOn(component, 'loadDataToTable').withArgs().and.stub();
    await component.onShowMore();
    expect(component.page).toEqual(2);
    expect(component.loadDataToTable).toHaveBeenCalled();
  });

  it(`${LaborProcessListComponent.prototype.loadDataToTable.name} should clear page properties`, async () => {
    component.result = [{}];
    component.page = 2;
    await component.loadDataToTable(true);
    expect(component.result.length).toEqual(0);
    expect(component.page).toEqual(1);
  });

  it(`${LaborProcessListComponent.prototype.editProcess.name} should change page`, async () => {
    spyOn(router, 'navigate').and.stub();
    await component.editProcess(({ id: 1 } as unknown) as LaborProcess);
    expect(router.navigate).toHaveBeenCalled();
  });

  it(`${LaborProcessListComponent.prototype.confirmDeleteDialog.name} should confirm dialog`, () => {
    spyOn(dialogService, 'confirm').and.stub();
    component.confirmDeleteDialog(({ id: 1 } as unknown) as LaborProcess);
    expect(dialogService.confirm).toHaveBeenCalled();
  });

  describe('when confirm delete dialog', () => {
    it('should success notification', done => {
      spyOn(service, 'delete').and.returnValue(of(null));
      spyOn(notificationService, 'success').and.stub();

      spyOn(dialogService, 'confirm').and.callFake(async options => {
        expect(options.confirm).toBeDefined();
        await options.confirm();
        expect(notificationService.success).toHaveBeenCalled();
        done();
      });

      component.confirmDeleteDialog(({ id: 1 } as unknown) as LaborProcess);
    });

    it('should error notification', done => {
      const error = new HttpErrorResponse({ error: { message: '' } });
      spyOn(service, 'delete').and.throwError(error);
      spyOn(notificationService, 'error').and.stub();

      spyOn(dialogService, 'confirm').and.callFake(async options => {
        expect(options.confirm).toBeDefined();
        await options.confirm();
        expect(notificationService.error).toHaveBeenCalled();
        done();
      });

      component.confirmDeleteDialog(({ id: 1 } as unknown) as LaborProcess);
    });
  });
});
