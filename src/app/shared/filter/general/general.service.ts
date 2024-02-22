import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'core/services/http.service';
import { General } from '../../../models/general';
import { GeneralResponse } from '../../../models/general-response';
import { ReinfEventsResponse } from './../../../models/reinfEvents-response';
import { ReinfEvents } from './../../../models/reinfEvents';
import { HttpCacheService } from 'core/services/http-cache.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService extends HttpCacheService<ReinfEvents,ReinfEventsResponse>  {
  public inputPeriod: string;
  public inputStatus: number;
  public inputGroup: number = 1;
  public inputEventType: Array<number>;
  private readyBloc40: boolean = false;

  constructor(protected injector: Injector,protected http: HttpService) {
    super(injector);
  }

  public getReinfEvents(params:ReinfEvents) : Observable<ReinfEventsResponse>{
    return this.http.get('/api/taf/reinf/v1/reinfEvents',params);
  }

  public getFilterDashboard(payload: General): Observable<GeneralResponse> {
    return this.http.get('/wstaf001', payload);
  }

  public setInputPeriodMonitor(inputPeriod: string): void {
    sessionStorage.setItem('period_monitor', inputPeriod);
    this.inputPeriod = inputPeriod;
  }

  public getInputPeriodMonitor(): string {
      return sessionStorage.getItem('period_monitor') ? sessionStorage.getItem('period_monitor') : this.inputPeriod;
  }

  public setInputStatusMonitor(inputStatus: number): void {
    sessionStorage.setItem('status_monitor', inputStatus.toString());
    this.inputStatus = inputStatus;
  }

  public getInputStatusMonitor(): number {
    var stringStatus = sessionStorage.getItem('status_monitor');
    var numberStatus = this.inputStatus;
    if (stringStatus == null || stringStatus == "null"){
      numberStatus = 0;
    } else {
      numberStatus = parseInt(stringStatus);
    }
      return numberStatus ? numberStatus : this.inputStatus;
  }

  public setInputGroupMonitor(inputGroup: number): void {
    sessionStorage.setItem('taf_group_monitor', inputGroup.toString());
    this.inputGroup = inputGroup;
  }

  public setReadyBloc40(readyBloc40: boolean): void {
    this.readyBloc40 = readyBloc40;
  }

  public getReadyBloc40(): boolean {
    return this.readyBloc40;
  }

  public getInputGroupMonitor(): number {
    var sessionGroup: string = sessionStorage.getItem('taf_group_monitor');
    var groupType: number = this.inputGroup;

    if(sessionGroup == null || sessionGroup == "null") {
      groupType = 1;
    } else {
      groupType = parseInt(sessionGroup);
    }

    return groupType ? groupType : this.inputGroup;
  }

  public setInputEventTypeMonitor(inputEventType: Array<number>): void {
    sessionStorage.setItem('eventType_monitor', JSON.stringify(inputEventType) );
    this.inputEventType = inputEventType;
  }

  public getInputEventTypeMonitor(): Array<number> {
    var arrayEvents = JSON.parse(sessionStorage.getItem("eventType_monitor"));
    return arrayEvents;
  }

  public clearLogValidation(): void {
    //Caso exista, removo da session storage o item TAFLogValidation para desativar o botão de Erro/Alerta
    if(sessionStorage.getItem('TAFLogValidation')){
      sessionStorage.removeItem('TAFLogValidation');
    }
  }
}
