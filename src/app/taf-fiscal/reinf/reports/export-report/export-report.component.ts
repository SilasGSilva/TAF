import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PoNotificationService, PoI18nPipe } from '@po-ui/ng-components';
import { getBranchLoggedIn, valueIsNull } from '../../../../../util/util';
import { LiteralService } from 'core/i18n/literal.service';
import { MasksPipe } from 'shared/pipe/masks.pipe';
import { DownloadService } from 'shared/download/download.service';
import { MessengerComponent } from 'shared/messenger/messenger.component';
import { CheckFeaturesService } from 'shared/check-features/check-features.service';
import { ExportReport } from 'taf-fiscal/models/export-report';
import { ExportReportResponse } from 'taf-fiscal/models/export-report-response';
import { ExportReportSportShow } from 'taf-fiscal/models/export-report-sport-show';
import { ExportXmlRequest } from './../../../models/export-xml-request';
import { ItemExportXml } from './../../../models/item-export-xml';
import { ExportReportResponse2030and2040 } from 'taf-fiscal/models/export-response-2030-2040';
import { ExportReportResponse2050 } from 'taf-fiscal/models/export-response-2050';
import { ExportReportResponse2055 } from 'taf-fiscal/models/export-response-2055';
import { ExportReportResponse4010 } from 'taf-fiscal/models/export-response-4010';
import { ExportReportResponse4020 } from 'taf-fiscal/models/export-response-4020';
import { ExportReportResponse4040 } from 'taf-fiscal/models/export-response-4040';
import { ExportReportResponse4080 } from 'taf-fiscal/models/export-response-4080';
import { ExportReportResponse5001 } from 'taf-fiscal/models/export-response-5001';
import { ExportReportResponse5011 } from 'taf-fiscal/models/export-response-5011';
import { ListEventsExportReportReinf } from 'taf-fiscal/models/list-events-export-report-reinf';
import { ExportReportSocialSecurityContribution } from 'taf-fiscal/models/export-report-social-security-contribution';
import { ExportReportResponse9015 } from 'taf-fiscal/models/export-response-9015';
import { ExportReportResponse9005 } from 'taf-fiscal/models/export-response-9005';
import { ExportReportService } from './export-report.service';

@Component({
  selector: 'app-export-report',
  templateUrl: './export-report.component.html',
  styleUrls: ['./export-report.component.scss'],
  providers: [MasksPipe],
})
export class ExportReportComponent {
  public data = [];
  public sortData = [];
  public literals = {};
  public actions: Array<object>;
  public directoryDestiny: string = "";
  public directoryOrigin: string = "";
  public reportItems: Array<
    | ExportReportResponse
    | ExportReportResponse2030and2040
    | ExportReportResponse2050
    | ExportReportResponse2055
    | ExportReportResponse5001
    | ExportReportResponse5011
    | ExportReportSocialSecurityContribution
  > = [];
  public isLoadingButton = false;
  public EVENTS_EXPORT_REPORT = ListEventsExportReportReinf;
  public loadingOverlay: boolean = false;
  public totEvents = 'R-5001/R-5011/R-9001/R-9005/R-9011/R-9015';

  @Input('taf-event') event = '';
  @Input('taf-period') period = '';

  @ViewChild(MessengerComponent, { static: true })
  messengerModal: MessengerComponent;

  constructor(
    private literalService: LiteralService,
    private exportReportService: ExportReportService,
    private poNotificationService: PoNotificationService,
    private datePipe: DatePipe,
    private poI18n: PoI18nPipe,
    private masksPipe: MasksPipe,
    private downloadService: DownloadService,
    private ref: ChangeDetectorRef,
    private checkFeatureService: CheckFeaturesService
  ) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  public ngOnInit() {
    this.actions = [
      {
        label: this.literals['exportReport']['export'], action: () => {
          this.getReportItems();
        }
      },
      {
        label: this.literals['exportReport']['exportXml'], action: () => {
          this.initSaveXML();
        }
      }
    ];
  }

  public exportExcel(value: Array<object>): void {
    let codEvent : string;

    if (this.event.match(/R-9001|R-9011/)) {
      codEvent = this.event.replace(/9/g,'5');
    } else {
      codEvent = this.event;
    }

    this.downloadService.download(
      this.poI18n.transform(this.literals['exportReport']['filename'], [
        this.event,
        this.period,
      ]),
      this.poI18n.transform(this.literals['exportReport']['title'], [
        this.event,
        this.period,
      ]),
      this[codEvent.replace('-', '')](),
      value
    );
  }

  public initSaveXML(): void {
    const params: ExportXmlRequest = {
      companyId: getBranchLoggedIn(),
      period: this.period,
      event: this.event
    }

    this.loadingOverlay = true;
    this.exportReportService.postExportXML(params).subscribe(
      response => {
        //Após retorno da API, método para copiar arquivo do protheus_data para diretório do usuário
        let directoryJson = {aFiles:[]};
        if (response.sucess) {
          response.exportXML.forEach((item:ItemExportXml)=>{
            if(item.createZip){
              directoryJson.aFiles.push(item.zipFile);
            }
          });
          this.copyZipFile(JSON.stringify(directoryJson));
        }else{
          this.messengerModal.onShowMessage(
            response.message,
            false,
            false,
            this.literals['exportReport']['titleMessage']
          );
          this.loadingOverlay = false;
        }
      },
      error => {
        this.poNotificationService.error(error);
        this.loadingOverlay = false;
      });
  }

