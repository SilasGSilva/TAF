import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DialogModalResponse } from './dialog-modal-response.service';

xdescribe('DialogModalResponse', () => {
  let service: DialogModalResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DialogModalResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set response true', () => {
    service.dialogResponse$.subscribe(response =>
      expect(response).toBeTruthy()
    );

    service.dialogResponse(true);
  });

  it('should set response false', () => {
    service.dialogResponse$.subscribe(response => expect(response).toBeFalsy());

    service.dialogResponse(false);
  });
});
