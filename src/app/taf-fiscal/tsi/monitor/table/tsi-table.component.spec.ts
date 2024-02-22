import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoNotificationService } from '@po-ui/ng-components';
import { HttpService } from 'core/services/http.service';
import { LiteralService } from 'core/i18n/literal.service';
import { getBranchLoggedIn, getBranchCodeLoggedIn } from '../../../../../util/util';
import { TafFiscalModule } from 'taf-fiscal/taf-fiscal.module';
import { TsiTableComponent } from './tsi-table.component';
import { TsiTableService } from './tsi-table.service';
import { MockTsiService } from '../tsi-monitor.service.spec';
import { TsiIntegrationErrorsRequest } from './../../models/tsi-integrations-errors-request';

xdescribe('TsiTableComponent', () => {
  let component: TsiTableComponent;
  let fixture: ComponentFixture<TsiTableComponent>;
  let service: TsiTableService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TsiTableComponent],
      imports: [TafFiscalModule, RouterTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }, LiteralService, PoNotificationService],
    }).compileComponents();
    service = TestBed.inject(TsiTableService);
  });

  beforeEach(async () => {
    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    fixture = TestBed.createComponent(TsiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente tsi-component', () => {
    expect(component).toBeTruthy();
  });

  it('deve existir 7 colunas na table', async () => {
    expect(component.tableComponent.columns.length).toEqual(7);
  });

  it('deve montar a table a mostrar a mensagem formatada da coluna errormessage', async () => {
    component.tsiTableItems = [];
    const params: TsiIntegrationErrorsRequest = {
      companyId: getBranchLoggedIn(),
      branchCode: getBranchCodeLoggedIn(),
      dateOf: '2022-04-22',
      dateUp: '2022-04-22',
      typeFilter: 'Todos',
      page: 1,
      pageSize: 10
    };
    const specResponse = await service.getTsiErrors(params).toPromise();
    specResponse.items.forEach(itemV5R =>{
      component.tsiTableItems.push(itemV5R);
    });

    component.openMsg(component.tsiTableItems[0].errormessage,component.literals['tsiTable']['errormessage']);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('deve existir 1 linha na table', async () => {
    component.tsiTableItems = [];
    const params: TsiIntegrationErrorsRequest = {
      companyId: getBranchLoggedIn(),
      branchCode: getBranchCodeLoggedIn(),
      dateOf: '2022-04-22',
      dateUp: '2022-04-22',
      typeFilter: 'Todos',
      page: 1,
      pageSize: 10
    };
    const specResponse = await service.getTsiErrors(params).toPromise();
    specResponse.items.forEach(itemV5R =>{
      component.tsiTableItems.push(itemV5R);
    });
    fixture.detectChanges();
    expect(component.tableComponent.items.length).toEqual(1);
  });

  it('deve existir executar função de buscar mais registros', async () => {
    component.tsiTableItems = [];
    const params: TsiIntegrationErrorsRequest = {
      companyId: getBranchLoggedIn(),
      branchCode: getBranchCodeLoggedIn(),
      dateOf: '2022-04-22',
      dateUp: '2022-04-22',
      typeFilter: 'Todos',
      page: 1,
      pageSize: 10
    };
    const specResponse = await service.getTsiErrors(params).toPromise();
    specResponse.items.forEach(itemV5R =>{
      component.tsiTableItems.push(itemV5R);
    });
    fixture.detectChanges();
    await component.showMoreRegisters();
    expect(component.tableComponent.items.length).toEqual(1);
  });

});
