import { StatusLabel } from './StatusLabel';

export interface HeaderEsocialEventDetails {
  property: string;
  label: string;
  type: string;
  width?: string;
  visible?: boolean;
  labels?: Array<StatusLabel>;
}
