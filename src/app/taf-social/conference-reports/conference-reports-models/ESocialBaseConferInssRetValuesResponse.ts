import { ESocialBaseConferInssRetValues } from './ESocialBaseConferInssRetValues';

export class ESocialBaseConferInssRetValuesResponse {
  public items: ESocialBaseConferInssRetValues<number, boolean>[];
  public hasNext: boolean;
}
