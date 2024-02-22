import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { DownloadService } from './../../../../shared/download/download.service';
import { CheckFeaturesService } from './../../../../shared/check-features/check-features.service';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TsiExportReportComponent } from './tsi-export-report.component';
import { MockTsiService } from '../tsi-monitor.service.spec';

xdescribe('TsiExportReportComponent', () => {
  let component: TsiExportReportComponent;
  let fixture: ComponentFixture<TsiExportReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TsiExportReportComponent],
      imports: [TafFiscalModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }, LiteralService, PoNotificationService, CheckFeaturesService, DownloadService],
    }).compileComponents();
  });

  beforeEach(async () => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
    sessionStorage.removeItem('TAFContext');
    sessionStorage.setItem('TAFContext', 'reinf');
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus'
    };
    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    fixture = TestBed.createComponent(TsiExportReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente tsi-component', () => {
    expect(component).toBeTruthy();
  });

  it('Deve executar a função getReportItems com access true', async () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl(['tsiFilter']['branches'], [Validators.required]),
      periodFrom: new UntypedFormControl(['tsiFilter']['periodFrom'], []),
      periodTo: new UntypedFormControl(['tsiFilter']['periodTo'], []),
      type: new UntypedFormControl(['tsiFilter']['type'], []),
    });
    component.formFilter.patchValue({ periodTo: '', periodFrom: '', type: component.literals['tsiFilter']['all'] });

    sessionStorage.setItem('TAFFeatures', '{"downloadXLS": { "access": true, "message": "VGVzdGU=" }}');
    const spyGetReport = spyOn(component, 'getReportItems').and.callThrough();

    await component.getReportItems();
    expect(spyGetReport).toHaveBeenCalledTimes(1);
  });

  it('Deve executar a função getReportItems com access false', async () => {
    sessionStorage.setItem('TAFFeatures','{"downloadXLS": { "access": false, "message": "VGVzdGU=" }}');

    const spyGetReport = spyOn(component, 'getReportItems').and.callThrough();

    await component.getReportItems();
    expect(spyGetReport).toHaveBeenCalledTimes(1);
  });

  it('deve realizar o get retornar 1 registro na api', async () => {
    component.formFilter = new UntypedFormGroup({
      branchCode: new UntypedFormControl(['tsiFilter']['branches'], [Validators.required]),
      periodFrom: new UntypedFormControl(['tsiFilter']['periodFrom'], []),
      periodTo: new UntypedFormControl(['tsiFilter']['periodTo'], []),
      type: new UntypedFormControl(['tsiFilter']['type'], []),
    });
    component.formFilter.patchValue({ periodTo: '', periodFrom: '', type: component.literals['tsiFilter']['all'] });
    sessionStorage.setItem('TAFFeatures', '{"downloadXLS": { "access": true, "message": "VGVzdGU=" }}');
    await component.getReportItems();

    expect(component.data.length).toEqual(1);
  });

});
