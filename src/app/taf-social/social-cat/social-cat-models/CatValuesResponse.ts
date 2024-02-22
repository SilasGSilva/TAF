import { Cat } from "./Cat";

export interface CatValuesResponse {
    items: Array<Cat>;
    hasNext: boolean;
}
