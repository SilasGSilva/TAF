import { UntypedFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SubscriptionMock } from '../../../../../../util/test/mock/global/subscription-mock';
import { Abono, OptionsAnswer } from '../../../../../models/labor-process.model';
import { YearsBaseIndemnityComponent } from './years-base-indemnity.component';

describe(YearsBaseIndemnityComponent.name, () => {
  let component: YearsBaseIndemnityComponent;
  let fb: UntypedFormBuilder;

  beforeEach(() => {
    fb = new UntypedFormBuilder();

    component = new YearsBaseIndemnityComponent(fb);

    component.mainFormGroup = fb.group({
      excluidoERP: [null],
    });
    component.currentFormGroup = fb.group({
      ideEstab: fb.group({
        infoVlr: fb.group({
          abono: fb.control([]),
        }),
      }),
    });
  });

  describe(YearsBaseIndemnityComponent.prototype.ngOnInit.name, () => {
    it('should initialize table action and rows ', () => {
      spyOn<any>(component, 'transformRows');
      spyOn<any>(component, 'initializeTableActions');

      component.ngOnInit();

      expect(component['transformRows']).toHaveBeenCalled();
      expect(component['initializeTableActions']).toHaveBeenCalled();
    });
  });

  describe('isExcludedERP getter', () => {
    it('should return FALSE if "excluidoERP" is not "S"', () => {
      const result = component.isExcludedERP;

      expect(result).toBeFalse();
    });

    it('should return TRUE if "excluidoERP" is "S"', () => {
      component.excluidoERP = OptionsAnswer.Yes;

      const result = component.isExcludedERP;

      expect(result).toBeTrue();
    });
  });

  describe('isExcludedERP getter', () => {
    it('should return TRUE when conditions are met', () => {
      component.formArray.setValue([]);
      component.isSelected = false;
      spyOnProperty(component, 'isExcludedERP').and.returnValue(false);

      const result = component.canCreateNewItem;

      expect(result).toBeTrue();
    });

    it('should return FALSE when conditions are not met', () => {
      component.isSelected = true;

      const result = component.canCreateNewItem;

      expect(result).toBeFalse();
    });
  });

  describe(YearsBaseIndemnityComponent.prototype.ngOnDestroy.name, () => {
    it('should remove all subscriptions', () => {
      const mockSubscription1 = new SubscriptionMock() as unknown as Subscription;
      const mockSubscription2 = new SubscriptionMock() as unknown as Subscription;
      component.subscriptions = [mockSubscription1, mockSubscription2];

      component.subscriptions.forEach(subscription => {
        spyOn(subscription, 'unsubscribe');
        component.ngOnDestroy();
        
        expect(subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('actions', () => {
    enum ActionsEnum {
      edit = 0,
      delete = 1,
    }

    let initialValue: Abono[];

    beforeEach(() => {
      initialValue = [{ anoBase: '2022' }, { anoBase: '2023' }, , { anoBase: '2024' }];

      component.ngOnInit();

      component.formArray.setValue(initialValue);
      component.rows = initialValue;
    })

    describe('handleClickEdit', () => {
      it('should set isEdit, isSelected, and editIndex correctly', () => {
        const editIndex = 1;
        const itemToEdit = initialValue[editIndex];

        component.isEdit = false;
        component.isSelected = false;
        component.editIndex = -1;

        component.actions[ActionsEnum.edit].action(itemToEdit);
    
        expect(component.isEdit).toBeTrue();
        expect(component.isSelected).toBeTrue();
        expect(component.editIndex).toEqual(editIndex);
      });

      it('should set subFormGroup value correctly', () => {
        const itemToEdit = initialValue[1];

        component.actions[ActionsEnum.edit].action(itemToEdit);

        expect(component.subFormGroup.value).toEqual(itemToEdit);
      });
    });

    describe('handleClickDelete', () => {
      it('should reset isEdit and isSelected correctly', () => {
        const itemToDelete = initialValue[1];

        component.isEdit = true;
        component.isSelected = true;

        component.actions[ActionsEnum.delete].action(itemToDelete);

        expect(component.isEdit).toBeFalse();
        expect(component.isSelected).toBeFalse();
      });
        

      it('should remove item from formArray', () => {
        const itemToDelete = initialValue[1];

        component.isEdit = true;
        component.isSelected = true;

        component.actions[ActionsEnum.delete].action(itemToDelete);

        expect(component.formArray.value).not.toContain(itemToDelete);
      });
    });
    
  });

  describe(YearsBaseIndemnityComponent.prototype.save.name, () => {
    it('should add a new item to the subForm', () => {
      const initialValue: Abono[] = [{ anoBase: '2022' }, { anoBase: '2023' }];
      const newValue: Abono = { anoBase: '2024' };
      const expectedResult = [...initialValue, newValue];
  
      component.formArray.setValue(initialValue);
      component.subFormGroup.setValue(newValue);
  
      component.save();
  
      expect(component.formArray.value).toEqual(expectedResult);
    });

    it('should change remove selection', () => {
      component.isSelected = true;

      component.save();

      expect(component.isSelected).toBeFalse();
    });
  });

  describe(YearsBaseIndemnityComponent.prototype.update.name, () => {
    it('should edit a existent item in the subForm', () => {
      const initialValue: Abono[] = [{ anoBase: '2022' }, { anoBase: '2023' }, { anoBase: '2024' }];
      const mockEditIndex = 1;
      const editValue: Abono = { anoBase: '2017' };
      const expectedResult = [...initialValue];
      expectedResult[mockEditIndex] = editValue;

      component.formArray.setValue(initialValue);
      component.subFormGroup.setValue(editValue);
      component.editIndex = mockEditIndex;
  
      component.update();

      expect(component.formArray.value).toEqual(expectedResult);
    });

    it('should change remove selection', () => {
      component.isSelected = true;

      component.update();

      expect(component.isSelected).toBeFalse();
    });
  });

  describe(YearsBaseIndemnityComponent.prototype.create.name, () => {
    it('should reset subForm', () => {
      spyOn(component.subFormGroup, 'reset');

      component.create();

      expect(component.subFormGroup.reset).toHaveBeenCalledOnceWith();
    });

    it('should change edit e select status', () => {
      component.isSelected = false;
      component.isEdit = true;

      component.create();

      expect(component.isSelected).toBeTrue();
      expect(component.isEdit).toBeFalse();
    });
  });

  describe(YearsBaseIndemnityComponent.prototype.cancel.name, () => {
    it('should change remove selection', () => {
      component.isSelected = true;

      component.cancel();

      expect(component.isSelected).toBeFalse();
    });
  });
});
