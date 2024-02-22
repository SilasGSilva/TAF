import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import * as pdfMake  from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { PoI18nPipe } from '@po-ui/ng-components';
import { Cat } from '../../social-cat-models/Cat';
import { LiteralService } from 'core/i18n/literal.service';

@Injectable()
export class CatPrintReportService {
  private literals = {};
  private zip = new JSZip();
  private pdf: TDocumentDefinitions;
  private catRecords: Array<Object>;
  private pdfPageDef = this.generatePageDef();

  constructor(
    private literalService: LiteralService,
    private poI18n: PoI18nPipe,
    private datePipe: DatePipe,
    ) {
      this.literals = literalService.literalsTafSocial;
  }

  public async printReport(catInfo: Array<Cat>): Promise<string> {
    this.catRecords = this.generateCatPages(catInfo, 'mixed');
    this.pdf = { content: this.catRecords.map(info => info['catPageContent']) };

    Object.assign(this.pdf, this.pdfPageDef);
    return await this.getPdf(this.pdf);
  }

  public async downloadReport(printMode: string): Promise<void> {
    const zipFileName = this.poI18n.transform(this.literals['catReport']['zipFileName'], [new Date().getTime()]);
    const cpf: Array<string> = [];
    const name: Array<string> = [];
    this.zip = new JSZip();

    if (printMode === 'separate' && this.catRecords.map(info => info['catPageContent']).length > 1) {
      const catInfo = this.catRecords.map(info => info['metaDataCatPageContent']);
      this.catRecords = this.generateCatPages(catInfo, 'separate');
      this.catRecords.map((info) => {
        cpf.push(info['metaDataCatPageContent'].cpf);
        name.push(info['metaDataCatPageContent'].name);
        return info['catPageContent'];
      })
        .forEach((individualCat, index) => {
          this.pdf = { content: individualCat };
          Object.assign(this.pdf, this.pdfPageDef);
          const urlPdfBase64 = this.getPdf64(this.pdf);
          const catIndividualName = this.poI18n.transform(
            this.literals['catReport']['fileName'], [cpf[index], name[index], new Date().getTime() + index]);
          this.zip.file(catIndividualName, urlPdfBase64, { base64: true });
      });
    } else {
      const urlPdfBase64 = await this.getPdf64(this.pdf);
      this.zip.file(this.poI18n.transform(
        this.literals['catReport']['mergedFileName'], [new Date().getTime()]), urlPdfBase64, { base64: true });
    }

    this.zip.generateAsync({type: 'blob'}).then(function(content) {
      FileSaver.saveAs(content, zipFileName);
    });
  }

  private generatePageDef(): Object {
    return {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [30, 40, 30, 40],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [70, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        mainTable: {
          margin: [0, 0, 0, -1],
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'black',
        },
      },
      defaultStyle: {
        fontSize: 9,
      },
    };
  }

  private generateFieldHeader(
    fieldValue: string,
    colSpanColumns?: number,
    pageBreakMode?: string
  ): TableCell {
    const topEdge = [true, true, true, false];

    return {
      text: fieldValue,
      border: topEdge,
      colSpan: colSpanColumns,
      pageBreak: pageBreakMode
    };
  }

  private generateCheckBox(
    fieldValue: string,
    labelValue: string,
    colSpanDescription: number = null
  ): TableCell {
    const borderless = [false, false, false, false];
    const image = fieldValue === labelValue ? 'checked.png' : 'unchecked.png';

    return {
      checkBox:
        {
          image: image,
          fit: [10, 10],
          alignment: 'right',
          border: borderless,
        },

      label:
      {
        text: labelValue,
        border: borderless,
        colSpan: colSpanDescription
      }
    };
  }

  private generateSimpleValue(
    fieldValue: string,
    colSpanDescription?: number,
    linesToSkipBeforeWriting?: number
  ): TableCell {
    const bottomEdge = [true, false, true, true];
    const value = `${'\n'.repeat(linesToSkipBeforeWriting ?? 0)}${fieldValue}`;

    return {
      text: value,
      border: bottomEdge,
      colSpan: colSpanDescription
    };
  }

