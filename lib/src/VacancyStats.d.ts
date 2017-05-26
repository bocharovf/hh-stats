import { CurrencyConverter } from './CurrencyConverter';
/**
 *
 */
export declare class VacancyStats {
    minSalary: number;
    maxSalary: number;
    avgSalary: number;
    amount: number;
    used: number;
    /**
     *
     * @param minSalary
     * @param maxSalary
     * @param avgSalary
     * @param amount
     */
    constructor(minSalary: number, maxSalary: number, avgSalary: number, amount: number, used: number);
    /**
     *
     * @param json
     */
    static parse(json: string, converter: CurrencyConverter): VacancyStats;
    /**
     *
     * @param stats
     */
    static merge(...stats: VacancyStats[]): VacancyStats;
}
