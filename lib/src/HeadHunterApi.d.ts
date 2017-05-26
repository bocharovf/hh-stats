import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { CurrencyConverter } from './CurrencyConverter';
/**
 *
 */
export declare class HeadHunterApi {
    currencyConverter: CurrencyConverter;
    constructor(currencyConverter: CurrencyConverter);
    /**
     *
     * @param keywords
     * @param area
     * @param experience
     * @param params
     */
    getVacancy(keywords: string[], area?: string, experience?: string): Promise<VacancyStats>;
    /**
     *
     * @param params
     */
    getCustomVacancy(...params: RequestParam[]): Promise<VacancyStats>;
    /**
     *
     * @param params
     * @param page
     * @param perPage
     */
    addPaging(params: RequestParam[], page: number, perPage: number): RequestParam[];
    /**
     *
     * @param keywords
     */
    prepareKeywords(keywords: string[]): string;
}
