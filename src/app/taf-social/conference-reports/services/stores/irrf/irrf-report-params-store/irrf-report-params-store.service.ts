import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ESocialBaseConferRetValuesRequest } from '../../../../conference-reports-models/ESocialBaseConferRetValuesRequest';

@Injectable()
export class IrrfReportParamsStoreService {
  private readonly _reportParamsSource = new BehaviorSubject<
    ESocialBaseConferRetValuesRequest
  >({
    companyId: '',
    requestId: '',
    synthetic: false,
    level: '1',
    differencesOnly: false,
    warningsOnly: false,
    page: 0,
    pageSize: 0,
  });

  private reportDataSave = false;
  private readonly _cardValuesSource = new BehaviorSubject<boolean>(false);
  public readonly reportParams$ = this._reportParamsSource.asObservable();
  public readonly isConfiguredService$ = this._cardValuesSource.asObservable();

  constructor() {}

  public getCurrentParams(): ESocialBaseConferRetValuesRequest {
    return this._reportParamsSource.getValue();
  }

  public addParams(params: ESocialBaseConferRetValuesRequest): void {
    this._setParams(params);
  }

  public getReportDataSave(): boolean {
    return this.reportDataSave;
  }

  public setReportDataSave(): void {
    this.reportDataSave = false;
  }

  public resetCurrentParams(): void {
    this._setParams({
      companyId: '',
      requestId: '',
      synthetic: false,
      level: '1',
      differencesOnly: false,
      warningsOnly: false,
      page: 0,
      pageSize: 0,
    });
  }

  public getIsConfiguredService(): boolean {
    return this._cardValuesSource.getValue();
  }

  public setIsConfiguredService(isConfiguredService: boolean): void {
    this._setIsConfiguredService(isConfiguredService);
  }

  private _setIsConfiguredService(isConfiguredService: boolean): void {
    this._cardValuesSource.next(isConfiguredService);
  }

  private _setParams(
    currentParams: ESocialBaseConferRetValuesRequest
  ): void {
    this.reportDataSave = true;
    this._reportParamsSource.next(currentParams);
  }
}
