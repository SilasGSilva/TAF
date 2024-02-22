import { ItemsEsocialEventDetailsColumns } from './ItemsEsocialEventDetailsColumns';

export interface ItemEsocialEventDetail {
    key: string;
    hasError: boolean;
    columns: Array<ItemsEsocialEventDetailsColumns>;
}
