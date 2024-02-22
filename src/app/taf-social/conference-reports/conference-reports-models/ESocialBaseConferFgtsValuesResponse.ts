import { ESocialBaseConferFgtsValues } from './ESocialBaseConferFgtsValues';

export class ESocialBaseConferFgtsValuesResponse {
  public items: Array<ESocialBaseConferFgtsValues>;
  public hasNext: boolean;
  public requestId: string;
  public differencesOnly: boolean;
}
