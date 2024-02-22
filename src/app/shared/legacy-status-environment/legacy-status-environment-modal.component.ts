import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { ElementRef } from '@angular/core';
import { PoTagComponent, PoButtonComponent } from '@po-ui/ng-components';
import { LiteralService } from '../../core/i18n/literal.service';
import { LegacyStatusEnvironmentSocial } from '../../models/legacy-status-environment-social';
import { LegacyStatusEnvironmentSocialModal } from '../../models/legacy-status-environment-social-modal';

@Component({
  selector: 'app-legacy-status-environment-modal',
  templateUrl: './legacy-status-environment-modal.component.html',
  styleUrls: ['./legacy-status-environment-modal.component.scss'],
})
export class LegacyStatusEnvironmentModalComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true })
  legacyStatusEnvironment: PoModalComponent;

  @ViewChild('popoverPoTag', { read: ElementRef, static: true }) poTag: ElementRef;

  public title = '';
  public tribute = '';
  public primaryAction: PoModalAction;
  public legacyStatus: LegacyStatusEnvironmentSocial = {
    isConfigured: false,
    isAvailable: false,
    inssIsUpToDate: false,
    fgtsIsUpToDate: false,
    irrfIsUpToDate: false,
    apiReturnError: null,
  };

  public readonly literals = {};

  constructor(private literalsService: LiteralService) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.primaryAction = {
      action: () => {
        this.legacyStatusEnvironment.close();
      },
      label: this.literals['systemInfos']['close'],
    };
  }

  public openModal({
    status,
    tribute,
  }: LegacyStatusEnvironmentSocialModal): void {
    this.legacyStatus = status;
    this.tribute = tribute;

    this.legacyStatusEnvironment.open();
  }

  public openLink(): void {
    const documentationLink: string =
      this.tribute === '1'
        ? 'https://tdn.totvs.com/pages/viewpage.action?pageId=528452133'
        : this.tribute === '2'
            ? 'https://tdn.totvs.com/pages/viewpage.action?pageId=528452163'
            : 'https://tdn.totvs.com/pages/viewpage.action?pageId=781873283';

    window.open(documentationLink, '_blank');
  }
}