  private generateSection(
    sectionName: string,
    colSpanColumns: number
  ): TableCell {

    return {
      text: sectionName,
      style: 'tableHeader',
      fillColor: '#dddddd',
      colSpan: colSpanColumns
    };
  }

  private generateFootnote(
    message: string,
    tableBorder?: Array<boolean>
  ): TableCell {

    return {
      text: message,
      style: 'tableHeader',
      colSpan: 5,
      border: tableBorder
    };
  }

  private generateLogo(
    howMuchCats: number,
    printMode: string
  ): TableCell {
    const pageBreakMode = (!howMuchCats || printMode === 'separate') ? null: 'before'

    return {
      image: 'previdencia_social_logo.png',
      fit: [250, 250],
      alignment: 'center',
      margin: [0, 0, 0, 10],
      pageBreak: pageBreakMode
    };
  }

  private async getPdf(pdf: TDocumentDefinitions): Promise<string> {
    return new Promise(function(resolve) {
      pdfMake.createPdf(pdf, null, null, pdfFonts.pdfMake.vfs).getDataUrl(buffer => {
        resolve(buffer);
      });
    });
  }

  private async getPdf64(pdf: TDocumentDefinitions): Promise<string> {
    return new Promise(function(resolve) {
      pdfMake.createPdf(pdf, null, null, pdfFonts.pdfMake.vfs).getBase64(buffer => {
        resolve(buffer);
      });
    });
  }