  public copyZipFile(directoryOrigin: String) {
    let objectAdvpl: string = '';

    if (!valueIsNull(window['totvstec'])) {
      if (window['totvstec'].internalPort !== undefined) {
        objectAdvpl = 'totvtec';
      } else if (window['twebchannel'].internalPort !== undefined) {
        objectAdvpl = 'twebchannel';
      }

      if (objectAdvpl) {
        window[objectAdvpl].jsToAdvpl('saveFileZip', directoryOrigin);
        window[objectAdvpl].advplToJs = (codeType: string, codeContent: string) => { this.execRetAdvplToJs(codeType, codeContent) };
      } else {
        this.loadingOverlay = false;
        this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
      }
    } else {
      this.loadingOverlay = false;
      this.poNotificationService.error(this.literals['systemInfos']['advplToJsFail']);
    }
  }

  public execRetAdvplToJs(codeType: string, codeContent: string) {
    if (codeType == "retSaveFileZip") {
      this.messengerModal.onShowMessage(
        codeContent,
        false,
        false,
        'Exportação de XML'
      );
    }
    this.loadingOverlay = false;
    this.ref.detectChanges();
  }

  public async getReportItems(): Promise<void> {
    if (this.checkFeatureService.getFeature('downloadXLS').access) {
      this.isLoadingButton = true;

      const payload: ExportReport = {
        period: this.period,
        event: this.event,
        companyId: await getBranchLoggedIn(),
      };

      this.exportReportService.getReport(payload).subscribe(
        response => {
          this.setDetailsItems(response.eventDetail);
          this.isLoadingButton = false;
        },
        error => {
          this.poNotificationService.error(error);
        }
      );
    } else {
      this.messengerModal.onShowMessage(
        this.checkFeatureService.getFeature('downloadXLS').message,
        false,
        false,
        this.literals['systemInfos']['unupdatedSystem']
      );
    }
  }

  public setDetailsItems(
    items: Array<
      | ExportReportResponse
      | ExportReportResponse2030and2040
      | ExportReportResponse2050
      | ExportReportResponse2055
      | ExportReportResponse5001
      | ExportReportResponse5011
      | ExportReportSocialSecurityContribution
      | ExportReportResponse4010
      | ExportReportSportShow
    >
  ): void {
    this.data = [];
    items.forEach(
      (
        item:
          | ExportReportResponse
          | ExportReportResponse2030and2040
          | ExportReportResponse2050
          | ExportReportResponse2055
          | ExportReportResponse5001
          | ExportReportResponse5011
          | ExportReportResponse4010
          | ExportReportSocialSecurityContribution
      ) => {
        let codEvent : string;

        if (this.event.match(/R-9001|R-9011/) ) {
          codEvent = this.event.replace(/9/g,'5');
        } else {
          codEvent = this.event;
        }

        this['transformItems' + codEvent.replace('-', '')](item);
        this['rearrange' + codEvent.replace('-', '')](item);

      }
    );
    this.exportExcel(this.data);
  }

  public isDisableButton(): boolean {
    return !this.EVENTS_EXPORT_REPORT.hasOwnProperty(this.event) ? true : false;
  }

  public R2010(): Array<string> {
    return this.headersOf2010and2020();
  }

  public R2020(): Array<string> {
    return this.headersOf2010and2020();
  }

  public R2030(): Array<string> {
    return this.headersOf2030and2040();
  }

  public R2040(): Array<string> {
    return this.headersOf2030and2040();
  }

  public R2050(): Array<string> {
    return this.headersOf2050();
  }

  public R2055(): Array<string> {
    return this.headersOf2055();
  }

  public R2060(): Array<string> {
    return this.headersReportSocialSecurityContribution();
  }

  public R3010(): Array<string> {
    return this.headersReportSportShow();
  }

  public R4010(): Array<string> {
    return this.headersOf4010();
  }

  public R4020(): Array<string> {
    return this.headersOf4020();
  }

  public R4040(): Array<string> {
    return this.headersOf4040();
  }

  public R4080(): Array<string> {
    return this.headersOf4080();
  }

  public R5001(): Array<string> {
    return this.headersOf5001();
  }

  public R5011(): Array<string> {
    return this.headersOf5011();
  }

  public R9015(): Array<string> {
    return this.headersOf9015();
  }

  public R9005(): Array<string> {
    return this.headersOf9005();
  }

  public headersOf2010and2020(): Array<string> {
    return [
      this.literals['headers2010and2020']['branch'],
      this.literals['headers2010and2020']['taxNumberBranch'],
      this.literals['headers2010and2020']['taxNumber'],
      this.literals['headers2010and2020']['typeOfInscriptionEmployee'],
      this.literals['headers2010and2020']['employeeCode'],
      this.literals['headers2010and2020']['company'],
      this.literals['headers2010and2020']['documentType'],
      this.literals['headers2010and2020']['invoiceSeries'],
      this.literals['headers2010and2020']['invoice'],
      this.literals['headers2010and2020']['issueDate'],
      this.literals['headers2010and2020']['taxDocumentCode'],
      this.literals['headers2010and2020']['serviceCode'],
      this.literals['headers2010and2020']['service'],
      this.literals['headers2010and2020']['CPRB'],
      this.literals['headers2010and2020']['grossValue'],
      this.literals['headers2010and2020']['tax'],
      this.literals['headers2010and2020']['taxBase'],
      this.literals['headers2010and2020']['aliquot'],
      this.literals['headers2010and2020']['subcontractServiceValue'],
      this.literals['headers2010and2020']['mainWithHoldingValue'],
      this.literals['headers2010and2020']['unpaiRetentionAmount'],
      this.literals['headers2010and2020']['additionalHoldValue'],
      this.literals['headers2010and2020']['additionalUnpaidRetentionAmount'],
      this.literals['headers2010and2020']['additionalHoldValueNotConfirmed'],
      this.literals['headers2010and2020'][
        'valueServicesProvidedOnSpecialCondition15Years'
      ],
      this.literals['headers2010and2020'][
        'valueServicesProvidedOnSpecialCondition20Years'
      ],
      this.literals['headers2010and2020'][
        'valueServicesProvidedOnSpecialCondition25Years'
      ],
      this.literals['headers2010and2020']['serviceProvidingIndication'],
      this.literals['headers2010and2020']['constructionSiteDescription'],
      this.literals['headers2010and2020']['observation'],
    ];
  }

