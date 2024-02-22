import { TestBed } from '@angular/core/testing';
import { CatFilterModule } from '../cat-filter.module';
import { CatEnvironmentService } from './cat-enviroment.service';

xdescribe(CatEnvironmentService.name, () => {
  let service: CatEnvironmentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
       CatFilterModule
      ]
    }).compileComponents();
    service = TestBed.inject(CatEnvironmentService);
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
