import { TestBed } from '@angular/core/testing';
import { AuditFilterModule } from './../audit-filter.module';
import { AuditEnvironmentService } from './audit-environment.service';

xdescribe(AuditEnvironmentService.name, () => {
  let service: AuditEnvironmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuditFilterModule
      ]
    }).compileComponents();
    service = TestBed.inject(AuditEnvironmentService);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('Deve criar o serviço de coleta de chave TAFCompany do session storage', () => {
    expect(service).toBeTruthy();
  });

  it(`#getCompany
    Deve retornar a chave TAFCompany do session storage no formato companyId das API's`, () => {
      const companyIdMock: string = 'T1|D MG 01';
      const companyId: string = service.getCompany();

      expect(companyId).toEqual(companyIdMock);
  });
});
