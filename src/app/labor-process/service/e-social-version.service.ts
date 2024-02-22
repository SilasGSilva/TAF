import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { ESocialVersion, TotvsPage } from '../../models/labor-process.model';

const VERSION_URL = '/api/rh/v1/eSocialLayoutVersion';

@Injectable()
export class ESocialVersionService {
  constructor(private http: HttpService) {}

  public get(companyId: string, branchId: string): Observable<TotvsPage<ESocialVersion>> {
    const querParams = { companyId, branchId };

    return this.http.get(VERSION_URL, querParams);
  }
}