  public headersOf2030and2040(): Array<string> {
    const taxNumber =
      this.event === 'R-2030'
        ? this.literals['headers2030and2040']['taxNumberBranch2030']
        : this.literals['headers2030and2040']['taxNumberBranch2040'];

    const title =
      this.event === 'R-2030'
        ? this.literals['headers2030and2040']['title2030']
        : this.literals['headers2030and2040']['title2040'];

    return [
      this.literals['headers2030and2040']['branch'],
      taxNumber,
      title,
      this.literals['headers2030and2040']['type'],
      this.literals['headers2030and2040']['doctype'],
      this.literals['headers2030and2040']['serie'],
      this.literals['headers2030and2040']['numberdocument'],
      this.literals['headers2030and2040']['keydocument'],
      this.literals['headers2030and2040']['itemdoc'],
      this.literals['headers2030and2040']['issuedate'],
      this.literals['headers2030and2040']['grossvalue'],
      this.literals['headers2030and2040']['totaltax'],
      this.literals['headers2030and2040']['payvalue'],
      this.literals['headers2030and2040']['paytax'],
      this.literals['headers2030and2040']['typeproccess'],
      this.literals['headers2030and2040']['proccess'],
      this.literals['headers2030and2040']['descriptionproccess'],
      this.literals['headers2030and2040']['suspendedvalue'],
    ];
  }
  public headersOf2050(): Array<string> {
    return [
      this.literals['header2050']['branchId'],
      this.literals['header2050']['branch'],
      this.literals['header2050']['taxNumber'],
      this.literals['header2050']['keyInvoice'],
      this.literals['header2050']['serie'],
      this.literals['header2050']['numberInvoice'],
      this.literals['header2050']['item'],
      this.literals['header2050']['issueDate'],
      this.literals['header2050']['commercialization'],
      this.literals['header2050']['grossValue'],
      this.literals['header2050']['valueINSS'],
      this.literals['header2050']['valueGilRat'],
      this.literals['header2050']['valueSenar'],
      this.literals['header2050']['processNumber'],
      this.literals['header2050']['codeProcessINSS'],
      this.literals['header2050']['valueINSSNRet'],
      this.literals['header2050']['codeProcessGilRat'],
      this.literals['header2050']['valueGilRatNRet'],
      this.literals['header2050']['codeProcessSenar'],
      this.literals['header2050']['valueSenarNRet'],
    ];
  }

  public headersOf2055(): Array<string> {
    return [
      this.literals['header2055']['branchId'],
      this.literals['header2055']['branch'],
      this.literals['header2055']['taxNumber'],
      this.literals['header2055']['typeOfInscription'],
      this.literals['header2055']['keyInvoice'],
      this.literals['header2055']['serie'],
      this.literals['header2055']['numberInvoice'],
      this.literals['header2055']['item'],
      this.literals['header2055']['issueDate'],
      this.literals['header2055']['acquisition'],
      this.literals['header2055']['grossValue'],
      this.literals['header2055']['valueINSS'],
      this.literals['header2055']['valueGilRat'],
      this.literals['header2055']['valueSenar'],
      this.literals['header2055']['processNumber'],
      this.literals['header2055']['codeProcessINSS'],
      this.literals['header2055']['valueINSSNRet'],
      this.literals['header2055']['codeProcessGilRat'],
      this.literals['header2055']['valueGilRatNRet'],
      this.literals['header2055']['codeProcessSenar'],
      this.literals['header2055']['valueSenarNRet'],
      this.literals['header2055']['indCp'],
    ];
  }

  public headersOf4020(): Array<string> {
    return [
      this.literals['header4020']['branchId'],
      this.literals['header4020']['branch'],
      this.literals['header4020']['taxNumberBranch'],
      this.literals['header4020']['taxNumber'],
      this.literals['header4020']['participantCode'],
      this.literals['header4020']['nifIndicator'],
      this.literals['header4020']['nifNumber'],
      this.literals['header4020']['formOfTax'],
      this.literals['header4020']['participantName'],
      this.literals['header4020']['documentType'],
      this.literals['header4020']['invoiceSeries'],
      this.literals['header4020']['invoiceNumber'],
      this.literals['header4020']['itemNumber'],
      this.literals['header4020']['issueDate'],
      this.literals['header4020']['invoiceId'],
      this.literals['header4020']['yield'],
      this.literals['header4020']['scpIndicator'],
      this.literals['header4020']['scpTaxNumber'],
      this.literals['header4020']['rraInformation'],
      this.literals['header4020']['rraNumber'],
      this.literals['header4020']['sourceTaxNumber'],
      this.literals['header4020']['totalValueLawyer'],
      this.literals['header4020']['totalCourtCosts'],
      this.literals['header4020']['grossValue'],
      this.literals['header4020']['taxBaseIr'],
      this.literals['header4020']['aliquotIr'],
      this.literals['header4020']['taxIr'],
      this.literals['header4020']['taxBasePis'],
      this.literals['header4020']['aliquotPis'],
      this.literals['header4020']['taxPis'],
      this.literals['header4020']['taxBaseCofins'],
      this.literals['header4020']['aliquotCofins'],
      this.literals['header4020']['taxCofins'],
      this.literals['header4020']['taxBaseCsll'],
      this.literals['header4020']['aliquotCsll'],
      this.literals['header4020']['taxCsll'],
      this.literals['header4020']['agregBase'],
      this.literals['header4020']['agregValue'],
      this.literals['header4020']['suspendedBaseIr'],
      this.literals['header4020']['suspendedValueIr'],
      this.literals['header4020']['suspendedBasePis'],
      this.literals['header4020']['suspendedValuePis'],
      this.literals['header4020']['suspendedBaseCofins'],
      this.literals['header4020']['suspendedValueCofins'],
      this.literals['header4020']['suspendedBaseCsll'],
      this.literals['header4020']['suspendedValueCsll'],
      this.literals['header4020']['processNumber']
    ];
  }

