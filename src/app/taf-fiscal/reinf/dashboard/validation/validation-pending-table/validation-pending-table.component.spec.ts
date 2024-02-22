import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import {
  PoI18nPipe,
  PoNotificationService,
  PoModalModule,
  PoFieldModule,
} from '@po-ui/ng-components';

import { CoreModule } from 'core/core.module';
import { TableModule } from 'shared/table/table.module';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { ValidationPendingTableComponent } from './validation-pending-table.component';
import { ValidationPendingService } from './validation-pending-table.service';
import { ItemTableResourcesReceivedByTheSportsAssociationValidation } from '../../../../models/item-table-resources-received-by-the-sports-association-validation';
import { ItemTableSocialSecurityContributionValidation } from '../../../../models/item-table-social-security-contribution-validation';
import { ItemTableSpecificEvent } from '../../../../models/item-table-specific-event';
import { ItemTableValidation } from '../../../../models/item-table-validation';

xdescribe('ValidationPendingTableComponent', () => {
  let component: ValidationPendingTableComponent;
  let fixture: ComponentFixture<ValidationPendingTableComponent>;
  let injector: TestBed;
  let originalTimeout: number;
  let validationPendingService: ValidationPendingService;
  let poNotificationService: PoNotificationService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ValidationPendingTableComponent],
      imports: [
        CommonModule,
        BrowserModule,
        TableModule,
        CoreModule,
        RouterTestingModule.withRoutes([]),
        PoModalModule,
        PoFieldModule,
        FormsModule,
      ],
      providers: [
        PoI18nPipe,
        MasksPipe,
        ValidationPendingService,
        PoNotificationService,
      ],
    }).compileComponents();
    injector = getTestBed();

    validationPendingService = injector.get(ValidationPendingService);
    poNotificationService = injector.get(PoNotificationService);

    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationPendingTableComponent);
    component = fixture.componentInstance;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000000;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  xit('deve trazer da api, as informações dos itens da tabela', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);

    const spy = spyOn(component, 'setTableItem');

    component.event = 'R-2010';
    component.period = '032019';

    const mockValidationPendingResponse:
    {
      eventDetail: Array<ItemTableValidation>,
      hasNext: boolean;
    } = {
      eventDetail: [
        {
          taxNumber: '01601250000140',
          status: 'notValidated',
          branchId: 'D MG 01 ',
          totalTaxBase: 330.96,
          totalTaxes: 29.12,
          key: '01601250000140',
          totalInvoice: 1,
          totalGrossValue: 330.96,
          branch: 'Filial BELO HOR',
          company: 'MILCLEAN 10',
          taxNumberFormated: '01.601.250/0001-40',
          errors: 'erros',
        },
      ],
      hasNext: false
    };

    spyOn(validationPendingService, 'getInfoValidationPending').and.returnValue(
      of(mockValidationPendingResponse)
    );

    component.getInfoTableValidationPending();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  xit('deve trazer da api, a mensagem de ambiente desatualizado', () => {
    const TAFCompany = { company_code: 'T1', branch_code: 'D MG 01' };
    const company = JSON.stringify(TAFCompany);
    const spy = spyOn(component, 'showMessage');

    const mockValidationPendingResponse: {
      eventDetail: Array<ItemTableSocialSecurityContributionValidation>,
      hasNext: boolean;
    } = {
      eventDetail: [
        {
          existProcId:
            'Atualize o sistema com o último pacote do portal para utilizar essa funcionalidade.',
        },
      ],
      hasNext: false
    };

    sessionStorage.setItem('TAFCompany', company);

    component.event = 'R-2010';
    component.period = '032019';

    spyOn(validationPendingService, 'getInfoValidationPending').and.returnValue(
      of(mockValidationPendingResponse)
    );

    component.getInfoTableValidationPending();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('deve exibir a mensagem de ambiente desatualizado', () => {
    const message = 'Ambiente desatualizado';
    const spyModal = spyOn(component.poModal, 'open');

    component.showMessage(message);
    fixture.detectChanges();

    expect(component.statusMessage).toBe(message);
    expect(spyModal).toHaveBeenCalled();
  });

  it('deve fechar o modal e retornar para a tela do dashboard', () => {
    const spyModal = spyOn(component.poModal, 'close');
    const spyRouter = spyOn(router, 'navigate');

    component.handleModalClosed(false);
    fixture.detectChanges();

    expect(spyModal).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/eventsMonitor']);
  });

  xit('deve retornar erro 500, na consulta dos itens da tabela na api', () => {
    const error500 = throwError({
      body: '',
      status: '500',
    });

    const spyNotification = spyOn(poNotificationService, 'error');

    spyOn(validationPendingService, 'getInfoValidationPending').and.returnValue(
      error500
    );

    component.getInfoTableValidationPending();
    fixture.detectChanges();

    expect(spyNotification).toHaveBeenCalled();
  });

  it('deve retornar os dados da tabela formatados, para o evento R-1000', () => {
    const mockEventDetail: Array<ItemTableSpecificEvent> = [
      {
        taxNumber: '53113791',
        status: '',
        hasFineExemptionAgreement: '0 - Sem acordo',
        beginingDate: '052018',
        finishingdate: '      ',
        contact: 'JAIR DA SILVA TEIXEIRA',
        isPayrollExemption: '0 - Não Aplicável',
        contactTaxNumber: '27015444836',
        isMandatoryBookkeeping: '1 - Empresa obrigada a ECD',
        branch: 'Filial BELO HOR                          ',
        typeOfInscription: '1 - CNPJ',
        taxClassification: '000001',
        contactTaxNumberFormated: '270.154.448-36',
        taxNumberFormated: '53.113.791',
        key: '07363764',
        errors: 'errors',
      },
    ];

    component.event = 'R-1000';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleValidationPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve retornar os dados da tabela formatados, para o evento R-2030', () => {
    const mockEventDetail: Array<
      ItemTableResourcesReceivedByTheSportsAssociationValidation
    > = [
      {
        branchId: 'T1D MG 01',
        branch: 'Filial BELO HOR                         ',
        branchTaxNumber: '64722662000158',
        status: 'Validated',
        taxNumberFormated: '64.722.662/0001-58',
        company: 'MILCLEAN 10',
        totalInvoice: 2,
        totalGrossValue: 2000,
        totalTaxes: 110,
        totalTaxBase: 10000,
        totalTransferAmount: 1000,
        key: 'ebac00d2-8167-e37f-230a-178cce86e21a',
        errors: 'errors',
      },
    ];

    component.event = 'R-2030';
    component.period = '032019';

    fixture.detectChanges();

    expect(component.handleValidationPendingItems(mockEventDetail)).toEqual(
      mockEventDetail
    );
  });

  it('deve setar os itens da tabelade apuração', () => {
    const mockEventDetail: Array<ItemTableValidation> = [
      {
        taxNumber: '01601250000140',
        status: 'notValidated',
        branchId: 'D MG 01 ',
        totalTaxBase: 330.96,
        totalTaxes: 29.12,
        key: '01601250000140',
        totalInvoice: 1,
        totalGrossValue: 330.96,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
        errors: 'errors',
      },
    ];

    component.setTableItem(mockEventDetail,false);
    fixture.detectChanges();

    expect(component.tableItems).toEqual(mockEventDetail);
  });

  it('deve emitir os registros válidos selecionados na tabela de apuração', () => {
    const spyEmitSelectedEntry = spyOn(component, 'emitSelectedEntry');
    const spyEmitButtonActivate = spyOn(component, 'emitButtonActivate');
    const mockEventDetail: Array<ItemTableValidation> = [
      {
        taxNumber: '01601250000140',
        status: 'notValidated',
        branchId: 'D MG 01 ',
        totalTaxBase: 330.96,
        totalTaxes: 29.12,
        key: '01601250000140',
        totalInvoice: 1,
        totalGrossValue: 330.96,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
        errors: 'errors',
      },
    ];

    component.onSelectionChange(mockEventDetail);

    fixture.detectChanges();

    expect(component.isDisablebutton).toBeFalsy();
    expect(spyEmitButtonActivate).toHaveBeenCalledWith(false);
    expect(spyEmitSelectedEntry).toHaveBeenCalledWith(mockEventDetail);
  });

  it('não deve emitir os registros inválidos selecionados na tabela', () => {
    const spyEmitSelectedEntry = spyOn(component, 'emitSelectedEntry');
    const spyEmitButtonActivate = spyOn(component, 'emitButtonActivate');
    const spyNotification = spyOn(poNotificationService, 'warning');
    const mockEventDetail: Array<ItemTableValidation> = [
      {
        taxNumber: '01601250000140',
        status: 'validated',
        branchId: 'D MG 01 ',
        totalTaxBase: 330.96,
        totalTaxes: 29.12,
        key: '01601250000140',
        totalInvoice: 1,
        totalGrossValue: 330.96,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
        errors: 'errors',
      },
    ];

    component.onSelectionChange(mockEventDetail);

    fixture.detectChanges();

    expect(component.isDisablebutton).toBeTruthy();
    expect(spyEmitButtonActivate).toHaveBeenCalledWith(true);
    expect(spyEmitSelectedEntry).not.toHaveBeenCalled();
    expect(spyNotification).toHaveBeenCalled();
  });

  it('não deve emitir os registros válidos, para a tela de eventsReport', () => {
    const spyEmitSelectedEntry = spyOn(component, 'emitSelectedEntry');
    const spyEmitButtonActivate = spyOn(component, 'emitButtonActivate');
    const mockEventDetail: Array<ItemTableValidation> = [
      {
        taxNumber: '01601250000140',
        status: 'notValidated',
        branchId: 'D MG 01 ',
        totalTaxBase: 330.96,
        totalTaxes: 29.12,
        key: '01601250000140',
        totalInvoice: 1,
        totalGrossValue: 330.96,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
        errors: 'errors',
      },
    ];

    component.path = 'eventsReport';

    component.onSelectionChange(mockEventDetail);

    fixture.detectChanges();

    expect(component.isDisablebutton).toBeTruthy();
    expect(spyEmitButtonActivate).toHaveBeenCalledWith(true);
    expect(spyEmitSelectedEntry).not.toHaveBeenCalled();
  });

  it('deve recarregar todos os dados apresentados na tela de apuração', () => {
    const spyHandleLoadOverlay = spyOn(component, 'handleLoadOverlay');
    const spySetCustomLiterals = spyOn(component, 'setCustomLiterals');
    const spyGetInfoTable = spyOn(component, 'getInfoTableValidationPending');
    const spyValidation = spyOn(component, 'validation');

    component.event = 'R-1070';
    component.period = '032019';

    component.reload();
    fixture.detectChanges();

    expect(spyHandleLoadOverlay).toHaveBeenCalledWith(true);
    expect(spySetCustomLiterals).toHaveBeenCalled();
    expect(spyValidation).toHaveBeenCalledWith('R-1070');
    expect(spyGetInfoTable).toHaveBeenCalled();
  });

  it('deve emitir o status do botão para ativação ou desativação', () => {
    const spyEmitButtonActive = spyOn(component.buttonEmit, 'emit');

    component.emitButtonActivate(true);
    fixture.detectChanges();

    expect(spyEmitButtonActive).toHaveBeenCalledWith(true);
  });

  it('deve emitir os itens selecionados da tabela', () => {
    const spyEmitSelectedEntry = spyOn(component.selectedEntry, 'emit');
    const mockEventDetail: Array<ItemTableValidation> = [
      {
        taxNumber: '01601250000140',
        status: 'notValidated',
        branchId: 'D MG 01 ',
        totalTaxBase: 330.96,
        totalTaxes: 29.12,
        key: '01601250000140',
        totalInvoice: 1,
        totalGrossValue: 330.96,
        branch: 'Filial BELO HOR',
        company: 'MILCLEAN 10',
        taxNumberFormated: '01.601.250/0001-40',
        errors: 'errors',
      },
    ];

    component.emitSelectedEntry(mockEventDetail);
    fixture.detectChanges();

    expect(spyEmitSelectedEntry).toHaveBeenCalledWith(mockEventDetail);
  });

  it('deve retornar os campos da tabela, para o evento R-1000', () => {
    const columns = component.validation('R-1000');

    fixture.detectChanges();

    expect(columns.length).toEqual(13);
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
    expect(columns[12].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-1070', () => {
    const columns = component.validation('R-1070');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('proccesType');
    expect(columns[2].property).toBe('proccesNumber');
    expect(columns[3].property).toBe('courtFederatedUnit');
    expect(columns[4].property).toBe('cityCode');
    expect(columns[5].property).toBe('courtId');
    expect(columns[6].property).toBe('beginingDate');
    expect(columns[7].property).toBe('finishingDate');
    expect(columns[8].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2010', () => {
    const columns = component.validation('R-2010');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalInvoice');
    expect(columns[5].property).toBe('totalGrossValue');
    expect(columns[6].property).toBe('totalTaxBase');
    expect(columns[7].property).toBe('totalTaxes');
    expect(columns[8].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2020', () => {
    const columns = component.validation('R-2020');

    fixture.detectChanges();

    expect(columns.length).toEqual(9);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalInvoice');
    expect(columns[5].property).toBe('totalGrossValue');
    expect(columns[6].property).toBe('totalTaxBase');
    expect(columns[7].property).toBe('totalTaxes');
    expect(columns[8].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2030', () => {
    const columns = component.validation('R-2030');

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2040', () => {
    const columns = component.validation('R-2040');

    fixture.detectChanges();

    expect(columns.length).toEqual(6);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2050', () => {
    const columns = component.validation('R-2050');

    fixture.detectChanges();

    expect(columns.length).toEqual(7);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('branch');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('company');
    expect(columns[4].property).toBe('totalInvoice');
    expect(columns[5].property).toBe('totalGrossValue');
    expect(columns[6].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-2060', () => {
    const columns = component.validation('R-2060');

    fixture.detectChanges();

    expect(columns.length).toEqual(8);
    expect(columns[0].property).toBe('status');
    expect(columns[1].property).toBe('typeOfInscription');
    expect(columns[2].property).toBe('taxNumberFormated');
    expect(columns[3].property).toBe('totalInvoice');
    expect(columns[4].property).toBe('totalGrossValue');
    expect(columns[5].property).toBe('sociaSecurityContributionValue');
    expect(columns[6].property).toBe(
      'socialSecurityContributionValueSuspended'
    );
    expect(columns[7].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para o evento R-3010', () => {
    const columns = component.validation('R-3010');

    fixture.detectChanges();

    expect(columns.length).toEqual(13);
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
    expect(columns[12].property).toBe('errors');
  });

  it('deve retornar os campos da tabela, para um evento inválido', () => {
    const columns = component.validation('S-1070');

    fixture.detectChanges();

    expect(columns.length).toEqual(0);
  });
});
