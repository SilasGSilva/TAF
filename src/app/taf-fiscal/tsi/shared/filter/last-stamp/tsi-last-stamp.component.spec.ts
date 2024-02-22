
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { MockTsiService } from 'taf-fiscal/tsi/monitor/tsi-monitor.service.spec';
import { TsiLastStampComponent } from './tsi-last-stamp.component';
import { TsiLastStampRequest } from 'taf-fiscal/tsi/models/tsi-last-stamp-request';
import { TsiLastStampService } from './tsi-last-stamp.service';


xdescribe('TsiFilterComponent', () => {
  let component: TsiLastStampComponent;
  let fixture: ComponentFixture<TsiLastStampComponent>;
  let serviceUltStamp: TsiLastStampService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TsiLastStampComponent],
      imports: [TafFiscalModule],
      providers: [
        TsiLastStampService,
        { provide: HttpService, useClass: MockTsiService },
        LiteralService,
        PoNotificationService],
    }).compileComponents();
    serviceUltStamp = TestBed.inject(TsiLastStampService);
  });

  beforeEach(async () => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    fixture = TestBed.createComponent(TsiLastStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Criação do componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve executar médodo para buscar ultimo stamp via service', async () => {
    component.setDefaultValues();
    const param:TsiLastStampRequest = {
      companyId: 'T1|D MG 01 ',
      branchCode: 'D MG 01 ',
      alias: 'C20'
    };
    const mockStamp = await serviceUltStamp.getLastStamp(param).toPromise();
    expect(mockStamp.stamp).toEqual('2022-07-20 20:31:56.583');
  });

  it('deve executar médodo para buscar ultimo stamp via component', async () => {
    component.setDefaultValues();
    component.getLastStamp();
    expect(component.lastStamp).toEqual('2022-07-20 20:31:56.583');
  });

  it('deve executar médodo para resetar o form', () => {
    component.setDefaultValues();
    component.formDateStamp.patchValue({ dateStamp:  '2022-07-22'});
    expect(component.formDateStamp.get('dateStamp').value).toEqual('2022-07-22');
    component.resetValueForm();
    expect(component.formDateStamp.get('dateStamp').value).toEqual('');
  });

  it('deve executar método para atualizar o stamp via component', async () => {
    component.setDefaultValues();
    component.postAtuStamp();
    fixture.detectChanges();
    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });

  it('deve executar primaryAction com data válida', async () => {
    component.setDefaultValues();
    component.formDateStamp.patchValue({ dateStamp:  component.addDays(new Date(), 1)});
    //Executa ação do modal
    component.primaryAction.action();
    fixture.detectChanges();
    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });

  it('deve executar primaryAction com data inválida', async () => {
    component.setDefaultValues();
    component.formDateStamp.patchValue({ dateStamp:  'XXXX'});
    //Executa ação do modal
    component.primaryAction.action();
    fixture.detectChanges();
    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect(modalEl).withContext('Deve existir um modal')
  });

  it('deve executar médodo para setar o stamp', async () => {
    component.setStamp('2022-07-20 20:31:56.583');
    expect(component.lastStamp).toEqual('2022-07-20 20:31:56.583');
    component.setStamp('');
    expect(component.lastStamp).toEqual('...');
  });

  it('deve abrir o modal para setar a data no datePicker', async () => {
    component.setDefaultValues();
    component.openModal();
    fixture.detectChanges();
    const modalEl: HTMLElement = fixture.nativeElement.querySelector('po-modal');
    expect( modalEl.textContent.trim()).toMatch( 'Informe a data de corte para integração das notas');
  });
});
