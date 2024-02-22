import { Injectable } from '@angular/core';
import { PoI18nPipe } from '@po-ui/ng-components';
import { Range } from 'xlsx';
import { LiteralService } from 'core/i18n/literal.service';
import { HttpService } from 'core/services/http.service';
import { DownloadService } from 'shared/download/download.service';
import { ESocialBaseConferFgtsValuesRequest } from '../conference-reports-models/ESocialBaseConferFgtsValuesRequest';
import { ESocialBaseConferFgtsValuesResponse } from '../conference-reports-models/ESocialBaseConferFgtsValuesResponse';
import { ESocialBaseConferRetValuesRequest } from '../conference-reports-models/ESocialBaseConferRetValuesRequest';
import { ESocialBaseConferInssRetValuesResponse } from '../conference-reports-models/ESocialBaseConferInssRetValuesResponse';
import { ESocialBaseConferValuesRequest } from '../conference-reports-models/ESocialBaseConferValuesRequest';
import { ESocialBaseConferInssValuesResponse } from '../conference-reports-models/ESocialBaseConferInssValuesResponse';
import { TributeReport } from '../conference-reports-models/TributeReport';
import { IRValueTypes } from '../irrf/irrf-models/IRValueTypes';
import { ESocialBaseConferIrrfRetValuesResponse } from '../irrf/irrf-models/ESocialBaseConferIrrfRetValuesResponse';
import { IrrfRetentions } from '../irrf/irrf-models/IrrfRetentions';
import { IRInfo } from '../irrf/irrf-models/IRInfo';

@Injectable({
  providedIn: 'root',
})
export class ExportExcelEsocialReportsService {
  public literals = {};

  constructor(
    private httpService: HttpService,
    private downloadService: DownloadService,
    private poI18n: PoI18nPipe,
    private literalService: LiteralService
  ) {
    this.literals = this.literalService.literalsTafSocial;
  }

  public getReportFGTS(
    payload: ESocialBaseConferFgtsValuesRequest
  ): Promise<ESocialBaseConferFgtsValuesResponse> {
    const menuContext = sessionStorage.getItem('TAFContext');
    if (menuContext === 'gpe') {
      return this.httpService.getAsync(
        `/api/rh/esocial/v1/GPEreportEsocialBaseConfer/FgtsValues`,
        payload
      );
    } else {
      return this.httpService.getAsync(
        `/api/rh/esocial/v1/reportEsocialBaseConfer/FgtsValues`,
        payload
      );
    }
  }

