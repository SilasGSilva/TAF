import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, ReplaySubject, throwError } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { ESocialVersionEnum, InfoContr, LaborProcess, OptionsAnswer, TotvsPage } from '../../../../app/models/labor-process.model';
import { RouterMock } from '../../../../util/test/mock/global/router.mock';
import { PoNotificationServiceMock } from '../../../../util/test/mock/po-components/po-notification-service.mock';
import { LaborProcessServiceMock } from '../../../../util/test/mock/labor-process-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../../util/test/mock/labor-process-data-state-service.mock';
import { LaborProcessService } from '../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../service/labor-process-data-state.service';
import { PayloadUtils } from './utils/payload-utils';
import { LaborProcessDetailComponent } from './labor-process-detail.component';

describe(LaborProcessDetailComponent.name, () => {
  let router: Router;
  let fb: UntypedFormBuilder;
  let notificationService: PoNotificationService;
  let laborProcessService: LaborProcessService;
  let laborProcessDataStateService: LaborProcessDataStateService;

  let component: LaborProcessDetailComponent;

  let paramsSubject: ReplaySubject<Params>;

  beforeEach(() => {
    router = new RouterMock() as unknown as Router;
    fb = new UntypedFormBuilder();
    notificationService = new PoNotificationServiceMock() as unknown as PoNotificationService;
    laborProcessService = new LaborProcessServiceMock() as unknown as LaborProcessService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;

    paramsSubject = new ReplaySubject(1);
    const activatedRoute = {
      params: paramsSubject.asObservable(),
    } as jasmine.SpyObj<ActivatedRoute>;

    component = new LaborProcessDetailComponent(
      router,
      fb,
      notificationService,
      activatedRoute,
      laborProcessService,
      laborProcessDataStateService
    );
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

  describe(LaborProcessDetailComponent.prototype.ngOnInit.name, () => {
    describe('when get version', () => {
      it('should set project version if it is defined', () => {
        const mockVersion = ESocialVersionEnum.v2;

        spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(mockVersion);
        component.ngOnInit();

        expect(component.version).toEqual(mockVersion);
      });

      it('should return to main page if it is NULL', () => {
        const mainPageRoute = '/labor-process';

        spyOn(laborProcessDataStateService, 'getVersion').and.returnValue(null);
        spyOn(router, 'navigate');
        component.ngOnInit();

        expect(router.navigate).toHaveBeenCalledOnceWith([mainPageRoute]);
      });
    });

    it('with edit labor process', fakeAsync(async () => {
      spyOn(laborProcessService, 'getSimple').and.returnValue(of(null));
      component.ngOnInit();
      paramsSubject.next({ id: 'b202caae-ff85-496c-8b71-da7650c35775' });
      flushMicrotasks();

      expect(component.isEdit).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(component.excluidoERP).toEqual(OptionsAnswer.No);
    }));

    it('with edit labor process and variable "excluirERP" equal to "S"', fakeAsync(async () => {
      spyOn(laborProcessService, 'getSimple').and.returnValue(of({ hasNext: false, items: [{ excluidoERP: 'S' }] } as TotvsPage<any>));
      component.ngOnInit();
      paramsSubject.next({ id: 'b202caae-ff85-496c-8b71-da7650c35775' });
      flushMicrotasks();

      expect(component.isEdit).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(component.excluidoERP).toEqual(OptionsAnswer.Yes);
    }));

    it('with edit labor process and throw HttpErrorResponse in getSimple', fakeAsync(async () => {
      spyOn(laborProcessService, 'getSimple').and.returnValue(throwError(() => new HttpErrorResponse({})));
      spyOn(notificationService, 'error');
      component.ngOnInit();
      paramsSubject.next({ id: 'b202caae-ff85-496c-8b71-da7650c35775' });
      flushMicrotasks();

      expect(component.isEdit).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(notificationService.error).toHaveBeenCalled();
    }));

    it('with edit labor process and throw generic error in getSimple', fakeAsync(async () => {
      spyOn(laborProcessService, 'getSimple').and.returnValue(throwError(() => new Error()));
      spyOn(notificationService, 'error');
      component.ngOnInit();
      paramsSubject.next({ id: 'b202caae-ff85-496c-8b71-da7650c35775' });
      flushMicrotasks();

      expect(component.isEdit).toBeTrue();
      expect(component.isLoading).toBeFalse();
      expect(notificationService.error).not.toHaveBeenCalled();
    }));

    it('with create new labor process', fakeAsync(async () => {
      component.ngOnInit();
      paramsSubject.next({ id: undefined });
      flushMicrotasks();

      expect(component.isEdit).toBeFalse();
      expect(component.isLoading).toBeFalse();
    }));
  });

  describe(LaborProcessDetailComponent.prototype.save.name, () => {
    beforeEach(() => {
      const emptyInfoContr = [{
        ideEstab: {
          infoVlr: {
            idePeriodo: [{
              baseCalculo: {},
              infoFGTS: {},
            }],
          },
        },
        infoCompl: {
          infoVinc: {
            infoDeslig: {},
          },
        },
      }];

      component.formGroup.get('ideTrab.infoContr').setValue(emptyInfoContr);

      spyOn(PayloadUtils, 'changeOptionalValuesLaborProcess').and.stub();
    });

    describe('when create a new labor process', () => {
      it('should create it and empty values with v1', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);
        component.version = ESocialVersionEnum.v1;

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });

      it('should create it and empty values with v2', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);
        component.version = ESocialVersionEnum.v2;

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });

      it('should create it and empty values', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });

      it('should create it and result error in post', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(of(null));
        spyOn(notificationService, 'error');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalled();
      });

      it('should create it and result throw HttpErrorResponse in post', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(throwError(() => new HttpErrorResponse({})));
        spyOn(notificationService, 'error');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalled();
      });

      it('should create it and result throw generic error in post', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(throwError(() => new Error()));
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.success).not.toHaveBeenCalled();
        expect(notificationService.error).not.toHaveBeenCalled();
      });

      it('should create it and full values', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'post').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(false);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(1);
        component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('1');
        component.formGroup.get('infoProcesso.obsProcTrab').setValue('obs');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue('90984471000174');
        component.formGroup.get('ideTrab.cpfTrab').setValue('15158659087');
        component.formGroup.get('ideTrab.nmTrab').setValue('Josias');
        component.formGroup.get('ideTrab.dtNascto').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.ufVara').setValue('SP');
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.codMunic').setValue(12345);
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.idVara').setValue(9);
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.tpCCP').setValue(9);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.post).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });
    });

    describe('when edit then exist labor process', () => {
      it('should update it and empty values', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'update').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(true);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.update).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });

      it('should update it and empty values and result error in update', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'update').and.returnValue(of(null));
        spyOn(notificationService, 'error');
        component.isEditSubject.next(true);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.update).toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalled();
      });

      it('should update it and empty values and throw HttpErrorResponse in update', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'update').and.returnValue(throwError(() => new HttpErrorResponse({})));
        spyOn(notificationService, 'error');
        component.isEditSubject.next(true);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.update).toHaveBeenCalled();
        expect(notificationService.error).toHaveBeenCalled();
      });

      it('should update it and empty values and throw generic error in update', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'update').and.returnValue(throwError(() => new Error()));
        spyOn(notificationService, 'success');
        spyOn(notificationService, 'error');
        component.isEditSubject.next(true);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue(null);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.update).toHaveBeenCalled();
        expect(notificationService.success).not.toHaveBeenCalled();
        expect(notificationService.error).not.toHaveBeenCalled();
      });

      it('should update it and full values', async () => {
        spyOn(component.formGroup, 'markAsDirty');
        spyOn(laborProcessService, 'update').and.returnValue(of({} as TotvsPage<LaborProcess>));
        spyOn(notificationService, 'success');
        component.isEditSubject.next(true);
        component.formGroup.get('infoProcesso.origem').setValue('1');
        component.formGroup.get('infoProcesso.nrProcTrab').setValue('12345678901234567890');
        component.formGroup.get('infoProcesso.ideResp.tpInsc').setValue(1);
        component.formGroup.get('infoProcesso.ideResp.nrInsc').setValue('1');
        component.formGroup.get('infoProcesso.obsProcTrab').setValue('obs');
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.cnpjCCP').setValue('90984471000174');
        component.formGroup.get('ideTrab.cpfTrab').setValue('15158659087');
        component.formGroup.get('ideTrab.nmTrab').setValue('Josias');
        component.formGroup.get('ideTrab.dtNascto').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.dtSent').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.ufVara').setValue('SP');
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.codMunic').setValue(12345);
        component.formGroup.get('infoProcesso.dadosCompl.infoProcJud.idVara').setValue(9);
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.dtCCP').setValue(new Date(1980, 1, 1));
        component.formGroup.get('infoProcesso.dadosCompl.infoCCP.tpCCP').setValue(9);

        await component.save();

        expect(component.formGroup.valid).toBeTrue();
        expect(component.formGroup.markAsDirty).not.toHaveBeenCalled();
        expect(laborProcessService.update).toHaveBeenCalled();
        expect(notificationService.success).toHaveBeenCalled();
      });
    });

    it('with entries invalid in form', async () => {
      spyOn(component.formGroup, 'markAsDirty');

      await component.save();

      expect(component.formGroup.valid).toBeFalse();
      expect(component.formGroup.markAsDirty).toHaveBeenCalled();
    });
  });

  it(LaborProcessDetailComponent.prototype.convertData.name, () => {
    expect(component.convertData("MM/YYYY")).toEqual("YYYY-MM");
  });
});
