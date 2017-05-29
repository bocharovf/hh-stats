import { CurrencyItem } from './response/DictionaryResponse';
/**
 * Support currency convertion
 */
export interface CurrencyConverter {
    convert(value: number, from: string, to: string): number;
}
/**
 * Simple currency converter based on list of currencies and rates
 */
export declare class DictCurrencyConverter implements CurrencyConverter {
    dict: CurrencyItem[];
    private rates;
    /**
     *
     * @param dict list of currency items
     */
    constructor(dict: CurrencyItem[]);
    /**
     * Convert value from original currency to target currency
     * @param value value to convert
     * @param from original currency
     * @param to target currency
     */
    convert(value: number, from: string, to: string): number;
}
