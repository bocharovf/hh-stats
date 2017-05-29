import {RequestParam} from './RequestParam';
import * as Settings from './settings';

/**
 * Represents single request to HH Api
 */
export class ApiRequest {

    /**
     * Request timeout
     */
    timeout = Settings.DEFAULT_REQUEST_TIMEOUT;

    /**
     * User agent header
     */
    userAgent = Settings.DEFAULT_USER_AGENT;

    /**
     * 
     * @param resource resource name to request
     * @param params query string parameters
     */
    constructor(public readonly resource: string, public params: RequestParam[] = []) {

    }

    /**
     * Perform request
     */
    run(): Promise<any> {
        let url = this.getRequestUrl();

        let request = fetch(url, {
            headers: {
                'User-Agent': this.userAgent
            },            
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
     * Build full request URL
     */
    getRequestUrl() {
        let baseUrl = Settings.HH_API_BASE_URL;
        let queryString = this.params.filter(p => p.name)
                                    .map(p => p.query)
                                    .join('&');
        return `${baseUrl}/${this.resource}?${queryString}`;
    }

    private delay(ms: number) {
        return new Promise((resolve: any ) => setTimeout(resolve, ms));
    }

}