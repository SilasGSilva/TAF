import { ReportFilterItemTable } from './report-filter-item-table';

export interface ReportListingResponse {
  descriptionEvent: string;
  hasNext: boolean;
  eventDetail: Array<ReportFilterItemTable>;
}
