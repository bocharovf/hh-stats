
/**
 * Represents timeout error
 */
export class TimeoutError implements Error {
    name = "TimeoutError";

    /**
     *
     */
    constructor(public message: string) {
        
    }
}