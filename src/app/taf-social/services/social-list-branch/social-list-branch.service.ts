import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpCacheService } from '../../../core/services/http-cache.service';
import { BranchRequest } from '../../models/BranchRequest';
import { BranchResponse } from '../../models/BranchResponse';

@Injectable()
export class SocialListBranchService extends HttpCacheService<
  BranchRequest,
  BranchResponse
> {
  private tafContext: string = sessionStorage.getItem('TAFContext');
  private tafFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));

  constructor(protected injector: Injector) {
    super(injector);
  }

  public getListBranchs(
    params: BranchRequest,
    page?: number
  ): Observable<BranchResponse> {
    return this.tafContext === 'gpe'
      ? this.get('/api/rh/esocial/v1/GPEEsocialBranches', params, page)
      : this.tafFull
      ? this.get('/api/rh/esocial/v1/TAFEsocialBranches', params, page)
      : this.get('/api/rh/esocial/v1/EsocialBranches', params, page);
  }
}
