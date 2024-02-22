import { OnInit } from '@angular/core';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideTop', [
      transition(':enter', [
        group([
          query('.container', style({ transform: 'translateY(-100%)' })),
          query('.top', style({ height: 0 })),
        ]),
        group([
          query('.top', animate('0.2s ease-in-out', style({ height: '*' }))),
          query(
            '.container',
            animate('0.2s ease-in-out', style({ transform: 'translateY(0%)' }))
          ),
        ]),
      ]),
      transition(':leave', [
        group([
          query('.container', style({ transform: 'translateY(0%)' })),
          query('.top', style({ height: '*' })),
        ]),
        group([
          query('.top', animate('0.1s', style({ height: 0 }))),
          query(
            '.container',
            animate('0.1s', style({ transform: 'translateY(-100%)' }))
          ),
        ]),
      ]),
    ]),
  ],
})
export class ErrorMessageComponent {
  constructor() {}

  @Input() message = '';

  @Input() set shouldAnimate(value: boolean) {
    this.animationsDisabled = !value;
  }

  @HostBinding('@slideTop') animation = 'true';

  @HostBinding('@.disabled') animationsDisabled = false;
}
