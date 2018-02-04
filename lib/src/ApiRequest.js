"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TimeoutError_1 = require("./errors/TimeoutError");
var Settings = require("./settings");
/**
 * Represents single request to HH Api
 */
var ApiRequest = /** @class */ (function () {
    /**
     *
     * @param resource resource name to request
     * @param params query string parameters
     */
    function ApiRequest(resource, params) {
        if (params === void 0) { params = []; }
        this.resource = resource;
        this.params = params;
        /**
         * Request timeout
         */
        this.timeout = Settings.DEFAULT_REQUEST_TIMEOUT;
        /**
         * User agent header
         */
        this.userAgent = Settings.DEFAULT_USER_AGENT;
    }
    /**
     * Perform request
     */
    ApiRequest.prototype.run = function () {
        var url = this.getRequestUrl();
        var request = fetch(url, {
            headers: {
                'User-Agent': this.userAgent
            },
            mode: 'cors'
        }).then(function (res) {
            if (res.status != 200)
                throw new Error(res.statusText);
            return res.json();
        });
        return this.race(request, this.timeout);
    };
    /**
     * Build full request URL
     */
    ApiRequest.prototype.getRequestUrl = function () {
        var baseUrl = Settings.HH_API_BASE_URL;
        var queryString = this.params.filter(function (p) { return p.name; })
            .map(function (p) { return p.query; })
            .join('&');
        return baseUrl + "/" + this.resource + "?" + queryString;
    };
    /**
     * Race between promise and timeout
     * @param promise promise to timeout
     * @param timeout timeout in ms
     */
    ApiRequest.prototype.race = function (promise, timeout) {
        var error = new TimeoutError_1.TimeoutError('Api request timeout expired');
        var timer;
        return Promise.race([
            new Promise(function (resolve, reject) {
                timer = setTimeout(reject, timeout, error);
                return timer;
            }),
            promise.then(function (value) {
                clearTimeout(timer);
                return value;
            }).catch(function (error) { return error; })
        ]).then(function (result) {
            if (result instanceof Error)
                throw result;
            else
                return result;
        });
    };
    return ApiRequest;
}());
exports.ApiRequest = ApiRequest;
