/**
 *
 */
export interface CurrencyConverter {
    convert(value: number, from: string, to: string): number;
}
/**
 *
 */
export declare class DictCurrencyConverter implements CurrencyConverter {
    dict: Array<{
        code: string;
        rate: number;
    }>;
    private rates;
    /**
     *
     * @param dict
     */
    constructor(dict: Array<{
        code: string;
        rate: number;
    }>);
    /**
     *
     * @param value
     * @param from
     * @param to
     */
    convert(value: number, from: string, to: string): number;
}
