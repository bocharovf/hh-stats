"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Query string parameter
 */
var RequestParam = /** @class */ (function () {
    function RequestParam(name, value) {
        this.name = name;
        this.value = value;
    }
    Object.defineProperty(RequestParam.prototype, "query", {
        /**
         * Query string segment "name=val"
         */
        get: function () {
            return this.name + "=" + encodeURIComponent(this.value || '');
        },
        enumerable: true,
        configurable: true
    });
    return RequestParam;
}());
exports.RequestParam = RequestParam;