  public headersOf4040(): Array<string> {
    return [
      this.literals['header4040']['branchId'],
      this.literals['header4040']['taxNumberBranch'],
      this.literals['header4040']['branchName'],
      this.literals['header4040']['participantCode'],
      this.literals['header4040']['invoiceId'],
      this.literals['header4040']['invoiceNumber'],
      this.literals['header4040']['taxableEventDate'],
      this.literals['header4040']['yield'],
      this.literals['header4040']['liquidValue'],
      this.literals['header4040']['taxBaseIR'],
      this.literals['header4040']['taxIr'],
      this.literals['header4040']['processNumber'],
      this.literals['header4040']['suspendedBaseIr'],
      this.literals['header4040']['suspendedValueIr'],
      this.literals['header4040']['irCourtDepositAmount'],
      this.literals['header4040']['obs']
    ];
  }

  public headersOf4080(): Array<string> {
    return [
      this.literals['header4080']['branchId'],
      this.literals['header4080']['fontNameTaxNumber'],
      this.literals['header4080']['fontName'],
      this.literals['header4080']['participantCode'],
      this.literals['header4080']['invoiceId'],
      this.literals['header4080']['invoiceNumber'],
      this.literals['header4080']['taxableEventDate'],
      this.literals['header4080']['yield'],
      this.literals['header4080']['grossValue'],
      this.literals['header4080']['taxBaseIR'],
      this.literals['header4080']['taxIr'],
      this.literals['header4080']['processNumber'],
      this.literals['header4080']['suspendedBaseIr'],
      this.literals['header4080']['suspendedValueIr'],
      this.literals['header4080']['irCourtDepositAmount'],
      this.literals['header4080']['obs']
    ];
  }

  public headersReportSocialSecurityContribution(): Array<string> {
    return [
      this.literals['header2060']['branchId'],
      this.literals['header2060']['branch'],
      this.literals['header2060']['typeOfInscription'],
      this.literals['header2060']['taxNumberBranch'],
      this.literals['header2060']['activityCode'],
      this.literals['header2060']['totalGrossValue'],
      this.literals['header2060']['additionalValueOfAdjustment'],
      this.literals['header2060']['exclusionValueOfAdjustment'],
      this.literals['header2060']['totalTaxBase'],
      this.literals['header2060']['sociaSecurityContributionValue'],
      this.literals['header2060']['socialSecurityContributionValueSuspended'],
      this.literals['header2060']['reviewType'],
      this.literals['header2060']['reviewDescription'],
      this.literals['header2060']['proccesType'],
      this.literals['header2060']['proccesNumber'],
      this.literals['header2060']['suspensionCode'],
    ];
  }

  public headersReportSportShow(): Array<string> {
    return [
      this.literals['header3010']['branch'],
      this.literals['header3010']['numberId'],
      this.literals['header3010']['typeOfCompetition'],
      this.literals['header3010']['category'],
      this.literals['header3010']['modality'],
      this.literals['header3010']['nameOfCompetition'],
      this.literals['header3010']['homeTeam'],
      this.literals['header3010']['visitors'],
      this.literals['header3010']['nameVisitor'],
      this.literals['header3010']['square'],
      this.literals['header3010']['country'],
      this.literals['header3010']['city'],
      this.literals['header3010']['payers'],
      this.literals['header3010']['notPayers'],
      this.literals['header3010']['totalGross'],
      this.literals['header3010']['contributionValue'],
      this.literals['header3010']['totalWithoutTaxes'],
      this.literals['header3010']['totalOfTaxes'],
    ];
  }
  public headersOf4010(): Array<string> {
    return [
      this.literals['header4010']['branchId'],
      this.literals['header4010']['branchName'],
      this.literals['header4010']['taxNumberBranch'],
      this.literals['header4010']['participantCpf'],
      this.literals['header4010']['participantCode'],
      this.literals['header4010']['nifIndicator'],
      this.literals['header4010']['nifNumber'],
      this.literals['header4010']['formOfTax'],
      this.literals['header4010']['participantName'],
      this.literals['header4010']['documentType'],
      this.literals['header4010']['invoiceSeries'],
      this.literals['header4010']['invoiceNumber'],
      this.literals['header4010']['itemNumber'],
      this.literals['header4010']['issueDate'],
      this.literals['header4010']['invoiceId'],
      this.literals['header4010']['yield'],
      this.literals['header4010']['indicatorSCP'],
      this.literals['header4010']['taxNumberSCP'],
      this.literals['header4010']['rraInformation'],
      this.literals['header4010']['rraNumber'],
      this.literals['header4010']['sourceTaxNumber'],
      this.literals['header4010']['totalValueLawyer'],
      this.literals['header4010']['totalCourtCosts'],
      this.literals['header4010']['grossValue'],
      this.literals['header4010']['taxBaseIR'],
      this.literals['header4010']['aliquotIR'],
      this.literals['header4010']['taxIR'],
      this.literals['header4010']['deductionValue'],
      this.literals['header4010']['deductionValueDependents'],
      this.literals['header4010']['exemptIncome'],
      this.literals['header4010']['suspendedIncome'],
      this.literals['header4010']['suspendedTaxValue'],
      this.literals['header4010']['suspendedDeduction'],
      this.literals['header4010']['proccesNumber'],
      this.literals['header4010']['taxNumberPLS'],
      this.literals['header4010']['participantPLS'],
      this.literals['header4010']['cpfDependents'],
      this.literals['header4010']['typeOfPayment'],
      this.literals['header4010']['valuePLS'],
      this.literals['header4010']['refundPreviousYear'],
      this.literals['header4010']['typeOfInscriptionMedic'],
      this.literals['header4010']['taxNumberMedic'],
    ];
  }

