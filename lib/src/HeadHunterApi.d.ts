import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { CurrencyConverter } from './CurrencyConverter';
/**
 * Head Hunter API client
 */
export declare class HeadHunterApi {
    currencyConverter: CurrencyConverter;
    /**
     *
     * @param currencyConverter currency converter to use
     */
    constructor(currencyConverter: CurrencyConverter);
    /**
     * Get vacancy statistics for specified area and experience
     * @param keywords array of keywords to search
     * @param area area name
     * @param experience experience category name
     * @param params additional request parameters
     */
    getVacancy(keywords: string[], area?: string, experience?: string): Promise<VacancyStats>;
    /**
     * Get vacancy statistics for custom filters
     * @param params array of resuest parameters
     */
    getCustomVacancy(...params: RequestParam[]): Promise<VacancyStats>;
    /**
     * Add paging parameters to request
     * @param params original parameters
     * @param page page number to request
     * @param perPage amount of results per page
     * @returns new array of parameters with paging
     */
    private addPaging(params, page, perPage);
    /**
     * Prepare search expression and filter non-empty and unique keywords
     * @param keywords original keywords
     */
    private prepareKeywords(keywords);
}
