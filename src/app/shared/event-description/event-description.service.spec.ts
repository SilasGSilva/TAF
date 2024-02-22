import { ValidationErrorMessage } from 'taf-fiscal/models/validation-error-message';

import { HttpService } from 'core/services/http.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { EventDescriptionService } from './event-description.service';
import { EventDescriptionResponse } from './../../models/event-description-response';

xdescribe('EventDescriptionService', () => {
  let service: EventDescriptionService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EventDescriptionService,
        { provide: HttpService, useClass: MockEventDescriptionService },
      ]
    });

    service = TestBed.inject(EventDescriptionService);
    httpMock = TestBed.inject(HttpTestingController);

    const TAFCompany = {
      company_code: 'T1',
      branch_code: 'D MG 01'
    };

    const company = JSON.stringify(TAFCompany);
    sessionStorage.setItem('TAFCompany', company);
  });

  afterEach(() => {
    sessionStorage.removeItem('TAFCompany');
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar o status do ambiente em produção', async () => {
    const specRequest = { eventDesc: 'R-2010' };
    const specResponse = await service.getDescription(specRequest).toPromise();

    expect(specResponse).toEqual({
    	description: 'Retenção contribuição previdenciária - serviços tomados'
    });
  });

});

export class MockEventDescriptionService {
  public dummyResponse: EventDescriptionResponse;

  get(url: string): any {
    if (url === '/wstaf003/eventDescription') {
      this.dummyResponse = {
        description: 'Retenção contribuição previdenciária - serviços tomados'
      };
    }

    return of(this.dummyResponse);
  }
}
