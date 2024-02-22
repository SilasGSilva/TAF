import { Demonstratives } from './Demonstratives';
import { IRValueTypes } from './IRValueTypes';
import { IrrfRetentions } from './IrrfRetentions';

export interface Employees {
  cpfNumber: string;
  name: string;
  period: string;
  demonstrative?: Array<Demonstratives>;
  totalDemonstratives?: {
    demonstrative: Array<string>;
    typesIrrfValues: IRValueTypes;
  }
  totalIrrfRetention: IrrfRetentions;
  divergent: boolean;
  warning: boolean;
}
