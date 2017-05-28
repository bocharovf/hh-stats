"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Settings = require("./settings");
/**
 * Represents single request to HH Api
 */
var ApiRequest = (function () {
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
    }
    /**
     * Perform request
     */
    ApiRequest.prototype.run = function () {
        var url = this.getRequestUrl();
        var request = fetch(url, {
            mode: 'cors'
        }).then(function (res) {
            if (res.status != 200)
                throw new Error(res.statusText);
            return res.json();
        });
        return Promise.race([
            request, this.delay(this.timeout)
        ]);
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
    ApiRequest.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return ApiRequest;
}());
exports.ApiRequest = ApiRequest;
