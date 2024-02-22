import { Injectable } from "@angular/core";
import { getBranchLoggedIn } from '../../util/util';

@Injectable({
  providedIn: 'root'
})
export class StatusEnvironmentRequest {
  public companyId: string = getBranchLoggedIn();
}