  public headersOf5001(): Array<string> {
    return [
      this.literals['header5001']['branchId'],
      this.literals['header5001']['branch'],
      this.literals['header5001']['taxNumber'],
      this.literals['header5001']['event'],
      this.literals['header5001']['protocol'],
      this.literals['header5001']['recipeCode'],
      this.literals['header5001']['registrationNumber'],
      this.literals['header5001']['taxBase'],
      this.literals['header5001']['tax'],
      this.literals['header5001']['suspendedContribution'],
      this.literals['header5001']['additionalHoldValue'],
      this.literals['header5001']['additionalHoldValueSuspended'],
    ];
  }

  public headersOf5011(): Array<string> {
    return [
      this.literals['header5011']['branchId'],
      this.literals['header5011']['branch'],
      this.literals['header5011']['taxNumber'],
      this.literals['header5011']['event'],
      this.literals['header5011']['protocol'],
      this.literals['header5011']['recipeCode'],
      this.literals['header5011']['registrationNumber'],
      this.literals['header5011']['taxBase'],
      this.literals['header5011']['tax'],
      this.literals['header5011']['suspendedContribution'],
      this.literals['header5011']['additionalHoldValue'],
      this.literals['header5011']['additionalHoldValueSuspended'],
    ];
  }
  public headersOf9015(): Array<string> {
    return [
      this.literals['header9015']['branch'],
      this.literals['header9015']['branchTaxNumber'],
      this.literals['header9015']['branchName'],
      this.literals['header9015']['grossCode'],
      this.literals['header9015']['yield'],
      this.literals['header9015']['taxValueMonth'],
      this.literals['header9015']['taxValueMonthSuspended'],
      this.literals['header9015']['taxValueBiweekly'],
      this.literals['header9015']['taxValueBiweeklySuspended'],
      this.literals['header9015']['taxValueDecennial'],
      this.literals['header9015']['taxValueDecennialSuspended'],
      this.literals['header9015']['taxValueWeekly'],
      this.literals['header9015']['taxValueWeeklySuspended'],
      this.literals['header9015']['taxValueDaily'],
      this.literals['header9015']['taxValueDailySuspended'],
    ];
  }

  public headersOf9005(): Array<string> {
    return [
      this.literals['header9005']['branchId'],
      this.literals['header9005']['taxNumberBranch'],
      this.literals['header9005']['company'],
      this.literals['header9005']['event'],
      this.literals['header9005']['recipeCode'],
      this.literals['header9005']['yield'],
      this.literals['header9005']['taxBaseMonth'],
      this.literals['header9005']['taxValueMonth'],
      this.literals['header9005']['taxBaseMonthSuspended'],
      this.literals['header9005']['taxValueMonthSuspended'],
      this.literals['header9005']['taxBaseBiweekly'],
      this.literals['header9005']['taxValueBiweekly'],
      this.literals['header9005']['taxBaseBiweeklySuspended'],
      this.literals['header9005']['taxValueBiweeklySuspended'],
      this.literals['header9005']['taxBaseDecennial'],
      this.literals['header9005']['taxValueDecennial'],
      this.literals['header9005']['taxBaseDecennialSuspended'],
      this.literals['header9005']['taxValueDecennialSuspended'],
      this.literals['header9005']['taxBaseWeekly'],
      this.literals['header9005']['taxValueWeekly'],
      this.literals['header9005']['taxBaseWeeklySuspended'],
      this.literals['header9005']['taxValueWeeklySuspended'],
      this.literals['header9005']['taxBaseDaily'],
      this.literals['header9005']['taxValueDaily'],
      this.literals['header9005']['taxBaseDailySuspended'],
      this.literals['header9005']['taxValueDailySuspended']
    ];
  }

  public transformItemsR2010(item: ExportReportResponse): Array<string> {
    return this.transformItems2010and2020(item);
  }

  public transformItemsR2020(item: ExportReportResponse): Array<string> {
    return this.transformItems2010and2020(item);
  }

  public transformItemsR2030(
    item: ExportReportResponse2030and2040
  ): Array<string> {
    return this.transformItems2030and2040(item);
  }

  public transformItemsR2040(
    item: ExportReportResponse2030and2040
  ): Array<string> {
    return this.transformItems2030and2040(item);
  }

  public transformItemsR2050(item: ExportReportResponse2050): Array<string> {
    return this.transformItems2050(item);
  }

  public transformItemsR2055(item: ExportReportResponse2055): Array<string> {
    return this.transformItems2055(item);
  }

  public transformItemsR5001(item: ExportReportResponse5001): Array<string> {
    return this.transformItems5001(item);
  }

