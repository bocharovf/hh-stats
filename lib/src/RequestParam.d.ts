/**
 * Query string parameter
 */
export declare class RequestParam {
    name: string;
    value: string;
    constructor(name: string, value?: string);
    /**
     * Query string segment "name=val"
     */
    readonly query: string;
}
