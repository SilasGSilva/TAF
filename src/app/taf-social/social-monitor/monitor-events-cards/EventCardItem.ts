import { EventCardItemStatus } from './EventCardItemStatus';

export interface EventCardItem {
  eventCode: string;
  eventDescription: string;
  total: number;
  status: EventCardItemStatus[];
  checked?: boolean;
}
