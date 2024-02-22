import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoBreadcrumbItem, PoToolbarAction } from '@po-ui/ng-components';
import { LiteralService } from '../i18n/literal.service';
import { VersionComponent } from '../version/version.component';

const ERPAPPCONFIG = 'ERPAPPCONFIG';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public notificationActions: Array<PoToolbarAction>;
  public notificationNumber: number;
  public literals: object;
  public profileActions: Array<PoToolbarAction>;
  public breadItems = new Array<PoBreadcrumbItem>();
  public isContextEsocial = false;
  public isContextMarcas = false;
  public isSocialMonitor = false;

  @Input() showHeaderTitle: boolean;
  @Input() headerTitle: string;
  @Input() showHeaderBreadCrumb: boolean;
  @Input() headerBreadCrumbLabel: string;
  @Input() headerBreadCrumbLink: string;
  @Input() headerBreadCrumbLabel2: string;
  @Input() headerBreadCrumbLink2: string;
  @Input() disabledInputs = false;

  @ViewChild(VersionComponent, { static: true }) versionModal: VersionComponent;

  constructor(private literalsService: LiteralService, private router: Router) {
    this.literals = this.literalsService.literalsCore;
  }

  ngOnInit(): void {
    this.isSocialMonitor = this.router.url.includes('/socialMonitor') || this.router.url.includes('/monitorDetail');
    this.isContextEsocial = sessionStorage.getItem('TAFContext') === 'esocial';
    this.isContextMarcas =
      ['rm', 'datasul'].indexOf(
        JSON.parse(
          sessionStorage.getItem('ERPAPPCONFIG')
        ).productLine.toLowerCase()
      ) >= 0 || sessionStorage.getItem('TAFContext') === 'marcas';

    this.profileActions = [
      {
        icon: 'po-icon po-icon-info',
        label: 'Sobre',
        separator: true,
        action: () => {
          const proAppConfig = JSON.parse(sessionStorage.getItem(ERPAPPCONFIG));
          this.versionModal.show(proAppConfig.tafVersion);
        },
      },
    ];

    this.profileActions.push({
      icon: 'po-icon-exit',
      label: this.literals['header']['exit'],
      type: 'danger',
      separator: true,
      action: () => this.logout(),
    });

    this.addBreadItems();
  }

  private logout(): void {
    const totvstec = 'totvstec';
    const twebchannel = 'twebchannel';

    if (window[totvstec]?.gotConnection) {
      this.execClose(totvstec);
    } else if (window[twebchannel]?.gotConnection) {
      this.execClose(twebchannel);
    } else {
      this.browseLogout();
    }
  }

  private browseLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  private addBreadItems(): void {
    this.breadItems.push({
      label: this.literals['header']['home'],
      link: '/socialMonitor',
    });

    this.breadItems.push({
      label: this.headerBreadCrumbLabel,
    });

    if (this.headerBreadCrumbLabel2 !== undefined) {
      this.breadItems.push({
        label: this.headerBreadCrumbLabel2,
      });
    }
  }

  private execClose(channel: string): void {
    if (this.disabledInputs) {
      if (confirm(this.literals['header']['tafDiscardReport'])) {
        window[channel].jsToAdvpl('close', 'force');
      }
    } else {
      window[channel].jsToAdvpl('close', 'force');
    }
  }
}
