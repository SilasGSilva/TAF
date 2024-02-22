import { TestBed, fakeAsync } from '@angular/core/testing';

import { SendValidationService } from './send-validation.service';
import { SendValidation } from '../../../../models/send-validation';
import { SendValidationModule } from './send-validation.module';
import { PayloadEventsReinf } from '../../../../../models/payload-events-reinf';
import { HttpService } from 'core/services/http.service';
import { of } from 'rxjs';

xdescribe('SendValidationService', () => {
  let service: SendValidationService;
  let fakeSendValidation: SendValidation;
  let fakeSendValidationParams: PayloadEventsReinf;

  class MockHttpService {
    post(url: string): any {
      const dummyResponse = { 'success': true, message: '' };
      return of(dummyResponse);
    }
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SendValidationModule
      ],
      providers: [
        SendValidationService,
        { provide: HttpService, useClass: MockHttpService },
      ]
    });

    service = TestBed.inject(SendValidationService);

    fakeSendValidation = {
      customerProviders: [
        { id: '53113791000122' },
        { id: '10347580000141' }
      ]};

    fakeSendValidationParams = {
      period: '012019' ,
      event: 'R-2010',
      companyId: 'T1|D MG 01'
    };

  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trasmit the validation for the customers', async () => {

    const mockResponse = { 'success': true, message: '' };

    const specResponse = await service.executePenddingValidation(fakeSendValidation, fakeSendValidationParams).toPromise();
    expect(specResponse).toEqual(mockResponse);
  });

});
