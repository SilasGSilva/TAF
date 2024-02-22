import { TsiErrorItem } from "./tsi-error-item";

export interface TsiIntegrationErrorsResponse {
  items: Array<TsiErrorItem>;
  hasNext: boolean;
  remainingRecords: number;
}
