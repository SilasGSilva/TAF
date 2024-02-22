import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ESocialBaseConferInssRetValuesResponse } from '../../../../conference-reports-models/ESocialBaseConferInssRetValuesResponse';

@Injectable()
export class InssReportCardStoreService  {
  private readonly initialCardValues: ESocialBaseConferInssRetValuesResponse = {
    items: [],
    hasNext: false,
  };
  private readonly _cardValuesSource = new BehaviorSubject<
    ESocialBaseConferInssRetValuesResponse
  >(this.initialCardValues);
  public readonly cardValues$ = this._cardValuesSource.asObservable();
  public isFromFilter = false;

  constructor() {}

  private _setReportValues(
    currentReportValues: ESocialBaseConferInssRetValuesResponse
  ): void {
    this._cardValuesSource.next(currentReportValues);
  }

  public getCurrentCardValues(): ESocialBaseConferInssRetValuesResponse {
    return this._cardValuesSource.getValue();
  }

  public setNewCardValues(
    currentCardValues: ESocialBaseConferInssRetValuesResponse
  ) {
    this._setReportValues(currentCardValues);
  }

  public resetCardValues(isFromFilter: boolean = false): void {
    this.isFromFilter = isFromFilter;
    this._setReportValues({
      items: [],
      hasNext: false,
    });
  }
}
