import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from 'core/services/http.service';
import { TsiFilterService } from './tsi-filter.service';
import { MockTsiService } from '../../monitor/tsi-monitor.service.spec';
import { TsiBranchesListing } from './../../models/tsi-branches-listing';

xdescribe('TsiFilterService', () => {
  let service: TsiFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HttpService, useClass: MockTsiService }],
    });
    service = TestBed.inject(TsiFilterService);
  });

  it('deve criar o serviço do tsi-filter', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar a requisição', async () => {
    const mockResponse = {
      branches: [
        {
          branchCode: "Todas",
          branchDescription: "Todas",
        },
        {
          branchCode: "D MG 01 ",
          branchDescription: "Filial BELO HOR",
        }
      ]
    };
    const params: TsiBranchesListing = {
      companyId: 'T1|D MG 01',
    };
    const specResponse = await service.getEventListing(params).toPromise();
    expect(specResponse).toEqual(mockResponse);
  });
});
