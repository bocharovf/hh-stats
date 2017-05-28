import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { ApiRequest } from './ApiRequest';
import { CurrencyConverter } from './CurrencyConverter';
import * as Settings from './settings';

/**
 * Head Hunter API client
 */
export class HeadHunterApi {

    /**
     * 
     * @param currencyConverter currency converter to use
     */
    constructor(public currencyConverter: CurrencyConverter) {

    }

    /**
     * Get vacancy statistics for specified area and experience
     * @param keywords array of keywords to search
     * @param area area name
     * @param experience experience category name
     * @param params additional request parameters
     */
    getVacancy(keywords: string[], area?: string, experience?: string): Promise<VacancyStats> {
        let textParam = new RequestParam('text', this.prepareKeywords(keywords));
        let areaParam = new RequestParam('area', area);
        let experienceParam = new RequestParam('experience', experience);
        return this.getCustomVacancy(textParam, areaParam, experienceParam);
    }

    /**
     * Get vacancy statistics for custom filters
     * @param params array of resuest parameters
     */
    getCustomVacancy(...params: RequestParam[]): Promise<VacancyStats> {
        let resource = 'vacancy';
        return Promise.all([
            new ApiRequest(resource, this.addPaging(params, 1, Settings.PAGE_SIZE)).run(),
            new ApiRequest(resource, this.addPaging(params, 2, Settings.PAGE_SIZE)).run(),
            new ApiRequest(resource, this.addPaging(params, 3, Settings.PAGE_SIZE)).run(),
            new ApiRequest(resource, this.addPaging(params, 4, Settings.PAGE_SIZE)).run()
        ]).then(results => {
            let stats = results.map(resp => VacancyStats.parse(resp, this.currencyConverter));
            return VacancyStats.merge(...stats);
        });
    }

    /**
     * Add paging parameters to request
     * @param params original parameters
     * @param page page number to request
     * @param perPage amount of results per page
     * @returns new array of parameters with paging
     */
    private addPaging(params: RequestParam[], page: number, perPage: number): RequestParam[] {
        return [
            ...params,
            new RequestParam('page', page.toString()),
            new RequestParam('per_page', perPage.toString())
        ];
    }    

    /**
     * Prepare search expression and filter non-empty and unique keywords
     * @param keywords original keywords
     */
    private prepareKeywords(keywords: string[]): string {
        return keywords.filter(w => w)
                        // distinct
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .join(' OR ');
    }
    
}