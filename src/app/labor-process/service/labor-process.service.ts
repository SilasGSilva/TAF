import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { ESocialVersionEnum, LaborProcess, TotvsPage } from '../../models/labor-process.model';
import { LaborProcessDataStateService } from './labor-process-data-state.service';

@Injectable()
export class LaborProcessService {
  get baseVersionUrl(): string {
    const version = this.laborProcessDataStateService.getVersion();
    const versionLabel = ESocialVersionEnum[version];

    return `/api/rh/${versionLabel}/laborProcess`;
  }

  get branchId(): string {
    return this.laborProcessDataStateService.getBranchId();
  }

  get companyId(): string {
    return this.laborProcessDataStateService.getCompanyId();
  }

  get userName(): string {
    return this.laborProcessDataStateService.getUserName();
  }

  constructor(private http: HttpService, private laborProcessDataStateService: LaborProcessDataStateService) {}

  public get(pageSize: number, page: number, nrProcTrab?: string, cpfTrab?: string): Observable<TotvsPage<LaborProcess>> {
    const queryParams = {
      companyId: this.companyId,
      branchId: this.branchId,
      page,
      pageSize,
      nrProcTrab,
      cpfTrab,
      userName: this.userName,
    };

    return this.http.get<TotvsPage<LaborProcess>>(this.baseVersionUrl, queryParams);
  }

  public getSimple(id: string): Observable<TotvsPage<LaborProcess>> {
    const queryParams = {
      companyId: this.companyId,
      branchId: this.branchId,
      userName: this.userName,
    };

    return this.http.get<TotvsPage<LaborProcess>>(`${this.baseVersionUrl}/${id}`, queryParams);
  }

  public update(id: string, hasNext: boolean, items: any[]): Observable<TotvsPage<LaborProcess>> {
    return this.http.put<TotvsPage<LaborProcess>>(
      `${this.baseVersionUrl}/${id}` +
        '?companyId=' +
        this.companyId +
        '&branchId=' +
        this.branchId +
        '&userName=' +
        this.userName,
      { hasNext, items }
    );
  }

  public delete(id: string): Observable<any> {
    return this.http.delete<any>(
      `${this.baseVersionUrl}/${id}` +
        '?companyId=' +
        this.companyId +
        '&branchId=' +
        this.branchId +
        '&userName=' +
        this.userName
    );
  }

  public post(hasNext: boolean, items: any[]): Observable<TotvsPage<LaborProcess>> {
    const payload = { hasNext, items };
    const queryParams = {
      companyId: this.companyId,
      branchId: this.branchId,
      userName: this.userName,
    };

    return this.http.post<TotvsPage<LaborProcess>>(this.baseVersionUrl, payload, queryParams);
  }
}
