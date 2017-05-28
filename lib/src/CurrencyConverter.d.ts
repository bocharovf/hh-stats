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
    dict: Array<{
        code: string;
        rate: number;
    }>;
    private rates;
    /**
     *
     * @param dict list of currency code and rate
     */
    constructor(dict: Array<{
        code: string;
        rate: number;
    }>);
    /**
     * Convert value from original currency to target currency
     * @param value value to convert
     * @param from original currency
     * @param to target currency
     */
    convert(value: number, from: string, to: string): number;
}
