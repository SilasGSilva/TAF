import { TestBed } from '@angular/core/testing';
import { CoreModule } from 'core/core.module';
import { LiteralService } from 'core/i18n/literal.service';
import { CheckFeaturesService } from './check-features.service';

xdescribe('CheckFeaturesService', () => {
  let service: CheckFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckFeaturesService, LiteralService],
      imports: [CoreModule],
    });

    service = TestBed.get(CheckFeaturesService);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01',
    };
    const company = JSON.stringify(TAFCompany);

    sessionStorage.setItem('TAFCompany', company);
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
    sessionStorage.removeItem('ERPAPPCONFIG');
    sessionStorage.removeItem('TAFFeatures');
  });

  it('deve criar o serviço de filtro de requisitos das features TAF', () => {
    expect(service).toBeTruthy();
  });

  it('deve realizar o GET através da função getFeature e retornar indisponibilidade da feature pesquisada', () => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    const TAFFeatures = {
      downloadXLS: {
        access: false,
        message: btoa('Função não disponível'),
      },
    };

    const features = JSON.stringify(TAFFeatures);
    sessionStorage.setItem('TAFFeatures', features);

    const mockRequest = 'downloadXLS';

    const mockGetResponse = {
      access: false,
      message: 'Função não disponível',
    };

    const resultGetFeature = service.getFeature(mockRequest);
    expect(resultGetFeature).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getFeature e retornar indisponibilidade da feature pesquisada por não encontra-la dentro da TAFFeatures', () => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);

    const TAFFeatures = {
      notificationCenter: {
        access: false,
        message: btoa('Função não disponível'),
      },
    };

    const features = JSON.stringify(TAFFeatures);
    sessionStorage.setItem('TAFFeatures', features);

    const mockRequest = 'downloadXLS';

    const mockGetResponse = {
      access: false,
      message: 'Função não disponível',
    };

    const resultGetFeature = service.getFeature(mockRequest);
    expect(resultGetFeature).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getFeature e retornar a indisponibilidade em virtude da não existência do TAFFeatures', () => {
    const ERPAPPCONFIG = {
      name: 'Protheus THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Protheus',
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    sessionStorage.setItem('ERPAPPCONFIG', config);
    sessionStorage.removeItem('TAFFeatures');

    const mockRequest = 'downloadXLS';

    const mockGetResponse = {
      access: false,
      message: 'Função não disponível',
    };

    const resultGetFeature = service.getFeature(mockRequest);
    expect(resultGetFeature).toEqual(mockGetResponse);
  });

  it('deve realizar o GET através da função getFeature e retornar a disponibilidade em virtude de ser linha Datasul', () => {
    const ERPAPPCONFIG = {
      name: 'Datasul THF',
      version: '12.23.0',
      serverBackend: '/',
      restEntryPoint: 'rest',
      versionAPI: '',
      appVersion: '0.1.6',
      productLine: 'Datasul',
    };
    const downloadXLS = {
      downloadXLS: { access: true, message: 'RGlzcG9u7XZlbC4=' },
    };

    const config = JSON.stringify(ERPAPPCONFIG);
    const tafFeatures = JSON.stringify(downloadXLS);

    sessionStorage.setItem('ERPAPPCONFIG', config);
    sessionStorage.setItem('TAFFeatures', tafFeatures);

    const mockRequest = 'downloadXLS';

    const mockGetResponse = {
      access: true,
      message: 'Disponível.',
    };

    const resultGetFeature = service.getFeature(mockRequest);

    expect(resultGetFeature).toEqual(mockGetResponse);
  });
});
