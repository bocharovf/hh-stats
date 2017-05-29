export interface DictionaryResponse {
    experience: ExperienceItem[];
    currency: CurrencyItem[];
}
/**
 * Currency item
 */
export interface CurrencyItem {
    code: string;
    rate: number;
}
/**
 * Experience item
 */
export interface ExperienceItem {
    id: string;
    name: string;
}
