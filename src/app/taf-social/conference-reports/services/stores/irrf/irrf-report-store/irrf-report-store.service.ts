import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ESocialBaseConferIrrfRetValuesResponse } from '../../../../irrf/irrf-models/ESocialBaseConferIrrfRetValuesResponse';

@Injectable()
export class IrrfReportStoreService {
  private readonly initialReportValues: ESocialBaseConferIrrfRetValuesResponse = {
    items: [],
    hasNext: false,
  };
  private readonly _reportValuesSource = new BehaviorSubject<
    ESocialBaseConferIrrfRetValuesResponse
  >(this.initialReportValues);

  constructor() {}

  public getCurrentReportValues(): ESocialBaseConferIrrfRetValuesResponse | any {
    return this._reportValuesSource.getValue();
  }

  public setNewReportValues(
    currentReportValues: ESocialBaseConferIrrfRetValuesResponse
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
    currentReportValues: ESocialBaseConferIrrfRetValuesResponse
  ): void {
    this._reportValuesSource.next(currentReportValues);
  }
}