  private getReportInssRetValues(
    payload: ESocialBaseConferRetValuesRequest
  ): Promise<ESocialBaseConferInssRetValuesResponse> {
    const menuContext = sessionStorage.getItem('TAFContext');

    if (menuContext === 'gpe') {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssRetValues',
        payload
      );
    } else {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/InssRetValues',
        payload
      );
    }
  }

  private getReportInssValues(
    payload: ESocialBaseConferValuesRequest
  ): Promise<ESocialBaseConferInssValuesResponse> {
    const menuContext = sessionStorage.getItem('TAFContext');

    if (menuContext === 'gpe') {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/InssValues',
        payload
      );
    } else {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/InssValues',
        payload
      );
    }
  }

  private getReportIrrfRetValues(
    payload: ESocialBaseConferRetValuesRequest
  ): Promise<ESocialBaseConferIrrfRetValuesResponse> {
    const menuContext = sessionStorage.getItem('TAFContext');

    if (menuContext === 'gpe') {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/GPEreportEsocialBaseConfer/IrrfRetValues',
        payload
      );
    } else {
      return this.httpService.getAsync(
        '/api/rh/esocial/v1/reportEsocialBaseConfer/IrrfRetValues',
        payload
      );
    }
  }

  public headerBasis(taxInfo: string, tafFull: Boolean): Array<String> {
    if (taxInfo === 'FGTS') {
      if (tafFull) {
        return [
          this.literals['exportReport']['establishment'],
          this.literals['exportReport']['lotation'],
          this.literals['exportReport']['cpf'],
          this.literals['exportReport']['name'],
          this.literals['exportReport']['registration'],
          this.literals['exportReport']['categorie'],
          this.literals['exportReport']['rhFgtsBase'],
          this.literals['exportReport']['tafFgtsBase'],
          this.literals['exportReport']['retFgtsBase'],
          this.literals['exportReport']['rh13FgtsBase'],
          this.literals['exportReport']['taf13FgtsBase'],
          this.literals['exportReport']['ret13FgtsBase'],
          this.literals['exportReport']['rhResFgtsBase'],
          this.literals['exportReport']['tafResFgtsBase'],
          this.literals['exportReport']['retResFgtsBase'],
        ];
      } else {
        return [
          this.literals['exportReport']['establishment'],
          this.literals['exportReport']['lotation'],
          this.literals['exportReport']['cpf'],
          this.literals['exportReport']['name'],
          this.literals['exportReport']['registration'],
          this.literals['exportReport']['categorie'],
          this.literals['exportReport']['rhFgtsBase'],
          this.literals['exportReport']['retFgtsBase'],
          this.literals['exportReport']['rh13FgtsBase'],
          this.literals['exportReport']['ret13FgtsBase'],
          this.literals['exportReport']['rhResFgtsBase'],
          this.literals['exportReport']['retResFgtsBase'],
        ];
      }
    }
  }
  public headerDeposits(
    taxInfo: string,
    tafFull: boolean,
    synthetic?: boolean,
    isConfiguredService?: boolean
  ): Array<String> {
    if (taxInfo === 'FGTS') {
      if (tafFull) {
        return [
          this.literals['exportReport']['cpf'],
          this.literals['exportReport']['name'],
          this.literals['exportReport']['registration'],
          this.literals['exportReport']['categorie'],
          this.literals['exportReport']['rhFgtsDeposit'],
          this.literals['exportReport']['tafFgtsDeposit'],
          this.literals['exportReport']['retFgtsDeposit'],
          this.literals['exportReport']['rhFgtsDeposit13'],
          this.literals['exportReport']['tafFgtsDeposit13'],
          this.literals['exportReport']['retFgtsDeposit13'],
          this.literals['exportReport']['rhFgtsDepositRes'],
          this.literals['exportReport']['tafFgtsDepositRes'],
          this.literals['exportReport']['retFgtsDepositRes'],
        ];
      } else {
        return [
          this.literals['exportReport']['cpf'],
          this.literals['exportReport']['name'],
          this.literals['exportReport']['registration'],
          this.literals['exportReport']['categorie'],
          this.literals['exportReport']['rhFgtsDeposit'],
          this.literals['exportReport']['retFgtsDeposit'],
          this.literals['exportReport']['rhFgtsDeposit13'],
          this.literals['exportReport']['retFgtsDeposit13'],
          this.literals['exportReport']['rhFgtsDepositRes'],
          this.literals['exportReport']['retFgtsDepositRes'],
        ];
      }
    }

    if (taxInfo === 'INSS') {
      if (synthetic) {
        if (tafFull) {
          if (isConfiguredService) {
            return [
              '',
              this.literals['inssReport']['cpf'],
              this.literals['inssReport']['name'],
              this.literals['inssReport']['inssGrossValue'],
              this.literals['inssReport']['inssTafGrossValue'],
              this.literals['inssReport']['inssRetGrossValue'],
              this.literals['inssReport']['inssRetDescGrossValue'],
              this.literals['inssReport']['inss13GrossValue'],
              this.literals['inssReport']['inss13TafGrossValue'],
              this.literals['inssReport']['inss13RetGrossValue'],
              this.literals['inssReport']['inss13DescGrossValue'],
              this.literals['inssReport']['familySalaryValue'],
              this.literals['inssReport']['familySalaryTafValue'],
              this.literals['inssReport']['familySalaryRetValue'],
              this.literals['inssReport']['maternitySalaryValue'],
              this.literals['inssReport']['maternitySalaryTafValue'],
              this.literals['inssReport']['maternitySalaryRetValue'],
              this.literals['inssReport']['maternitySalary13Value'],
              this.literals['inssReport']['maternitySalary13TafRetValue'],
              this.literals['inssReport']['maternitySalary13RetValue'],
            ];
          } else {
            return [
              '',
              this.literals['inssReport']['cpf'],
              this.literals['inssReport']['name'],
              this.literals['inssReport']['inssTafGrossValue'],
              this.literals['inssReport']['inssRetGrossValue'],
              this.literals['inssReport']['inssRetDescGrossValue'],
              this.literals['inssReport']['inss13TafGrossValue'],
              this.literals['inssReport']['inss13RetGrossValue'],
              this.literals['inssReport']['inss13DescGrossValue'],
              this.literals['inssReport']['familySalaryTafValue'],
              this.literals['inssReport']['familySalaryRetValue'],
              this.literals['inssReport']['maternitySalaryTafValue'],
              this.literals['inssReport']['maternitySalaryRetValue'],
              this.literals['inssReport']['maternitySalary13TafRetValue'],
              this.literals['inssReport']['maternitySalary13RetValue'],
            ];
          }
        } else {
          return [
            '',
            this.literals['inssReport']['cpf'],
            this.literals['inssReport']['name'],
            this.literals['inssReport']['inssGrossValue'],
            this.literals['inssReport']['inssRetGrossValue'],
            this.literals['inssReport']['inssRetDescGrossValue'],
            this.literals['inssReport']['inss13GrossValue'],
            this.literals['inssReport']['inss13RetGrossValue'],
            this.literals['inssReport']['inss13DescGrossValue'],
            this.literals['inssReport']['familySalaryValue'],
            this.literals['inssReport']['familySalaryRetValue'],
            this.literals['inssReport']['maternitySalaryValue'],
            this.literals['inssReport']['maternitySalaryRetValue'],
            this.literals['inssReport']['maternitySalary13Value'],
            this.literals['inssReport']['maternitySalary13RetValue'],
          ];
        }
      } else {
        if (tafFull) {
          if (isConfiguredService) {
            return [
              '',
              this.literals['inssReport']['establishment'],
              this.literals['inssReport']['lotation'],
              this.literals['inssReport']['cpf'],
              this.literals['inssReport']['name'],
              this.literals['inssReport']['registration'],
              this.literals['inssReport']['esocialCategory'],
              this.literals['inssReport']['rhInssAnalyticBase'],
              this.literals['inssReport']['tafInssAnalyticBase'],
              this.literals['inssReport']['retInssAnalyticBase'],
              this.literals['inssReport']['retInssSuspJudAnalyticBase'],
              this.literals['inssReport']['retInssTotalAnalyticBase'],
              this.literals['inssReport']['rhInssAnalyticValue'],
              this.literals['inssReport']['tafInssAnalyticValue'],
              this.literals['inssReport']['retInssAnalyticValue'],
              this.literals['inssReport']['retInssAnalyticGrossValue'],
              this.literals['inssReport']['rhInss13AnalyticBase'],
              this.literals['inssReport']['tafInss13AnalyticBase'],
              this.literals['inssReport']['retInss13AnalyticBase'],
              this.literals['inssReport']['rhInss13AnalyticValue'],
              this.literals['inssReport']['tafInss13AnalyticValue'],
              this.literals['inssReport']['retInss13AnalyticValue'],
              this.literals['inssReport']['retInss13AnalyticGrossValue'],
              this.literals['inssReport']['rhInssFamilySalaryAnalyticValue'],
              this.literals['inssReport']['tafInssFamilySalaryAnalyticValue'],
              this.literals['inssReport']['retInssFamilySalaryAnalyticValue'],
              this.literals['inssReport']['rhInssMaternitySalaryAnalyticValue'],
              this.literals['inssReport'][
                'tafInssMaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'retInssMaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'rhInss13MaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'tafInss13MaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'retInss13MaternitySalaryAnalyticValue'
              ],
            ];
          } else {
            return [
              '',
              this.literals['inssReport']['establishment'],
              this.literals['inssReport']['lotation'],
              this.literals['inssReport']['cpf'],
              this.literals['inssReport']['name'],
              this.literals['inssReport']['registration'],
              this.literals['inssReport']['esocialCategory'],
              this.literals['inssReport']['tafInssAnalyticBase'],
              this.literals['inssReport']['retInssAnalyticBase'],
              this.literals['inssReport']['retInssSuspJudAnalyticBase'],
              this.literals['inssReport']['retInssTotalAnalyticBase'],
              this.literals['inssReport']['tafInssAnalyticValue'],
              this.literals['inssReport']['retInssAnalyticValue'],
              this.literals['inssReport']['retInssAnalyticGrossValue'],
              this.literals['inssReport']['tafInss13AnalyticBase'],
              this.literals['inssReport']['retInss13AnalyticBase'],
              this.literals['inssReport']['tafInss13AnalyticValue'],
              this.literals['inssReport']['retInss13AnalyticValue'],
              this.literals['inssReport']['retInss13AnalyticGrossValue'],
              this.literals['inssReport']['tafInssFamilySalaryAnalyticValue'],
              this.literals['inssReport']['retInssFamilySalaryAnalyticValue'],
              this.literals['inssReport'][
                'tafInssMaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'retInssMaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'tafInss13MaternitySalaryAnalyticValue'
              ],
              this.literals['inssReport'][
                'retInss13MaternitySalaryAnalyticValue'
              ],
            ];
          }
        } else {
          return [
            this.literals['inssReport']['establishment'],
            this.literals['inssReport']['lotation'],
            this.literals['inssReport']['cpf'],
            this.literals['inssReport']['name'],
            this.literals['inssReport']['registration'],
            this.literals['inssReport']['esocialCategory'],
            this.literals['inssReport']['rhInssAnalyticBase'],
            this.literals['inssReport']['retInssAnalyticBase'],
            this.literals['inssReport']['rhInssAnalyticValue'],
            this.literals['inssReport']['retInssAnalyticValue'],
            this.literals['inssReport']['rhInss13AnalyticBase'],
            this.literals['inssReport']['retInss13AnalyticBase'],
            this.literals['inssReport']['rhInss13AnalyticValue'],
            this.literals['inssReport']['retInss13AnalyticValue'],
            this.literals['inssReport']['rhInssFamilySalaryAnalyticValue'],
            this.literals['inssReport']['retInssFamilySalaryAnalyticValue'],
            this.literals['inssReport']['rhInssMaternitySalaryAnalyticValue'],
            this.literals['inssReport']['retInssMaternitySalaryAnalyticValue'],
            this.literals['inssReport']['rhInss13MaternitySalaryAnalyticValue'],
            this.literals['inssReport'][
              'retInss13MaternitySalaryAnalyticValue'
            ],
          ];
        }
      }
    }

    if (taxInfo === 'IRRF') {
      if (synthetic) {
        if (tafFull) {
          if (isConfiguredService) {
            return [
              '',
              '',
              this.literals['irrfReport']['cpf'],
              this.literals['irrfReport']['name'],
              this.literals['irrfReport']['referencePeriod'],
              this.literals['irrfReport']['rhIRRF'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
            ];
          } else {
            return [
              '',
              '',
              this.literals['irrfReport']['cpf'],
              this.literals['irrfReport']['name'],
              this.literals['irrfReport']['referencePeriod'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
            ];
          }
        } else {
          return [
            '',
            '',
            this.literals['irrfReport']['cpf'],
            this.literals['irrfReport']['name'],
            this.literals['irrfReport']['referencePeriod'],
            this.literals['irrfReport']['rhIRRF'],
            this.literals['irrfReport']['govIRRF'],
          ];
        }
      } else {
        if (tafFull) {
          if (isConfiguredService) 
            return [
              '',
              '',
              this.literals['irrfReport']['name'],
              this.literals['irrfReport']['cpf'],
              this.literals['irrfReport']['rhIRRF'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
              this.literals['irrfReport']['demonstrative'],
              this.literals['irrfReport']['category'],
              this.literals['irrfReport']['referencePeriod'],
              this.literals['irrfReport']['rhIRRF'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
              this.literals['irrfReport']['payday'],
              this.literals['irrfReport']['origin'],
              this.literals['irrfReport']['IRRFvaluesConsolidation'],
              this.literals['irrfReport']['type'],
              this.literals['irrfReport']['IRRFvalueType'],
              this.literals['irrfReport']['rhValues'],
              this.literals['irrfReport']['tafValues'],
              this.literals['irrfReport']['govValues']
            ];
          else 
            return [
              '',
              '',
              this.literals['irrfReport']['name'],
              this.literals['irrfReport']['cpf'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
              this.literals['irrfReport']['demonstrative'],
              this.literals['irrfReport']['category'],
              this.literals['irrfReport']['referencePeriod'],
              this.literals['irrfReport']['tafIRRF'],
              this.literals['irrfReport']['govIRRF'],
              this.literals['irrfReport']['payday'],
              this.literals['irrfReport']['origin'],
              this.literals['irrfReport']['IRRFvaluesConsolidation'],
              this.literals['irrfReport']['type'],
              this.literals['irrfReport']['IRRFvalueType'],
              this.literals['irrfReport']['tafValues'],
              this.literals['irrfReport']['govValues']
            ];
          }
        else {
          return [
            '',
            '',
            this.literals['irrfReport']['name'],
            this.literals['irrfReport']['cpf'],
            this.literals['irrfReport']['rhIRRF'],
            this.literals['irrfReport']['govIRRF'],
            this.literals['irrfReport']['demonstrative'],
            this.literals['irrfReport']['category'],
            this.literals['irrfReport']['referencePeriod'],
            this.literals['irrfReport']['rhIRRF'],
            this.literals['irrfReport']['govIRRF'],
            this.literals['irrfReport']['payday'],
            this.literals['irrfReport']['origin'],
            this.literals['irrfReport']['IRRFvaluesConsolidation'],
            this.literals['irrfReport']['type'],
            this.literals['irrfReport']['IRRFvalueType'],
            this.literals['irrfReport']['rhValues'],
            this.literals['irrfReport']['govValues']
          ];
        }
      }
    }
  }

  public async PrintReport(
    taxInfo: string,
    params: any,
    synthetic?: boolean,
    isConfiguredService?: boolean
  ) {
    const totalBasis = {
      rhTotalBasis: 0,
      tafotalBasis: 0,
      retTotalBasis: 0,
      rh13TotalBasis: 0,
      taf13TotalBasis: 0,
      ret13TotalBasis: 0,
      rhRescissionTotalBasis: 0,
      tafRescissionTotalBasis: 0,
      retRescissionTotalBasis: 0,
    };

    const totalDeposits = {
      rhTotalDeposits: 0,
      tafTotalDeposits: 0,
      retTotalDeposits: 0,
      rh13TotalDeposits: 0,
      taf13TotalDeposits: 0,
      ret13TotalDeposits: 0,
      rhRescissionTotalDeposits: 0,
      tafRescissionTotalDeposits: 0,
      retRescissionTotalDeposits: 0,
    };

    const resultBasis = [];
    const resultDeposits = [];
    const isTafFull = JSON.parse(sessionStorage.getItem('TAFFull'));
    let hasNextValues = true;
    let tributeReport: TributeReport;

    if (taxInfo === 'FGTS') {
      const reportInfoParams = { ...params, page: 1, pageSize: 1000 };

      resultDeposits.push(this.headerDeposits(taxInfo, isTafFull));
      resultBasis.push(this.headerBasis(taxInfo, isTafFull));

      while (hasNextValues) {
        await this.getReportFGTS(reportInfoParams).then(response => {
          response.items.forEach(item => {
            const {
              cpfNumber,
              name,
              esocialRegistration,
              esocialCategory,
              basis,
              fgtsValue,
              fgtsTafValue,
              fgtsRetValue,
              fgts13Value,
              fgts13TafValue,
              fgts13RetValue,
              fgtsRescissionValue,
              fgtsRescissionTafValue,
              fgtsRescissionRetValue,
            } = item;

            basis.map(basisItem => {
              if (isTafFull) {
                resultBasis.push([
                  basisItem.branchId,
                  basisItem.lotationCode,
                  cpfNumber,
                  name,
                  esocialRegistration,
                  esocialCategory,
                  basisItem.fgtsBasis,
                  basisItem.fgtsTafBasis,
                  basisItem.fgtsRetBasis,
                  basisItem.fgts13Basis,
                  basisItem.fgts13TafBasis,
                  basisItem.fgts13RetBasis,
                  basisItem.fgtsRescissionBasis,
                  basisItem.fgtsRescissionTafBasis,
                  basisItem.fgtsRescissionRetBasis,
                ]);

                totalBasis.rhTotalBasis += basisItem.fgtsBasis;
                totalBasis.tafotalBasis += basisItem.fgtsTafBasis;
                totalBasis.retTotalBasis += basisItem.fgtsRetBasis;

                totalBasis.rh13TotalBasis += basisItem.fgts13Basis;
                totalBasis.taf13TotalBasis += basisItem.fgts13TafBasis;
                totalBasis.ret13TotalBasis += basisItem.fgts13RetBasis;

                totalBasis.rhRescissionTotalBasis +=
                  basisItem.fgtsRescissionBasis;
                totalBasis.tafRescissionTotalBasis +=
                  basisItem.fgtsRescissionTafBasis;
                totalBasis.retRescissionTotalBasis +=
                  basisItem.fgtsRescissionRetBasis;

                resultDeposits.push([
                  cpfNumber,
                  name,
                  esocialRegistration,
                  esocialCategory,
                  fgtsValue,
                  fgtsTafValue,
                  fgtsRetValue,
                  fgts13Value,
                  fgts13TafValue,
                  fgts13RetValue,
                  fgtsRescissionValue,
                  fgtsRescissionTafValue,
                  fgtsRescissionRetValue,
                ]);

                totalDeposits.rhTotalDeposits += fgtsValue;
                totalDeposits.tafTotalDeposits += fgtsTafValue;
                totalDeposits.retTotalDeposits += fgtsRetValue;

                totalDeposits.rh13TotalDeposits += fgts13Value;
                totalDeposits.taf13TotalDeposits += fgts13TafValue;
                totalDeposits.ret13TotalDeposits += fgts13RetValue;

                totalDeposits.rhRescissionTotalDeposits += fgtsRescissionValue;
                totalDeposits.tafRescissionTotalDeposits += fgtsRescissionTafValue;
                totalDeposits.retRescissionTotalDeposits += fgtsRescissionRetValue;
              } else {
                resultBasis.push([
                  basisItem.branchId,
                  basisItem.lotationCode,
                  cpfNumber,
                  name,
                  esocialRegistration,
                  esocialCategory,
                  basisItem.fgtsBasis,
                  basisItem.fgtsRetBasis,
                  basisItem.fgts13Basis,
                  basisItem.fgts13RetBasis,
                  basisItem.fgtsRescissionBasis,
                  basisItem.fgtsRescissionRetBasis,
                ]);

                totalBasis.rhTotalBasis += basisItem.fgtsBasis;
                totalBasis.retTotalBasis += basisItem.fgtsRetBasis;

                totalBasis.rh13TotalBasis += basisItem.fgts13Basis;
                totalBasis.ret13TotalBasis += basisItem.fgts13RetBasis;

                totalBasis.rhRescissionTotalBasis +=
                  basisItem.fgtsRescissionBasis;
                totalBasis.retRescissionTotalBasis +=
                  basisItem.fgtsRescissionRetBasis;

                resultDeposits.push([
                  cpfNumber,
                  name,
                  esocialRegistration,
                  esocialCategory,
                  fgtsValue,
                  fgtsRetValue,
                  fgts13Value,
                  fgts13RetValue,
                  fgtsRescissionValue,
                  fgtsRescissionRetValue,
                ]);

                totalDeposits.rhTotalDeposits += fgtsValue;
                totalDeposits.retTotalDeposits += fgtsRetValue;

                totalDeposits.rh13TotalDeposits += fgts13Value;
                totalDeposits.ret13TotalDeposits += fgts13RetValue;

                totalDeposits.rhRescissionTotalDeposits += fgtsRescissionValue;
                totalDeposits.retRescissionTotalDeposits += fgtsRescissionRetValue;
              }
            });
          });
          hasNextValues = response.hasNext;
          reportInfoParams.page++;
        });
      }

      if (isTafFull) {
        resultBasis.push([
          '',
          '',
          '',
          '',
          '',
          '',
          totalBasis.rhTotalBasis,
          totalBasis.tafotalBasis,
          totalBasis.retTotalBasis,
          totalBasis.rh13TotalBasis,
          totalBasis.taf13TotalBasis,
          totalBasis.ret13TotalBasis,
          totalBasis.rhRescissionTotalBasis,
          totalBasis.tafRescissionTotalBasis,
          totalBasis.retRescissionTotalBasis,
        ]);

        resultDeposits.push([
          '',
          '',
          '',
          '',
          totalDeposits.rhTotalDeposits,
          totalDeposits.tafTotalDeposits,
          totalDeposits.retTotalDeposits,
          totalDeposits.rh13TotalDeposits,
          totalDeposits.taf13TotalDeposits,
          totalDeposits.ret13TotalDeposits,
          totalDeposits.rhRescissionTotalDeposits,
          totalDeposits.tafRescissionTotalDeposits,
          totalDeposits.retRescissionTotalDeposits,
        ]);
      } else {
        resultBasis.push([
          '',
          '',
          '',
          '',
          '',
          '',
          totalBasis.rhTotalBasis,
          totalBasis.retTotalBasis,
          totalBasis.rh13TotalBasis,
          totalBasis.ret13TotalBasis,
          totalBasis.rhRescissionTotalBasis,
          totalBasis.retRescissionTotalBasis,
        ]);

        resultDeposits.push([
          '',
          '',
          '',
          '',
          totalDeposits.rhTotalDeposits,
          totalDeposits.retTotalDeposits,
          totalDeposits.rh13TotalDeposits,
          totalDeposits.ret13TotalDeposits,
          totalDeposits.rhRescissionTotalDeposits,
          totalDeposits.retRescissionTotalDeposits,
        ]);
      }

      tributeReport = {
        fileName: this.poI18n.transform(
          this.literals['exportReport']['filename'],
          [taxInfo.toLowerCase(), reportInfoParams.requestId]
        ),
        tribute: {
          type: '2',
          fgts: {
            resultBasis,
            resultDeposits,
          },
        },
      };
    } else if (taxInfo === 'INSS') {
      const reportInfoParams = {
        ...params,
        page: 1,
        pageSize: 1000,
        synthetic: false,
      };

      const { dataValues, mergedCells } = synthetic
        ? await this.getInssSyntheticsValues(
            reportInfoParams,
            isTafFull,
            taxInfo,
            synthetic,
            isConfiguredService
          )
        : await this.getInssAnalyticsValues(
            reportInfoParams,
            isTafFull,
            taxInfo,
            synthetic,
            isConfiguredService
          );

      tributeReport = {
        fileName: this.poI18n.transform(
          this.literals['exportReport']['filename'],
          [taxInfo.toLowerCase(), reportInfoParams.requestId]
        ),
        synthetic,
        tribute: {
          type: '1',
          inss: {
            dataValues,
            mergedCells,
          },
        },
      };
    } else if ((taxInfo = 'IRRF')) {
      const reportInfoParams = {
        ...params,
        page: 1,
        pageSize: 1000,
        synthetic: false,
      };

      const { dataValues, mergedCells, dataValuesAgglutinated } = synthetic
        ? await this.getIrrfSyntheticsValues(
            reportInfoParams,
            isTafFull,
            taxInfo,
            synthetic,
            isConfiguredService
          )
        : await this.getIrrfAnalyticsValues(
            reportInfoParams,
            isTafFull,
            taxInfo,
            synthetic,
            isConfiguredService
          );

      tributeReport = {
        fileName: this.poI18n.transform(
          this.literals['exportReport']['filename'],
          [taxInfo.toLowerCase(), reportInfoParams.requestId]
        ),
        synthetic,
        tribute: {
          type: '3',
          irrf: {
            dataValues,
            dataValuesAgglutinated,
            mergedCells
          },
        },
      };
    }

    this.downloadService.downloadXLSX(tributeReport);
  }

  public async getInssSyntheticsValues(
    reportInfoParams: ESocialBaseConferRetValuesRequest,
    isTafFull: boolean,
    taxInfo: string,
    synthetic: boolean,
    isConfiguredService: boolean
  ): Promise<{ dataValues: Array<string | number>; mergedCells?: Range[] }> {
    const inssTotalValues = {
      rhTotalValue: 0,
      tafTotalValue: 0,
      retTotalValue: 0,
      retTotalDiscounts: 0,
      rh13TotalValue: 0,
      taf13TotalValue: 0,
      ret13TotalValue: 0,
      ret13TotalDiscounts: 0,
      rhFamilySalaryValue: 0,
      tafFamilySalaryValue: 0,
      retFamilySalaryRetValue: 0,
      rhMaternitySalaryValue: 0,
      tafMaternitySalaryValue: 0,
      retMaternitySalaryValue: 0,
      rhMaternitySalary13Value: 0,
      tafMaternitySalary13Value: 0,
      retMaternitySalary13Value: 0,
    };
    const dataValues = [];
    let hasNextValues = true;

    dataValues.push(
      this.headerDeposits(taxInfo, isTafFull, synthetic, isConfiguredService)
    );

    while (hasNextValues) {
      await this.getReportInssRetValues(reportInfoParams).then(response => {
        response.items.forEach(item => {
          const {
            divergent,
            cpfNumber,
            name,
            inssGrossValue,
            inssTafGrossValue,
            inssRetGrossValue,
            inssRetDescGrossValue,
            inss13GrossValue,
            inss13TafGrossValue,
            inss13RetGrossValue,
            inss13DescGrossValue,
            familySalaryValue,
            familySalaryTafValue,
            familySalaryRetValue,
            maternitySalaryValue,
            maternitySalaryTafValue,
            maternitySalaryRetValue,
            maternitySalary13Value,
            maternitySalary13TafRetValue,
            maternitySalary13RetValue,
          } = item;

          if (isTafFull) {
            if (isConfiguredService) {
              dataValues.push([
                divergent ? this.literals['inssReport']['divergentValues'] : '',
                cpfNumber,
                name,
                inssGrossValue,
                inssTafGrossValue,
                inssRetGrossValue,
                inssRetDescGrossValue,
                inss13GrossValue,
                inss13TafGrossValue,
                inss13RetGrossValue,
                inss13DescGrossValue,
                familySalaryValue,
                familySalaryTafValue,
                familySalaryRetValue,
                maternitySalaryValue,
                maternitySalaryTafValue,
                maternitySalaryRetValue,
                maternitySalary13Value,
                maternitySalary13TafRetValue,
                maternitySalary13RetValue,
              ]);

              inssTotalValues.rhTotalValue += inssGrossValue;
              inssTotalValues.tafTotalValue += inssTafGrossValue;
              inssTotalValues.retTotalValue += inssRetGrossValue;
              inssTotalValues.retTotalDiscounts += inssRetDescGrossValue;

              inssTotalValues.rh13TotalValue += inss13GrossValue;
              inssTotalValues.taf13TotalValue += inss13TafGrossValue;
              inssTotalValues.ret13TotalValue += inss13RetGrossValue;
              inssTotalValues.ret13TotalDiscounts += inss13DescGrossValue;

              inssTotalValues.rhFamilySalaryValue += familySalaryValue;
              inssTotalValues.tafFamilySalaryValue += familySalaryTafValue;
              inssTotalValues.retFamilySalaryRetValue += familySalaryRetValue;

              inssTotalValues.rhMaternitySalaryValue += maternitySalaryValue;
              inssTotalValues.tafMaternitySalaryValue += maternitySalaryTafValue;
              inssTotalValues.retMaternitySalaryValue += maternitySalaryRetValue;

              inssTotalValues.rhMaternitySalary13Value += maternitySalary13Value;
              inssTotalValues.tafMaternitySalary13Value += maternitySalary13TafRetValue;
              inssTotalValues.retMaternitySalary13Value += maternitySalary13RetValue;
            } else {
              dataValues.push([
                divergent ? this.literals['inssReport']['divergentValues'] : '',
                cpfNumber,
                name,
                inssTafGrossValue,
                inssRetGrossValue,
                inssRetDescGrossValue,
                inss13TafGrossValue,
                inss13RetGrossValue,
                inss13DescGrossValue,
                familySalaryTafValue,
                familySalaryRetValue,
                maternitySalaryTafValue,
                maternitySalaryRetValue,
                maternitySalary13TafRetValue,
                maternitySalary13RetValue,
              ]);

              inssTotalValues.tafTotalValue += inssTafGrossValue;
              inssTotalValues.retTotalValue += inssRetGrossValue;
              inssTotalValues.retTotalDiscounts += inssRetDescGrossValue;

              inssTotalValues.taf13TotalValue += inss13TafGrossValue;
              inssTotalValues.ret13TotalValue += inss13RetGrossValue;
              inssTotalValues.ret13TotalDiscounts += inss13DescGrossValue;

              inssTotalValues.tafFamilySalaryValue += familySalaryTafValue;
              inssTotalValues.retFamilySalaryRetValue += familySalaryRetValue;

              inssTotalValues.tafMaternitySalaryValue += maternitySalaryTafValue;
              inssTotalValues.retMaternitySalaryValue += maternitySalaryRetValue;

              inssTotalValues.tafMaternitySalary13Value += maternitySalary13TafRetValue;
              inssTotalValues.retMaternitySalary13Value += maternitySalary13RetValue;
            }
          } else {
            dataValues.push([
              divergent ? this.literals['inssReport']['divergentValues'] : '',
              cpfNumber,
              name,
              inssGrossValue,
              inssRetGrossValue,
              inssRetDescGrossValue,
              inss13GrossValue,
              inss13RetGrossValue,
              inss13DescGrossValue,
              familySalaryValue,
              familySalaryRetValue,
              maternitySalaryValue,
              maternitySalaryRetValue,
              maternitySalary13Value,
              maternitySalary13RetValue,
            ]);

            inssTotalValues.rhTotalValue += inssGrossValue;
            inssTotalValues.retTotalValue += inssRetGrossValue;
            inssTotalValues.retTotalDiscounts += inssRetDescGrossValue;

            inssTotalValues.rh13TotalValue += inss13GrossValue;
            inssTotalValues.ret13TotalValue += inss13RetGrossValue;
            inssTotalValues.ret13TotalDiscounts += inss13DescGrossValue;

            inssTotalValues.rhFamilySalaryValue += familySalaryValue;
            inssTotalValues.retFamilySalaryRetValue += familySalaryRetValue;

            inssTotalValues.rhMaternitySalaryValue += maternitySalaryValue;
            inssTotalValues.retMaternitySalaryValue += maternitySalaryRetValue;

            inssTotalValues.rhMaternitySalary13Value += maternitySalary13Value;
            inssTotalValues.retMaternitySalary13Value += maternitySalary13RetValue;
          }
        });

        hasNextValues = response.hasNext;
        reportInfoParams.page++;
      });
    }

    if (isTafFull) {
      if (isConfiguredService) {
        dataValues.push([
          '',
          '',
          '',
          inssTotalValues.rhTotalValue,
          inssTotalValues.tafTotalValue,
          inssTotalValues.retTotalValue,
          inssTotalValues.retTotalDiscounts,
          inssTotalValues.rh13TotalValue,
          inssTotalValues.taf13TotalValue,
          inssTotalValues.ret13TotalValue,
          inssTotalValues.ret13TotalDiscounts,
          inssTotalValues.rhFamilySalaryValue,
          inssTotalValues.tafFamilySalaryValue,
          inssTotalValues.retFamilySalaryRetValue,
          inssTotalValues.rhMaternitySalaryValue,
          inssTotalValues.tafMaternitySalaryValue,
          inssTotalValues.retMaternitySalaryValue,
          inssTotalValues.rhMaternitySalary13Value,
          inssTotalValues.tafMaternitySalary13Value,
          inssTotalValues.retMaternitySalary13Value,
        ]);
      } else {
        dataValues.push([
          '',
          '',
          '',
          inssTotalValues.tafTotalValue,
          inssTotalValues.retTotalValue,
          inssTotalValues.retTotalDiscounts,
          inssTotalValues.taf13TotalValue,
          inssTotalValues.ret13TotalValue,
          inssTotalValues.ret13TotalDiscounts,
          inssTotalValues.tafFamilySalaryValue,
          inssTotalValues.retFamilySalaryRetValue,
          inssTotalValues.tafMaternitySalaryValue,
          inssTotalValues.retMaternitySalaryValue,
          inssTotalValues.tafMaternitySalary13Value,
          inssTotalValues.retMaternitySalary13Value,
        ]);
      }
    } else {
      dataValues.push([
        '',
        '',
        '',
        inssTotalValues.rhTotalValue,
        inssTotalValues.retTotalValue,
        inssTotalValues.retTotalDiscounts,
        inssTotalValues.rh13TotalValue,
        inssTotalValues.ret13TotalValue,
        inssTotalValues.ret13TotalDiscounts,
        inssTotalValues.rhFamilySalaryValue,
        inssTotalValues.retFamilySalaryRetValue,
        inssTotalValues.rhMaternitySalaryValue,
        inssTotalValues.retMaternitySalaryValue,
        inssTotalValues.rhMaternitySalary13Value,
        inssTotalValues.retMaternitySalary13Value,
      ]);
    }

    return { dataValues };
  }

  public async getInssAnalyticsValues(
    reportInfoParams: ESocialBaseConferRetValuesRequest,
    isTafFull: boolean,
    taxInfo: string,
    synthetic: boolean,
    isConfiguredService: boolean
  ): Promise<{ dataValues: Array<string | number>; mergedCells?: Range[] }> {
    const inssTotalValues = {
      rhInssAnalyticBase: 0,
      tafInssAnalyticBase: 0,
      retInssAnalyticBase: 0,
      retInssSuspJudAnalyticBase: 0,
      retInssTotalAnalyticBase: 0,
      rhInssAnalyticValue: 0,
      tafInssAnalyticValue: 0,
      retInssAnalyticValue: 0,
      retInssAnalyticGrossValue: 0,
      rhInss13AnalyticBase: 0,
      tafInss13AnalyticBase: 0,
      retInss13AnalyticBase: 0,
      rhInss13AnalyticValue: 0,
      tafInss13AnalyticValue: 0,
      retInss13AnalyticValue: 0,
      retInss13AnalyticGrossValue: 0,
      rhInssFamilySalaryAnalyticValue: 0,
      tafInssFamilySalaryAnalyticValue: 0,
      retInssFamilySalaryAnalyticValue: 0,
      rhInssMaternitySalaryAnalyticValue: 0,
      tafInssMaternitySalaryAnalyticValue: 0,
      retInssMaternitySalaryAnalyticValue: 0,
      rhInss13MaternitySalaryAnalyticValue: 0,
      tafInss13MaternitySalaryAnalyticValue: 0,
      retInss13MaternitySalaryAnalyticValue: 0,
    };
    const dataValues = [];
    const mergedCells = [];
    let hasNextValues = true;

    dataValues.push(
      this.headerDeposits(taxInfo, isTafFull, synthetic, isConfiguredService)
    );

    while (hasNextValues) {
      await this.getReportInssValues(reportInfoParams).then(response => {
        const lengthItems = response.items.length;
        const inssRetGrossValueColumn = isConfiguredService ? 15 : 13;
        const inss13RetGrossValueColumn = isConfiguredService ? 22 : 18;

        response.items.forEach((item, index, arr) => {
          const {
            inconsistent,
            branchId,
            lotationCode,
            cpfNumber,
            name,
            esocialRegistration,
            esocialCategory,
            inssBasis,
            inssTafBasis,
            inssRetBasis,
            inssRetSuspJudBasis,
            inssRetTotalBasis,
            inssValue,
            inssTafValue,
            inssRetValue,
            inssRetGrossValue,
            inss13Basis,
            inss13TafBasis,
            inss13RetBasis,
            inss13Value,
            inss13TafValue,
            inss13RetValue,
            inss13RetGrossValue,
            familySalaryValue,
            familySalaryTafValue,
            familySalaryRetValue,
            maternitySalaryValue,
            maternitySalaryTafValue,
            maternitySalaryRetValue,
            maternitySalary13Value,
            maternitySalary13TafRetValue,
            maternitySalary13RetValue,
          } = item;

          if (isTafFull) {
            const nextIndex = index + 1 === lengthItems ? 0 : index + 1;
            const mustMerge =
              nextIndex && item.cpfNumber === arr[nextIndex].cpfNumber;

            if (mustMerge) {
              mergedCells.push(
                ...[
                  {
                    s: { r: index + 1, c: inssRetGrossValueColumn },
                    e: { r: nextIndex + 1, c: inssRetGrossValueColumn },
                  },
                  {
                    s: { r: index + 1, c: inss13RetGrossValueColumn },
                    e: { r: nextIndex + 1, c: inss13RetGrossValueColumn },
                  },
                ]
              );
            }

            if (isConfiguredService) {
              dataValues.push([
                inconsistent
                  ? this.literals['inssReport']['divergentValues']
                  : '',
                branchId,
                lotationCode,
                cpfNumber,
                name,
                esocialRegistration,
                esocialCategory,
                inssBasis,
                inssTafBasis,
                inssRetBasis,
                inssRetSuspJudBasis,
                inssRetTotalBasis,
                inssValue,
                inssTafValue,
                inssRetValue,
                inssRetGrossValue,
                inss13Basis,
                inss13TafBasis,
                inss13RetBasis,
                inss13Value,
                inss13TafValue,
                inss13RetValue,
                inss13RetGrossValue,
                familySalaryValue,
                familySalaryTafValue,
                familySalaryRetValue,
                maternitySalaryValue,
                maternitySalaryTafValue,
                maternitySalaryRetValue,
                maternitySalary13Value,
                maternitySalary13TafRetValue,
                maternitySalary13RetValue,
              ]);

              inssTotalValues.rhInssAnalyticBase += inssBasis;
              inssTotalValues.tafInssAnalyticBase += inssTafBasis;
              inssTotalValues.retInssAnalyticBase += inssRetBasis;
              inssTotalValues.retInssSuspJudAnalyticBase += inssRetSuspJudBasis;
              inssTotalValues.retInssTotalAnalyticBase += inssRetTotalBasis;
              inssTotalValues.rhInssAnalyticValue += inssValue;
              inssTotalValues.tafInssAnalyticValue += inssTafValue;
              inssTotalValues.retInssAnalyticValue += inssRetValue;
              inssTotalValues.rhInss13AnalyticBase += inss13Basis;
              inssTotalValues.tafInss13AnalyticBase += inss13TafBasis;
              inssTotalValues.retInss13AnalyticBase += inss13RetBasis;
              inssTotalValues.rhInss13AnalyticValue += inss13Value;
              inssTotalValues.tafInss13AnalyticValue += inss13TafValue;
              inssTotalValues.retInss13AnalyticValue += inss13RetValue;
              inssTotalValues.rhInssFamilySalaryAnalyticValue += familySalaryValue;
              inssTotalValues.tafInssFamilySalaryAnalyticValue += familySalaryTafValue;
              inssTotalValues.retInssFamilySalaryAnalyticValue += familySalaryRetValue;
              inssTotalValues.rhInssMaternitySalaryAnalyticValue += maternitySalaryValue;
              inssTotalValues.tafInssMaternitySalaryAnalyticValue += maternitySalaryTafValue;
              inssTotalValues.retInssMaternitySalaryAnalyticValue += maternitySalaryRetValue;
              inssTotalValues.rhInss13MaternitySalaryAnalyticValue += maternitySalary13Value;
              inssTotalValues.tafInss13MaternitySalaryAnalyticValue += maternitySalary13TafRetValue;
              inssTotalValues.retInss13MaternitySalaryAnalyticValue += maternitySalary13RetValue;

              if (!mustMerge) {
                inssTotalValues.retInssAnalyticGrossValue += inssRetGrossValue;
                inssTotalValues.retInss13AnalyticGrossValue += inss13RetGrossValue;
              }
            } else {
              dataValues.push([
                inconsistent
                  ? this.literals['inssReport']['divergentValues']
                  : '',
                branchId,
                lotationCode,
                cpfNumber,
                name,
                esocialRegistration,
                esocialCategory,
                inssTafBasis,
                inssRetBasis,
                inssRetSuspJudBasis,
                inssRetTotalBasis,
                inssTafValue,
                inssRetValue,
                inssRetGrossValue,
                inss13TafBasis,
                inss13RetBasis,
                inss13TafValue,
                inss13RetValue,
                inss13RetGrossValue,
                familySalaryTafValue,
                familySalaryRetValue,
                maternitySalaryTafValue,
                maternitySalaryRetValue,
                maternitySalary13TafRetValue,
                maternitySalary13RetValue,
              ]);

              inssTotalValues.tafInssAnalyticBase += inssTafBasis;
              inssTotalValues.retInssAnalyticBase += inssRetBasis;
              inssTotalValues.retInssSuspJudAnalyticBase += inssRetSuspJudBasis;
              inssTotalValues.retInssTotalAnalyticBase += inssRetTotalBasis;
              inssTotalValues.tafInssAnalyticValue += inssTafValue;
              inssTotalValues.retInssAnalyticValue += inssRetValue;
              inssTotalValues.tafInss13AnalyticBase += inss13TafBasis;
              inssTotalValues.retInss13AnalyticBase += inss13RetBasis;
              inssTotalValues.tafInss13AnalyticValue += inss13TafValue;
              inssTotalValues.retInss13AnalyticValue += inss13RetValue;
              inssTotalValues.tafInssFamilySalaryAnalyticValue += familySalaryTafValue;
              inssTotalValues.retInssFamilySalaryAnalyticValue += familySalaryRetValue;
              inssTotalValues.tafInssMaternitySalaryAnalyticValue += maternitySalaryTafValue;
              inssTotalValues.retInssMaternitySalaryAnalyticValue += maternitySalaryRetValue;
              inssTotalValues.tafInss13MaternitySalaryAnalyticValue += maternitySalary13TafRetValue;
              inssTotalValues.retInss13MaternitySalaryAnalyticValue += maternitySalary13RetValue;

              if (!mustMerge) {
                inssTotalValues.retInssAnalyticGrossValue += inssRetGrossValue;
                inssTotalValues.retInss13AnalyticGrossValue += inss13RetGrossValue;
              }
            }
          } else {
            dataValues.push([
              branchId,
              lotationCode,
              cpfNumber,
              name,
              esocialRegistration,
              esocialCategory,
              inssBasis,
              inssRetBasis,
              inssValue,
              inssRetValue,
              inss13Basis,
              inss13RetBasis,
              inss13Value,
              inss13RetValue,
              familySalaryValue,
              familySalaryRetValue,
              maternitySalaryValue,
              maternitySalaryRetValue,
              maternitySalary13Value,
              maternitySalary13RetValue,
            ]);

            inssTotalValues.rhInssAnalyticBase += inssBasis;
            inssTotalValues.retInssAnalyticBase += inssRetBasis;
            inssTotalValues.rhInssAnalyticValue += inssValue;
            inssTotalValues.retInssAnalyticValue += inssRetValue;
            inssTotalValues.rhInss13AnalyticBase += inss13Basis;
            inssTotalValues.retInss13AnalyticBase += inss13RetBasis;
            inssTotalValues.rhInss13AnalyticValue += inss13Value;
            inssTotalValues.retInss13AnalyticValue += inss13RetValue;
            inssTotalValues.rhInssFamilySalaryAnalyticValue += familySalaryValue;
            inssTotalValues.retInssFamilySalaryAnalyticValue += familySalaryRetValue;
            inssTotalValues.rhInssMaternitySalaryAnalyticValue += maternitySalaryValue;
            inssTotalValues.retInssMaternitySalaryAnalyticValue += maternitySalaryRetValue;
            inssTotalValues.rhInss13MaternitySalaryAnalyticValue += maternitySalary13Value;
            inssTotalValues.retInss13MaternitySalaryAnalyticValue += maternitySalary13RetValue;
          }
        });

        hasNextValues = response.hasNext;
        reportInfoParams.page++;
      });
    }

    if (isTafFull) {
      if (isConfiguredService) {
        dataValues.push([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          inssTotalValues.rhInssAnalyticBase,
          inssTotalValues.tafInssAnalyticBase,
          inssTotalValues.retInssAnalyticBase,
          inssTotalValues.retInssSuspJudAnalyticBase,
          inssTotalValues.retInssTotalAnalyticBase,
          inssTotalValues.rhInssAnalyticValue,
          inssTotalValues.tafInssAnalyticValue,
          inssTotalValues.retInssAnalyticValue,
          inssTotalValues.retInssAnalyticGrossValue,
          inssTotalValues.rhInss13AnalyticBase,
          inssTotalValues.tafInss13AnalyticBase,
          inssTotalValues.retInss13AnalyticBase,
          inssTotalValues.rhInss13AnalyticValue,
          inssTotalValues.tafInss13AnalyticValue,
          inssTotalValues.retInss13AnalyticValue,
          inssTotalValues.retInss13AnalyticGrossValue,
          inssTotalValues.rhInssFamilySalaryAnalyticValue,
          inssTotalValues.tafInssFamilySalaryAnalyticValue,
          inssTotalValues.retInssFamilySalaryAnalyticValue,
          inssTotalValues.rhInssMaternitySalaryAnalyticValue,
          inssTotalValues.tafInssMaternitySalaryAnalyticValue,
          inssTotalValues.retInssMaternitySalaryAnalyticValue,
          inssTotalValues.rhInss13MaternitySalaryAnalyticValue,
          inssTotalValues.tafInss13MaternitySalaryAnalyticValue,
          inssTotalValues.retInss13MaternitySalaryAnalyticValue,
        ]);
      } else {
        dataValues.push([
          '',
          '',
          '',
          '',
          '',
          '',
          '',
          inssTotalValues.tafInssAnalyticBase,
          inssTotalValues.retInssAnalyticBase,
          inssTotalValues.retInssSuspJudAnalyticBase,
          inssTotalValues.retInssTotalAnalyticBase,
          inssTotalValues.tafInssAnalyticValue,
          inssTotalValues.retInssAnalyticValue,
          inssTotalValues.retInssAnalyticGrossValue,
          inssTotalValues.tafInss13AnalyticBase,
          inssTotalValues.retInss13AnalyticBase,
          inssTotalValues.tafInss13AnalyticValue,
          inssTotalValues.retInss13AnalyticValue,
          inssTotalValues.retInss13AnalyticGrossValue,
          inssTotalValues.tafInssFamilySalaryAnalyticValue,
          inssTotalValues.retInssFamilySalaryAnalyticValue,
          inssTotalValues.tafInssMaternitySalaryAnalyticValue,
          inssTotalValues.retInssMaternitySalaryAnalyticValue,
          inssTotalValues.tafInss13MaternitySalaryAnalyticValue,
          inssTotalValues.retInss13MaternitySalaryAnalyticValue,
        ]);
      }
    } else {
      dataValues.push([
        '',
        '',
        '',
        '',
        '',
        '',
        inssTotalValues.rhInssAnalyticBase,
        inssTotalValues.retInssAnalyticBase,
        inssTotalValues.rhInssAnalyticValue,
        inssTotalValues.retInssAnalyticValue,
        inssTotalValues.rhInss13AnalyticBase,
        inssTotalValues.retInss13AnalyticBase,
        inssTotalValues.rhInss13AnalyticValue,
        inssTotalValues.retInss13AnalyticValue,
        inssTotalValues.rhInssFamilySalaryAnalyticValue,
        inssTotalValues.retInssFamilySalaryAnalyticValue,
        inssTotalValues.rhInssMaternitySalaryAnalyticValue,
        inssTotalValues.retInssMaternitySalaryAnalyticValue,
        inssTotalValues.rhInss13MaternitySalaryAnalyticValue,
        inssTotalValues.retInss13MaternitySalaryAnalyticValue,
      ]);
    }

    return { dataValues, mergedCells };
  }

  public async getIrrfSyntheticsValues(
    reportInfoParams: ESocialBaseConferRetValuesRequest,
    isTafFull: boolean,
    taxInfo: string,
    synthetic: boolean,
    isConfiguredService: boolean
  ): Promise<{ 
    dataValues: Array<string | number>;
    dataValuesAgglutinated?: Array<string | number>;
    mergedCells?: Range[]
  }> {
    const irrfTotalValues = {
      rhTotalValue: 0,
      tafTotalValue: 0,
      retTotalValue: 0,
    };

    const dataValues = [];
    let hasNextValues = true;

    dataValues.push(
      this.headerDeposits(taxInfo, isTafFull, synthetic, isConfiguredService)
    );

    while (hasNextValues) {
      await this.getReportIrrfRetValues(reportInfoParams).then(response => {
        response.items[0].employees.forEach(item => {
          const {
            cpfNumber,
            demonstrative,
            divergent,
            warning,
            name,
            period,
            totalIrrfRetention,
          } = item;

          if (isTafFull) {
            if (isConfiguredService) {
              dataValues.push([
                divergent ? this.literals['irrfReport']['divergentValues'] : '',
                warning ? this.literals['irrfReport']['warningValues'] : '',
                cpfNumber,
                name,
                period,
                totalIrrfRetention.erpValue,
                totalIrrfRetention.tafValue,
                totalIrrfRetention.retValue,
              ]);

              irrfTotalValues.rhTotalValue += totalIrrfRetention.erpValue;
              irrfTotalValues.tafTotalValue += totalIrrfRetention.tafValue;
              irrfTotalValues.retTotalValue += totalIrrfRetention.retValue;
            } else {
              dataValues.push([
                divergent ? this.literals['irrfReport']['divergentValues'] : '',
                warning ? this.literals['irrfReport']['warningValues'] : '',
                cpfNumber,
                name,
                period,
                totalIrrfRetention.tafValue,
                totalIrrfRetention.retValue,
              ]);

              irrfTotalValues.tafTotalValue += totalIrrfRetention.tafValue;
              irrfTotalValues.retTotalValue += totalIrrfRetention.retValue;
            }
          } else {
            dataValues.push([
              divergent ? this.literals['irrfReport']['divergentValues'] : '',
              warning ? this.literals['irrfReport']['warningValues'] : '',
              cpfNumber,
              name,
              period,
              totalIrrfRetention.erpValue,
              totalIrrfRetention.retValue,
            ]);

            irrfTotalValues.rhTotalValue += totalIrrfRetention.erpValue;
            irrfTotalValues.retTotalValue += totalIrrfRetention.retValue;
          }
        });

        hasNextValues = response.hasNext;
        reportInfoParams.page ++;
      });
    }

    if (isTafFull) {
      if (isConfiguredService) {
        dataValues.push([
          '',
          '',
          '',
          '',
          '',
          irrfTotalValues.rhTotalValue,
          irrfTotalValues.tafTotalValue,
          irrfTotalValues.retTotalValue,
        ]);
      } else {
        dataValues.push([
          '',
          '',
          '',
          '',
          '',
          irrfTotalValues.tafTotalValue,
          irrfTotalValues.retTotalValue,
        ]);
      }
    } else {
      dataValues.push([
        '',
        '',
        '',
        '',
        '',
        irrfTotalValues.rhTotalValue,
        irrfTotalValues.retTotalValue,
      ]);
    }

    return { dataValues };
  }

  public async getIrrfAnalyticsValues(
    reportInfoParams: ESocialBaseConferRetValuesRequest,
    isTafFull: boolean,
    taxInfo: string,
    synthetic: boolean,
    isConfiguredService: boolean
  ): Promise<{
    dataValues: Array<string | number>;
    dataValuesAgglutinated: Array<string | number>;
    mergedCells?: Range[]
  }> {
    const hadColumnRemoved: boolean = !isTafFull || !isConfiguredService ? true : false;
    const dataValues = [];
    const dataValuesAgglutinated = [];
    const dataAnalytical = {
      employeeExcelData: [],
      employeeExcelDataAgglutinated: []
    };
    const typesIrrfValuesDesc: IRValueTypes = this.getTypesIrrfValuesDesc();
    const headerDataValuesAgglutinated = this.headerDeposits(taxInfo, isTafFull, synthetic, isConfiguredService);
    let hasNextValues = true;

    dataValues.push(this.headerDeposits(taxInfo, isTafFull, synthetic, isConfiguredService));
    headerDataValuesAgglutinated.splice(
      hadColumnRemoved ? 7 : 8,
      hadColumnRemoved ? 6 : 7);
    dataValuesAgglutinated.push(headerDataValuesAgglutinated);

    while (hasNextValues) {
      await this.getReportIrrfRetValues(reportInfoParams).then(response => {
        response.items[0].employees.forEach((employee) => {

          Object.keys(dataAnalytical).forEach((demoType => {
            dataAnalytical[demoType].push([
              employee.divergent ? this.literals['irrfReport']['divergentValues'] : '',
              employee.warning ? this.literals['irrfReport']['warningValues'] : '',
              employee.name,
              employee.cpfNumber,
              ...this.getRetentionsByTAFFullAndServiceConfigured(
                employee.totalIrrfRetention,
                isTafFull,
                isConfiguredService
              )
            ]);
          }));

          employee?.demonstrative?.forEach((demonstrative, indexDemoResponse) => {
            const lastIndex = dataAnalytical.employeeExcelData.length - 1;
            const offsetDemo = Array(hadColumnRemoved ? 6 : 6);
            const demoResponse = [
              demonstrative.demonstrativeId,
              demonstrative.category,
              demonstrative.referencePeriod,
              ...this.getRetentionsByTAFFullAndServiceConfigured(
                demonstrative.irrfRetention,
                isTafFull,
                isConfiguredService
              ),
              demonstrative.payday,
              demonstrative.origin
            ];
            indexDemoResponse == 0
              ? dataAnalytical.employeeExcelData[lastIndex].push(...demoResponse)
              : dataAnalytical.employeeExcelData.push([...offsetDemo, ...demoResponse])

            Object.entries(demonstrative.typesIrrfValues ?? []).forEach((typesIrrfValues, indexTypesIrrfValuesResponse) => {
              const lastIndex = dataAnalytical.employeeExcelData.length - 1;
              const InfoTypeIrrf = {
                code: typesIrrfValues[0],
                description: typesIrrfValuesDesc[typesIrrfValues[0]]
              };
              const offsetTypesIrrf = Array(hadColumnRemoved ? 13 : 14);
              const offsetInfoRubr = Array(hadColumnRemoved ? 14: 15);
              const infoRubrTotalResponse = [
                '',
                this.literals['irrfReport']['total'],
                ...this.getRetentionsByTAFFullAndServiceConfigured(
                  demonstrative.typesIrrfValues[InfoTypeIrrf.code].total,
                  isTafFull,
                  isConfiguredService
                )
              ];

              indexTypesIrrfValuesResponse == 0
                ? dataAnalytical.employeeExcelData[lastIndex].push(InfoTypeIrrf.description)
                : dataAnalytical.employeeExcelData.push([...offsetTypesIrrf, InfoTypeIrrf.description])

              demonstrative.typesIrrfValues[InfoTypeIrrf.code].items.forEach((infoRubr, indexInfoRubrResponse) => {
                const lastIndex = dataAnalytical.employeeExcelData.length - 1;
                const infoRubrResponse = [
                  infoRubr.type,
                  infoRubr.descriptionType,
                  ...this.getRetentionsByTAFFullAndServiceConfigured(
                    infoRubr,
                    isTafFull,
                    isConfiguredService
                  )
                ];
                indexInfoRubrResponse == 0
                ? dataAnalytical.employeeExcelData[lastIndex].push(...infoRubrResponse)
                : dataAnalytical.employeeExcelData.push([...offsetInfoRubr, ...infoRubrResponse])
              });

              dataAnalytical.employeeExcelData.push([...offsetInfoRubr, ...infoRubrTotalResponse])
            });
          });

          dataAnalytical.employeeExcelDataAgglutinated[dataAnalytical.employeeExcelDataAgglutinated.length - 1].push(
            employee?.totalDemonstratives?.demonstrative?.join('|')
          );

          Object.entries(employee?.totalDemonstratives?.typesIrrfValues ?? []).forEach((typesIrrfValues, indexTypesIrrfValuesResponse) => {
            const lastIndex = dataAnalytical.employeeExcelDataAgglutinated.length - 1;
            const InfoTypeIrrf = {
              code: typesIrrfValues[0],
              description: typesIrrfValuesDesc[typesIrrfValues[0]]
            };
            const offsetTypesIrrf = Array(hadColumnRemoved ? 7 : 7);
            const offsetInfoRubr = Array(hadColumnRemoved ? 8: 8);
            const infoRubrTotalResponse = [
              '',
              this.literals['irrfReport']['total'],
              ...this.getRetentionsByTAFFullAndServiceConfigured(
                employee.totalDemonstratives.typesIrrfValues[InfoTypeIrrf.code].total,
                isTafFull,
                isConfiguredService
              )
            ];

            indexTypesIrrfValuesResponse == 0
              ? dataAnalytical.employeeExcelDataAgglutinated[lastIndex].push(InfoTypeIrrf.description)
              : dataAnalytical.employeeExcelDataAgglutinated.push([...offsetTypesIrrf, InfoTypeIrrf.description])

              employee.totalDemonstratives.typesIrrfValues[InfoTypeIrrf.code].items.forEach((infoRubr: IRInfo, indexInfoRubrResponse: number) => {
              const lastIndex = dataAnalytical.employeeExcelDataAgglutinated.length - 1;
              const infoRubrResponse = [
                infoRubr.type,
                infoRubr.descriptionType,
                ...this.getRetentionsByTAFFullAndServiceConfigured(
                  infoRubr,
                  isTafFull,
                  isConfiguredService
                )
              ];
              indexInfoRubrResponse == 0
              ? dataAnalytical.employeeExcelDataAgglutinated[lastIndex].push(...infoRubrResponse)
              : dataAnalytical.employeeExcelDataAgglutinated.push([...offsetInfoRubr, ...infoRubrResponse])
            });

            dataAnalytical.employeeExcelDataAgglutinated.push([...offsetInfoRubr, ...infoRubrTotalResponse])
          });
        });
        
        dataValues.push(...dataAnalytical.employeeExcelData);
        dataValuesAgglutinated.push(...dataAnalytical.employeeExcelDataAgglutinated);
        hasNextValues = response.hasNext;
        reportInfoParams.page++;
      });
    }

    return { dataValues, dataValuesAgglutinated };
   }

   private getTypesIrrfValuesDesc(): IRValueTypes {
    return {
      taxableIncome: this.literals['irrfReport']['taxableIncome'],
      nonTaxableIncome: this.literals['irrfReport']['nonTaxableIncome'],
      retention: this.literals['irrfReport']['retention'],
      deductions: this.literals['irrfReport']['deductions'],
      taxableIncomeSuspended: this.literals['irrfReport']['taxableIncomeSuspended'],
      retentionSuspended: this.literals['irrfReport']['retentionSuspended'],
      deductionsSuspended: this.literals['irrfReport']['deductionsSuspended'],
      judicialCompensation: this.literals['irrfReport']['judicialCompensation']
    }
  }

  private getRetentionsByTAFFullAndServiceConfigured(
    {erpValue, retValue, tafValue}: IrrfRetentions, 
    TAFFull, isConfiguredService: boolean
  ): Array<number> {
    const irrfRetention: IrrfRetentions = {erpValue, tafValue, retValue};  

    if (!TAFFull)
      delete irrfRetention.tafValue
    else
      if (!isConfiguredService)
        delete irrfRetention.erpValue;

    return Object.values(irrfRetention)
  }
}
