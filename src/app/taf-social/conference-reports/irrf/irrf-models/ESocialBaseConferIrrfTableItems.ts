import { Demonstratives } from './Demonstratives';

export interface ESocialBaseConferIrrfTableItems {
  cpfNumber: string;
  name: string;
  period: string;
  tafValue: number;
  erpValue: number;
  retValue: number;
  divergent: string;
  warning: string;
  demonstrative: Array<Demonstratives>
}
