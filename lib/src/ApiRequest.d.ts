import { RequestParam } from './RequestParam';
/**
 *
 */
export declare class ApiRequest {
    readonly resource: string;
    params: RequestParam[];
    timeout: number;
    /**
     *
     * @param resource
     * @param params
     */
    constructor(resource: string, params?: RequestParam[]);
    /**
     *
     */
    run(): Promise<string>;
    /**
     *
     */
    getRequestUrl(): string;
    private delay(ms);
}
