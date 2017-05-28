import { VacancyResponse, VacancyItemSalary } from  './response/VacancyResponse'
import { CurrencyConverter } from './CurrencyConverter';

/**
 * Aggregated vacancy statistics
 */
export class VacancyStats {

    /**
     * 
     * @param minSalary Min salary
     * @param maxSalary Max salary
     * @param avgSalary Average salary
     * @param amount Amount of found vacancies
     * @param used Amount of vacancies used to calculate min, max and avg salary 
     */
    constructor(
        public minSalary: number, 
        public maxSalary: number,
        public avgSalary: number,
        public amount: number,
        public used: number) {

    }

    /**
     * Parse JSON response from HH service and return salary statistics
     * @param json JSON response from HH service
     * @param converter CurrencyConverter implementation to convert currency
     */
    static parse(json: any, converter: CurrencyConverter): VacancyStats {
        let resp = json as VacancyResponse;

        let salaries = resp.items
                            .map(i => i.salary)
                            .filter(s => s && (s!.from || s!.to) && s!.currency) as VacancyItemSalary[];

        let used = salaries.length;
        if (used === 0) return new VacancyStats(0, 0, 0, 0, 0);

        let minSalary = Math.min(...salaries.map(s => converter.convert(s.from || s.to as number, s.currency as string, 'RUR')));
        let maxSalary = Math.max(...salaries.map(s => converter.convert(s.to || s.from as number, s.currency as string, 'RUR')));
        let amount = resp.found;
        
        let avgSalary = salaries.map(s => s.from && s.to ? 
                                    converter.convert((s.from + s.to) / 2.0, s.currency as string, 'RUR') : 
                                    converter.convert(s.from || s.to as number, s.currency as string, 'RUR') )
                                .reduce((a, b) => a + b, 0) / used;

        return new VacancyStats(minSalary, maxSalary, avgSalary, amount, used);
    }

    /**
     * Merge multiple VacancyStats instance to single instance
     * @param stats VacancyStats to merge
     */
    static merge(...stats: VacancyStats[]) {
        let validStats = stats.filter(s => s.used > 0);

        let minSalary = Math.min(...validStats.map(s => s.minSalary));
        let maxSalary = Math.max(...validStats.map(s => s.maxSalary));
        let avgSalary = validStats.map(s => s.avgSalary).reduce((a, b) => a + b, 0) / validStats.length;
        let amount = Math.max(...validStats.map(s => s.amount));
        let used = validStats.map(s => s.used).reduce((a, b) => a + b, 0);
        
        return new VacancyStats(minSalary, maxSalary, avgSalary, amount, used);
    }

}