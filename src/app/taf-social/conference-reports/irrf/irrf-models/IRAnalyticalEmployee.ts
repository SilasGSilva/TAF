import { IRValueTypes } from "./IRValueTypes";

export interface IRAnalyticalEmployee {
  cpfNumber: string;
  name: string;
  demonstrativeId: Array<string>;
  typesIrrfValues: IRValueTypes;
}