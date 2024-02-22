import { Observable, of } from 'rxjs';

import { ESocialVersion, ESocialVersionEnum, TotvsPage } from '../../../app/models/labor-process.model';

export class ESocialVersionServiceMock {
  public get(companyId: string, branchId: string): Observable<TotvsPage<ESocialVersion>> {
    return of({
      items: [
        {
          eSocialLayoutVersion: ESocialVersionEnum.v1,
        },
      ],
      hasNext: false,
    });
  }
}
