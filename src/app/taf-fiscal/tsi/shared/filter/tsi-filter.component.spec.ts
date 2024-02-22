import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { MockTsiService } from '../../monitor/tsi-monitor.service.spec';
import { TsiFilterComponent } from './tsi-filter.component';

xdescribe('TsiFilterComponent', () => {
  let component: TsiFilterComponent;
  let fixture: ComponentFixture<TsiFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TsiFilterComponent],
      imports: [TafFiscalModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }, LiteralService, PoNotificationService],
    }).compileComponents();
  });

  beforeEach(async () => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    fixture = TestBed.createComponent(TsiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Criação do componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve existir mais de uma opção no campo filial e a branchCode selecionada como D MG 01', async () => {
    await component.getBranches();
    expect(component.branchesOptions.length).toEqual(2);
    expect(component.formFilter.get('branchCode').value).toEqual('D MG 01');
  });

  it('deve existir mais de uma opção no campo tipo', async () => {
    await component.setDefaultValues();
    expect(component.typeOptions.length).toEqual(4);

  });


  //Testar enable do botão Aplicar
  //Testar vbalidação do formulário

  xit('Seleção de 1 filial e data de e data até preenchidos de forma válida e Tipo Todos', () => {
    const branchCode: string = 'D MG 01';
    const type: string = 'Todos';
    component.formFilter.get('branchCode').setValue(branchCode);
    component.formFilter.get('type').setValue(type);
    expect(component.formFilter.get('branchCode').value).toBeTruthy();
    expect(component.formFilter.get('periodFrom').value).toBeTruthy();
    expect(component.formFilter.get('periodTo').value).toBeTruthy();
    expect(component.formFilter.get('type').value === type).toBeTruthy();
    expect(component).toBeTruthy();
  });

  xit('Seleção de multifiliais e data de e data até preenchidos de forma válida e Tipo Movimentos', () => {
    const branchCode: string = 'Todas';
    const type: string = 'Movimentos';
    component.formFilter.get('branchCode').setValue(branchCode);
    component.formFilter.get('type').setValue(type);
    expect(component.formFilter.get('branchCode').value == branchCode).toBeTruthy();
    expect(component.formFilter.get('periodFrom').value).toBeTruthy();
    expect(component.formFilter.get('periodTo').value).toBeTruthy();
    expect(component.formFilter.get('type').value === type).toBeTruthy();
    expect(component).toBeTruthy();
  });

  xit('Seleção de data de e data até inválida', () => {
    const branchCode: string = 'D MG 01';
    const periodFrom: string = ' '; //sao campos requeridos
    const periodTo: string = ' '; //sao campos requeridos
    const type: string = 'Todos';
    component.formFilter.get('branchCode').setValue(branchCode);
    component.formFilter.get('periodFrom').setValue(periodFrom);
    component.formFilter.get('periodTo').setValue(periodTo);
    component.formFilter.get('type').setValue(type);
    expect(component.formFilter.get('branchCode').value == branchCode).toBeTruthy();
    expect(component.formFilter.get('periodFrom').value === '').toBeTruthy();
    expect(component.formFilter.get('periodFrom').value === '').toBeTruthy();
    expect(component.formFilter.get('type').value === type).toBeTruthy();
    expect(component.formFilter.invalid).toBeTruthy();
    expect(component).toBeTruthy();
  });

  xit('Seleção de multifiliais e data de e data até preenchidos de forma válida e Tipo vazio', () => {
    const branchCode: string = 'Todas';
    const type: string = 'Todos';
    component.formFilter.get('branchCode').setValue(branchCode);
    component.formFilter.get('type').setValue(type);
    expect(component.formFilter.get('branchCode').value == branchCode).toBeTruthy();
    expect(component.formFilter.get('periodFrom').value).toBeTruthy();
    expect(component.formFilter.get('periodTo').value).toBeTruthy();
    expect(component.formFilter.get('type').value === type).toBeTruthy();
    expect(component).toBeTruthy();
  });

});
