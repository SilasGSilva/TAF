import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogModalResponse {
  private readonly _dialogResponse = new Subject<boolean>();
  public readonly dialogResponse$ = this._dialogResponse.asObservable();

  constructor() {}

  private _setDialogResponse(response: boolean): void {
    this._dialogResponse.next(response);
  }

  public dialogResponse(response: boolean): void {
    this._setDialogResponse(response);
  }
}
