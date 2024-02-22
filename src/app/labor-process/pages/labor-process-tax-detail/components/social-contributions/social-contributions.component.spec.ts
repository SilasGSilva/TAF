import { UntypedFormBuilder } from '@angular/forms';
import { InfoCRContrib, TpCREnum } from '../../../../../../app/models/labor-process-taxes.model';
import { SocialContributionsComponent } from './social-contributions.component';

describe('SocialContributionsComponent', () => {
  let fb: UntypedFormBuilder;
  let component: SocialContributionsComponent;

  let rows: any[];

  beforeEach(() => {
    fb = new UntypedFormBuilder();
    component = new SocialContributionsComponent(fb);
    component.currentFormGroup = fb.group({
      infoCRContrib: fb.control([])
    });
    rows = [
      {
        tpCR: 1,
        vrCR: 0.01,
      },
      {
        tpCR: 2,
        vrCR: 0.02,
      }];
    component.currentFormGroup.get('infoCRContrib').setValue(rows);
    component.subFormGroup = component['createSubFormGroup']();
    component.rows = rows.map(m => {
      const value = {
        codigoReceitaLabel: m.tpCR,
        valorLabel: m.vrCR
      } as any;
      return value;
    });
  });

  it('when called getter formArray', () => {
    void expect(component.formArray).toBeDefined();
    component.currentFormGroup = null;
    void expect(component.formArray).toBeUndefined();
  });

  describe('when called method ngOnInit', () => {
    it('should actions is empty from excluidoERP equal to "S"', () => {
      const rows: InfoCRContrib[] = component.currentFormGroup.get('infoCRContrib').value;
      rows.push({} as InfoCRContrib);
      component.excluidoERP = 'S';
      component.currentFormGroup.get('infoCRContrib').setValue(rows);
      component.ngOnInit();
      void expect(component.rows.length).toEqual(3);
      void expect(component.actions.length).toEqual(0);
    });

    it('should actions edit and delete from excluidoERP equal to "N"', () => {
      const rows: InfoCRContrib[] = component.currentFormGroup.get('infoCRContrib').value;
      rows.push({} as InfoCRContrib);
      component.excluidoERP = 'N';
      component.currentFormGroup.get('infoCRContrib').setValue(rows);
      component.ngOnInit();
      void expect(component.rows.length).toEqual(3);
      void expect(component.actions.length).toEqual(2);
    });

    it('should actions edit and delete from excluidoERP equal to "N"', async () => {
      component.ngOnInit();
      spyOn(component, 'transformRows').and.stub();

      const subscription = component.currentFormGroup.get('infoCRContrib').valueChanges.subscribe(() => {
        void expect(component.transformRows).toHaveBeenCalled();
      });

      component.currentFormGroup.get('infoCRContrib').setValue([]);
      subscription.unsubscribe();
    });
  });

  it('when called method ngOnDestroy should unsubscribe subscriptions', () => {
    component.ngOnInit();
    spyOn(component.subscription, 'unsubscribe').and.stub();

    component.ngOnDestroy();
    void expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });

  it('when called method create', () => {
    spyOn(component.subFormGroup, 'reset').and.stub();
    component.isSelected = false;
    component.isEdit = true;
    component.create();
    void expect(component.isSelected).toBeTrue();
    void expect(component.isEdit).toBeFalse();
    void expect(component.subFormGroup.reset).toHaveBeenCalled();
  });

  it('when called method saveSocialContrib', () => {
    component.isSelected = true;
    component.subFormGroup.value.tpCr = 3;
    component.subFormGroup.value.vrCr = 3.01;
    component.saveSocialContrib();
    void expect(component.formArray.value.length).toEqual(3);
    void expect(component.isSelected).toBeFalse();
  });

  it('when called method updateSocialContrib', () => {
    component.isSelected = true;
    component.subFormGroup.setValue(
      {
        tpCR: 3 as TpCREnum,
        vrCR: 3.01
      } as InfoCRContrib);
    component.editIndex = 1;

    component.updateSocialContrib();
    void expect(component.formArray.value[1].tpCR).toEqual(3);
    void expect(component.isSelected).toBeFalse();
  });

  it('when called method clickToEditSocialContrib', () => {
    component.isEdit = false;
    component.isSelected = false;
    component.editIndex = 0;

    component.clickToEditSocialContrib(component.rows[1]);
    void expect(component.isEdit).toBeTrue();
    void expect(component.editIndex).toEqual(1);
    void expect(component.isSelected).toBeTrue();
    void expect(component.subFormGroup.get('tpCR').value).toEqual(2);
  });

  it('when called method deleteSocialContrib', () => {
    component.isEdit = true;
    component.isSelected = true;

    component.deleteSocialContrib(component.rows[1]);
    void expect(component.formArray.value.length).toEqual(1);
    void expect(component.isEdit).toBeFalse();
    void expect(component.isSelected).toBeFalse();
  });

  it('when called method cancel', () => {
    component.isSelected = true;
    component.cancel();

    expect(component.isSelected).toBeFalse();
  });

  it('when called getter formArrayValue', () => {
    component.currentFormGroup.get('infoCRContrib').setValue(rows);
    void expect(component.formArrayValue.length).toEqual(rows.length);
    component.formArray.setValue(null);
    void expect(component.formArrayValue.length).toEqual(0);
  });
});
