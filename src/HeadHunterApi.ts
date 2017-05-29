import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { ApiRequest } from './ApiRequest';
import { CurrencyConverter } from './CurrencyConverter';
import { DictionaryResponse, CurrencyItem, ExperienceItem } from './response/DictionaryResponse';
import { AreaItem } from './response/AreaResponse';
import * as Settings from './settings';

/**
 * Head Hunter API client
 */
export class HeadHunterApi {

    private _dictionary: DictionaryResponse;
    private _area: AreaItem[];

    /**
     * 
     * @param currencyConverter currency converter to use
     * @param userAgent User-Agent header to be send in requests
     * @param timeout timeout of requests
     */
    constructor(public currencyConverter: CurrencyConverter, 
                public userAgent: string = Settings.DEFAULT_USER_AGENT,
                public timeout: number = Settings.DEFAULT_REQUEST_TIMEOUT) {

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
        const resource = 'vacancies';
        let requests = [0, 1, 2, 3].map(i => {
            let request = new ApiRequest(
                resource, 
                this.addPaging(params, i, Settings.PAGE_SIZE)
            );
            request.timeout = this.timeout;
            request.userAgent = this.userAgent;
            return request.run();
        });
                
        return Promise.all(requests)
                    .then(results => {
                        let stats = results.map(resp => VacancyStats.parse(resp, this.currencyConverter));
                        return VacancyStats.merge(...stats);
                    });
    }

    /**
     * Get hierarchical list of areas
     * @param noCache if true disable cache
     */
    getAreas(noCache: boolean = false): Promise<AreaItem[]> {
        const resource = 'areas';
        if(noCache || !this._area)
            return new ApiRequest(resource).run().then(area => {
                this._area = area;
                return this._area;
            })
        else 
            return Promise.resolve(this._area);
    }

    /**
     * Get list of experiences
     * @param noCache if true disable cache
     */
    getExperincies(noCache: boolean = false): Promise<ExperienceItem[]> {
        return this.getDictionaries(noCache).then(d => d.experience);
    }

    /**
     * Get list of currency rates
     * @param noCache if true disable cache
     */
    getCurrencies(noCache: boolean = false): Promise<CurrencyItem[]> {
        return this.getDictionaries(noCache).then(d => d.currency);
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

    /**
     * Get cacheable dictionary resource 
     * @param noCache if true disable cache 
     */
    private getDictionaries(noCache: boolean): Promise<DictionaryResponse> {
        const resource = 'dictionaries';
        if(noCache || !this._dictionary)
            return new ApiRequest(resource).run().then(d => {
                this._dictionary = d;
                return this._dictionary;
            })
        else 
            return Promise.resolve(this._dictionary);
    }
    
}