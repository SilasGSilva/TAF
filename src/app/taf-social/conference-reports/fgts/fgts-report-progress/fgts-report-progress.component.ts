import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fgts-report-progress',
  templateUrl: './fgts-report-progress.component.html',
  styleUrls: ['./fgts-report-progress.component.scss']
})
export class FgtsReportProgressComponent {

  @Input() progressBarValue;
  @Input() progressBarInfo;

}
