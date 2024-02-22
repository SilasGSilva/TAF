import { Monitoring } from './monitoring';

export interface Events {
  event: string;
  descriptionEvent: string;
  monitoring: Array<Monitoring>;
  total: number;
  totalInvoice: number;
  totalValidation: number;
  totalMonitoring: number;
  statusMonitoring: number;
  totalNotValidation: number;
  typeEvent: number;
  metrics: string;
}
