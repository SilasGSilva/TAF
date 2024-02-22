import { Component, OnInit } from '@angular/core';
import { LiteralService } from '../../../core/i18n/literal.service';
import { SocialStatusEnvironmentResponse } from '../../../taf-social/models/social-status-environment-response';
import { SocialStatusEnvironmentService } from '../../services/social-status-environment/social-status-environment.service';
import { SocialMonitorService } from '../social-monitor.service';

@Component({
  selector: 'app-monitor-status-environment',
  templateUrl: './monitor-status-environment.component.html',
  styleUrls: ['./monitor-status-environment.component.scss'],
})
export class MonitorStatusEnvironmentComponent implements OnInit {
  public statusEnvironment: SocialStatusEnvironmentResponse;
  public readonly literals: object;

  constructor(
    private socialStatusEnvironmentService: SocialStatusEnvironmentService,
    private literalsService: LiteralService,
    private socialMonitorService: SocialMonitorService
  ) {
    this.literals = this.literalsService.literalsTafSocial;
  }

  ngOnInit(): void {
    this.getSocialStatusEnvironment();
  }

  private getSocialStatusEnvironment(): void {
    this.socialStatusEnvironmentService
      .getSocialStatusEnvironment({
        companyId: this.socialMonitorService.getCompany(),
      })
      .toPromise()
      .then(response => (this.statusEnvironment = response));
  }
}
