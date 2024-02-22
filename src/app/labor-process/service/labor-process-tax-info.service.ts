import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { ProcessTax, ProcessWorker, SimpleProcessTax } from '../../models/labor-process-taxes.model';
import { ESocialVersionEnum, TotvsPage } from '../../models/labor-process.model';
import { LaborProcessDataStateService } from './labor-process-data-state.service';

@Injectable()
export class LaborProcessTaxInfoService {
  readonly EMPLOYEES_URL = '/api/rh/v1/laborProcessEmployees';

  get baseVersionProcessTaxUrl(): string {
    const version = this.laborProcessDataStateService.getVersion();
    const versionLabel = ESocialVersionEnum[version];

    return `/api/rh/${versionLabel}/laborProcessTaxes`;
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

  constructor(private http: HttpService, private laborProcessDataStateService: LaborProcessDataStateService) { }

  public getAll(
    page: number,
    pageSize: number,
    nrProcTrab: string = '',
    perApurPagto: string = '',
  ): Observable<TotvsPage<SimpleProcessTax>> {
    let url = `${this.baseVersionProcessTaxUrl}?page=${page}&pageSize=${pageSize}`;
    if (this.companyId) url += `&companyId=${this.companyId}`;
    if (this.branchId) url += `&branchId=${this.branchId}`;
    if (nrProcTrab) url += `&nrProcTrab=${nrProcTrab}`;
    if (perApurPagto) url += `&perApurPagto=${perApurPagto}`;
    if (this.userName) url += `&userName=${this.userName}`;

    return this.http.get<TotvsPage<SimpleProcessTax>>(url);
  }

  public get(id: string): Observable<TotvsPage<ProcessTax>> {
    let url = `${this.baseVersionProcessTaxUrl}/${id}`;
    if (this.userName) url += `?userName=${this.userName}`;

    return this.http.get<TotvsPage<ProcessTax>>(url);
  }

  public create(processTax: ProcessTax): Observable<TotvsPage<ProcessTax>> {
    let url = `${this.baseVersionProcessTaxUrl}?companyId=${this.companyId} `;
    if (this.branchId) url = url += `&branchId=${this.branchId} `;
    if (this.userName) url += `&userName=${this.userName} `;
    const payload = {
      hasNext: false,
      items: [processTax],
    };

    return this.http.post<TotvsPage<ProcessTax>>(url, payload);
  }

  public edit(id: string, processTax: ProcessTax): Observable<TotvsPage<ProcessTax>> {
    let url = `${this.baseVersionProcessTaxUrl}/${id}`;
    if (this.userName) url += `?userName=${this.userName} `;
    const payload = {
      hasNext: false,
      items: [processTax],
    };

    return this.http.put<TotvsPage<ProcessTax>>(url, payload);
  }

  public delete(id: string): Observable<TotvsPage<ProcessTax>> {
    let url = `${this.baseVersionProcessTaxUrl}/${id}`;
    if (this.userName) url += `?userName=${this.userName}`;

    return this.http.delete<TotvsPage<ProcessTax>>(url);
  }

  public getProcessWorkers(nrProcTrab: string): Observable<TotvsPage<ProcessWorker>> {
    const id = `${this.companyId};${this.branchId};${nrProcTrab}`;

    let url = `${this.EMPLOYEES_URL}/${id}`;
    if (this.userName) url += `?userName=${this.userName}`;

    return this.http.get<TotvsPage<ProcessWorker>>(url);
  }
}
