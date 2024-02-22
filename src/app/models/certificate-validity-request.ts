import { Injectable } from '@angular/core';
import { getBranchLoggedIn } from '../../util';

@Injectable({
  providedIn: 'root',
})
export class CertificateValidityRequest {
  companyId: string = getBranchLoggedIn();
}
