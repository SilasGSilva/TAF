import { EventErrorMessageResponse } from './event-error-message-response';

export interface EventErrorsMessageResponse {
  errorTransmission: Array<EventErrorMessageResponse>;
}
