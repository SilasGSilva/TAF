import { IRInfo } from "./IRInfo";
import { IrrfRetentions } from "./IrrfRetentions";

export interface IRAnalyticalInfo {
  total: IrrfRetentions;
  items: Array<IRInfo>;
}