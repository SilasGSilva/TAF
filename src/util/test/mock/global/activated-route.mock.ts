import { Observable, of } from 'rxjs';

export class ActivatedRouteMock {
  get params(): null {
    return null;
  }

  get paramMap(): any {
    return of({
      get(): any {
        return '1';
      },
    });
  }

  get snapshot(): any {
    return {
      data: {
        dataProtected: ['Assessment'],
      },
    };
  }

  get queryParams(): Observable<any> {
    return of(void 0);
  }
}
