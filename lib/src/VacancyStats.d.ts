import { CurrencyConverter } from './CurrencyConverter';
/**
 * Aggregated vacancy statistics
 */
export declare class VacancyStats {
    minSalary: number;
    maxSalary: number;
    avgSalary: number;
    amount: number;
    used: number;
    /**
     *
     * @param minSalary Min salary
     * @param maxSalary Max salary
     * @param avgSalary Average salary
     * @param amount Amount of found vacancies
     * @param used Amount of vacancies used to calculate min, max and avg salary
     */
    constructor(minSalary: number, maxSalary: number, avgSalary: number, amount: number, used: number);
    /**
     * Parse JSON response from HH service and return salary statistics
     * @param json JSON response from HH service
     * @param converter CurrencyConverter implementation to convert currency
     */
    static parse(json: any, converter: CurrencyConverter): VacancyStats;
    /**
     * Merge multiple VacancyStats instance to single instance
     * @param stats VacancyStats to merge
     */
    static merge(...stats: VacancyStats[]): VacancyStats;
}
