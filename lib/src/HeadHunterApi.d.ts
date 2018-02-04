import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { CurrencyConverter } from './CurrencyConverter';
import { CurrencyItem, ExperienceItem } from './response/DictionaryResponse';
import { AreaItem } from './response/AreaResponse';
/**
 * Head Hunter API client
 */
export declare class HeadHunterApi {
    userAgent: string;
    timeout: number;
    private _dictionary?;
    private _area?;
    /**
     *
     * @param userAgent User-Agent header to be send in requests
     * @param timeout timeout of requests
     */
    constructor(userAgent?: string, timeout?: number);
    /**
     * Get vacancy statistics for specified area and experience
     * @param currencyConverter currency converter to use
     * @param keywords array of keywords to search
     * @param area area name
     * @param experience experience category name
     * @param params additional request parameters
     */
    getVacancy(currencyConverter: CurrencyConverter, keywords: string[], area?: string, experience?: string, ...params: RequestParam[]): Promise<VacancyStats>;
    /**
     * Get vacancy statistics for custom filters
     * @param currencyConverter currency converter to use
     * @param params additional request parameters
     */
    getCustomVacancy(currencyConverter: CurrencyConverter, ...params: RequestParam[]): Promise<VacancyStats>;
    /**
     * Generates specified amount of vacancy requests
     * @param vacanciesAmount amount of requests
     * @param params additional request parameters
     */
    private getVacancyRequests(requestsAmount, ...params);
    /**
     * Get hierarchical list of areas
     * @param noCache if true disable cache
     */
    getAreas(noCache?: boolean): Promise<AreaItem[]>;
    /**
     * Get list of experiences
     * @param noCache if true disable cache
     */
    getExperincies(noCache?: boolean): Promise<ExperienceItem[]>;
    /**
     * Get list of currency rates
     * @param noCache if true disable cache
     */
    getCurrencies(noCache?: boolean): Promise<CurrencyItem[]>;
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
    /**
     * Get cacheable dictionary resource
     * @param noCache if true disable cache
     */
    private getDictionaries(noCache);
}
