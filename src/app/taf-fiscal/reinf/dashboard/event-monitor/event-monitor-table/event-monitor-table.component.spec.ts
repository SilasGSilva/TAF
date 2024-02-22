import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  getTestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import {
  PoPageModule,
  PoTableModule,
  PoContainerModule,
  PoModalModule,
  PoI18nPipe,
} from '@po-ui/ng-components';

import { EventErrorMessageModule } from 'shared/event-error-message/event-error-message.module';
import { TableModule } from 'shared/table/table.module';
import { ItemTableMonitor } from '../../../../models/item-table-monitor';
import { ItemTableTaxPayer } from './item-table-tax-payer';
import { EventMonitorTableComponent } from './event-monitor-table.component';
import { EventMonitorTableService } from './event-monitor-table.service';
import { ItemTableProcess } from '../../../../models/item-table-process';
import { ItemTableSociaSecurityContribution } from './item-table-socia-security-contribution';
import { ItemTableResourcesReceivedByTheSportsAssociation } from './item-table-resources-received-by-the-sports-association';
import { ItemTableEventByTheSportsAssociation } from '../../../../models/item-table-event-by-the-sports-association';
import { CoreModule } from 'core/core.module';

xdescribe('EventMonitorTableComponent', () => {
  let component: EventMonitorTableComponent;
  let fixture: ComponentFixture<EventMonitorTableComponent>;
  let eventMonitorTableService: EventMonitorTableService;
  let originalTimeout: number;
  let injector: TestBed;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventMonitorTableComponent],
      imports: [
        CoreModule,
        CommonModule,
        BrowserModule,
        PoPageModule,
        PoTableModule,
        PoModalModule,
        PoContainerModule,
        RouterTestingModule,
        EventErrorMessageModule,
        TableModule,
      ],
      providers: [PoI18nPipe, EventMonitorTableService],
    }).compileComponents();
    injector = getTestBed();

    eventMonitorTableService = injector.get(EventMonitorTableService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMonitorTableComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 700000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar os dados da api para o evento R-1000 com o status rejeitado', async function() {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    const spySetItems = spyOn(component, 'setItems');

    const mockEventDetail = {
      eventDetail: [
        {
          typeOfInscription: '1 - CNPJ',
          taxNumberFormated: '53.113.791',
          beginingDate: '052018',
          finishingdate: '      ',
          taxClassification: '000001',
          isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
          isPayrollExemption: '0 - Não Aplicável',
          hasFineExemptionAgreement: '0 - Sem acordo',
          contact: 'JAIR DA SILVA TEIXEIRA',
          contactTaxNumberFormated: '270.154.448-36',
          contactTaxNumber: '27015444836',
          errorId: '22',
          errors: 'Erros',
        },
      ],
    };

    sessionStorage.setItem('TAFCompany', company);

    component.status = 'rejected';
    component.event = 'R-1000';
    component.period = '012019';

    spyOn(eventMonitorTableService, 'getInfoEventMonitor').and.returnValue(
      of(mockEventDetail)
    );

    await component.getInfoEventMonitor();
    fixture.detectChanges();

    expect(spySetItems).toHaveBeenCalled();
    expect(component.tableLoad).toBeFalsy();
  });

  it('deve retornar os itens da tabela formatados, para o evento R-1000', () => {
    const mockEventDetail: Array<ItemTableTaxPayer> = [
      {
        typeOfInscription: '1 - CNPJ',
        taxNumberFormated: '53.113.791',
        beginingDate: '052018',
        finishingdate: '      ',
        taxClassification: '000001',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        isPayrollExemption: '0 - Não Aplicável',
        hasFineExemptionAgreement: '0 - Sem acordo',
        contact: 'JAIR DA SILVA TEIXEIRA',
        contactTaxNumberFormated: '270.154.448-36',
        contactTaxNumber: '27015444836',
        errorId: '22',
        errors: 'Erros',
      },
    ];

    component.event = 'R-1000';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetail)).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2030', () => {
    const mockEventDetail: Array<
      ItemTableResourcesReceivedByTheSportsAssociation
    > = [
      {
        taxNumberFormated: '54.216.964/0001-09',
        branchTaxNumber: '54216964000109',
        company: 'D MG 01 ',
        totalGrossValue: 1000,
        totalReceivedWithHoldAmount: 1000,
        totalValueOfRetentionWithSuspendedLiability: 1000,
        errorId: '22',
        errors: 'Erros',
        protocol: '831287381974189717',
      },
    ];

    component.event = 'R-2030';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetail)).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2040', () => {
    const mockEventDetail = [
      {
        taxNumberFormated: '57.357.888/0001-10',
        branchTaxNumber: '57357888000110',
        company: 'D MG 01 ',
        totalGrossValue: 1001,
        totalReceivedWithHoldAmount: 1001,
        totalValueOfRetentionWithSuspendedLiability: 1001,
        errorId: '23',
        errors: 'Erros',
        protocol: '831287ZZ381974189717',
      },
    ];

    component.event = 'R-2040';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetail)).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2060', () => {
    const mockEventDetail: Array<ItemTableSociaSecurityContribution> = [
      {
        typeOfInscription: '1 - CNPJ',
        taxNumberFormated: '07.363.764/0001-90',
        companyTaxNumber: '07363764000190',
        totalGrossValue: 10500.0,
        sociaSecurityContributionValue: 198.0,
        socialSecurityContributionValueSuspended: 0.0,
        errorId: '22',
        errors: 'Erros',
      },
    ];

    component.event = 'R-2060';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetail)).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-3010', () => {
    const mockEventDetail: Array<ItemTableEventByTheSportsAssociation> = [
      {
        branch: 'D MG 01',
        newsletterNumber: '1009',
        mode: 'MODALIDADE',
        contributionValueSuspended: 0,
        payingOffValue: 1200,
        dontPayingOffValue: 10,
        contributionValue: 1232,
        taxNumberVisited: '17379939000101',
        grossValue: 11200,
        taxNumberPrincipal: '99622840000153',
        competition: 'NOME COMPETICAO',
        errorId: '27',
        errors: 'Erros',
      },
    ];

    component.event = 'R-3010';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetail)).toEqual(mockEventDetail);
  });

  it('deve retornar os itens da tabela formatados, para o evento R-2010', () => {
    const mockEventDetailResponse: Array<ItemTableMonitor> = [
      {
        taxNumberFormated: '01.601.250/0001-40',
        company: 'MILCLEAN 10',
        totalGrossValue: 1000,
        totalTaxes: 29.12,
        totalTaxBase: 330.96,
        errorId: '22',
        errors: 'Erros',
      },
    ];

    component.event = 'R-2010';
    component.period = '012019';

    fixture.detectChanges();

    expect(component.setItems(mockEventDetailResponse)).toEqual(
      mockEventDetailResponse
    );
  });

  it('deve detectar mudanças no componente e efetuar a chamada da função que carrrega a tabela', () => {
    const spy = spyOn(component, 'loadTable');

    sessionStorage.clear();

    component.companyId = '';
    component.currentStatus = 'transmitted';
    component.status = 'waitingReturn';
    component.ngOnChanges();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve detectar mudanças no componente e não efetuar a chamada da função que carrrega a tabela', () => {
    const spy = spyOn(component, 'loadTable');

    component.currentStatus = 'transmitted';
    component.status = 'transmitted';
    component.ngOnChanges();

    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('deve retornar um id específico', () => {
    const spy = spyOn(component.eventErrorMessage, 'errorDetail');

    const mockItemTableProcess: ItemTableProcess = {
      proccesType: 'Administrativo',
      proccesNumber: '10095957620188260001',
      courtFederatedUnit: 'SAO PAULO',
      cityCode: '50308 - SAO PAULO',
      courtId: '003888',
      beginingDate: '012019',
      finishingDate: '      ',
      errorId: '99999',
      errors: 'Erros',
    };

    component.showError(mockItemTableProcess);

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('99999');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1000 no estado transmitido', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1000';
    component.status = 'transmitted';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(10);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('beginingDate');
    expect(columns[3].property).toBe('finishingdate');
    expect(columns[4].property).toBe('taxClassification');
    expect(columns[5].property).toBe('isMandatoryBookkeeping');
    expect(columns[6].property).toBe('isPayrollExemption');
    expect(columns[7].property).toBe('hasFineExemptionAgreement');
    expect(columns[8].property).toBe('contact');
    expect(columns[9].property).toBe('contactTaxNumberFormated');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1000 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1000';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(10);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('beginingDate');
    expect(columns[3].property).toBe('finishingdate');
    expect(columns[4].property).toBe('taxClassification');
    expect(columns[5].property).toBe('isMandatoryBookkeeping');
    expect(columns[6].property).toBe('isPayrollExemption');
    expect(columns[7].property).toBe('hasFineExemptionAgreement');
    expect(columns[8].property).toBe('contact');
    expect(columns[9].property).toBe('contactTaxNumberFormated');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1000 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1000';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('beginingDate');
    expect(columns[3].property).toBe('finishingdate');
    expect(columns[4].property).toBe('taxClassification');
    expect(columns[5].property).toBe('isMandatoryBookkeeping');
    expect(columns[6].property).toBe('isPayrollExemption');
    expect(columns[7].property).toBe('hasFineExemptionAgreement');
    expect(columns[8].property).toBe('contact');
    expect(columns[9].property).toBe('contactTaxNumberFormated');
    expect(columns[10].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1000 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1000';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('beginingDate');
    expect(columns[3].property).toBe('finishingdate');
    expect(columns[4].property).toBe('taxClassification');
    expect(columns[5].property).toBe('isMandatoryBookkeeping');
    expect(columns[6].property).toBe('isPayrollExemption');
    expect(columns[7].property).toBe('hasFineExemptionAgreement');
    expect(columns[8].property).toBe('contact');
    expect(columns[9].property).toBe('contactTaxNumberFormated');
    expect(columns[10].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1070 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1070';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('proccesType');
    expect(columns[1].property).toBe('proccesNumber');
    expect(columns[2].property).toBe('courtFederatedUnit');
    expect(columns[3].property).toBe('cityCode');
    expect(columns[4].property).toBe('courtId');
    expect(columns[5].property).toBe('beginingDate');
    expect(columns[6].property).toBe('finishingDate');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1070 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1070';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('proccesType');
    expect(columns[1].property).toBe('proccesNumber');
    expect(columns[2].property).toBe('courtFederatedUnit');
    expect(columns[3].property).toBe('cityCode');
    expect(columns[4].property).toBe('courtId');
    expect(columns[5].property).toBe('beginingDate');
    expect(columns[6].property).toBe('finishingDate');
    expect(columns[7].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-1070 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-1070';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('proccesType');
    expect(columns[1].property).toBe('proccesNumber');
    expect(columns[2].property).toBe('courtFederatedUnit');
    expect(columns[3].property).toBe('cityCode');
    expect(columns[4].property).toBe('courtId');
    expect(columns[5].property).toBe('beginingDate');
    expect(columns[6].property).toBe('finishingDate');
    expect(columns[7].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2010 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2010';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2010 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2010';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
    expect(columns[5].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2010 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2010';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
    expect(columns[5].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2020 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2020';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2020 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2020';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
    expect(columns[5].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2020 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2020';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalTaxBase');
    expect(columns[4].property).toBe('totalTaxes');
    expect(columns[5].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2030 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2030';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve comparar o retorno da função monitoring para o evento R-2030 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2030';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
    expect(columns[5].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2030 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2030';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
    expect(columns[5].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2040 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2040';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
  });

  it('deve comparar o retorno da função monitoring para o evento R-2040 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2040';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
    expect(columns[5].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2040 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2040';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('totalReceivedWithHoldAmount');
    expect(columns[4].property).toBe(
      'totalValueOfRetentionWithSuspendedLiability'
    );
    expect(columns[5].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2050 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2050';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe('sociaSecurityContributionValueGilrat');
    expect(columns[5].property).toBe('sociaSecurityContributionValueSenar');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2050 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2050';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe('sociaSecurityContributionValueGilrat');
    expect(columns[5].property).toBe('sociaSecurityContributionValueSenar');
    expect(columns[6].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2050 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2050';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('taxNumberFormated');
    expect(columns[1].property).toBe('company');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe('sociaSecurityContributionValueGilrat');
    expect(columns[5].property).toBe('sociaSecurityContributionValueSenar');
    expect(columns[6].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2060 no estado transmitido', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2060';
    component.status = 'transmitted';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe(
      'socialSecurityContributionValueSuspended'
    );
  });

  it('deve comparar o retorno da função monitoring para o evento R-2060 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2060';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(5);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe(
      'socialSecurityContributionValueSuspended'
    );
  });

  it('deve comparar o retorno da função monitoring para o evento R-2060 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2060';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe(
      'socialSecurityContributionValueSuspended'
    );
    expect(columns[5].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-2060 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2060';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('typeOfInscription');
    expect(columns[1].property).toBe('taxNumberFormated');
    expect(columns[2].property).toBe('totalGrossValue');
    expect(columns[3].property).toBe('sociaSecurityContributionValue');
    expect(columns[4].property).toBe(
      'socialSecurityContributionValueSuspended'
    );
    expect(columns[5].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento R-3010 no estado transmitido', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-3010';
    component.status = 'transmitted';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
    expect(columns[0].property).toBe('branch');
    expect(columns[1].property).toBe('newsletterNumber');
    expect(columns[2].property).toBe('mode');
    expect(columns[3].property).toBe('competition');
    expect(columns[4].property).toBe('taxNumberPrincipal');
    expect(columns[5].property).toBe('taxNumberVisited');
    expect(columns[6].property).toBe('payingOffValue');
    expect(columns[7].property).toBe('dontPayingOffValue');
    expect(columns[8].property).toBe('grossValue');
    expect(columns[9].property).toBe('contributionValue');
    expect(columns[10].property).toBe('contributionValueSuspended');
  });

  it('deve comparar o retorno da função monitoring para o evento R-3010 no estado aguardando governo', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-3010';
    component.status = 'waitingReturn';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(11);
    expect(columns[0].property).toBe('branch');
    expect(columns[1].property).toBe('newsletterNumber');
    expect(columns[2].property).toBe('mode');
    expect(columns[3].property).toBe('competition');
    expect(columns[4].property).toBe('taxNumberPrincipal');
    expect(columns[5].property).toBe('taxNumberVisited');
    expect(columns[6].property).toBe('payingOffValue');
    expect(columns[7].property).toBe('dontPayingOffValue');
    expect(columns[8].property).toBe('grossValue');
    expect(columns[9].property).toBe('contributionValue');
    expect(columns[10].property).toBe('contributionValueSuspended');
  });

  it('deve comparar o retorno da função monitoring para o evento R-3010 no estado autorizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-3010';
    component.status = 'authorized';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(12);
    expect(columns[0].property).toBe('branch');
    expect(columns[1].property).toBe('newsletterNumber');
    expect(columns[2].property).toBe('mode');
    expect(columns[3].property).toBe('competition');
    expect(columns[4].property).toBe('taxNumberPrincipal');
    expect(columns[5].property).toBe('taxNumberVisited');
    expect(columns[6].property).toBe('payingOffValue');
    expect(columns[7].property).toBe('dontPayingOffValue');
    expect(columns[8].property).toBe('grossValue');
    expect(columns[9].property).toBe('contributionValue');
    expect(columns[10].property).toBe('contributionValueSuspended');
    expect(columns[11].property).toBe('protocol');
  });

  it('deve comparar o retorno da função monitoring para o evento R-3010 no estado rejeitado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-3010';
    component.status = 'rejected';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns.length).toEqual(12);
    expect(columns[0].property).toBe('branch');
    expect(columns[1].property).toBe('newsletterNumber');
    expect(columns[2].property).toBe('mode');
    expect(columns[3].property).toBe('competition');
    expect(columns[4].property).toBe('taxNumberPrincipal');
    expect(columns[5].property).toBe('taxNumberVisited');
    expect(columns[6].property).toBe('payingOffValue');
    expect(columns[7].property).toBe('dontPayingOffValue');
    expect(columns[8].property).toBe('grossValue');
    expect(columns[9].property).toBe('contributionValue');
    expect(columns[10].property).toBe('contributionValueSuspended');
    expect(columns[11].property).toBe('errors');
  });

  it('deve comparar o retorno da função monitoring para o evento diferente do reinf no estado transmitido', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    component.event = 'S-1000';
    component.status = 'transmitted';

    const columns = component.monitoring(component.event);

    fixture.detectChanges();

    expect(columns).toEqual([]);
  });
});
