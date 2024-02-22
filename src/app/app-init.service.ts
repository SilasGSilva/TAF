import { Injectable } from '@angular/core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

@Injectable()
export class AppInitService {

  constructor(
    private protheusConfigService: ProAppConfigService
  ) {}

  public initApp(): Promise<void> {
    return new Promise<void>((resolve) => {
      /*****************************
      Verifica existência da chave ERPAPPCONFIG pois na linha RM é injetada antes da inicialização do APP.
      Código criado por conta de falha da abertura do APP na linha RM para Release 2209.
      *****************************/
      if (sessionStorage.getItem('ERPAPPCONFIG')) {
        resolve();
      } else {
        this.protheusConfigService.loadAppConfig().then(() => {
          resolve();
        });
      }
    });
  }
}