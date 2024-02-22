import { LaborProcess } from "../../../app/models/labor-process.model";
import { TotvsPage } from "../../../app/models/labor-process.model";
import { Observable } from "rxjs";

export class LaborProcessServiceMock {
  get(
    pageSize: number,
    page: number,
    nrProcTrab?: string,
    cpfTrab?: string,
  ): Observable<TotvsPage<any>> {
    return;
  }

  getSimple(id: string): Observable<TotvsPage<any>> {
    return;
  }

  update(id: string, hasNext: boolean, items: any[]): Observable<TotvsPage<LaborProcess>> {
    return;
  }

  delete(id: string): Observable<any> {
    return;
  }

  post(hasNext: boolean, items: any[]): Observable<any> {
    return;
  }
}