  private getFieldName(): any {
    return {
      emitter:
        this.generateFieldHeader(this.literals['catReport']['emitterField'], 3),
      catType:
        this.generateFieldHeader(this.literals['catReport']['catTypeField']),
      catInitiative:
        this.generateFieldHeader(this.literals['catReport']['catInitiativeField']),
      registrationSource:
        this.generateFieldHeader(this.literals['catReport']['registrationSourceField']),
      catNumber:
        this.generateFieldHeader(this.literals['catReport']['catNumberField']),
      originCatNumber:
        this.generateFieldHeader(this.literals['catReport']['originCatNumberField'], 2),
      corporateName:
        this.generateFieldHeader(this.literals['catReport']['corporateNameField'], 5),
      employerType:
        this.generateFieldHeader(this.literals['catReport']['employerTypeField'], 2),
      registrationNumber:
        this.generateFieldHeader(this.literals['catReport']['registrationNumberField'], 2),
      cnae:
        this.generateFieldHeader(this.literals['catReport']['cnaeField']),
      name:
        this.generateFieldHeader(this.literals['catReport']['nameField'], 5),
      cpf:
        this.generateFieldHeader(this.literals['catReport']['cpfField']),
      birthDate:
        this.generateFieldHeader(this.literals['catReport']['birthDateField']),
      gender:
        this.generateFieldHeader(this.literals['catReport']['genderField']),
      civilStatus:
        this.generateFieldHeader(this.literals['catReport']['statusCivilField'], 2),
      cbo:
        this.generateFieldHeader(this.literals['catReport']['cboField']),
      affiliationSocialSecurity:
        this.generateFieldHeader(this.literals['catReport']['affiliationSocialSecurityField'], 3),
      areas:
        this.generateFieldHeader(this.literals['catReport']['areasField']),
      accidentDate:
        this.generateFieldHeader(this.literals['catReport']['accidentDateField']),
      accidentTime:
        this.generateFieldHeader(this.literals['catReport']['accidentTimeField']),
      workHour:
        this.generateFieldHeader(this.literals['catReport']['workHourField']),
      accidentType:
        this.generateFieldHeader(this.literals['catReport']['accidentTypeField'], 2),
      thereWasRemoval:
        this.generateFieldHeader(this.literals['catReport']['thereWasRemovalField']),
      lastDayWorked:
        this.generateFieldHeader(this.literals['catReport']['lastDayWorkedField']),
      accidentSite:
        this.generateFieldHeader(this.literals['catReport']['accidentSiteField'], 3),
      accidentSiteSpecification:
        this.generateFieldHeader(this.literals['catReport']['accidentSiteSpecificationField'], 5),
      accidentSiteInscription:
        this.generateFieldHeader(this.literals['catReport']['accidentSiteInscriptionField']),
      uf:
        this.generateFieldHeader(this.literals['catReport']['ufField']),
      accidentSiteCounty:
        this.generateFieldHeader(this.literals['catReport']['accidentSiteCountyField'], 2),
      country:
        this.generateFieldHeader(this.literals['catReport']['countryField']),
      affectedBodyPart:
        this.generateFieldHeader(this.literals['catReport']['affectedBodyPartField'], 2, 'before'),
      causerAgent:
        this.generateFieldHeader(this.literals['catReport']['causerAgentField'], 3, 'before'),
      laterality:
        this.generateFieldHeader(this.literals['catReport']['lateralityField'], 2),
      descriptionGeneratingSituation:
        this.generateFieldHeader(this.literals['catReport']['descriptionGeneratingSituationField'], 3),
      thereWasPolice:
        this.generateFieldHeader(this.literals['catReport']['thereWasPoliceField'], 2),
      thereWasDeath:
        this.generateFieldHeader(this.literals['catReport']['thereWasDeathField'], 2),
      deathDate:
        this.generateFieldHeader(this.literals['catReport']['deathDateField']),
      accidentObservation:
        this.generateFieldHeader(this.literals['catReport']['accidentObservationField'], 4),
      receivingDate:
        this.generateFieldHeader(this.literals['catReport']['receivingDateField']),
      serviceDate:
        this.generateFieldHeader(this.literals['catReport']['serviceDateField']),
      serviceTime:
        this.generateFieldHeader(this.literals['catReport']['serviceTimeField']),
      thereWasHospitalization:
        this.generateFieldHeader(this.literals['catReport']['thereWasHospitalizationField']),
      probableTreatmentDuration:
        this.generateFieldHeader(this.literals['catReport']['probableTreatmentDurationField']),
      shouldInjuredPersonBeRemoval:
        this.generateFieldHeader(this.literals['catReport']['shouldInjuredPersonBeRemovalField']),
      injuryDescription:
        this.generateFieldHeader(this.literals['catReport']['injuryDescriptionField'], 5),
      probableDiagnosis:
        this.generateFieldHeader(this.literals['catReport']['probableDiagnosisField'], 2),
      cid10:
        this.generateFieldHeader(this.literals['catReport']['cid10Field']),
      placeAndDate:
        this.generateFieldHeader(this.literals['catReport']['placeAndDateField'], 2),
      doctorInformation:
        this.generateFieldHeader(this.literals['catReport']['doctorInformationField'], 5),
      diagnosticObservation:
        this.generateFieldHeader(this.literals['catReport']['diagnosticObservationField'], 5)
    };
  }

