import {
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
} from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';

import { TableDetailsModule } from 'shared/table/table-details/table-details.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { TableDetailsService } from 'shared/table/table-details/table-details.service';
import { TransmissionPendingTableDetailComponent } from './transmission-pending-table-detail.component';
import { tafFiscalPt } from 'core/i18n/taf-fiscal-pt';
import { ItemTableDetails } from 'taf-fiscal/models/item-table-details';
import { ItemTableDetailsResourcesReceivedByTheSportsAssociation } from 'taf-fiscal/models/item-table-details-resources-received-by-the-sports-association';
import { ItemTableDetailsProcess } from 'taf-fiscal/models/item-table-details-process';
import { ItemTableDetailsMarketingByFarmer } from '../../../../models/item-table-details-marketing-by-farmer';
import { ItemTableDetailsSocialSecurityContributionValidation } from 'taf-fiscal/models/item-table-details-social-security-contribution-validation';
import { ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation } from '../../../../models/item-table-details-resources-passed-on-the-by-the-sports-association';

xdescribe('TransmissionPendingTableDetailComponent', () => {
  let component: TransmissionPendingTableDetailComponent;
  let fixture: ComponentFixture<TransmissionPendingTableDetailComponent>;
  let injector: TestBed;
  let tableDetailsService: TableDetailsService;

  const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
  const company = JSON.stringify(TAFCompany);
  sessionStorage.setItem('TAFCompany', company);

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  const i18nConfig: PoI18nConfig = {
    default: {
      language: 'pt-BR',
      context: 'general',
      cache: true,
    },
    contexts: {
      tafFiscal: {
        'pt-BR': tafFiscalPt,
      },
    },
  };

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransmissionPendingTableDetailComponent],
      imports: [TableDetailsModule, PoI18nModule.config(i18nConfig)],
      providers: [
        MasksPipe,
        HttpTestingController,
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    injector = getTestBed();
    tableDetailsService = TestBed.get(TableDetailsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionPendingTableDetailComponent);
    component = fixture.componentInstance;
    component.event = '';
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar o detalhamento do documento do evento R-1070', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetailsProcess = {
      suspensionIndicator:
        'SENTENÇA EM AÇÃO ORDINÁRIA FAVORÁVEL AO CONTRIBUINTE E CONFIRMADA PELO TRF',
      depositIndicator: 1,
      suspensionCode: 1,
      decisionDate: '2018/04/01',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2010', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetails = {
      invoiceSeries: '0',
      type: 'FAT',
      invoice: '1009R20103     ',
      serviceCode:
        '100000002-VIGILANCIA OU SEGURANCA                                                                                                                                                                                                                                   ',
      tax: '110',
      issueDate: '2018/07/15',
      taxBase: '1000',
      note: '',
      grossValue: '1000',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2020', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetails = {
      invoiceSeries: '0',
      type: 'FAT',
      invoice: '1009R20103     ',
      serviceCode:
        '100000002-VIGILANCIA OU SEGURANCA                                                                                                                                                                                                                                   ',
      tax: '110',
      issueDate: '2018/07/15',
      taxBase: '1000',
      note: '',
      grossValue: '1000',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2030', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetailsResourcesReceivedByTheSportsAssociation = {
      sourceTaxNumber: '54216964000109',
      branchId: 'D MG 01 ',
      totalReceived: 440,
      totalValueOfRetentionWithSuspendedLiability: 0,
      key: 'a6a96dcb-f3e1-a32b-f0fc-f528b42a9f2d',
      grossValue: 4000,
      item: '54216964000109',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2040', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetailsResourcesPassedOnTheByTheSportsAssociation = {
      sourceTaxNumber: '54216964000109',
      branchId: 'D MG 01 ',
      totalReceived: 440,
      totalValueOfRetentionWithSuspendedLiability: 0,
      key: 'a6a96dcb-f3e1-a32b-f0fc-f528b42a9f2d',
      grossValue: 4000,
      item: '54216964000109',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2050', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetailsMarketingByFarmer = {
      typeOfTrading:
        '1 - Comercialização da Produção por Prod. Rural PJ/Agroindústria, exceto para entidades executoras do PAA.',
      grossValue: '1000',
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar o detalhamento do documento do evento R-2060', async function() {
    const spySetDetailsItems = spyOn(component, 'setDetailsItems');

    const mockEventDetail: ItemTableDetailsSocialSecurityContributionValidation = {
      contributionValue: '103',
      additionalValueOfAdjustment: '0',
      activityCode:
        '00000095 - EMPRESAS DO SETOR DE CONSTRUCAO CIVIL, ENQUADRADAS NO GRUPO 412 DA CNAE 2.0 - OBRAS COM MATRICULA CEI ATE 30/11/2015',
      grossIncome: 5500,
      exclusionValueOfAdjustment: '350',
      baseValue: 5150,
      contributionRate: 2,
    };

    spyOn(tableDetailsService, 'getDetails').and.returnValue(
      of(mockEventDetail)
    );

    await component.getItems();
    fixture.detectChanges();

    expect(spySetDetailsItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar os detalhes das colunas do evento R-1070', () => {
    const columns = component.transmissionDetails('R-1070');

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
    expect(columns[0].property).toBe('suspensionCode');
    expect(columns[1].property).toBe('suspensionIndicator');
    expect(columns[2].property).toBe('decisionDate');
    expect(columns[3].property).toBe('depositIndicator');
  });

  it('deve retornar os detalhes das colunas do evento R-2010', () => {
    const columns = component.transmissionDetails('R-2010');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('type');
    expect(columns[1].property).toBe('invoice');
    expect(columns[2].property).toBe('invoiceSeries');
    expect(columns[3].property).toBe('serviceCode');
    expect(columns[4].property).toBe('issueDate');
    expect(columns[5].property).toBe('grossValue');
    expect(columns[6].property).toBe('taxBase');
    expect(columns[7].property).toBe('tax');
    expect(columns[8].property).toBe('note');
  });

  it('deve retornar os detalhes das colunas do evento R-2020', () => {
    const columns = component.transmissionDetails('R-2020');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('type');
    expect(columns[1].property).toBe('invoice');
    expect(columns[2].property).toBe('invoiceSeries');
    expect(columns[3].property).toBe('serviceCode');
    expect(columns[4].property).toBe('issueDate');
    expect(columns[5].property).toBe('grossValue');
    expect(columns[6].property).toBe('taxBase');
    expect(columns[7].property).toBe('tax');
    expect(columns[8].property).toBe('note');
  });

  it('deve retornar os detalhes das colunas do evento R-2030', () => {
    const columns = component.transmissionDetails('R-2030');

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
    expect(columns[0].property).toBe('sourceTaxNumber');
    expect(columns[1].property).toBe('grossValue');
    expect(columns[2].property).toBe('receivedAmount');
    expect(columns[3].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve retornar os detalhes das colunas do evento R-2040', () => {
    const columns = component.transmissionDetails('R-2040');

    fixture.detectChanges();

    expect(columns.length).toEqual(4);
    expect(columns[0].property).toBe('sourceTaxNumber');
    expect(columns[1].property).toBe('grossValue');
    expect(columns[2].property).toBe('receivedAmount');
    expect(columns[3].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve retornar os detalhes das colunas do evento R-2050', () => {
    const columns = component.transmissionDetails('R-2050');

    fixture.detectChanges();

    expect(columns.length).toEqual(2);
    expect(columns[0].property).toBe('typeOfTrading');
    expect(columns[1].property).toBe('grossValue');
  });

  it('deve retornar os detalhes das colunas do evento R-2060', () => {
    const columns = component.transmissionDetails('R-2060');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('activityCode');
    expect(columns[1].property).toBe('grossValue');
    expect(columns[2].property).toBe('additionalValueOfAdjustment');
    expect(columns[3].property).toBe('exclusionValueOfAdjustment');
    expect(columns[4].property).toBe('taxBase');
    expect(columns[5].property).toBe('aliquot');
    expect(columns[6].property).toBe('contributionValue');
  });

  it('não deve retornar colunas da tabela', () => {
    const columns = component.transmissionDetails('');

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
    expect(columns).toEqual([]);
  });
});
