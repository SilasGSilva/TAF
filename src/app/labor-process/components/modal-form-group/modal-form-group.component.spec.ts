import { PoModalComponent } from '@po-ui/ng-components';
import { PoModalComponentMock } from '../../../../util/test/mock/po-components/po-modal-component.mock';
import { ModalFormGroupComponent } from './modal-form-group.component';

describe(ModalFormGroupComponent.name, () => {
  let component: ModalFormGroupComponent;

  beforeEach(() => {
    component = new ModalFormGroupComponent();

    component.poModal = new PoModalComponentMock() as PoModalComponent;
  });

  describe(ModalFormGroupComponent.prototype.ngOnInit.name, () => {
    it('should initialize modal actions', () => {
      component.isDisabledPrimaryAction = true;
      component.labelPrimaryAction = 'Salvar';
      component.labelSecondaryAction = 'Fechar';

      component.ngOnInit();

      expect(component.primaryAction.label).toEqual('Salvar');
      expect(component.primaryAction.disabled).toEqual(true);
      expect(component.secondaryAction.label).toEqual('Fechar');
    });
  });

  describe(ModalFormGroupComponent.prototype.open.name, () => {
    it('should open the modal', () => {
      spyOn(component.poModal, 'open');

      component.open();

      expect(component.poModal.open).toHaveBeenCalledOnceWith();
    });
  });

  describe(ModalFormGroupComponent.prototype.close.name, () => {
    it('should close the modal', () => {
      spyOn(component.poModal, 'close');

      component.close();

      expect(component.poModal.close).toHaveBeenCalledOnceWith();
    });
  });

  describe(ModalFormGroupComponent.prototype.save.name, () => {
    it('should close the modal', () => {
      spyOn(component.poModal, 'close');

      component.save();

      expect(component.poModal.close).toHaveBeenCalled();
    });

    it('should emit @primaryActionClicked', () => {
      spyOn(component.primaryActionClicked, 'emit');

      component.save();

      expect(component.primaryActionClicked.emit).toHaveBeenCalledOnceWith();
    });
  });

  describe(ModalFormGroupComponent.prototype.close.name, () => {
    it('should close the modal', () => {
      spyOn(component.poModal, 'close');

      component.close();

      expect(component.poModal.close).toHaveBeenCalled();
    });

    it('should emit @secondaryActionClicked', () => {
      spyOn(component.secondaryActionClicked, 'emit');

      component.close();

      expect(component.secondaryActionClicked.emit).toHaveBeenCalledOnceWith();
    });
  });
});
