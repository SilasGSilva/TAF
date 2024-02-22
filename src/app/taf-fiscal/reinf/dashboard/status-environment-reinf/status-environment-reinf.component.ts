import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LiteralService } from '../../../../core/i18n/literal.service';
import { getBranchLoggedIn, valueIsNull } from '../../../../../util/util';
import { StatusEnvironmentReinfService } from './status-environment-reinf.service';
import { StatusEnvironmentResponse } from '../../../../models/status.environment-response';
import { StatusEnvironmentRequest } from '../../../../models/status.environment-request';

@Component({
  selector: 'app-status-environment',
  templateUrl: './status-environment-reinf.component.html',
  styleUrls: ['./status-environment-reinf.component.scss'],
})
export class StatusEnvironmentReinfComponent implements OnInit {
  public literals = {};
  public labelTagInformation = '';
  public typePoTag = 'warning';
  private tafContext: string = sessionStorage.getItem('TAFContext');
  public companyId:string = getBranchLoggedIn();

  @Output('taf-is-production-restrict') isProductionRestrict = new EventEmitter<boolean>();
  @Output('taf-layout-reinf') layoutReinf = new EventEmitter<string>();

  constructor(
    private literalService: LiteralService,
    private statusEnvironmentService: StatusEnvironmentReinfService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    if (this.tafContext === 'reinf') {
      const params: StatusEnvironmentRequest = {
        companyId: this.companyId,
      };
      this.statusEnvironmentService
        .getStatusEnvironmentReinf(params)
        .subscribe(response => {
          this.setStatusEnvironment(response);
        });
    }
  }

  public setStatusEnvironment(response: StatusEnvironmentResponse): void {
    const isProduction = response.statusEnvironment === 'production';

    // Dispara emit() para o dashboard saber se é produção restrita
    this.isProductionRestrict.emit(isProduction ? false : true);

    this.labelTagInformation = isProduction
      ? this.literals['eventMonitor']['production']
      : this.literals['eventMonitor']['restrictedProduction'];

    // Proteção para caso o backend não estiver atualizado
    if (
      !valueIsNull(response.layoutReinf) &&
      !valueIsNull(response.entidadeTSS)
    ) {
      this.layoutReinf.emit(response.layoutReinf);

      this.labelTagInformation +=
        '  |  Layout: ' +
        response.layoutReinf +
        '  |  Entidade: ' +
        response.entidadeTSS +
        '  |  TSS: ' +
        response.versionTSS;
      // Mudo cor do po-tag caso algum não tenha sido retornado pelo WSTAF0003/environment
      if (
        response.statusEnvironment.length == 0 ||
        (response.layoutReinf.length == 0 ||
          response.layoutReinf != '2_01_02') ||
        response.entidadeTSS.length == 0
      ) {
        this.typePoTag = 'warning';
      } else {
        this.typePoTag = 'success';
      }
    }
  }
}
