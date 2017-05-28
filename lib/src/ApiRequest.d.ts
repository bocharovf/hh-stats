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
     *
     * @param resource resource name to request
     * @param params query string parameters
     */
    constructor(resource: string, params?: RequestParam[]);
    /**
     * Perform request
     */
    run(): Promise<string>;
    /**
     * Build full request URL
     */
    getRequestUrl(): string;
    private delay(ms);
}
