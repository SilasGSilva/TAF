import { environment } from "../environments/environment";

export function valueIsNull(value: any): boolean {
  return value === null || value === undefined;
}

export function getBranchLoggedIn(): string {
  let company = { company_code: '', branch_code: '' };
  let companyId = '';

  company = JSON.parse(getTAFCompany());

  companyId = company.company_code;

  if (!valueIsNull(company.branch_code)) {
    companyId += `|${company.branch_code}`;
  }
  return companyId;
}

export function getTAFCompany(): any {
  const forceTAFCompanyCode = environment['forceTAFCompanyCode'];

  if (forceTAFCompanyCode) {
    return JSON.stringify({ "company_code": forceTAFCompanyCode });
  }

  return sessionStorage['TAFCompany'];
}

export function getBranchCodeLoggedIn(): string {
  let company = { company_code: '', branch_code: '' };
  let branchCode = '';

  company = JSON.parse(getTAFCompany());

  branchCode = company.branch_code;

  return branchCode;
}

export function checkIfIsProtheus(): boolean {
  return (
    JSON.parse(
      sessionStorage.getItem('ERPAPPCONFIG')!
    ).productLine.toLowerCase() === 'protheus'
  );
}

export function getBranchCode(): string {
  let company = { company_code: '', branch_code: '' };
  let branchCode = '';

  company = getTAFCompany();

  if (!valueIsNull(company)) {
    company = JSON.parse(company as any);
    branchCode = company?.branch_code;
  }

  return branchCode;
}

export function getCompanyId(): string {
  let company = { company_code: '', branch_code: '' };
  let companyId = '';

  company = getTAFCompany();

  if (!valueIsNull(company)) {
    company = JSON.parse(company as any);
    companyId = company?.company_code;
  }

  return companyId;
}

export function getUserName(): string {
  let userName = sessionStorage['username'];

  userName = !valueIsNull(userName) ? userName : '';

  return userName;
}