  private getFieldValue(cat: Cat): any {
    return {
      catNumber:
        this.generateSimpleValue(cat.catNumber),
      originCatNumber:
        this.generateSimpleValue(cat.originCatNumber, 2),
      corporateName:
        this.generateSimpleValue(cat.socialReason, 5),
      registrationNumber:
        this.generateSimpleValue(cat.inscriptionNumber, 2, 1),
      cnae:
        this.generateSimpleValue(cat.cnae, null, 1),
      name:
        this.generateSimpleValue(cat.name, 5),
      cpf:
        this.generateSimpleValue(cat.cpf, null, 2),
      birthDate:
        this.generateSimpleValue(cat.birthDate, null, 2),
      cbo:
        this.generateSimpleValue(cat.cbo),
      accidentDate:
        this.generateSimpleValue(this.datePipe.transform(cat.accidentDate, 'dd/MM/yy'), null, 1),
      accidentTime:
        this.generateSimpleValue(cat.accidentTime, null, 1),
      workHour:
        this.generateSimpleValue(cat.workHour, null, 1),
      lastDayWorked:
        this.generateSimpleValue(cat.lastDayWorked, null, 1),
      accidentSite:
        this.generateSimpleValue(cat.placeType, 3, 1),
      accidentSiteSpecification:
        this.generateSimpleValue(cat.place, 5),
      accidentSiteInscription:
        this.generateSimpleValue(cat.inscriptionPlace),
      uf:
        this.generateSimpleValue(cat.uf),
      accidentSiteCounty:
        this.generateSimpleValue(cat.county, 2),
      country:
        this.generateSimpleValue(cat.country, 1),
      affectedBodyPart:
        this.generateSimpleValue(cat.affectedParts, 2),
      causerAgent:
        this.generateSimpleValue(cat.causerAgent, 3),
      descriptionGeneratingSituation:
        this.generateSimpleValue(cat.situation, 3),
      deathDate:
        this.generateSimpleValue(cat.deathDate, null, 1),
      accidentObservation:
        this.generateSimpleValue(cat.note, 4),
      receivingDate:
        this.generateSimpleValue(cat.receivingDate),
      serviceDate:
        this.generateSimpleValue(cat.serviceDate, null, 2),
      serviceTime:
        this.generateSimpleValue(cat.serviceHour, null, 2),
      probableTreatmentDuration:
        this.generateSimpleValue(cat.treatmentDuration, null, 2),
      injuryDescription:
        this.generateSimpleValue(cat.lesion, 5),
      probableDiagnosis:
        this.generateSimpleValue(cat.probableDiagnosis, 2),
      cid10:
        this.generateSimpleValue(cat.codeCid),
      placeAndDate:
        this.generateSimpleValue(cat.placeDate, 2),
      doctorInformation:
        this.generateSimpleValue(cat.doctorInformation, 5),
      diagnosticObservation:
        this.generateSimpleValue(cat.observation, 5),
      emitter:
      {
        serviceTaker:
          this.generateCheckBox('', this.literals['catReport']['serviceTaker']),
        doctor:
          this.generateCheckBox('', this.literals['catReport']['doctor']),
        domesticEmployer:
          this.generateCheckBox('', this.literals['catReport']['domesticEmployer']),
        employer:
          this.generateCheckBox(this.literals['catReport']['employer'], this.literals['catReport']['employer']),
        syndicate:
          this.generateCheckBox('', this.literals['catReport']['syndicate']),
        worker:
          this.generateCheckBox('', this.literals['catReport']['worker']),
        dependents:
          this.generateCheckBox('', this.literals['catReport']['dependents']),
        publicAuthority:
          this.generateCheckBox('', this.literals['catReport']['publicAuthority']),
      },
      catType:
      {
        initial:
          this.generateCheckBox(cat.catType, this.literals['catReport']['initial']),
        reopening:
          this.generateCheckBox(cat.catType, this.literals['catReport']['reopening']),
        deathNotice:
          this.generateCheckBox(cat.catType, this.literals['catReport']['deathNotice'], 3),
      },
      catInitiative:
      {
        employerInitiative:
          this.generateCheckBox(cat.initialCat, this.literals['catReport']['employerInitiative']),
        courtOrder:
          this.generateCheckBox(cat.initialCat, this.literals['catReport']['courtOrder']),
        determinationSupervisoryBody:
          this.generateCheckBox(cat.initialCat, this.literals['catReport']['determinationSupervisoryBody'], 3)
      },
      registrationSource:
      {
        eSocial:
          this.generateCheckBox(this.literals['catReport']['eSocial'], this.literals['catReport']['eSocial']),
        catWeb:
          this.generateCheckBox('', this.literals['catReport']['catWeb'])
      },
      employerType:
      {
        cnpj:
          this.generateCheckBox(cat.inscriptionType, this.literals['catReport']['cnpj']),
        cno:
          this.generateCheckBox(cat.inscriptionType, this.literals['catReport']['cno']),
        caepf:
          this.generateCheckBox(cat.inscriptionType, this.literals['catReport']['caepf']),
        cpf:
          this.generateCheckBox(cat.inscriptionType, this.literals['catReport']['cpf'])
      },
      gender:
      {
        male:
          this.generateCheckBox(cat.gender, this.literals['catReport']['male']),
        female:
          this.generateCheckBox(cat.gender, this.literals['catReport']['female'])
      },
      civilStatus:
      {
        single:
          this.generateCheckBox(cat.civilStatus, this.literals['catReport']['single']),
        married:
          this.generateCheckBox(cat.civilStatus, this.literals['catReport']['married']),
        widower:
          this.generateCheckBox(cat.civilStatus, this.literals['catReport']['widower']),
        divorced:
          this.generateCheckBox(cat.civilStatus, this.literals['catReport']['divorced'], 2),
        separeted:
          this.generateCheckBox(cat.civilStatus, this.literals['catReport']['separeted'], 2)
      },
      affiliationSocialSecurity:
      {
        employee:
          this.generateCheckBox(cat.affilitationSocialSecurity, this.literals['catReport']['employee']),
        domesticEmployee:
          this.generateCheckBox(cat.affilitationSocialSecurity, this.literals['catReport']['domesticEmployee']),
        freelancer:
          this.generateCheckBox(cat.affilitationSocialSecurity, this.literals['catReport']['freelancer']),
        specialInsured:
          this.generateCheckBox(cat.affilitationSocialSecurity, this.literals['catReport']['specialInsured'])
      },
      areas:
      {
        urban:
          this.generateCheckBox(cat.area, this.literals['catReport']['urban']),
        rural:
          this.generateCheckBox(cat.area, this.literals['catReport']['rural'])
      },
      accidentType:
      {
        typical:
          this.generateCheckBox(cat.accidentType, this.literals['catReport']['typical']),
        route:
          this.generateCheckBox(cat.accidentType, this.literals['catReport']['route']),
        illness:
          this.generateCheckBox(cat.accidentType, this.literals['catReport']['illness'])
      },
      thereWasRemoval:
      {
        yes:
          this.generateCheckBox(cat.thereWasRemoval, this.literals['catReport']['yes']),
        no:
          this.generateCheckBox(cat.thereWasRemoval, this.literals['catReport']['no'])
      },
      laterality:
      {
        notApplicable:
          this.generateCheckBox(cat.laterality, this.literals['catReport']['notApplicable']),
        left:
          this.generateCheckBox(cat.laterality, this.literals['catReport']['left']),
        right:
          this.generateCheckBox(cat.laterality, this.literals['catReport']['right']),
        both:
          this.generateCheckBox(cat.laterality, this.literals['catReport']['both'])
      },
      police:
      {
        yes:
          this.generateCheckBox(cat.police, this.literals['catReport']['yes']),
        no:
          this.generateCheckBox(cat.police, this.literals['catReport']['no'])
      },
      thereWasDeath:
      {
        yes:
          this.generateCheckBox(cat.deathSign, this.literals['catReport']['yes']),
        no:
          this.generateCheckBox(cat.deathSign, this.literals['catReport']['no'])
      },
      thereWasHospitalization:
      {
        yes:
          this.generateCheckBox(cat.hospitalization, this.literals['catReport']['yes']),
        no:
          this.generateCheckBox(cat.hospitalization, this.literals['catReport']['no'])
      },
      removal:
      {
        yes:
          this.generateCheckBox(cat.removal, this.literals['catReport']['yes']),
        no:
          this.generateCheckBox(cat.removal, this.literals['catReport']['no'])
      }
    };
  }

