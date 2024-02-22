import { ReportAnalytic } from './report-analytic';
import { ReportSinteticValue } from './report-sintetic-value';

export interface ReportSinteticItems {
  analytic: Array<ReportAnalytic>;
  sinteticValue: Array<ReportSinteticValue>;
}
