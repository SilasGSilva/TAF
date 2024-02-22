import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { valueIsNull } from '../../../util/util';

const ERPAPPCONFIG = 'ERPAPPCONFIG';
const COMPANY = 'TAFCompany';

@Injectable({
  providedIn: 'root'
})
export class SocialMonitorService {

  private company = { company_code: null, branch_code: null };
  private updateDetailsBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    if (!this.isDatasul && !this.isRM)  {
      this.company = JSON.parse(sessionStorage[COMPANY]);
    }
  }

  private get isDatasul() {
    const proAppConfig = JSON.parse(sessionStorage.getItem(ERPAPPCONFIG));
    return proAppConfig.productLine.toLowerCase() === 'datasul';
  }

  private get isRM() {
    const proAppConfig = JSON.parse(sessionStorage.getItem(ERPAPPCONFIG));
    return proAppConfig.productLine.toLowerCase() === 'rm';
  }

  getCompany(): string {
    let companyId = '';

    if (!this.isDatasul && !this.isRM) {
      if (!valueIsNull(this.company.company_code)) {
        companyId = this.company.company_code;
      }

      if (!valueIsNull(this.company.branch_code)) {
        companyId += `|${this.company.branch_code}`;
      }
    }
    return companyId;
  }

  getCompanyCode(): string {
    if (!this.isDatasul && !this.isRM) { return this.company.company_code; } else { return ''; }
  }

  updateMonitor(valor: boolean) {
    this.updateDetailsBehaviorSubject.next(valor);
  }

  returnStateMonitor() {
    return this.updateDetailsBehaviorSubject;
  }
}
