import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CoreModule } from 'core/core.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ValidationPendingTableDetailComponent } from './validation-pending-table-detail.component';
import { ItemTableDetailsProcess } from 'taf-fiscal/models/item-table-details-process';
import { TableDetailsModule } from 'shared/table/table-details/table-details.module';
import { TableDetailsService } from 'shared/table/table-details/table-details.service';

xdescribe('ValidationPendingTableDetailComponent', () => {
  let originalTimeout: number;
  let injector: TestBed;
  let component: ValidationPendingTableDetailComponent;
  let fixture: ComponentFixture<ValidationPendingTableDetailComponent>;
  let mockTableDetailsService: TableDetailsService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationPendingTableDetailComponent],
      imports: [
        CommonModule,
        BrowserModule,
        TableDetailsModule,
        CoreModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      providers: [MasksPipe],
    }).compileComponents();

    injector = getTestBed();
    httpTestingController = TestBed.get(HttpTestingController);
    mockTableDetailsService = injector.get(TableDetailsService);
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300000;
    fixture = TestBed.createComponent(ValidationPendingTableDetailComponent);
    component = fixture.componentInstance;
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
    component.event = '';
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-1070', () => {
    const columns = component.validationDetails('R-1070');

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
    expect(columns[0].property).toBe('suspensionCode');
    expect(columns[1].property).toBe('suspensionIndicator');
    expect(columns[2].property).toBe('decisionDate');
    expect(columns[3].property).toBe('depositIndicator');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2010', () => {
    const columns = component.validationDetails('R-2010');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('type');
    expect(columns[1].property).toBe('invoice');
    expect(columns[2].property).toBe('invoiceSeries');
    expect(columns[3].property).toBe('serviceCode');
    expect(columns[4].property).toBe('issueDate');
    expect(columns[5].property).toBe('grossValue');
    expect(columns[6].property).toBe('taxBase');
    expect(columns[7].property).toBe('aliquot');
    expect(columns[8].property).toBe('tax');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2020', () => {
    const columns = component.validationDetails('R-2020');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('type');
    expect(columns[1].property).toBe('invoice');
    expect(columns[2].property).toBe('invoiceSeries');
    expect(columns[3].property).toBe('serviceCode');
    expect(columns[4].property).toBe('issueDate');
    expect(columns[5].property).toBe('grossValue');
    expect(columns[6].property).toBe('taxBase');
    expect(columns[7].property).toBe('aliquot');
    expect(columns[8].property).toBe('tax');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2030', () => {
    const columns = component.validationDetails('R-2030');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('sourceTaxNumber');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalInvoice');
    expect(columns[3].property).toBe('totalTransferAmount');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('totalTaxBase');
    expect(columns[6].property).toBe('totalTaxes');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2040', () => {
    const columns = component.validationDetails('R-2040');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('associationTaxNumber');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalInvoice');
    expect(columns[3].property).toBe('totalTransferAmount');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('totalTaxBase');
    expect(columns[6].property).toBe('totalTaxes');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2050', () => {
    const columns = component.validationDetails('R-2050');

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('invoice');
    expect(columns[1].property).toBe('invoiceSeries');
    expect(columns[2].property).toBe('item');
    expect(columns[3].property).toBe('issueDate');
    expect(columns[4].property).toBe('grossValue');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-2060', () => {
    const columns = component.validationDetails('R-2060');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('activityCode');
    expect(columns[1].property).toBe('totalGrossValue');
    expect(columns[2].property).toBe('additionalValueOfAdjustment');
    expect(columns[3].property).toBe('exclusionValueOfAdjustment');
    expect(columns[4].property).toBe('totalTaxBase');
    expect(columns[5].property).toBe('aliquot');
    expect(columns[6].property).toBe('contributionValue');
  });

  it('deve trazer as colunas do detalhe da tabela de apuração do evento R-3010', () => {
    const columns = component.validationDetails('R-3010');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('income');
    expect(columns[1].property).toBe('type');
    expect(columns[2].property).toBe('saleAmount');
    expect(columns[3].property).toBe('soldAmount');
    expect(columns[4].property).toBe('refundAmount');
    expect(columns[5].property).toBe('unitaryValue');
    expect(columns[6].property).toBe('totalGrossValue');
  });

  it('deve chamar o serviço que retornar os itens da tabela e retornar com sucesso', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');
    const mockEventDetail: ItemTableDetailsProcess = {
      suspensionIndicator:
        'SENTENÇA EM AÇÃO ORDINÁRIA FAVORÁVEL AO CONTRIBUINTE E CONFIRMADA PELO TRF',
      depositIndicator: 1,
      suspensionCode: 1,
      decisionDate: '2018/04/01',
    };

    spyOn(mockTableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve chamar a função que adiciona os itens na tabela', () => {
    const mockTableDetailsItems = [
      {
        sourceTaxNumber: '42190459000145',
        totalTaxes: '150.00',
        branchId: 'D MG 01 ',
        totalTaxBase: '100.00',
        totalTransferAmount: '1000.00',
        totalInvoice: '2',
        totalGrossValue: '1500.00',
        company: 'Filial BELO HOR',
        invoiceKey: '12345',
      },
      {
        branchId: 'D MG 01 ',
        taxNumber: '03640354000199',
        taxNumberFormated: '03.640.354/0001-99',
        company: 'Filial BELO HOR',
        totalTransferAmount: 1000.0,
        totalGrossValue: 1500.0,
        totalTaxBase: 100.0,
        totalTaxes: 1000.0,
        invoiceKey: '12345',
        sourceTaxNumber: '42190459000145',
        associationTaxNumber: '03640354000199',
      },
    ];

    component.setDetailsItems(mockTableDetailsItems);
    fixture.detectChanges();

    expect(component.tableDetailsItems.length).toEqual(2);
  });
});
