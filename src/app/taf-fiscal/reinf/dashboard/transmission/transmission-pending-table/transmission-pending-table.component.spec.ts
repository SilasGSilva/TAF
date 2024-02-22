import {
  ComponentFixture,
  TestBed,
  getTestBed,
  fakeAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import {
  PoContainerModule,
  PoFieldModule,
  PoDisclaimerGroupModule,
  PoI18nPipe,
  PoPageModule,
  PoTableModule,
} from '@po-ui/ng-components';

import { TableModule } from 'shared/table/table.module';
import { CoreModule } from 'core/core.module';
import { TransmissionPendingService } from './transmission-pending.service';
import { TransmissionPendingTableComponent } from './transmission-pending-table.component';
import { ItemTable } from '../../../../models/item-table';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableSocialSecurityContribution } from '../../../../models/item-table-social-security-contribution';
import { ItemTableMarketingByFarmer } from '../../../../models/item-table-marketing-by-farmer';
import { ItemTableResourcesReceivedByTheSportsAssociation } from '../../../../models/item-table-resources-received-by-the-sports-association';

xdescribe('TransmissionPendingTableComponent', () => {
  /*let component: TransmissionPendingTableComponent;
  let fixture: ComponentFixture<TransmissionPendingTableComponent>;
  let injector: TestBed;
  let transmissionPendingService: TransmissionPendingService;
  let originalTimeout: number;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TransmissionPendingTableComponent],
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        PoPageModule,
        PoTableModule,
        PoContainerModule,
        RouterTestingModule,
        PoFieldModule,
        PoDisclaimerGroupModule,
        TableModule,
        CoreModule,
      ],
      providers: [PoI18nPipe, TransmissionPendingService],
    }).compileComponents();
    injector = getTestBed();

    transmissionPendingService = injector.get(TransmissionPendingService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionPendingTableComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 800000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve apresentar os detalhes da tabela, para o evento R-1000', () => {
    component.event = 'R-1000';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeFalsy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-1070', () => {
    component.event = 'R-1070';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2010', () => {
    component.event = 'R-2010';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2020', () => {
    component.event = 'R-2020';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2030', () => {
    component.event = 'R-2030';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2040', () => {
    component.event = 'R-2040';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2050', () => {
    component.event = 'R-2050';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-2060', () => {
    component.event = 'R-2060';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve apresentar os detalhes da tabela, para o evento R-3010', () => {
    component.event = 'R-3010';

    component.loadData();

    fixture.detectChanges();

    expect(component.showDetails).toBeTruthy();
  });

  it('deve trazer da api, as informações dos itens da tabela', async function() {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    const spy = spyOn(component, 'setTableItems');

    const mockTransmissionPendingResponse = {
      eventDetail: [
        {
          branch: 'Filial BELO HOR                          ',
          company: 'MILCLEAN 10',
          key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
          status: 'notTransmitted',
          taxNumber: '01601250000140',
          taxNumberFormated: '01.601.250/0001-40',
          totalGrossValue: 661.92,
          totalInvoice: 2,
          totalTaxes: 58.24,
          totalTaxBase: 661.92,
          branchTaxNumber: '53113791000122',
        },
      ],
      hasNext: false
    };

    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2010';
    component.period = '032019';

    spyOn(
      transmissionPendingService,
      'getInfoTransmissionPending'
    ).and.returnValue(of(mockTransmissionPendingResponse));

    await component.getItems();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve trazer da api, um retorno em branco da consulta dos itens da tabela', async function() {
    const mockTransmissionPendingResponse = {
      eventDetail: [],
      hasNext: false
    };

    component.event = 'R-2060';
    component.period = '032019';

    spyOn(
      transmissionPendingService,
      'getInfoTransmissionPending'
    ).and.returnValue(of(mockTransmissionPendingResponse));

    await component.getItems();

    fixture.detectChanges();

    expect(component.tableLoad).toBeFalsy();
  });

  it('deve preencher a tabela com os dados retornados da api, para evento igual a R-1000', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);

    const mockEventDetail: Array<ItemTableSpecificEvent> = [
      {
        taxNumber: '53113791',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];

    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1000';
    component.period = '032019';
    component.filters.length = 0;

    component.setTableItems(mockEventDetail);

    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-1000 ', () => {
    const mockEventDetail: Array<ItemTableSpecificEvent> = [
      {
        taxNumber: '53113791',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];

    component.event = 'R-1000';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleTransmissionPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve retornar os itens da tabela formatados, para o evento R-1000 com as propriedades taxNumber e contactTaxNumber em branco', () => {
    const mockEventDetail: Array<ItemTableSpecificEvent> = [
      {
        taxNumber: '',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];

    component.event = 'R-1000';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleTransmissionPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2010 ', () => {
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'notTransmitted',
        branch: 'Filial BELO HOR                         ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '01601250000140',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '53113791000122',
      },
    ];

    component.event = 'R-2010';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleTransmissionPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2010 com as propriedades branchTaxNumber e taxNumber em branco', () => {
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'notTransmitted',
        branch: 'Filial BELO HOR                         ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '',
      },
    ];

    component.event = 'R-2010';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleTransmissionPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2060 ', () => {
    const mockEventDetail: Array<ItemTableSocialSecurityContribution> = [
      {
        status: 'notTransmitted',
        typeOfInscription: '4',
        companyTaxNumber: '	512229865174',
        taxNumberFormated: '51.222.98651/74',
        totalInvoice: 1,
        totalGrossValue: 7000.0,
        sociaSecurityContributionValue: 166.0,
        sociaSecurityContributionValueSuspended: 0.0,
      },
    ];

    component.event = 'R-2060';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleTransmissionPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve alterar o filtro executado', () => {
    component.eventDetail = [
      {
        taxNumber: '53113791',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];

    component.event = 'R-1000';
    component.period = '032019';
    component.filters.length = 0;

    component.changeFilter('belo');

    fixture.detectChanges();

    expect(component.filters[0].value).toEqual('belo');
    expect(component.filters[0].label).toEqual('belo');
  });

  it('deve alterar o filtro executado, resetando o filtro', async function() {
    component.eventDetail = [
      {
        taxNumber: '53113791',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];
    component.event = 'R-1000';
    component.period = '032019';
    component.filters.length = 0;

    await component.changeFilter('');

    fixture.detectChanges();

    expect(component.filters.length).toEqual(0);
    expect(component.eventDetail).toEqual([]);
  });

  it('deve alterar o filtro executado, para um evento inválido', () => {
    component.eventDetail = [
      {
        taxNumber: '53113791',
        status: 'notTransmitted',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact:
          'JAIR DA SILVA TEIXEIRA                                                ',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
      },
    ];
    component.event = 'R-9090';
    component.period = '032019';
    component.filters.length = 0;

    component.changeFilter('belo');

    fixture.detectChanges();

    expect(component.filters[0].value).toEqual('belo');
    expect(component.filters[0].label).toEqual('belo');
    expect(component.eventDetail).toEqual([]);
  });

  it('deve resetar o filtro do disclaimer', () => {
    const mockEventDetails = [];
    component.event = 'R-1000';
    component.period = '032019';

    component.changeFilters([]);

    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockEventDetails);
  });

  it('deve alterar o filtro do disclaimer, adicionando novos filtros informados', () => {
    const mockFilters = [{ property: '', value: 'belo', label: 'belo' }];

    component.event = 'R-9090';
    component.period = '032019';
    component.previousFilter = [
      { property: '', value: 'belo', label: 'belo' },
      { property: '', value: '113', label: '113' },
    ];
    component.filters = [{ property: '', value: 'belo', label: 'belo' }];

    component.changeFilters(mockFilters);

    fixture.detectChanges();

    expect(component.previousFilter).toEqual(component.filters);
  });

  it('deve recarregar o filtro de acordo com os parâmetros informados', () => {
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'notTransmitted',
        branch: 'Filial BELO HOR                         ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '01601250000140',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '53113791000122',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2010';
    component.period = '032019';
    component.filters = [{ property: '', value: 'bar', label: 'bar' }];

    component.reloadFilter();
    fixture.detectChanges();

    expect(component.eventDetail).toEqual([]);
  });

  it('deve executar o filtro da tabela, para o evento R-2010 de acordo com o valor informado', () => {
    const mockEventDetail: Array<ItemTable> = [
      {
        branchTaxNumber: '53113791000122',
        taxNumber: '01601250000140',
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        status: 'transmitted',
        key: 'bfd5641a-58f3-9f8e-5034-6b9e2786b659',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        branch: 'Filial BELO HOR                          ',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
      },
      {
        branchTaxNumber: '53113791000122',
        taxNumber: '02666114000109',
        totalTaxes: 1980,
        totalTaxBase: 22500,
        status: 'transmitted',
        key: '80f04dee-22ca-00e0-6268-a23d47c8555d',
        totalInvoice: 2,
        totalGrossValue: 22500,
        branch: 'Filial BELO HOR                          ',
        company: 'MILCLEAN 2',
        taxNumberFormated: '02.666.114/0001-09',
      },
      {
        branchTaxNumber: '53113791000122',
        taxNumber: '09321147000158',
        totalTaxes: 3872,
        totalTaxBase: 176000,
        status: 'transmitted',
        key: '2e81d1fe-3ddf-fa19-a46f-49a6fa492d21',
        totalInvoice: 2,
        totalGrossValue: 176000,
        branch: 'Filial BELO HOR                          ',
        company: 'HELINEWS 1',
        taxNumberFormated: '09.321.147/0001-58',
      },
    ];

    const mockeventDetailFiltered: Array<ItemTable> = [
      {
        branchTaxNumber: '53113791000122',
        taxNumber: '09321147000158',
        totalTaxes: 3872,
        totalTaxBase: 176000,
        status: 'transmitted',
        key: '2e81d1fe-3ddf-fa19-a46f-49a6fa492d21',
        totalInvoice: 2,
        totalGrossValue: 176000,
        branch: 'Filial BELO HOR                          ',
        company: 'HELINEWS 1',
        taxNumberFormated: '09.321.147/0001-58',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2010';
    component.period = '032019';

    component.executeFilter('321');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve executar o filtro da tabela, para o evento R-1070 de acordo com o valor informado', () => {
    const mockEventDetail: Array<ItemTableProcess> = [
      {
        status: 'transmitted',
        courtFederatedUnit: 'SAO PAULO',
        cityCode: '50308 - SAO PAULO',
        beginingDate: '102018',
        finishingDate: '      ',
        key: '10095957620188260001 ',
        proccesNumber: '10095957620188260001 ',
        courtId: '003888',
        proccesType: 'Administrativo',
      },
      {
        status: 'transmitted',
        courtFederatedUnit: 'SAO PAULO',
        cityCode: '50308 - SAO PAULO',
        beginingDate: '102018',
        finishingDate: '      ',
        key: '10095956220188260001 ',
        proccesNumber: '10095956220188260001 ',
        courtId: '003888',
        proccesType: 'Administrativo',
      },
    ];

    const mockeventDetailFiltered: Array<ItemTableProcess> = [
      {
        status: 'transmitted',
        courtFederatedUnit: 'SAO PAULO',
        cityCode: '50308 - SAO PAULO',
        beginingDate: '102018',
        finishingDate: '      ',
        key: '10095957620188260001 ',
        proccesNumber: '10095957620188260001 ',
        courtId: '003888',
        proccesType: 'Administrativo',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-1070';
    component.period = '032019';

    component.executeFilter('576');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve executar o filtro da tabela, para o evento R-2030 de acordo com o valor informado', () => {
    const mockEventDetail: Array<
      ItemTableResourcesReceivedByTheSportsAssociation
    > = [
      {
        status: 'transmitted',
        taxNumberFormated: '07.363.764/0001-90',
        taxNumber: '07363764000190',
        totalGrossValue: 7500,
        totalReceivedWithHoldAmount: 770,
        totalTaxes: 0,
        key: '2ce0b227-e894-c1ae-3b2a-39c160f07115',
      },
    ];

    const mockeventDetailFiltered: Array<
      ItemTableResourcesReceivedByTheSportsAssociation
    > = [
      {
        status: 'transmitted',
        taxNumberFormated: '07.363.764/0001-90',
        taxNumber: '07363764000190',
        totalGrossValue: 7500,
        totalReceivedWithHoldAmount: 770,
        totalTaxes: 0,
        key: '2ce0b227-e894-c1ae-3b2a-39c160f07115',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2030';
    component.period = '032019';

    component.executeFilter('363.');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve executar o filtro da tabela, para o evento R-2040 de acordo com o valor informado', () => {
    const mockEventDetail = [
      {
        status: 'transmitted',
        taxNumberFormated: '07.363.764/0001-90',
        taxNumber: '07363764000190',
        totalGrossValue: 7500,
        totalReceivedWithHoldAmount: 770,
        totalTaxes: 0,
        key: '2ce0b227-e894-c1ae-3b2a-39c160f07115',
      },
    ];

    const mockeventDetailFiltered = [
      {
        status: 'transmitted',
        taxNumberFormated: '07.363.764/0001-90',
        taxNumber: '07363764000190',
        totalGrossValue: 7500,
        totalReceivedWithHoldAmount: 770,
        totalTaxes: 0,
        key: '2ce0b227-e894-c1ae-3b2a-39c160f07115',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2040';
    component.period = '032019';

    component.executeFilter('363.');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve executar o filtro da tabela, para o evento R-2050 de acordo com o valor informado', () => {
    const mockEventDetail: Array<ItemTableMarketingByFarmer> = [
      {
        taxNumber: '53113791000122',
        taxNumberFormated: '53.113.791/0001-22',
        sociaSecurityContributionValueSenar: 25,
        sociaSecurityContributionValueGilrat: 10,
        sociaSecurityContributionValue: 200,
        status: 'transmitted',
        key: '4d5df209-1d75-4faf-dab0-a2fe7500d7db',
        totalGrossValue: 10000,
        company: 'TOTVS SA',
      },
      {
        taxNumber: '53113791000203',
        taxNumberFormated: '53.113.791/0002-03',
        sociaSecurityContributionValueSenar: 12.5,
        sociaSecurityContributionValueGilrat: 5,
        sociaSecurityContributionValue: 100,
        status: 'notTransmitted',
        key: '4012f904-cc83-7994-1187-74801cf261f1',
        totalGrossValue: 5000,
        company: 'TOTVS NITEROI',
      },
    ];

    const mockeventDetailFiltered: Array<ItemTableMarketingByFarmer> = [
      {
        taxNumber: '53113791000122',
        taxNumberFormated: '53.113.791/0001-22',
        sociaSecurityContributionValueSenar: 25,
        sociaSecurityContributionValueGilrat: 10,
        sociaSecurityContributionValue: 200,
        status: 'transmitted',
        key: '4d5df209-1d75-4faf-dab0-a2fe7500d7db',
        totalGrossValue: 10000,
        company: 'TOTVS SA',
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2050';
    component.period = '032019';

    component.executeFilter('000122');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve executar o filtro da tabela, para o evento R-2060 de acordo com o valor informado', () => {
    const mockEventDetail: Array<ItemTableSocialSecurityContribution> = [
      {
        status: '',
        typeOfInscription: '4',
        companyTaxNumber: '	512229865174',
        taxNumberFormated: '51.222.98651/74',
        totalInvoice: 1,
        totalGrossValue: 7000.0,
        sociaSecurityContributionValue: 166.0,
        sociaSecurityContributionValueSuspended: 0.0,
      },
      {
        status: '',
        typeOfInscription: '4',
        companyTaxNumber: '512425618375',
        taxNumberFormated: '51.242.56183/75',
        totalInvoice: 2,
        totalGrossValue: 15200.0,
        sociaSecurityContributionValue: 502.0,
        sociaSecurityContributionValueSuspended: 500.0,
      },
      {
        status: '',
        typeOfInscription: '1',
        companyTaxNumber: '07363764000190',
        taxNumberFormated: '07.363.764/0001-90',
        totalInvoice: 2,
        totalGrossValue: 32500.0,
        sociaSecurityContributionValue: 638.0,
        sociaSecurityContributionValueSuspended: 500.0,
      },
    ];

    const mockeventDetailFiltered: Array<
      ItemTableSocialSecurityContribution
    > = [
      {
        status: '',
        typeOfInscription: '1',
        companyTaxNumber: '07363764000190',
        taxNumberFormated: '07.363.764/0001-90',
        totalInvoice: 2,
        totalGrossValue: 32500.0,
        sociaSecurityContributionValue: 638.0,
        sociaSecurityContributionValueSuspended: 500.0,
      },
    ];

    component.eventDetail = mockEventDetail;
    component.event = 'R-2060';
    component.period = '032019';

    component.executeFilter('000190');
    fixture.detectChanges();

    expect(component.eventDetail).toEqual(mockeventDetailFiltered);
  });

  it('deve emitir os registros válidos selecionados na tabela', () => {
    const spyEmitSelectedEntry = spyOn(component, 'emitSelectedEntry');
    const spyEmitButtonActivate = spyOn(component, 'emitButtonActivate');
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'notTransmitted',
        branch: 'Filial BELO HOR                          ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '01601250000140',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '53113791000122',
      },
    ];

    component.onSelectionChange(mockEventDetail);

    fixture.detectChanges();

    expect(component.isDisablebutton).toBeFalsy();
    expect(spyEmitSelectedEntry).toHaveBeenCalled();
    expect(spyEmitButtonActivate).toHaveBeenCalled();
  });

  it('não deve emitir os registros inválidos selecionados na tabela', () => {
    const spyEmitSelectedEntry = spyOn(component, 'emitSelectedEntry');
    const spyEmitButtonActivate = spyOn(component, 'emitButtonActivate');
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'transmitted',
        branch: 'Filial BELO HOR                         ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '01601250000140',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '53113791000122',
      },
    ];

    component.onSelectionChange(mockEventDetail);

    fixture.detectChanges();

    expect(component.isDisablebutton).toBeTruthy();
    expect(spyEmitSelectedEntry).not.toHaveBeenCalled();
    expect(spyEmitButtonActivate).toHaveBeenCalled();
  });

  it('deve retornar o status dos detalhes da tabela', () => {
    component.showDetails = true;

    fixture.detectChanges();

    expect(component.setShowDetails()).toBeTruthy();
  });

  it('deve emitir o status do botão e desabilitar ele para uso', () => {
    const spyEmitButtonActive = spyOn(component.buttonEmit, 'emit');

    component.emitButtonActivate(true);
    fixture.detectChanges();

    expect(spyEmitButtonActive).toHaveBeenCalledWith(true);
  });

  it('deve emitir os itens selecionados da tabela', () => {
    const spyEmitSelectedEntry = spyOn(component.selectedEntry, 'emit');
    const mockEventDetail: Array<ItemTable> = [
      {
        status: 'transmitted',
        branch: 'Filial BELO HOR                         ',
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 661.92,
        totalTaxes: 58.24,
        totalTaxBase: 661.92,
        taxNumber: '01601250000140',
        key: 'ebac00d2-8167-e37f-230a-178cce86d01a',
        branchTaxNumber: '53113791000122',
      },
    ];

    component.emitSelectedEntry(mockEventDetail);
    fixture.detectChanges();

    expect(spyEmitSelectedEntry).toHaveBeenCalledWith(mockEventDetail);
  });

  it('deve recarregar dos dados e colunas da tabela', () => {
    const spyGetItems = spyOn(component, 'getItems');
    const spyGetSearchLabel = spyOn(component, 'getSearchLabel');

    component.event = 'R-1070';
    component.period = '032019';

    component.reloadData();
    fixture.detectChanges();

    expect(component.showDetails).toEqual(true);

    expect(component.tableColumns[0].property).toBe('status');
    expect(component.tableColumns[1].property).toBe('proccesType');
    expect(component.tableColumns[2].property).toBe('proccesNumber');
    expect(component.tableColumns[3].property).toBe('courtFederatedUnit');
    expect(component.tableColumns[4].property).toBe('cityCode');
    expect(component.tableColumns[5].property).toBe('courtId');
    expect(component.tableColumns[6].property).toBe('beginingDate');
    expect(component.tableColumns[7].property).toBe('finishingDate');

    expect(spyGetItems).toHaveBeenCalled();
    expect(spyGetSearchLabel).toHaveBeenCalledWith('R-1070');
  });

  it('deve retornar os campos da tabela, para o evento R-1000', () => {
    component.event = 'R-1000';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(12);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('typeOfInscription');
    expect(columns[3].property).toBe('taxNumberFormated');
    expect(columns[4].property).toBe('beginingDate');
    expect(columns[5].property).toBe('finishingdate');
    expect(columns[6].property).toBe('taxClassification');
    expect(columns[7].property).toBe('isMandatoryBookkeeping');
    expect(columns[8].property).toBe('isPayrollExemption');
    expect(columns[9].property).toBe('hasFineExemptionAgreement');
    expect(columns[10].property).toBe('contact');
    expect(columns[11].property).toBe('contactTaxNumberFormated');
  });

  it('deve retornar os campos da tabela, para o evento R-1070', () => {
    component.event = 'R-1070';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('proccesType');
    expect(columns[2].property).toBe('proccesNumber');
    expect(columns[3].property).toBe('courtFederatedUnit');
    expect(columns[4].property).toBe('cityCode');
    expect(columns[5].property).toBe('courtId');
    expect(columns[6].property).toBe('beginingDate');
    expect(columns[7].property).toBe('finishingDate');
  });

  it('deve retornar os campos da tabela, para o evento R-2010', () => {
    component.event = 'R-2010';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalInvoice');
    expect(columns[5].property).toBe('totalGrossValue');
    expect(columns[6].property).toBe('totalTaxBase');
    expect(columns[7].property).toBe('totalTaxes');
  });

  it('deve retornar os campos da tabela, para o evento R-2020', () => {
    component.event = 'R-2020';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalInvoice');
    expect(columns[5].property).toBe('totalGrossValue');
    expect(columns[6].property).toBe('totalTaxBase');
    expect(columns[7].property).toBe('totalTaxes');
  });

  it('deve retornar os campos da tabela, para o evento R-2030', () => {
    component.event = 'R-2030';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithholdAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve retornar os campos da tabela, para o evento R-2040', () => {
    component.event = 'R-2040';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithholdAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve retornar os campos da tabela, para o evento R-2050', () => {
    component.event = 'R-2050';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('company');
    expect(columns[3].property).toBe('totalGrossValue');
    expect(columns[4].property).toBe('sociaSecurityContributionValue');
    expect(columns[5].property).toBe('sociaSecurityContributionValueGilrat');
    expect(columns[6].property).toBe('sociaSecurityContributionValueSenar');
  });

  it('deve retornar os campos da tabela, para o evento R-2060', () => {
    component.event = 'R-2060';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('typeOfInscription');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('totalInvoice');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('sociaSecurityContributionValue');
    expect(columns[6].property).toBe('sociaSecurityContributionValueSuspended');
  });

  it('deve retornar os campos da tabela, para o evento R-3010', () => {
    component.event = 'R-3010';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(12);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('newsletterNumber');
    expect(columns[3].property).toBe('mode');
    expect(columns[4].property).toBe('competition');
    expect(columns[5].property).toBe('taxNumberPrincipal');
    expect(columns[6].property).toBe('taxNumberVisited');
    expect(columns[7].property).toBe('payingOffValue');
    expect(columns[8].property).toBe('dontPayingOffValue');
    expect(columns[9].property).toBe('grossValue');
    expect(columns[10].property).toBe('contributionValue');
    expect(columns[11].property).toBe('contributionValueSuspended');
  });

  it('não deve retornar nenhum campo da tabela, por conta do evento ser inválido', () => {
    component.event = 'S-1000';

    const columns = component.transmission(component.event);

    fixture.detectChanges();

    expect(columns).toEqual([]);
  });*/
});
