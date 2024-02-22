import { Injectable, Injector } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { LiteralService } from './../../core/i18n/literal.service';
import { HttpCacheService } from '../../core/services/http-cache.service';
import { CertificateValidityRequest } from '../../models/certificate-validity-request';
import { CertificateValidityResponse } from '../../models/certificate-validity-response';

@Injectable({
  providedIn: 'root',
})
export class CertificateValidityService extends HttpCacheService<CertificateValidityRequest, CertificateValidityResponse> {
  private tafFull: boolean = JSON.parse(sessionStorage.getItem('TAFFull'));
  public literals: object;

  constructor(protected injector: Injector,
    private literalsService: LiteralService,
    private certificateValidityRequest: CertificateValidityRequest,
    private poNotification: PoNotificationService, ) {
    super(injector);
    this.literals = this.literalsService.literalsShared;
  }

  public canShowCertificate(): void {
    if (this.tafFull) {
      this.get('/api/rh/esocial/v1/certificateValidity', this.certificateValidityRequest).toPromise().then(
        response => {
          if (response) {
            this.showCertificateValidity(response?.validTo);
          }
        }
      );
    }
  }

  private showCertificateValidity(valueDateCert: string) {
    if (valueDateCert) {
      const dateCerts = new Date(
        valueDateCert.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
      );
      const dataFormatada = new Intl.DateTimeFormat('pt-BR').format(
        new Date(dateCerts.valueOf() + dateCerts.getTimezoneOffset() * 60000)
      );
      const timeDuration = 30000;
      const dateSo = new Date();

      const diff = Math.abs(dateCerts.getTime() - dateSo.getTime());
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

      if (dateCerts < dateSo) {
        this.poNotification.setDefaultDuration(timeDuration);
        this.poNotification.error(
          this.literals['certificateValidity']['invalidCertificate'] +
          dataFormatada
        );
      } else if (days >= 0 && days < 31) {
        this.poNotification.setDefaultDuration(timeDuration);
        this.poNotification.warning(
          this.literals['certificateValidity']['expiredCertificate'] +
          days +
          this.literals['certificateValidity']['expiredCertDate']
        );
      }
    }
  }
}
