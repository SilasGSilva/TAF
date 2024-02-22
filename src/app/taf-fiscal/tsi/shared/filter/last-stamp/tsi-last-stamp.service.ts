
import { Injectable } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { Observable, of } from 'rxjs';
import { TsiAtuStampResponse } from './../../../models/tsi-atu-stamp-response';
import { TsiAtuStampRequest } from './../../../models/tsi-atu-stamp-request';
import { TsiLastStampRequest } from './../../../models/tsi-last-stamp-request';
import { TsiLastStampResponse } from './../../../models/tsi-last-stamp-response';

@Injectable({
  providedIn: 'root'
})

export class TsiLastStampService {

  constructor(private httpService: HttpService) { }

  public getLastStamp(param: TsiLastStampRequest): Observable<TsiLastStampResponse> {
    return this.httpService.get('/api/tsi/v1/TSIUtilStamp/getLastStamp',param );
  }

  public postAtuStamp(param: TsiAtuStampRequest): Observable<TsiAtuStampResponse> {
    return this.httpService.post('/api/tsi/v1/TSIUtilStamp/updateStamp',{},param );
  }

}
