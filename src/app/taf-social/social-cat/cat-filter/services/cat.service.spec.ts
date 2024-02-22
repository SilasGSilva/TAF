import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { PoI18nConfig, PoI18nModule, PoI18nPipe } from '@po-ui/ng-components';
import { tafSocialPt } from 'core/i18n/taf-social-pt';
import { CatExecuteRequest } from '../../social-cat-models/CatRequest';
import { CatValuesRequestMonitor } from './../../social-cat-models/CatValuesRequestMonitor';
import { CatServices } from './cat.service';
import { CatEnvironmentService } from './cat-enviroment.service';
import { CatPrintReportService } from '../../cat-report/services/cat-print-report.service';

const mockRequestID = 'd80e6290-b916-d3c3-9219-74dd5ebbaeea';
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

function buildQueryParams(params: Object): string {
  return (
    '?' +
    Object.keys(params)
      .map(item => {
        return item + '=' + encodeURIComponent(params[item]);
      })
      .join('&')
  );
}

function validateConvertedBase64PDF(urlPdfBase64: string): boolean {
  const base64RegexVerification = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  const urlBase64 = urlPdfBase64.replace('data:application/pdf;base64,', '');

  return base64RegexVerification.test(urlBase64);
}

xdescribe(CatServices.name, () => {
  let service: CatServices = null;
  let environmentService: CatEnvironmentService = null;
  let httpController: HttpTestingController = null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        PoI18nModule.config(i18nConfig),
      ],
      providers: [
        CatServices,
        CatEnvironmentService,
        CatPrintReportService,
        PoI18nPipe,
        DatePipe
      ],
    }).compileComponents();

    service = TestBed.inject(CatServices);
    httpController = TestBed.inject(HttpTestingController);
    environmentService = TestBed.inject(CatEnvironmentService);
  });

  afterEach(() => httpController.verify());

  it('Deve criar o serviço principal do Painel de Emissão de Formulários da CAT', () => {
    expect(service).toBeTruthy();
  });

  it(`#postExecutCat
    deve retornar o ID da Requisição de geração do relatório quando solicitada execução`, done => {
    const mockResponsePostExecuteCat = {
      api: '/api/rh/esocial/v1/CatReport',
      data: { requestId: mockRequestID },
    };
    const payload: CatExecuteRequest = {
      companyId: 'T1|D MG 01 ',
      branches: [
        'D MG 01 ',
        'D RJ 02 ',
        'M PR 02 '
      ],
      cpf: '88069328029',
      name: 'BRAZ LEME',
      catNumber: '4.44444444',
      periodFrom: '20220901',
      periodTo: '20220930'
    };

    service.postExecutCat(payload).subscribe(response => {
      expect(response).toBe(mockResponsePostExecuteCat.data);
      done();
    });

    httpController
      .expectOne(mockResponsePostExecuteCat.api)
      .flush(mockResponsePostExecuteCat.data);
  });

  it(`#getStatusCat
    deve retornar o percentual e flag de término de conclusão do relatório quando concluído`, done => {
    const mockResponseGetStatusCat = {
      api: '/api/rh/esocial/v1/CatReport/status',
      data: {
        finished: true,
        percent: 100,
      },
    };
    const params = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
    };

    service.getStatusCat(params).subscribe(response => {
      expect(response).toBe(mockResponseGetStatusCat.data);
      done();
    });

    httpController
      .expectOne(mockResponseGetStatusCat.api + buildQueryParams(params))
      .flush(mockResponseGetStatusCat.data);
  });

  it(`#postValuesCat
    deve retornar valores a preencher na tabela do Painel da CAT conforme paginação quando solicitado`, done => {
    const mockResponsePostValuesCat = {
      api: '/api/rh/esocial/v1/CatReport/catValues',
      data: {
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
      },
    };
    const payload = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID,
      page: 1,
      pageSize: 5,
    };

    service.postValuesCat(payload).subscribe(response => {
      expect(response).toBe(mockResponsePostValuesCat.data);
      done();
    });

    httpController
      .expectOne(mockResponsePostValuesCat.api)
      .flush(mockResponsePostValuesCat.data);
  });

  it(`#postValuesCatMonitor
    deve retornar informações necessárias para impressão de cada uma das CATs solicitadas via Detalhamento do Monitoramento`, done => {
    const mockResponsePostValuesCatMonitor = {
      api: '/api/rh/esocial/v1/CatReport/catMonitorValues',
      data: {
        items: [
          {
            branch: 'D MG 01 ',
            catNumber: '3.3333333',
            categCode: '101',
            accidentDate: '2022-09-15',
            accidentTime: '13:21',
            accidentType: 'Tipico',
            catType: 'Inicial',
            eventType: 'Inclusão',
            deathDate: '15/09/22',
            originCatNumber: '',
            cpf: '392.883.920-92',
            name: 'MONICA BELUCCHI',
            registration: 'MATMONI001',
            predecessorType: 'S2200',
            initialCat: 'Iniciativa do empregador',
            inscriptionType: 'CNPJ',
            inscriptionNumber: '53.113.791/0001-22',
            socialReason: 'TOTVS SA',
            cnae: '',
            gender: 'Feminino',
            civilStatus: 'Solteiro',
            birthDate: '03/12/93',
            cbo: '010115 - Oficial general da marinha',
            area: '',
            workHour: '03:21',
            removal: 'Sim',
            place: '',
            placeType: 'Estab empreg. Exterior',
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
            serviceDate: '05/12/93',
            serviceHour: '08:00',
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
            placeDate: ' SP - 05/12/93',
            key: '000001'
          }
        ],
        hasNext: false
      }
    };
    const payload: CatValuesRequestMonitor = {
      companyId: 'T1|D MG 01 ',
      key: [
        'D MG 01 |S2210|000005|15092204815194|'
      ]
    };

    service.postValuesCatMonitor(payload).subscribe(response => {
      expect(response).toBe(mockResponsePostValuesCatMonitor.data);
      done();
    });

    httpController
      .expectOne(mockResponsePostValuesCatMonitor.api)
      .flush(mockResponsePostValuesCatMonitor.data);
  });

  it(`#printCatReport
    deve retornar um pdf da CAT válido convertido em base64 baseado nas chaves informadas quando solicitado`, done => {
    const selectedCatKeys = ['000003'];
    const mockResponsePostValuesCat = {
      api: '/api/rh/esocial/v1/CatReport/catValues',
      data: {
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
      },
    };
    service.requestCurrentParams = {
      companyId: environmentService.getCompany(),
      requestId: mockRequestID
    };

    service.printCatReport(selectedCatKeys).subscribe(response => {
      expect(validateConvertedBase64PDF(response))
        .withContext('Deve conter um arquivo PDF convertido para string base64 válida')
        .toBeTrue()
      done();
    });

    httpController
      .expectOne(mockResponsePostValuesCat.api)
      .flush(mockResponsePostValuesCat.data);
  });

  it(`#printCatReportMonitor
  deve retornar um pdf da CAT válido convertido em base64 baseado nas chaves informadas quando solicitado via Painel de Monitoramento`, done => {
    const selectedCatKeys = ['D MG 01 |S2210|000005|15092204815194|'];
    const mockResponsePostValuesCatMonitor = {
      api: '/api/rh/esocial/v1/CatReport/catMonitorValues',
      data: {
        items: [
          {
            branch: 'D MG 01 ',
            catNumber: '3.3333333',
            categCode: '101',
            accidentDate: '2022-09-15',
            accidentTime: '13:21',
            accidentType: 'Tipico',
            catType: 'Inicial',
            eventType: 'Inclusão',
            deathDate: '15/09/22',
            originCatNumber: '',
            cpf: '392.883.920-92',
            name: 'MONICA BELUCCHI',
            registration: 'MATMONI001',
            predecessorType: 'S2200',
            initialCat: 'Iniciativa do empregador',
            inscriptionType: 'CNPJ',
            inscriptionNumber: '53.113.791/0001-22',
            socialReason: 'TOTVS SA',
            cnae: '',
            gender: 'Feminino',
            civilStatus: 'Solteiro',
            birthDate: '03/12/93',
            cbo: '010115 - Oficial general da marinha',
            area: '',
            workHour: '03:21',
            removal: 'Sim',
            place: '',
            placeType: 'Estab empreg. Exterior',
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
            serviceDate: '05/12/93',
            serviceHour: '08:00',
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
            placeDate: ' SP - 05/12/93',
            key: '000001'
          }
        ],
        hasNext: false
      },
    };

    service.printCatReportMonitor(selectedCatKeys).subscribe(response => {
      expect(validateConvertedBase64PDF(response))
        .withContext('Deve conter um arquivo PDF convertido para string base64 válida')
        .toBeTrue()
      done();
    });

    httpController
      .expectOne(mockResponsePostValuesCatMonitor.api)
      .flush(mockResponsePostValuesCatMonitor.data);
  });

  it(`#downloadCatReport
  deve retornar um pdf da CAT válido convertido em base64 para cada um dos modos de impressão da CAT`, () => {
    const printMode = ['mixed', 'separate'];
    const mockResponsePostValuesCatMonitor = {
      api: '/api/rh/esocial/v1/CatReport/catMonitorValues',
      data: {
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
          },          {
            branch: 'D MG 01 ',
            catNumber: '3.3333333',
            categCode: '101',
            accidentDate: '2022-09-15',
            accidentTime: '13:21',
            accidentType: 'Tipico',
            catType: 'Inicial',
            eventType: 'Inclusão',
            deathDate: '15/09/22',
            originCatNumber: '',
            cpf: '392.883.920-92',
            name: 'MONICA BELUCCHI',
            registration: 'MATMONI001',
            predecessorType: 'S2200',
            initialCat: 'Iniciativa do empregador',
            inscriptionType: 'CNPJ',
            inscriptionNumber: '53.113.791/0001-22',
            socialReason: 'TOTVS SA',
            cnae: '',
            gender: 'Feminino',
            civilStatus: 'Solteiro',
            birthDate: '03/12/93',
            cbo: '010115 - Oficial general da marinha',
            area: '',
            workHour: '03:21',
            removal: 'Sim',
            place: '',
            placeType: 'Estab empreg. Exterior',
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
            serviceDate: '05/12/93',
            serviceHour: '08:00',
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
            placeDate: ' SP - 05/12/93',
            key: '000002'
          }
        ],
        hasNext: false
      }
    };

    spyOn(service, 'postValuesCatMonitor').and.returnValue(
      of(mockResponsePostValuesCatMonitor.data)
    )

    expect(() => service.downloadCatReport(printMode[0]))
      .withContext('Deve efetuar a geração de PDF mesclado sem gerar exceções')
      .not.toThrow();
    expect(() => service.downloadCatReport(printMode[1]))
      .withContext('Deve efetuar a geração de PDF individualizado sem gerar exceções')
      .not.toThrow();
  });
});
