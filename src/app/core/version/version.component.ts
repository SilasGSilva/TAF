import { Component, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent {

  public version: string;

  @ViewChild(PoModalComponent, { static: true }) versionModal: PoModalComponent;

  public show(version: string): void {
    this.version = version;
    this.versionModal.open();
  }

}
