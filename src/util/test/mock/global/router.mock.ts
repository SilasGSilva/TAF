import { NavigationExtras, NavigationStart } from '@angular/router';
import { of } from 'rxjs';

export class RouterMock {
  public static navigated = false;
  public static url: string;
  public events = of(new NavigationStart(0, 'http://localhost:4200/home'));

  get url() {
    return 'http://localhost:4200/new';
  }

  public initialNavigation(): void { }

  public navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      RouterMock.navigated = true;
      resolve(true);
    });
  }

  public navigateByUrl(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      RouterMock.navigated = true;
      resolve(true);
    });
  }
}
