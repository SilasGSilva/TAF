import { Inject, Injectable, Injector } from '@angular/core';
import { HttpService } from 'core/services/http.service';
import { HttpCacheService } from 'core/services/http-cache.service';
import { StatusEnvironmentRequest } from '../../../../models/status.environment-request';
import { StatusEnvironmentResponse } from '../../../../models/status.environment-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusEnvironmentReinfService extends HttpCacheService<StatusEnvironmentRequest,StatusEnvironmentResponse> {

  constructor(protected injector: Injector,private http: HttpService) {
    super(injector);
  }

  public getStatusEnvironmentReinf(params:StatusEnvironmentRequest) : Observable<StatusEnvironmentResponse>{
    return this.get('/wstaf003/statusEnvironment',params)
  }

}
