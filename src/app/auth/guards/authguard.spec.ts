import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuardService } from './authguard.service';

xdescribe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule]
  }));

  it('should be created', () => {
    const service: AuthGuardService = TestBed.inject(AuthGuardService);
    expect(service).toBeTruthy();
  });
});
