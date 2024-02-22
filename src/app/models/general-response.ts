import { Events } from './events';
import { EventsNotPeriodics } from './events-not-periodics';
import { Totalizer } from './totalizer';

export interface GeneralResponse {
  eventsReinf: Array<Events>;
  eventsReinfTotalizers: Array<Totalizer>;
  eventsReinfNotPeriodics: Array<EventsNotPeriodics>;
  statusPeriod2099: string;
  protocol2099: string;
  statusPeriod4099: string;
  protocol4099: string;
}
