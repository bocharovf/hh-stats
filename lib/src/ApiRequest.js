"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Settings = require("./settings");
/**
 *
 */
var ApiRequest = (function () {
    /**
     *
     * @param resource
     * @param params
     */
    function ApiRequest(resource, params) {
        if (params === void 0) { params = []; }
        this.resource = resource;
        this.params = params;
        this.timeout = Settings.DEFAULT_REQUEST_TIMEOUT;
    }
    /**
     *
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
     *
     */
    ApiRequest.prototype.getRequestUrl = function () {
        var baseUrl = Settings.HH_API_BASE_URL;
        var queryString = this.params.filter(function (p) { return p.name; })
            .map(function (p) { return p.name + "=" + encodeURIComponent(p.value || ''); })
            .join('&');
        return baseUrl + "/" + this.resource + "?" + queryString;
    };
    ApiRequest.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return ApiRequest;
}());
exports.ApiRequest = ApiRequest;
