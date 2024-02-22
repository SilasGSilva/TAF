import {
  Component,
  OnInit,
  Input,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { Md5 } from 'md5-typescript';
import { Router } from '@angular/router';

import {
  PoNotificationService,
  PoModalComponent,
  PoModalAction,
} from '@po-ui/ng-components';

import { LiteralService } from 'core/i18n/literal.service';
import { EditorXmlService } from './editor-xml.service';
import { GetXmlEditRequest } from './editor-xml-models/GetXmlEditRequest';
import { SaveXmlEditRequest } from './editor-xml-models/SaveXmlEditRequest';

@Component({
  selector: 'app-editor-xml',
  templateUrl: './editor-xml.component.html',
  styleUrls: ['./editor-xml.component.scss'],
})
export class EditorXMLComponent implements OnInit {
  public modalDetailMessage: string;
  public errorDetail: string;
  public seeMore: string;
  public pageLink = '/editorXML';
  public menuContext = sessionStorage['TAFContext'];
  public companyId = this.editorXmlService.getCompany();
  public modalTitle: string;
  public isMonitorSocial: boolean;
  public isButtonSaveDisabled = true;
  public featContext: Array<string>;
  public company = JSON.parse(sessionStorage['TAFCompany']);
  public literals = {};
  public close: PoModalAction;
  public isTAFFull: boolean;

  @Input() tafEditOnContainer = false;
  @Input() showStatusMessage = false;
  @Input('isEditXml') editXml: boolean;
  @Input('xmlMessage') messageXml: string;
  @Input() code = '';
  @Input() hashCode = '';
  @Input('isReadOnly') isReadOnly: boolean;
  @Output() successMessage = new EventEmitter();
  @Output() errorMessage = new EventEmitter();
  @Output() emitStatusMessage = new EventEmitter();
  @ViewChild(PoModalComponent, { static: true })
  modalMessage: PoModalComponent;

  constructor(
    private literalsService: LiteralService,
    private editorXmlService: EditorXmlService,
    private notification: PoNotificationService,
    private router: Router
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit() {
    this.isTAFFull = JSON.parse(sessionStorage.getItem('TAFFull'));

    this.verifyContext();
    if ('editorXML' === sessionStorage.getItem('TAFContext')) {
      this.getXMLEdit();
    }

    this.close = {
      action: () => {
        this.closeModal();
      },
      label: this.literals['editorXML']['close'],
      danger: false,
    };
  }

  public verifyContext(): void {
    if (!this.editorXmlService.isDatasul) {
      this.isMonitorSocial =
        (this.router.url.match(/monitorDetail/) &&
          this.menuContext !== 'editorXML') ||
        (this.router.url.match(/editorXML/) &&
          this.menuContext === 'editorXML');
    }
  }

  public getXMLEdit(): void {
    this.featContext = JSON.parse(sessionStorage['TAFBusiness']);
    const params: GetXmlEditRequest = {
      companyId: this.companyId,
      id: this.featContext['eSocialXmlId'],
    };

    this.editorXmlService.getXmlEdit(params, this.menuContext, this.isTAFFull).subscribe(
      payload => {
        this.code = this.prettifyXml(atob(payload.xmlMessage));
        this.hashCode = Md5.init(this.code);
      },
      error => {
        this.notification.error(error);
      }
    );
  }

  public getPageLink(): string {
    return this.pageLink;
  }

  public onEditXml(): void {
    this.isButtonSaveDisabled = this.hashCode === Md5.init(this.code);
  }

  public saveXml(): void {
    this.featContext = JSON.parse(sessionStorage['TAFBusiness']);
    const params: SaveXmlEditRequest = {
      companyId: this.companyId,
      id: this.featContext['eSocialXmlId'],
      user: sessionStorage['TAFUser'],
      xmlMessage: btoa(this.code),
    };

    this.editorXmlService.saveXmlEdit(params, this.menuContext).subscribe(
      response => {
        if (this.menuContext !== 'editorXML') {
          response.success
            ? this.emitSuccessMessage(response.message)
            : this.emitErrorMessage(response.message);
        } else {
          response.success
            ? this.setModalSuccessMessage(response.message)
            : this.setModalErrorMessage(response.message);
          this.openModal();
        }
      },
      error => {
        this.setServerError(error);
        this.openModal();
      }
    );
  }

  public prettifyXml(sourceXml: string): string {
    const xmlDoc = new DOMParser().parseFromString(
      sourceXml,
      'application/xml'
    );
    const xsltDoc = new DOMParser().parseFromString(
      [
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">',
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'),
      'application/xml'
    );

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    const resultXml = new XMLSerializer().serializeToString(resultDoc);

    return resultXml;
  }

  public emitSuccessMessage(message: string): void {
    const success = {
      title: this.literals['editorXML']['xmlEditorSuccessMessage'],
      statusMessage: message,
      isEditXml: !this.editXml,
    };
    this.showStatusMessage = false;
    this.successMessage.emit(success);
  }

  public emitErrorMessage(message: string): void {
    const error = {
      title: this.literals['editorXML']['xmlEditorFailureMessage'],
    };

    this.setErrorMessage(message);
    this.errorMessage.emit(error);
  }

  public setErrorMessage(message: string): void {
    this.errorDetail = message;
    this.seeMore = this.literals['editorXML']['seeMore'];
    this.showStatusMessage = true;
    this.emitStatusMessage.emit(this.showStatusMessage);
  }

  public setModalSuccessMessage(message: string): void {
    this.modalTitle = this.literals['editorXML']['xmlEditorSuccessMessage'];
    this.modalDetailMessage = message;
  }

  public setModalErrorMessage(message: string): void {
    this.modalTitle = this.literals['editorXML']['xmlEditorFailureMessage'];
    this.modalDetailMessage = message;
  }

  public openModal(): void {
    this.modalMessage.open();
  }

  public closeModal(): void {
    this.modalMessage.close();
  }

  public setServerError(message: Object): void {
    this.modalTitle = this.literals['editorXML'][
      'xmlEditorServerFailureMessage'
    ];
    this.modalDetailMessage = message['error']['message'];
  }

  public setErrorModal(): void {
    this.modalTitle = this.literals['editorXML']['detailErrors'];
    this.modalDetailMessage = this.errorDetail;
    this.openModal();
  }
}