  private generateCatPages(catInfo: Array<Cat>, printMode: string): Array<Object> {
    const bottomEdge = [true, false, true, true];
    const topEdge = [true, true, true, false];
    const retCatPages = [];

    catInfo.forEach(cat => {
      const fieldName = this.getFieldName();
      const emptyColumn = '';
      const fieldValue = this.getFieldValue(cat);

      const content = [
        this.generateLogo(retCatPages.length, printMode),
        {
          text: this.literals['catReport']['workAccidentReporting'],
          style: 'header',
        },
        {
          style: 'mainTable',
          table: {
            widths: [135, 220, '*'],
            body: [
              [
                this.generateSection(this.literals['catReport']['identificationDataSection'], 3),
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.emitter,
                emptyColumn,
                emptyColumn,
              ],
              [
                {
                  table: {
                    widths: [10, 150, 10, '*', 10, '*', 10, '*'],
                    body: [
                      [
                        fieldValue.emitter.serviceTaker.checkBox,
                        fieldValue.emitter.serviceTaker.label,
                        fieldValue.emitter.doctor.checkBox,
                        fieldValue.emitter.doctor.label,
                        fieldValue.emitter.syndicate.checkBox,
                        fieldValue.emitter.syndicate.label,
                        fieldValue.emitter.employer.checkBox,
                        fieldValue.emitter.employer.label,
                      ],
                      [
                        fieldValue.emitter.domesticEmployer.checkBox,
                        fieldValue.emitter.domesticEmployer.label,
                        fieldValue.emitter.worker.checkBox,
                        fieldValue.emitter.worker.label,
                        fieldValue.emitter.dependents.checkBox,
                        fieldValue.emitter.dependents.label,
                        fieldValue.emitter.publicAuthority.checkBox,
                        fieldValue.emitter.publicAuthority.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 3,
                },
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.catType,
                fieldName.catInitiative,
                fieldName.registrationSource,
              ],
              [
                {
                  table: {
                    body: [
                      [
                        fieldValue.catType.initial.checkBox,
                        fieldValue.catType.initial.label,
                        fieldValue.catType.reopening.checkBox,
                        fieldValue.catType.reopening.label
                      ],
                      [
                        fieldValue.catType.deathNotice.checkBox,
                        fieldValue.catType.deathNotice.label,
                        emptyColumn,
                        emptyColumn
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
                {
                  table: {
                    body: [
                      [
                        fieldValue.catInitiative.employerInitiative.checkBox,
                        fieldValue.catInitiative.employerInitiative.label,
                        fieldValue.catInitiative.courtOrder.checkBox,
                        fieldValue.catInitiative.courtOrder.label
                      ],
                      [
                        fieldValue.catInitiative.determinationSupervisoryBody.checkBox,
                        fieldValue.catInitiative.determinationSupervisoryBody.label,
                        emptyColumn,
                        emptyColumn
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
                {
                  table: {
                    body: [
                      [
                        fieldValue.registrationSource.eSocial.checkBox,
                        fieldValue.registrationSource.eSocial.label,
                      ],
                      [
                        fieldValue.registrationSource.catWeb.checkBox,
                        fieldValue.registrationSource.catWeb.label,
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
              ],
              [
                fieldName.catNumber,
                fieldName.originCatNumber,
                emptyColumn,
              ],
              [
                fieldValue.catNumber,
                fieldValue.originCatNumber,
                emptyColumn,
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: 'gray',
            vLineColor: 'gray',
          },
        },
        {
          style: 'mainTable',
          table: {
            widths: [100, 110, 100, 90, '*'],
            body: [
              [
                this.generateSection(this.literals['catReport']['emitterSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                this.generateSection(this.literals['catReport']['employerSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.corporateName,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.corporateName,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.employerType,
                emptyColumn,
                fieldName.registrationNumber,
                emptyColumn,
                fieldName.cnae,
              ],
              [
                {
                  table: {
                    body: [
                      [
                        fieldValue.employerType.cnpj.checkBox,
                        fieldValue.employerType.cnpj.label,
                        fieldValue.employerType.cno.checkBox,
                        fieldValue.employerType.cno.label,
                        fieldValue.employerType.caepf.checkBox,
                        fieldValue.employerType.caepf.label,
                        fieldValue.employerType.cpf.checkBox,
                        fieldValue.employerType.cpf.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
                fieldValue.registrationNumber,
                emptyColumn,
                fieldValue.cnae,
              ],
              [
                this.generateSection(this.literals['catReport']['injuredSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.name,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.name,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.cpf,
                fieldName.birthDate,
                fieldName.gender,
                fieldName.civilStatus,
                emptyColumn,
              ],
              [
                fieldValue.cpf,
                fieldValue.birthDate,
                {
                  table: {
                    body: [
                      [
                        fieldValue.gender.male.checkBox,
                        fieldValue.gender.male.label
                      ],
                      [
                        fieldValue.gender.female.checkBox,
                        fieldValue.gender.female.label,
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
                {
                  table: {
                    body: [
                      [
                        fieldValue.civilStatus.single.checkBox,
                        fieldValue.civilStatus.single.label,
                        fieldValue.civilStatus.married.checkBox,
                        fieldValue.civilStatus.married.label,
                        fieldValue.civilStatus.widower.checkBox,
                        fieldValue.civilStatus.widower.label
                      ],
                      [
                        fieldValue.civilStatus.divorced.checkBox,
                        fieldValue.civilStatus.divorced.label,
                        emptyColumn,
                        fieldValue.civilStatus.separeted.checkBox,
                        fieldValue.civilStatus.separeted.label,
                        emptyColumn,
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
              ],
              [
                fieldName.cbo,
                fieldName.affiliationSocialSecurity,
                emptyColumn,
                emptyColumn,
                fieldName.areas,
              ],
              [
                fieldValue.cbo,
                {
                  table: {
                    body: [
                      [
                        fieldValue.affiliationSocialSecurity.employee.checkBox,
                        fieldValue.affiliationSocialSecurity.employee.label,
                        fieldValue.affiliationSocialSecurity.domesticEmployee.checkBox,
                        fieldValue.affiliationSocialSecurity.domesticEmployee.label,
                        fieldValue.affiliationSocialSecurity.freelancer.checkBox,
                        fieldValue.affiliationSocialSecurity.freelancer.label,
                        fieldValue.affiliationSocialSecurity.specialInsured.checkBox,
                        fieldValue.affiliationSocialSecurity.specialInsured.label,
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 3,
                },
                emptyColumn,
                emptyColumn,
                {
                  table: {
                    body: [
                      [
                        fieldValue.areas.urban.checkBox,
                        fieldValue.areas.urban.label
                      ],
                      [
                        fieldValue.areas.rural.checkBox,
                        fieldValue.areas.rural.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
              ],
              [
                this.generateSection(this.literals['catReport']['accidentOrIllnessSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.accidentDate,
                fieldName.accidentTime,
                fieldName.workHour,
                fieldName.accidentType,
                emptyColumn,
              ],
              [
                fieldValue.accidentDate,
                fieldValue.accidentTime,
                fieldValue.workHour,
                {
                  table: {
                    body: [
                      [
                        fieldValue.accidentType.typical.checkBox,
                        fieldValue.accidentType.typical.label,
                        fieldValue.accidentType.route.checkBox,
                        fieldValue.accidentType.route.label,
                        fieldValue.accidentType.illness.checkBox,
                        fieldValue.accidentType.illness.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
              ],
              [
                fieldName.thereWasRemoval,
                fieldName.lastDayWorked,
                fieldName.accidentSite,
                emptyColumn,
                emptyColumn,
              ],
              [
                {
                  table: {
                    body: [
                      [
                        fieldValue.thereWasRemoval.yes.checkBox,
                        fieldValue.thereWasRemoval.yes.label,
                        fieldValue.thereWasRemoval.no.checkBox,
                        fieldValue.thereWasRemoval.no.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
                fieldValue.lastDayWorked,
                fieldValue.accidentSite,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.accidentSiteSpecification,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.accidentSiteSpecification,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.accidentSiteInscription,
                fieldName.uf,
                fieldName.accidentSiteCounty,
                emptyColumn,
                fieldName.country,
              ],
              [
                fieldValue.accidentSiteInscription,
                fieldValue.uf,
                fieldValue.accidentSiteCounty,
                emptyColumn,
                fieldValue.country,
              ],
              [
                fieldName.affectedBodyPart,
                emptyColumn,
                fieldName.causerAgent,
                emptyColumn,
                emptyColumn,
              ],
              [
                {
                  text: cat.affectedParts,
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
                fieldValue.causerAgent,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.laterality,
                emptyColumn,
                fieldName.descriptionGeneratingSituation,
                emptyColumn,
                emptyColumn,
              ],
              [
                {
                  table: {
                    body: [
                      [
                        fieldValue.laterality.notApplicable.checkBox,
                        fieldValue.laterality.notApplicable.label,
                        fieldValue.laterality.left.checkBox,
                        fieldValue.laterality.left.label,
                      ],
                      [
                        fieldValue.laterality.right.checkBox,
                        fieldValue.laterality.right.label,
                        fieldValue.laterality.both.checkBox,
                        fieldValue.laterality.both.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
                fieldValue.descriptionGeneratingSituation,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.thereWasPolice,
                emptyColumn,
                fieldName.thereWasDeath,
                emptyColumn,
                fieldName.deathDate,
              ],
              [
                {
                  table: {
                    body: [
                      [
                        fieldValue.police.yes.checkBox,
                        fieldValue.police.yes.label,
                        fieldValue.police.no.checkBox,
                        fieldValue.police.no.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
                {
                  table: {
                    body: [
                      [
                        fieldValue.thereWasDeath.yes.checkBox,
                        fieldValue.thereWasDeath.yes.label,
                        fieldValue.thereWasDeath.no.checkBox,
                        fieldValue.thereWasDeath.no.label,
                      ],
                    ],
                  },
                  border: bottomEdge,
                  colSpan: 2,
                },
                emptyColumn,
                fieldValue.deathDate,
              ],
              [
                fieldName.accidentObservation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                fieldName.receivingDate,
              ],
              [
                fieldValue.accidentObservation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                fieldValue.receivingDate,
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: 'gray',
            vLineColor: 'gray',
          },
        },
        {
          style: 'mainTable',
          table: {
            widths: [60, 60, 100, 90, '*'],
            body: [
              [
                this.generateSection(this.literals['catReport']['medicalCertificateInformationSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                this.generateSection(this.literals['catReport']['treatmentSection'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.serviceDate,
                fieldName.serviceTime,
                fieldName.thereWasHospitalization,
                fieldName.probableTreatmentDuration,
                fieldName.shouldInjuredPersonBeRemoval,
              ],
              [
                fieldValue.serviceDate,
                fieldValue.serviceTime,
                {
                  table: {
                    body: [
                      [
                        fieldValue.thereWasHospitalization.yes.checkBox,
                        fieldValue.thereWasHospitalization.yes.label
                      ],
                      [
                        fieldValue.thereWasHospitalization.no.checkBox,
                        fieldValue.thereWasHospitalization.no.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
                fieldValue.probableTreatmentDuration,
                {
                  table: {
                    body: [
                      [
                        fieldValue.removal.yes.checkBox,
                        fieldValue.removal.yes.label,
                      ],
                      [
                        fieldValue.removal.no.checkBox,
                        fieldValue.removal.no.label
                      ],
                    ],
                  },
                  border: bottomEdge,
                },
              ],
              [
                this.generateSection(this.literals['catReport']['lesion'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.injuryDescription,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.injuryDescription,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                this.generateSection(this.literals['catReport']['diagnosis'], 5),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.probableDiagnosis,
                emptyColumn,
                fieldName.cid10,
                fieldName.placeAndDate,
                emptyColumn,
              ],
              [
                fieldValue.probableDiagnosis,
                emptyColumn,
                fieldValue.cid10,
                fieldValue.placeAndDate,
                emptyColumn,
              ],
              [
                fieldName.doctorInformation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.doctorInformation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldName.diagnosticObservation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                fieldValue.diagnosticObservation,
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                this.generateFootnote(this.literals['catReport']['mandatoryCommunicationFootnote'], topEdge),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
              [
                this.generateFootnote(this.literals['catReport']['electronicallySignedFormFootnote'], bottomEdge),
                emptyColumn,
                emptyColumn,
                emptyColumn,
                emptyColumn,
              ],
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: 'gray',
            vLineColor: 'gray',
          },
        }
      ];

      retCatPages.push({
        catPageContent: content,
        metaDataCatPageContent: cat});
    });

    return retCatPages;
  }
}
