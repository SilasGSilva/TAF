import { Component, OnInit } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

import { LiteralService } from '../i18n/literal.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menu: Array<PoMenuItem>;
  public subItemsTsi: Array<PoMenuItem>;
  public literals: object;
  public menuContext: string = '';
  public menuTsi: string = '';
  public menuSv: string = '';
  public isDatasul: boolean;
  public isRM: boolean;

  constructor(private literalsService: LiteralService) {
    this.literals = this.literalsService.literalsCore;
  }

  async ngOnInit() {
    await this.checkSession();
    (this.isDatasul || this.isRM  )? (this.menuContext = 'marcas') : this.menuContext;
    this.menuContext ? this[this.menuContext]() : this.allMenus();
  }

  public async checkSession() {
    const erpAppConfig = JSON.parse(sessionStorage.getItem('ERPAPPCONFIG'));
    this.isDatasul = erpAppConfig.productLine.toLowerCase() === 'datasul';
    this.isRM = erpAppConfig.productLine.toLowerCase() === 'rm';
    this.menuContext = sessionStorage.getItem('TAFContext');
    this.menuTsi = sessionStorage.getItem('TAFTsi');
    this.menuSv = sessionStorage.getItem('TAFSv');
  }

  public lalurlacs(): void {
    this.menu = [
      { label: this.literals['menu']['lalur'], link: '/lalur' },
      { label: this.literals['menu']['lacs'], link: '/lacs' },
    ];
  }

  public reinf(): void {

    this.menu = [
      { label: this.literals['menu']['dashboard'] , link: '/eventsMonitor' },
      { label: this.literals['menu']['report']    , link: '/eventsReport' },
    ];

    if (this.menuTsi === 'tsi' || !this.menuTsi){
      this.subItemsTsi  = [
        { label: this.literals['menu']['errorIntegration']  , link: '/tsiMonitor' },
        { label: this.literals['menu']['divergentDocuments'], link: '/tsiDivergentDocuments' }
      ]
      this.menu.push({ label: this.literals['menu']['tsiMonitor'], subItems: this.subItemsTsi });
    }

    if (this.menuSv === 'smartview') {
      this.menu.push({ label: this.literals['menu']['smartView'], link: '/smartViewMonitor' });
    }
  }

  public esocial(): void {
    this.menu = [
      { label: this.literals['menu']['dashboardSocial'], link: '/socialMonitor' },
      { label: this.literals['menu']['socialAudit'], link: '/socialAudit' },
      { label: this.literals['menu']['reports'],
        subItems: [
          { label: this.literals['menu']['conferenceReportInss'], link: '/inssReport' },
          { label: this.literals['menu']['conferenceReportIrrf'], link: '/irrfReport' },
          { label: this.literals['menu']['conferenceReportFgts'], link: '/fgtsReport' },
          { label: this.literals['menu']['socialCat'], link: '/socialCat' },
        ]
      }
    ];
  }

  public gpe(): void {
    this.menu = [
      { label: this.literals['menu']['dashboardSocial'], link: '/socialMonitor' },
      { label: this.literals['menu']['conferenceReportInss'], link: '/inssReport' },
      { label: this.literals['menu']['conferenceReportIrrf'], link: '/irrfReport' },
      { label: this.literals['menu']['conferenceReportFgts'], link: '/fgtsReport' },
    ];
  }

  public marcas(): void {
    this.menu = [
      { label: this.literals['menu']['conferenceReportInss'], link: '/inssReport' },
      { label: this.literals['menu']['conferenceReportIrrf'], link: '/irrfReport' },
      { label: this.literals['menu']['conferenceReportFgts'], link: '/fgtsReport' },
    ];
  }

  public editorXML(): void {
    this.menu = [
      { label: this.literals['menu']['editorXML'], link: '/editorXML' },
    ];
  }

  public allMenus() {
    this.menu = [
      { label: this.literals['menu']['dashboard'], link: '/eventsMonitor' },
      { label: this.literals['menu']['report'], link: '/eventsReport' },
      { label: this.literals['menu']['tsiMonitor'], link: '/tsiMonitor' },
      { label: this.literals['menu']['smartView'], link: '/smartViewMonitor' },
      { label: this.literals['menu']['dashboardSocial'], link: '/socialMonitor' },
      { label: this.literals['menu']['conferenceReportInss'], link: '/inssReport' },
      { label: this.literals['menu']['conferenceReportIrrf'], link: '/irrfReport' },
      { label: this.literals['menu']['conferenceReportFgts'], link: '/fgtsReport' },
      { label: this.literals['menu']['lalur'], link: '/lalur' },
      { label: this.literals['menu']['lacs'], link: '/lacs' },
    ];
  }


}
