
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpService } from '../../../../../core/services/http.service';
import { LiteralService } from '../../../../../core/i18n/literal.service';
import { MockTsiService } from '../../../monitor/tsi-monitor.service.spec';
import { TsiStatusComponent } from './tsi-status.component';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';

xdescribe('TsiStatusComponent', () => {
  let component: TsiStatusComponent;
  let fixture: ComponentFixture<TsiStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TsiStatusComponent ],
      imports:[TafFiscalModule],
      providers:[{ provide: HttpService, useClass: MockTsiService }, LiteralService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    fixture = TestBed.createComponent(TsiStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar fomulario', () => {
    component.setStandardFormStatus();
    expect(component.formStatus).toBeTruthy();
  });

  it('deve retornar a api e deixar as variaveis statusConfigured=true e statusActive=false', () => {
    component.getStatus();
    expect(component.statusConfigured).toBeTrue();
    expect(component.statusActive).toBeFalse();
  });

  it('deve testar a função fakeClick', () => {
    component.getStatus();
    expect(component.statusConfigured).toBeTrue();
    expect(component.statusActive).toBeFalse();
    component.fakeClick();
    expect(component.statusConfigured).toBeTrue();
    expect(component.statusActive).toBeFalse();
    expect(component.formStatus.get('tsiStatusService').value).toEqual(component.statusConfigured);

  });
});
