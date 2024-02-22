import { TsiDivergentDocumentsItemBody } from "./tsi-divergent-documents-item-body";

export interface TsiDivergentDocumentsBody {
  reprocessAll: boolean;
  itemsV5R: Array<number>;
  itemsSFT: Array<TsiDivergentDocumentsItemBody>;
}
