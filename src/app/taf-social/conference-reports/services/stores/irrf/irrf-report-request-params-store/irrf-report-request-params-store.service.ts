import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExecuteReportEsocialBaseConferRequest } from './../../../../conference-reports-models/ExecuteReportEsocialBaseConferRequest';

@Injectable()
export class IrrfReportRequestParamsStoreService {
  private readonly _reportRequestParamsSource = new BehaviorSubject<
    ExecuteReportEsocialBaseConferRequest
  >({
    companyId: '',
    cpfNumber: '',
    eSocialCategory: [],
    paymentPeriod: '',
    registrationNumber: [],
    tribute: '',
    differencesOnly: false,
    warningsOnly: false,
    numberOfLines: 30,
  });

  public readonly reportRequestParams$ = this._reportRequestParamsSource.asObservable();

  constructor() {}

  public getCurrentRequestParams(): ExecuteReportEsocialBaseConferRequest {
    return this._reportRequestParamsSource.getValue();
  }

  public addRequestParams(
    requestParams: ExecuteReportEsocialBaseConferRequest
  ): void {
    this._setRequesParams(requestParams);
  }

  public resetRequestParams(): void {
    this._setRequesParams({
      companyId: '',
      cpfNumber: '',
      eSocialCategory: [],
      paymentPeriod: '',
      registrationNumber: [],
      tribute: '',
      differencesOnly: false,
      warningsOnly: false,
      numberOfLines: 30,
    });
  }

  private _setRequesParams(
    currentRequestParams: ExecuteReportEsocialBaseConferRequest
  ): void {
    this._reportRequestParamsSource.next(currentRequestParams);
  }
}
