export class EsocialMonitorHomeCardsRequest {
  public companyId: string;
  public branches: Array<string>;
  public events: Array<string>;
  public period: string;
  public periodTo?: string;
  public periodFrom?: string;
  public motiveCode?: Array<string>;
  public filterStatus?: Array<string>;
  public eventGroups?: Array<string>;
}
