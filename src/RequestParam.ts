

/**
 * Query string parameter
 */
export class RequestParam {
    constructor(public name: string, public value?: string) {
    }

    /**
     * Query string segment "name=val"
     */
    get query () {
        return `${this.name}=${encodeURIComponent(this.value || '')}`;
    }
}