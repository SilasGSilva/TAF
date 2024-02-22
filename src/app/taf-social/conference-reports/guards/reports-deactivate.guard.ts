import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DialogModalResponse } from '../../../shared/dialog-modal-response/dialog-modal-response.service';
import { IReportsCanDeactivate } from './ireports-deactivate';

@Injectable()
export class ReportsDeactivateGuard
  implements CanDeactivate<IReportsCanDeactivate> {
  constructor(private dialogModalResponse: DialogModalResponse) {}

  canDeactivate(
    component: IReportsCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.discardReport()) {
      component.discardReportDialog();
    } else {
      if (currentState.url === '/inssReport') {
        if (component.dataSave()) {
          component.dataSaveDialog();
        } else {
          return true;
        }
      } else if (currentState.url === '/irrfReport') {
        if (component.dataSave()) {
          component.dataSaveDialog();
        } else {
          return true;
        }
      } else {
        return true;
      }
    }

    return this.dialogModalResponse.dialogResponse$;
  }
}
