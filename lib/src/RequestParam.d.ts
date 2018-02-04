/**
 * Query string parameter
 */
export declare class RequestParam {
    name: string;
    value: string | undefined;
    constructor(name: string, value?: string | undefined);
    /**
     * Query string segment "name=val"
     */
    readonly query: string;
}
