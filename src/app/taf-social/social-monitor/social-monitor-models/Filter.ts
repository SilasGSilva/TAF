export interface Filter {
  companyId: string;
  branches: Array<string>;
  events: Array<string>;
  period: string;
  motiveCode?: Array<string>;
}
