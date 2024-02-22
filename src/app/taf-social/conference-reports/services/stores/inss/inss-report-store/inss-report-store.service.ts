import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ESocialBaseConferInssRetValuesResponse } from '../../../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';

@Injectable()
export class InssReportStoreService {
  private readonly initialReportValues: ESocialBaseConferInssRetValuesResponse = {
    items: [],
    hasNext: false,
  };
  private readonly _reportValuesSource = new BehaviorSubject<
    ESocialBaseConferInssRetValuesResponse
  >(this.initialReportValues);
  public readonly reportValues$ = this._reportValuesSource.asObservable();

  constructor() {}

  public getCurrentReportValues(): ESocialBaseConferInssRetValuesResponse {
    return this._reportValuesSource.getValue();
  }

  public setNewReportValues(
    currentReportValues: ESocialBaseConferInssRetValuesResponse
  ) {
    this._setReportValues(currentReportValues);
  }

  public resetReportValues(): void {
    this._setReportValues({
      items: [],
      hasNext: false,
    });
  }

  private _setReportValues(
    currentReportValues: ESocialBaseConferInssRetValuesResponse
  ): void {
    this._reportValuesSource.next(currentReportValues);
  }
}
