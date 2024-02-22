import { Component, Input } from '@angular/core';

import { PoBreadcrumbItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {

  @Input('taf-stepperItems') stepperItems: Array<PoBreadcrumbItem>;
  constructor() { }

}
