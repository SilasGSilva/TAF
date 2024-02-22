import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cat-progress',
  templateUrl: './cat-progress.component.html'
})
export class CatProgressComponent {
  @Input() progressBarValue;
  @Input() progressBarInfo;
}
