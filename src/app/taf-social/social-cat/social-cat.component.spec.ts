import { SocialListBranchService } from './../services/social-list-branch/social-list-branch.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PoI18nConfig, PoI18nModule } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { CatValuesResponse } from './social-cat-models/CatValuesResponse';
import { Cat } from './social-cat-models/Cat';
import { CatEnvironmentService } from './cat-filter/services/cat-enviroment.service';
import { CatServices } from './cat-filter/services/cat.service';
import { SocialCatComponent } from './social-cat.component';
import { TafSocialCatModule } from './social-cat.module';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true,
  },
  contexts: {
    tafSocial: {
      'pt-BR': tafSocialPt,
    },
  },
};

xdescribe(SocialCatComponent.name, () => {
  let component: SocialCatComponent = null;
  let fixture: ComponentFixture<SocialCatComponent> = null;
  let catServices: CatServices = null;
  let catEnvironmentService: CatEnvironmentService;

  const TAFCompany = {
    company_code: 'T1',
    branch_code: 'D MG 01',
  };
  const tafFull = true;
  const tafContext = 'esocial';

  sessionStorage.setItem('TAFCompany', JSON.stringify(TAFCompany));
  sessionStorage.setItem('TAFFull', JSON.stringify(tafFull));
  sessionStorage.setItem('TAFContext', tafContext);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TafSocialCatModule,
        RouterTestingModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        SocialListBranchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialCatComponent);
    component = fixture.componentInstance;
    catServices = TestBed.inject(CatServices);
    catEnvironmentService = TestBed.inject(CatEnvironmentService);
  });

  it(`deve criar o componente ${SocialCatComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it(`#loadProgressBar
    deve incrementar régua de processamento e liberar controles após conclusão de término quando solicitado`, () => {
    const percent = [0, 25, 50, 100, 150];
    percent.forEach(percent => {
      component.loadProgressBar(percent);
    });

    expect(component.disabledInputs)
      .withContext(`disabledInputs: ${component.disabledInputs}`)
      .toBeFalse();
    expect(component.loadingTable)
      .withContext(`disabledInputs: ${component.loadingTable}`)
      .toBeFalse();
    expect(component.progressSuccess)
      .withContext(`disabledInputs: ${component.progressSuccess}`)
      .toBeTrue();
  });

  it(`#loadMainTable
    deve carregar/incrementar tabela principal, liberar controles de exibição e ocultar régua de processamento quando dados chegarem do serviço`, async () => {
    const params = {
      companyId: catEnvironmentService.getCompany(),
      requestId: 'd80e6290-b916-d3c3-9219-74dd5ebbaeea',
      page: 1,
      pageSize: 20,
    };
    const mockItemsTable: Array<Cat> = [
      {
        branch: 'D MG 01 ',
        catNumber: '4.44444444',
        categCode: '101',
        accidentDate: '2022-09-16',
        accidentTime: '13:24',
        accidentType: 'Tipico',
        catType: 'Inicial',
        eventType: 'Inclusão',
        deathDate: '',
        originCatNumber: '',
        cpf: '880.693.280-29',
        name: 'SEU BRAZ LEME',
        registration: 'MATBRAZ001',
        predecessorType: 'S2200',
        initialCat: 'Iniciativa do empregador',
        inscriptionType: 'CNPJ',
        inscriptionNumber: '53.113.791/0001-22',
        socialReason: 'TOTVS SA',
        cnae: '',
        gender: 'Masculino',
        civilStatus: 'Divorciado',
        birthDate: '04/12/93',
        cbo: '010115 - Oficial general da marinha',
        area: '',
        workHour: '03:24',
        removal: 'Sim',
        place: '',
        placeType: 'Estab empreg. Brazil',
        country: 'BRASIL',
        inscriptionPlace: '  .   .   /    -  ',
        uf: 'AC',
        county: 'PORTO VELHO',
        affectedParts: '753030000 - CRANIO (INCLUSIVE ENCEFALO)',
        laterality: 'Esquerda',
        causerAgent: '302010200 - RUA E ESTRADA - SUPERFICIE UTILIZADA PARA SUSTENTAR PESSOAS',
        situation: '200004300 - IMPACTO DE PESSOA CONTRA OBJETO PARADO',
        police: 'Sim',
        deathSign: 'Sim',
        note: '',
        serviceDate: '16/09/22',
        serviceHour: '13:24',
        hospitalization: 'Sim',
        treatmentDuration: '1',
        lesion: '702000000 - LESAO IMEDIATA',
        probableDiagnosis: '',
        codeCid: 'A00.0 - COLERA DEVIDA A VIBRIO CHOLERAE 01, BIOTIPO CHOLERAE',
        observation: '',
        doctorInformation: ', CRM  AC',
        lastDayWorked: '',
        thereWasRemoval: '',
        receivingDate: '  /  /  ',
        placeDate: ' SP - 16/09/22',
        key: '000001'
      }
    ];
    const responseReportTableEmpty: CatValuesResponse = {
      items: [],
      hasNext: false,
    };
    const responseReportTable: CatValuesResponse = {
      items: [
        {
          branch: 'D MG 01 ',
          catNumber: '4.44444444',
          categCode: '101',
          accidentDate: '2022-09-16',
          accidentTime: '13:24',
          accidentType: 'Tipico',
          catType: 'Inicial',
          eventType: 'Inclusão',
          deathDate: '',
          originCatNumber: '',
          cpf: '880.693.280-29',
          name: 'SEU BRAZ LEME',
          registration: 'MATBRAZ001',
          predecessorType: 'S2200',
          initialCat: 'Iniciativa do empregador',
          inscriptionType: 'CNPJ',
          inscriptionNumber: '53.113.791/0001-22',
          socialReason: 'TOTVS SA',
          cnae: '',
          gender: 'Masculino',
          civilStatus: 'Divorciado',
          birthDate: '04/12/93',
          cbo: '010115 - Oficial general da marinha',
          area: '',
          workHour: '03:24',
          removal: 'Sim',
          place: '',
          placeType: 'Estab empreg. Brazil',
          country: 'BRASIL',
          inscriptionPlace: '  .   .   /    -  ',
          uf: 'AC',
          county: 'PORTO VELHO',
          affectedParts: '753030000 - CRANIO (INCLUSIVE ENCEFALO)',
          laterality: 'Esquerda',
          causerAgent: '302010200 - RUA E ESTRADA - SUPERFICIE UTILIZADA PARA SUSTENTAR PESSOAS',
          situation: '200004300 - IMPACTO DE PESSOA CONTRA OBJETO PARADO',
          police: 'Sim',
          deathSign: 'Sim',
          note: '',
          serviceDate: '16/09/22',
          serviceHour: '13:24',
          hospitalization: 'Sim',
          treatmentDuration: '1',
          lesion: '702000000 - LESAO IMEDIATA',
          probableDiagnosis: '',
          codeCid: 'A00.0 - COLERA DEVIDA A VIBRIO CHOLERAE 01, BIOTIPO CHOLERAE',
          observation: '',
          doctorInformation: ', CRM  AC',
          lastDayWorked: '',
          thereWasRemoval: '',
          receivingDate: '  /  /  ',
          placeDate: ' SP - 16/09/22',
          key: '000001'
        }
      ],
      hasNext: false,
    };

    spyOn(catServices, 'postValuesCat').and.returnValue(
      of(responseReportTable)
    );
    component.loadMainTable(responseReportTableEmpty);
    expect(component.emptyResult)
      .withContext(`Deve sinalizar resultado vazio`)
      .toBeTrue();
    expect(component.verifyRegisters)
      .withContext(
        `Deve sinalizar para não liberar exibição de tabela nem gráficos`
      )
      .toBeFalse();

    await catServices
      .postValuesCat(params)
      .toPromise()
      .then(response => {
        component.loadMainTable(response);
        expect(component.itemsTable)
          .withContext(`Mock de inclusão de itens na tabela`)
          .toEqual(mockItemsTable);
        expect(component.verifyRegisters)
          .withContext(
            `Deve sinalizar para liberar exibição de tabela em gráficos`
          )
          .toBeTrue();
        expect(component.progressBarValue)
          .withContext(`Deve ocultar régua de processamento`)
          .toBeUndefined();
      });
  });

  it(`#reset
    deve resetar elementos de controle do componente quando filtro emitir evento de reset`, () => {
    const catFilterEl: HTMLElement = fixture.nativeElement.querySelector(
      'app-cat-filter'
    );
    const resetEvent = new CustomEvent('reset');
    catFilterEl.dispatchEvent(resetEvent);

    expect(component.progressBarValue)
      .withContext(`Deve resetar valor da barra de progresso`)
      .toBeUndefined();
    expect(component.progressSuccess)
      .withContext(`Deve resetar flag de sucesso`)
      .toBeUndefined();
    expect(component.itemsTable)
      .withContext(`Deve resetar itens da tabela principal`)
      .toBeUndefined();
    expect(component.verifyRegisters)
      .withContext(
        `Deve sinalizar para não liberar exibição de tabela nem gráficos`
      )
      .toBeFalse();
    expect(component.emptyResult)
      .withContext(`Deve sinalizar resultado vazio`)
      .toBeFalse();
  });

});
