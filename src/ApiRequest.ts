import {RequestParam} from './RequestParam';
import * as Settings from './settings';

/**
 * 
 */
export class ApiRequest {

    timeout = Settings.DEFAULT_REQUEST_TIMEOUT;

    /**
     * 
     * @param resource 
     * @param params 
     */
    constructor(public readonly resource: string, public params: RequestParam[] = []) {

    }

    /**
     * 
     */
    run(): Promise<string> {
        let url = this.getRequestUrl();
        
        let request = fetch(url, {
            mode: 'cors'
        }).then(res => {
            if (res.status != 200) 
                throw new Error(res.statusText);
            return res.json();
        });
        
        return Promise.race([
            request, this.delay(this.timeout)
        ]);
    }

    /**
     * 
     */
    getRequestUrl() {
        let baseUrl = Settings.HH_API_BASE_URL;
        let queryString = this.params.filter(p=>p.name)
                                    .map(p => `${p.name}=${encodeURIComponent(p.value || '')}`)
                                    .join('&');
        return `${baseUrl}/${this.resource}?${queryString}`;
    }

    private delay(ms: number) {
        return new Promise((resolve: any ) => setTimeout(resolve, ms));
    }

}