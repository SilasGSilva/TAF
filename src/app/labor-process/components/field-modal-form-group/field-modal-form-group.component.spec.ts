import { FieldModalFormGroupComponent } from './field-modal-form-group.component';

describe(FieldModalFormGroupComponent.name, () => {
  let component: FieldModalFormGroupComponent;

  beforeEach(() => {
    component = new FieldModalFormGroupComponent();
  });

  describe(FieldModalFormGroupComponent.prototype.handleClick.name, () => {
    it('should emit @buttonClicked', () => {
      spyOn(component.buttonClicked, 'emit');

      component.handleClick();

      expect(component.buttonClicked.emit).toHaveBeenCalledOnceWith();
    });
  });
});
