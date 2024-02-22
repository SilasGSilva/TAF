import { Observable, of } from 'rxjs';

export class DedSuspStateServiceMock {
  state$: Observable<any> = of();

  getData(): any[] {
    return [];
  }

  setData(dedSusp: any[]): void {
    return;
  }

  resetData(): void {
    return;
  }
}
