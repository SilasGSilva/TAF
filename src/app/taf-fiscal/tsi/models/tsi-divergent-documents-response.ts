import { TsiDivergentDocumentsItem } from './tsi-divergent-documents-item';

export interface TsiDivergentDocumentsResponse {
  items: Array<TsiDivergentDocumentsItem>;
  hasNext: boolean;
  remainingRecords: number;
}
