"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents timeout error
 */
var TimeoutError = /** @class */ (function () {
    /**
     *
     */
    function TimeoutError(message) {
        this.message = message;
        this.name = "TimeoutError";
    }
    return TimeoutError;
}());
exports.TimeoutError = TimeoutError;
