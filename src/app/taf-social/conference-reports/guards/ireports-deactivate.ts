export interface IReportsCanDeactivate {
  dataSave?: () => boolean;
  dataSaveDialog?: () => void;
  discardReport: () => boolean;
  discardReportDialog: () => void;
}
