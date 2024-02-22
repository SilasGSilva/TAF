import { Monitoring } from './monitoring';

export interface EventsNotPeriodics {
  event: string;
  descriptionEvent: string;
  monitoring: Array<Monitoring>;
  total: number;
  totalValidation: number;
  totalMonitoring: number;
  statusMonitoring: number;
  totalNotValidation: number;
  typeEvent: number;
  metrics: string;
}