  public transformItemsR5011(item: ExportReportResponse5011): Array<string> {
    return this.transformItems5011(item);
  }
  public transformItemsR9015(item: ExportReportResponse9015): Array<string> {
    return this.transformItems9015(item);
}

  public transformItemsR4010(item: ExportReportResponse4010): Array<string> {
    return this.transformItems4010(item);
  }

  public transformItemsR9005(item: ExportReportResponse9005): Array<string> {
    return this.transformItems9005(item);
  }

  public transformItemsR2060(
    item: ExportReportSocialSecurityContribution
  ): Array<string> {
    return this.transformItemReportSocialSecurityContribution(item);
  }

  public transformItemsR3010(item: ExportReportSportShow): Array<string> {
    return this.transformItemSportShow(item);
  }

  public transformItemsR4020(item: ExportReportResponse4020): Array<string> {
    return this.transformItems4020(item);
  }

  public transformItemsR4040(item: ExportReportResponse4040): Array<string> {
    return this.transformItems4040(item);
  }

  public transformItemsR4080(item: ExportReportResponse4080): Array<string> {
    return this.transformItems4080(item);
  }

  public transformItems2010and2020(item: ExportReportResponse): Array<string> {
    return [
      item.totalTaxBase,
      (item.issueDate = this.datePipe.transform(item.issueDate, 'dd/MM/yyyy')),
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
    ];
  }

