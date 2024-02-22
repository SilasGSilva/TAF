import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VersionComponent } from './../../../../core/version/version.component';
import { LiteralService } from './../../../../core/i18n/literal.service';
import { PoToolbarAction } from '@po-ui/ng-components';

const ERPAPPCONFIG = 'ERPAPPCONFIG';

@Component({
  selector: 'app-sv-header',
  templateUrl: './sv-header.component.html',
  styleUrls: ['./sv-header.component.scss']
})
export class SmartViewHeaderComponent implements OnInit {
  public literals = {};
  public profileActions: Array<PoToolbarAction>;

  @Input('sv-headerTitle') headerTitle: string;

  @ViewChild(VersionComponent, { static: true }) versionModal: VersionComponent;

  constructor(private router: Router,
    private literalService: LiteralService) {
    this.literals = this.literalService.literalsTafFiscal;
  }

  ngOnInit(): void {
    this.profileActions = [
      {
        icon: 'po-icon po-icon-info',
        label: this.literals['tsiHeader']['about'],
        separator: true,
        action: () => {
          const proAppConfig = JSON.parse(sessionStorage.getItem(ERPAPPCONFIG));
          this.openVersionModal(proAppConfig.tafVersion);
        }
      }
    ];

    this.profileActions.push({
      icon: 'po-icon-exit',
      label: this.literals['tsiHeader']['exit'],
      type: 'danger',
      separator: true,
      action: () => this.logout()
    });
  }

  public openVersionModal(version:string){
    this.versionModal.show(version);
  }

  private logout(): void {
    if (this.isEmbeded()) {
      window['totvstec'].jsToAdvpl('close', 'force');
    } else {
      this.browseLogout();
    }
  }

  private browseLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  public isEmbeded() {
    return typeof window['totvstec'] !== 'undefined';
  }
  
}
