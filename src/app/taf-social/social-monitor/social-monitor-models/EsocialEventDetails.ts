import { HeaderEsocialEventDetails } from './HeaderEsocialEventDetails';
import { ItemsEsocialEventDetails } from './ItemsEsocialEventDetails';

export interface EsocialEventDetails {
    header: Array<HeaderEsocialEventDetails>;
    items: Array<ItemsEsocialEventDetails>;
    hasNext: boolean;
}
