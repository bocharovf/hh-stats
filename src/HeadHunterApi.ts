import { VacancyStats } from './VacancyStats';
import { RequestParam } from './RequestParam';
import { ApiRequest } from './ApiRequest';
import { CurrencyConverter } from './CurrencyConverter';
import * as Settings from './settings';

/**
 * 
 */
export class HeadHunterApi {

    constructor(public currencyConverter: CurrencyConverter) {

    }

    /**
     * 
     * @param keywords 
     * @param area 
     * @param experience 
     * @param params 
     */
    getVacancy(keywords: string[], area?: string, experience?: string): Promise<VacancyStats> {
        let textParam = new RequestParam('text', this.prepareKeywords(keywords));
        let areaParam = new RequestParam('area', area);
        let experienceParam = new RequestParam('experience', experience);
        return this.getCustomVacancy(textParam, areaParam, experienceParam);
    }

    /**
     * 
     * @param params 
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
     * 
     * @param params 
     * @param page 
     * @param perPage 
     */
    addPaging(params: RequestParam[], page: number, perPage: number): RequestParam[] {
        return [
            ...params,
            new RequestParam('page', page.toString()),
            new RequestParam('per_page', perPage.toString())
        ];
    }    

    /**
     * 
     * @param keywords 
     */
    prepareKeywords(keywords: string[]): string {
        return keywords.filter(w => w)
                        // distinct
                        .filter((value, index, self) => self.indexOf(value) === index)
                        .join(' OR ');
    }
    
}