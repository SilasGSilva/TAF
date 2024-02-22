import { Observable, of } from 'rxjs';

export class InfoValoresStateServiceMock {
  state$: Observable<any> = of();

  getData(): any[] {
    return [];
  }

  setData(infoValores: any[]): void {
    return;
  }

  resetData(): void {
    return;
  }
}
