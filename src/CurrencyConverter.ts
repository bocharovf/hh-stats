
/**
 * Support currency convertion
 */
export interface CurrencyConverter {
    convert(value: number, from: string, to: string): number;
}

interface RateHash {
    [rates:string]: number;
}

/**
 * Simple currency converter based on list of currencies and rates
 */
export class DictCurrencyConverter implements CurrencyConverter {
    
    private rates: RateHash = Object.create(null);

    /**
     * 
     * @param dict list of currency code and rate
     */
    constructor(public dict:Array<{code: string, rate: number}>) {

        for (let currency of dict) {
            this.rates[currency.code] = currency.rate;
        }
    }
    
    /**
     * Convert value from original currency to target currency
     * @param value value to convert
     * @param from original currency
     * @param to target currency
     */
    convert(value: number, from: string, to: string) {
        if (from === to) return value;

        const fromRate = this.rates[from];
        if(!fromRate) throw new Error(`Rate for currency ${from} is not defined`);
        
        const toRate = this.rates[to];
        if(!toRate) throw new Error(`Rate for currency ${to} is not defined`);

        return value * toRate / fromRate;
    }
}