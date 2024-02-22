import { Injectable } from '@angular/core';

const COMPANY = 'TAFCompany';

@Injectable()
export class CatEnvironmentService {
  private company = {
    branch_code: '',
    company_code: ''
  };

  constructor() {
    this.company = JSON.parse(sessionStorage[COMPANY]);
  }

  public getCompany(): string {
    let companyId: string = this.company.company_code;

    if (this.company.branch_code !== '') {
      companyId += `|${this.company.branch_code}`;
    }

    return companyId;
  }
}
