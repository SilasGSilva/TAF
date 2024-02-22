import { Motive } from './Motive';

export interface MotiveResponse {
  items: Array<Motive>;
  hasNext: boolean;
}
