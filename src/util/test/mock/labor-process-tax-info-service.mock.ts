import { SimpleProcessTax, ProcessTax, ProcessWorker } from "../../../app/models/labor-process-taxes.model";
import { TotvsPage } from "../../../app/models/labor-process.model";
import { Observable } from "rxjs";

export class LaborProcessTaxInfoServiceMock {
  public getAll(
    page: number,
    pageSize: number,
    nrProcTrab: string = '',
    perApurPagto: string = '',
  ): Observable<TotvsPage<SimpleProcessTax>> {
    return;
  }

  public get(id: string): Observable<TotvsPage<ProcessTax>> {
    return;
  }


  public create(processTax: ProcessTax): Observable<TotvsPage<ProcessTax>> {
    return;
  }

  public edit(id: string, processTax: ProcessTax): Observable<TotvsPage<ProcessTax>> {
    return;
  }

  public delete(id: string): Observable<TotvsPage<ProcessTax>> {
    return;
  }

  public getProcessWorkers(nrProcTrab: string): Observable<TotvsPage<ProcessWorker>> {
    return;
  }
}