  public transformItems2030and2040(
    item: ExportReportResponse2030and2040
  ): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
      (item.issuedate = this.datePipe.transform(item.issuedate, 'dd/MM/yyyy')),
    ];
  }

  public transformItems2050(item: ExportReportResponse2050): Array<string> {
    const valueINSS = item.valueINSS ? '' : item.valueINSS;
    const valueGilRat = item.valueGilRat ? '' : item.valueGilRat;
    const valueSenar = item.valueSenar ? '' : item.valueSenar;
    return [
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
      (item.issueDate = this.datePipe.transform(item.issueDate, 'dd/MM/yyyy')),
      valueINSS,
      valueGilRat,
      valueSenar,
    ];
  }

  public transformItems2055(item: ExportReportResponse2055): Array<string> {
    const valueINSS = item.valueINSS ? '' : item.valueINSS;
    const valueGilRat = item.valueGilRat ? '' : item.valueGilRat;
    const valueSenar = item.valueSenar ? '' : item.valueSenar;
    return [
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
      (item.issueDate = this.datePipe.transform(item.issueDate, 'dd/MM/yyyy')),
      valueINSS,
      valueGilRat,
      valueSenar,
    ];
  }

  public transformItems4020(item: ExportReportResponse4020): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
      (item.scpTaxNumber = this.masksPipe.transform(item.scpTaxNumber)),
      (item.sourceTaxNumber = this.masksPipe.transform(item.sourceTaxNumber)),
      (item.issueDate = this.datePipe.transform(item.issueDate, 'dd/MM/yyyy'))
    ];
  }

  public transformItems4040(item: ExportReportResponse4040): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
      (item.taxableEventDate = this.datePipe.transform(item.taxableEventDate, 'dd/MM/yyyy'))
    ];
  }

  public transformItems4080(item: ExportReportResponse4080): Array<string> {
    return [
      (item.fontNameTaxNumber = this.masksPipe.transform(item.fontNameTaxNumber)),
      (item.taxableEventDate = this.datePipe.transform(item.taxableEventDate, 'dd/MM/yyyy'))
    ];
  }

  public transformItems5001(item: ExportReportResponse5001): Array<string> {
    return [
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
    ];
  }

  public transformItems5011(item: ExportReportResponse5011): Array<string> {
    return [
      (item.taxNumber = this.masksPipe.transform(item.taxNumber)),
    ];
  }

  public transformItems4010(item: ExportReportResponse4010): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
      (item.taxNumberSCP = this.masksPipe.transform(item.taxNumberSCP)),
      (item.sourceTaxNumber = this.masksPipe.transform(item.sourceTaxNumber)),
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
      (item.issueDate = this.datePipe.transform(item.issueDate, 'dd/MM/yyyy')),
    ];
  }

  public transformItems9015(item: ExportReportResponse9015): Array<string> {
    return [
      (item.branchTaxNumber = this.masksPipe.transform(item.branchTaxNumber)),
    ];
  }

  public transformItems9005(item: ExportReportResponse9005): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
    ];
  }

  public transformItemReportSocialSecurityContribution(
    item: ExportReportSocialSecurityContribution
  ): Array<string> {
    return [
      (item.taxNumberBranch = this.masksPipe.transform(item.taxNumberBranch)),
    ];
  }
  public transformItemSportShow(item: ExportReportSportShow): Array<string> {
    return [
      (item.visitors = this.masksPipe.transform(item.visitors)),
      (item.homeTeam = this.masksPipe.transform(item.homeTeam)),
    ];
  }

  public rearrangeR2010(item: ExportReportResponse): void {
    this.rearrange2010and2020(item);
  }

  public rearrangeR2020(item: ExportReportResponse): void {
    this.rearrange2010and2020(item);
  }

  public rearrangeR2030(item: ExportReportResponse2030and2040): void {
    this.rearrange2030and2040(item);
  }

  public rearrangeR2040(item: ExportReportResponse2030and2040): void {
    this.rearrange2030and2040(item);
  }

  public rearrangeR2050(item: ExportReportResponse2050): void {
    this.rearrange2050(item);
  }

  public rearrangeR2055(item: ExportReportResponse2055): void {
    this.rearrange2055(item);
  }

  public rearrangeR5001(item: ExportReportResponse5001): void {
    this.rearrange5001(item);
  }

  public rearrangeR5011(item: ExportReportResponse5011): void {
    this.rearrange5011(item);
  }

  public rearrangeR9015(item: ExportReportResponse9015): void {
    this.rearrange9015(item);
  }

  public rearrangeR9005(item: ExportReportResponse9005): void {
    this.rearrange9005(item);
  }

  public rearrangeR2060(item: ExportReportSocialSecurityContribution): void {
    this.rearrangeItemReportSocialSecurityContribution(item);
  }

  public rearrangeR3010(item: ExportReportSportShow): void {
    this.rearrangeSportShow(item);
  }

  public rearrangeR4010(item: ExportReportResponse4010): void {
    this.rearrange4010(item);
  }

  public rearrangeR4020(item: ExportReportResponse4020): void {
    this.rearrange4020(item);
  }

  public rearrangeR4040(item: ExportReportResponse4040): void {
    this.rearrange4040(item);
  }

  public rearrangeR4080(item: ExportReportResponse4080): void {
    this.rearrange4080(item);
  }

  public rearrange2010and2020(item: ExportReportResponse): void {
    this.sortData = [
      item.branch,
      item.taxNumberBranch,
      item.taxNumber,
      item.typeOfInscriptionEmployee,
      item.employeeCode,
      item.company,
      item.documentType,
      item.invoiceSeries,
      item.invoice,
      item.issueDate,
      item.taxDocumentCode,
      item.serviceCode,
      item.service,
      item.CPRB,
      item.grossValue,
      item.tax,
      item.taxBase,
      item.aliquot,
      item.subcontractServiceValue,
      item.mainWithHoldingValue,
      item.unpaiRetentionAmount,
      item.additionalHoldValue,
      item.additionalUnpaidRetentionAmount,
      item.additionalHoldValueNotConfirmed,
      item.valueServicesProvidedOnSpecialCondition15Years,
      item.valueServicesProvidedOnSpecialCondition20Years,
      item.valueServicesProvidedOnSpecialCondition25Years,
      item.serviceProvidingIndication,
      item.constructionSiteDescription,
      item.observation,
    ];
    this.data.push(this.sortData);
  }

  public rearrange2030and2040(item: ExportReportResponse2030and2040): void {
    this.sortData = [
      item.branch,
      item.taxNumberBranch,
      item.name,
      item.type,
      item.doctype,
      item.serie,
      item.numberdocument,
      item.keydocument,
      item.itemdoc,
      item.issuedate,
      item.grossvalue,
      item.totaltax,
      item.payvalue,
      item.paytax,
      item.typeproccess,
      item.proccess,
      item.descriptionproccess,
      item.suspendedvalue,
    ];
    this.data.push(this.sortData);
  }

  public rearrange2050(item: ExportReportResponse2050): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.taxNumber,
      item.keyInvoice,
      item.serie,
      item.numberInvoice,
      item.item,
      item.issueDate,
      item.commercialization,
      item.grossValue,
      item.valueINSS,
      item.valueGilRat,
      item.valueSenar,
      item.processNumber,
      item.codeProcessINSS,
      item.valueINSSNRet,
      item.codeProcessGilRat,
      item.valueGilRatNRet,
      item.codeProcessSenar,
      item.valueSenarNRet,
    ];
    this.data.push(this.sortData);
  }

  public rearrange2055(item: ExportReportResponse2055): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.taxNumber,
      item.typeOfInscription,
      item.keyInvoice,
      item.serie,
      item.numberInvoice,
      item.item,
      item.issueDate,
      item.acquisition,
      item.grossValue,
      item.valueINSS,
      item.valueGilRat,
      item.valueSenar,
      item.processNumber,
      item.codeProcessINSS,
      item.valueINSSNRet,
      item.codeProcessGilRat,
      item.valueGilRatNRet,
      item.codeProcessSenar,
      item.valueSenarNRet,
      item.indCp,
    ];
    this.data.push(this.sortData);
  }

  public rearrange4020(item: ExportReportResponse4020): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.taxNumberBranch,
      item.taxNumber,
      item.participantCode,
      item.nifIndicator,
      item.nifNumber,
      item.formOfTax,
      item.participantName,
      item.documentType,
      item.invoiceSeries,
      item.invoiceNumber,
      item.itemNumber,
      item.issueDate,
      item.invoiceId,
      item.yield,
      item.scpIndicator,
      item.scpTaxNumber,
      item.rraInformation,
      item.rraNumber,
      item.sourceTaxNumber,
      item.totalValueLawyer,
      item.totalCourtCosts,
      item.grossValue,
      item.taxBaseIr,
      item.aliquotIr,
      item.taxIr,
      item.taxBasePis,
      item.aliquotPis,
      item.taxPis,
      item.taxBaseCofins,
      item.aliquotCofins,
      item.taxCofins,
      item.taxBaseCsll,
      item.aliquotCsll,
      item.taxCsll,
      item.agregBase,
      item.agregValue,
      item.suspendedBaseIr,
      item.suspendedValueIr,
      item.suspendedBasePis,
      item.suspendedValuePis,
      item.suspendedBaseCofins,
      item.suspendedValueCofins,
      item.suspendedBaseCsll,
      item.suspendedValueCsll,
      item.processNumber
    ];
    this.data.push(this.sortData);
  }

  public rearrange4040(item: ExportReportResponse4040): void {
    this.sortData = [
      item.branchId,
      item.taxNumberBranch,
      item.branchName,
      item.participantCode,
      item.invoiceId,
      item.invoiceNumber,
      item.taxableEventDate,
      item.yield,
      item.liquidValue,
      item.taxBaseIR,
      item.taxIr,
      item.processNumber,
      item.suspendedBaseIr,
      item.suspendedValueIr,
      item.irCourtDepositAmount,
      item.obs
    ];
    this.data.push(this.sortData);
  }

  public rearrange4080(item: ExportReportResponse4080): void {
    this.sortData = [
      item.branchId,
      item.fontNameTaxNumber,
      item.fontName,
      item.participantCode,
      item.invoiceId,
      item.invoiceNumber,
      item.taxableEventDate,
      item.yield,
      item.liquidValue,
      item.taxBaseIR,
      item.taxIr,
      item.processNumber,
      item.suspendedBaseIr,
      item.suspendedValueIr,
      item.irCourtDepositAmount,
      item.obs
    ];
    this.data.push(this.sortData);
  }

  public rearrange5001(item: ExportReportResponse5001): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.taxNumber,
      item.event,
      item.protocol,
      item.recipeCode,
      item.registrationNumber,
      item.taxBase,
      item.tax,
      item.suspendedContribution,
      item.additionalHoldValue,
      item.additionalHoldValueSuspended,
    ];
    this.data.push(this.sortData);
  }

  public rearrange5011(item: ExportReportResponse5011): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.taxNumber,
      item.event,
      item.protocol,
      item.recipeCode,
      item.registrationNumber,
      item.taxBase,
      item.tax,
      item.suspendedContribution,
      item.additionalHoldValue,
      item.additionalHoldValueSuspended,
    ];
    this.data.push(this.sortData);
  }

  public rearrange4010(item: ExportReportResponse4010): void {
    this.sortData = [
      item.branchId,
      item.branchName,
      item.taxNumberBranch,
      item.participantCpf,
      item.participantCode,
      item.nifIndicator,
      item.nifNumber,
      item.formOfTax,
      item.participantName,
      item.documentType,
      item.invoiceSeries,
      item.invoiceNumber,
      item.itemNumber,
      item.issueDate,
      item.invoiceId,
      item.yield,
      item.indicatorSCP,
      item.taxNumberSCP,
      item.rraInformation,
      item.rraNumber,
      item.sourceTaxNumber,
      item.totalValueLawyer,
      item.totalCourtCosts,
      item.grossValue,
      item.taxBaseIR,
      item.aliquotIR,
      item.taxIR,
      item.deductionValue,
      item.deductionValueDependents,
      item.exemptIncome,
      item.suspendedIncome,
      item.suspendedTaxValue,
      item.suspendedDeduction,
      item.proccesNumber,
      item.taxNumberPLS,
      item.participantPLS,
      item.cpfDependents,
      item.typeOfPayment,
      item.valuePLS,
      item.refundPreviousYear,
      item.typeOfInscriptionMedic,
      item.taxNumberMedic,
    ];
    this.data.push(this.sortData);
  }

  public rearrange9015(item: ExportReportResponse9015): void {
    this.sortData = [
      item.branch,
      item.branchTaxNumber,
      item.branchName,
      item.grossCode,
      item.yield,
      item.taxValueMonth,
      item.taxValueMonthSuspended,
      item.taxValueBiweekly,
      item.taxValueBiweeklySuspended,
      item.taxValueDecennial,
      item.taxValueDecennialSuspended,
      item.taxValueWeekly,
      item.taxValueWeeklySuspended,
      item.taxValueDaily,
      item.taxValueDailySuspended,
    ];
    this.data.push(this.sortData);
  }

  public rearrange9005(item: ExportReportResponse9005): void {
    this.sortData = [
      item.branchId,
      item.taxNumberBranch,
      item.company,
      item.event,
      item.recipeCode,
      item.yield,
      item.taxBaseMonth,
      item.taxValueMonth,
      item.taxBaseMonthSuspended,
      item.taxValueMonthSuspended,
      item.taxBaseBiweekly,
      item.taxValueBiweekly,
      item.taxBaseBiweeklySuspended,
      item.taxValueBiweeklySuspended,
      item.taxBaseDecennial,
      item.taxValueDecennial,
      item.taxBaseDecennialSuspended,
      item.taxValueDecennialSuspended,
      item.taxBaseWeekly,
      item.taxValueWeekly,
      item.taxBaseWeeklySuspended,
      item.taxValueWeeklySuspended,
      item.taxBaseDaily,
      item.taxValueDaily,
      item.taxBaseDailySuspended,
      item.taxValueDailySuspended,
    ];
    this.data.push(this.sortData);
  }


  public rearrangeItemReportSocialSecurityContribution(
    item: ExportReportSocialSecurityContribution
  ): void {
    this.sortData = [
      item.branchId,
      item.branch,
      item.typeOfInscription,
      item.taxNumberBranch,
      item.activityCode,
      item.totalGrossValue,
      item.additionalValueOfAdjustment,
      item.exclusionValueOfAdjustment,
      item.totalTaxBase,
      item.sociaSecurityContributionValue,
      item.socialSecurityContributionValueSuspended,
      item.reviewType,
      item.reviewDescription,
      item.proccesType,
      item.proccesNumber,
      item.suspensionCode,
    ];
    this.data.push(this.sortData);
  }

  public rearrangeSportShow(item: ExportReportSportShow): void {
    this.sortData = [
      item.branch,
      item.numberId,
      item.typeOfCompetition,
      item.category,
      item.modality,
      item.nameOfCompetition,
      item.homeTeam,
      item.visitors,
      item.nameVisitor,
      item.square,
      item.country,
      item.city,
      item.payers,
      item.notPayers,
      item.totalGross,
      item.contributionValue,
      item.totalWithoutTaxes,
      item.totalOfTaxes,
    ];
    this.data.push(this.sortData);
  }
}
