import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audit-progress',
  templateUrl: './audit-progress.component.html'
})
export class AuditProgressComponent {
  @Input() progressBarValue;
  @Input() progressBarInfo;
}
