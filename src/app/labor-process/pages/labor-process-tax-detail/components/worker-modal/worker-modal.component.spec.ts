import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';
import { LaborProcessServiceMock } from '../../../../../../util/test/mock/labor-process-service.mock';
import { PoNotificationServiceMock } from '../../../../../../util/test/mock/po-components/po-notification-service.mock';
import { LaborProcessDataStateServiceMock } from '../../../../../../util/test/mock/labor-process-data-state-service.mock';
import { LaborProcessService } from '../../../../service/labor-process.service';
import { LaborProcessDataStateService } from '../../../../service/labor-process-data-state.service';
import { WorkerModalComponent } from './worker-modal.component';

describe(WorkerModalComponent.name, () => {
  let formBuilder: UntypedFormBuilder;
  let component: WorkerModalComponent;
  let laborProcessService: LaborProcessService;
  let laborProcessDataStateService: LaborProcessDataStateService;
  let notificationService: PoNotificationService;

  beforeEach(() => {
    laborProcessService = (new LaborProcessServiceMock() as unknown) as LaborProcessService;
    laborProcessDataStateService = new LaborProcessDataStateServiceMock() as unknown as LaborProcessDataStateService;
    notificationService = (new PoNotificationServiceMock() as unknown) as PoNotificationService;
    formBuilder = new UntypedFormBuilder();
    component = new WorkerModalComponent(
      formBuilder,
      laborProcessService,
      laborProcessDataStateService,
      notificationService
    );
    component.poModal = jasmine.createSpyObj('PoModalComponent', [
      'open',
      'close',
    ]);
    component.irrfInformationForm = jasmine.createSpyObj(
      'IrrfInformationComponent',
      ['initializeTableActions', 'cancel']
    );
    component.calculationPeriodForm = jasmine.createSpyObj(
      'CalculationPeriodAndBasisComponent',
      ['initializeTableActions', 'cancel', 'createSubFormGroup','resetValidatorsAndSubFormGroup']
    );
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'initializeModalActions').and.stub();
    });

    it('deve chamar initializeModalActions e subscrever alteração em calcTrib', () => {
      component.ngOnInit();
      void expect(component.initializeModalActions).toHaveBeenCalledTimes(1);
      void expect(component.subscription).not.toBeUndefined();
    });

    it('subscrição de calcTrib deve chamar initializeModalActions', fakeAsync(() => {
      component.ngOnInit();
      component.formGroup.patchValue({ calcTrib: 1 });
      flushMicrotasks();
      void expect(component.initializeModalActions).toHaveBeenCalledTimes(2);
    }));
  });

  it('ngOnDestroy deve chamar unsubscribe de subscription', () => {
    const subscription: Subscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component.subscription = subscription;
    component.ngOnDestroy();
    void expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  describe('initializeModalActions', () => {
    beforeEach(() => {
      spyOn(component, 'onSave').and.stub();
      spyOn(component, 'onClose').and.stub();
    });

    it('deve inicializar os labels dos botões de ações do modal', () => {
      component.initializeModalActions();
      void expect(component.modalPrimaryAction.label).toEqual('Salvar');
      void expect(component.modalSecondaryAction.label).toEqual('Fechar');
    });

    it('botão Salvar deve chamar onSave', () => {
      component.initializeModalActions();
      component.modalPrimaryAction.action();
      void expect(component.onSave).toHaveBeenCalledTimes(1);
    });

    it('botão Fechar deve chamar onClose', () => {
      component.initializeModalActions();
      component.modalSecondaryAction.action();
      void expect(component.onClose).toHaveBeenCalledTimes(1);
    });

    describe('deve inciciar Salvar como desabilitado', () => {
      it('quando calcTrib não for válido na v1', () => {
        spyOnProperty(component, 'isV1').and.returnValue(true);
        component.formGroup.patchValue({ calcTrib: 0 });
        component.excluidoERP = 'N';
        component.initializeModalActions();
        void expect(component.modalPrimaryAction.disabled).toBeTrue();
      });

      it('quando excluidoERP igual "S"', () => {
        component.formGroup.patchValue({ calcTrib: [1] });
        component.formGroup.updateValueAndValidity();
        component.excluidoERP = 'S';
        component.initializeModalActions();
        void expect(component.modalPrimaryAction.disabled).toBeTrue();
      });
    });

    it('deve inciciar Salvar habilitado', () => {
      component.formGroup.patchValue({ calcTrib: [1] });
      component.formGroup.updateValueAndValidity();
      component.excluidoERP = 'N';
      component.initializeModalActions();
      void expect(component.modalPrimaryAction.disabled).toBeFalse();
    });
  });

  it('openModal deve abrir modal', async () => {
    const formGroup = formBuilder.group({
      cpfTrab: [null],
      nmTrab: [null],
      dtNascto: [null],
      calcTrib: formBuilder.control([]),
      infoCRIRRF: formBuilder.control([]),
      infoIRComplem: formBuilder.group({
        dtLaudo: formBuilder.control([]),
        infoDep: formBuilder.control([]),
      }),
    });

    const workerName = 'workerName';
    await component.openModal(formGroup.value, workerName);
    void expect(component.formGroup.value).toEqual(formGroup.value);
    void expect(component.workerName).toEqual(workerName);
    void expect(
      component.irrfInformationForm.initializeTableActions
    ).toHaveBeenCalledTimes(1);
    void expect(
      component.calculationPeriodForm.initializeTableActions
    ).toHaveBeenCalledTimes(1);
    void expect(
      component.calculationPeriodForm.resetValidatorsAndSubFormGroup
    ).toHaveBeenCalledTimes(1);
    void expect(component.poModal.open).toHaveBeenCalledTimes(1);
  });

  it('onClose deve fechar o modal', () => {
    component.onClose();
    void expect(component.calculationPeriodForm.cancel).toHaveBeenCalledTimes(
      1
    );
    void expect(component.irrfInformationForm.cancel).toHaveBeenCalledTimes(1);
    void expect(component.poModal.close).toHaveBeenCalledTimes(1);
  });

  it('onSave deve chamar emit do evento saveClicked', () => {
    spyOn(component.saveClicked, 'emit').and.stub();
    component.onSave();
    void expect(component.saveClicked.emit).toHaveBeenCalledTimes(1);
  });
});
