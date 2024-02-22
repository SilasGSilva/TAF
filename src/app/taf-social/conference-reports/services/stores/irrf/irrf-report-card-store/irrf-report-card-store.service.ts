import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ESocialBaseConferIrrfRetValuesResponse } from '../../../../irrf/irrf-models/ESocialBaseConferIrrfRetValuesResponse';

@Injectable()
export class IrrfReportCardStoreService  {
  private readonly initialCardValues: ESocialBaseConferIrrfRetValuesResponse = {
    items: [],
    hasNext: false,
  };
  private readonly _cardValuesSource = new BehaviorSubject<ESocialBaseConferIrrfRetValuesResponse>(this.initialCardValues);

  constructor() {}

  private _setReportValues(
    currentReportValues: ESocialBaseConferIrrfRetValuesResponse
  ): void {
    this._cardValuesSource.next(currentReportValues);
  }

  public getCurrentCardValues(): ESocialBaseConferIrrfRetValuesResponse | any {
    return this._cardValuesSource.getValue();
  }

  public setNewCardValues(
    currentCardValues: ESocialBaseConferIrrfRetValuesResponse | any
  ) {
    this._setReportValues(currentCardValues);
  }

  public resetCardValues(): void {
    this._setReportValues({
      items: [],
      hasNext: false,
    });
  }
}
