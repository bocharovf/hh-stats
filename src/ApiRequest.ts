import { RequestParam } from './RequestParam';
import { TimeoutError } from './errors/TimeoutError';
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
        
        return this.race(request, this.timeout);
    }

    /**
     * Build full request URL
     */
    private getRequestUrl() {
        let baseUrl = Settings.HH_API_BASE_URL;
        let queryString = this.params.filter(p => p.name)
                                    .map(p => p.query)
                                    .join('&');
        return `${baseUrl}/${this.resource}?${queryString}`;
    }

    /**
     * Race between promise and timeout
     * @param promise promise to timeout
     * @param timeout timeout in ms
     */
    private race(promise: Promise<any>, timeout: number) {
        const error = new TimeoutError('Api request timeout expired');
        let timer: NodeJS.Timer;

        return Promise.race([
            new Promise((resolve, reject) => {
                timer = setTimeout(reject, timeout, error);
                return timer;
            }),
            promise.then((value) => {
                clearTimeout(timer);
                return value;
            }).catch((error) => error) 
        ]).then(result => {
            if(result instanceof Error)
                throw result;
            else
                return result;
        });
    }

}