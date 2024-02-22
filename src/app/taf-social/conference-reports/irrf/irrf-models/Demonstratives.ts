import { IRValueTypes } from "./IRValueTypes";
import { IrrfRetentions } from "./IrrfRetentions";

export interface Demonstratives {
  demonstrativeId: string;
  category: string;
  referencePeriod: string;
  origin: string;
  payday: string;
  irrfRetention: IrrfRetentions;
  typesIrrfValues?: IRValueTypes;
}
