import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inss-report-progress',
  templateUrl: './inss-report-progress.component.html',
  styleUrls: ['./inss-report-progress.component.scss']
})
export class InssReportProgressComponent {

  @Input() progressBarValue;
  @Input() progressBarInfo;

}
