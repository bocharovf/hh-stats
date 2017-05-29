import { RequestParam } from './RequestParam';
/**
 * Represents single request to HH Api
 */
export declare class ApiRequest {
    readonly resource: string;
    params: RequestParam[];
    /**
     * Request timeout
     */
    timeout: number;
    /**
     * User agent header
     */
    userAgent: string;
    /**
     *
     * @param resource resource name to request
     * @param params query string parameters
     */
    constructor(resource: string, params?: RequestParam[]);
    /**
     * Perform request
     */
    run(): Promise<any>;
    /**
     * Build full request URL
     */
    private getRequestUrl();
    /**
     * Race between promise and timeout
     * @param promise promise to timeout
     * @param timeout timeout in ms
     */
    private race(promise, timeout);
}
