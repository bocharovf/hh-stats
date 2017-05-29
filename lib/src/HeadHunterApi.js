"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VacancyStats_1 = require("./VacancyStats");
var RequestParam_1 = require("./RequestParam");
var ApiRequest_1 = require("./ApiRequest");
var Settings = require("./settings");
/**
 * Head Hunter API client
 */
var HeadHunterApi = (function () {
    /**
     *
     * @param currencyConverter currency converter to use
     * @param userAgent User-Agent header to be send in requests
     * @param timeout timeout of requests
     */
    function HeadHunterApi(currencyConverter, userAgent, timeout) {
        if (userAgent === void 0) { userAgent = Settings.DEFAULT_USER_AGENT; }
        if (timeout === void 0) { timeout = Settings.DEFAULT_REQUEST_TIMEOUT; }
        this.currencyConverter = currencyConverter;
        this.userAgent = userAgent;
        this.timeout = timeout;
    }
    /**
     * Get vacancy statistics for specified area and experience
     * @param keywords array of keywords to search
     * @param area area name
     * @param experience experience category name
     * @param params additional request parameters
     */
    HeadHunterApi.prototype.getVacancy = function (keywords, area, experience) {
        var textParam = new RequestParam_1.RequestParam('text', this.prepareKeywords(keywords));
        var areaParam = new RequestParam_1.RequestParam('area', area);
        var experienceParam = new RequestParam_1.RequestParam('experience', experience);
        return this.getCustomVacancy(textParam, areaParam, experienceParam);
    };
    /**
     * Get vacancy statistics for custom filters
     * @param params array of resuest parameters
     */
    HeadHunterApi.prototype.getCustomVacancy = function () {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var resource = 'vacancies';
        var requests = [0, 1, 2, 3].map(function (i) {
            var request = new ApiRequest_1.ApiRequest(resource, _this.addPaging(params, i, Settings.PAGE_SIZE));
            request.timeout = _this.timeout;
            request.userAgent = _this.userAgent;
            return request.run();
        });
        return Promise.all(requests)
            .then(function (results) {
            var stats = results.map(function (resp) { return VacancyStats_1.VacancyStats.parse(resp, _this.currencyConverter); });
            return VacancyStats_1.VacancyStats.merge.apply(VacancyStats_1.VacancyStats, stats);
        });
    };
    /**
     * Get hierarchical list of areas
     * @param noCache if true disable cache
     */
    HeadHunterApi.prototype.getAreas = function (noCache) {
        var _this = this;
        if (noCache === void 0) { noCache = false; }
        var resource = 'areas';
        if (noCache || !this._area)
            return new ApiRequest_1.ApiRequest(resource).run().then(function (area) {
                _this._area = area;
                return _this._area;
            });
        else
            return Promise.resolve(this._area);
    };
    /**
     * Get list of experiences
     * @param noCache if true disable cache
     */
    HeadHunterApi.prototype.getExperincies = function (noCache) {
        if (noCache === void 0) { noCache = false; }
        return this.getDictionaries(noCache).then(function (d) { return d.experience; });
    };
    /**
     * Get list of currency rates
     * @param noCache if true disable cache
     */
    HeadHunterApi.prototype.getCurrencies = function (noCache) {
        if (noCache === void 0) { noCache = false; }
        return this.getDictionaries(noCache).then(function (d) { return d.currency; });
    };
    /**
     * Add paging parameters to request
     * @param params original parameters
     * @param page page number to request
     * @param perPage amount of results per page
     * @returns new array of parameters with paging
     */
    HeadHunterApi.prototype.addPaging = function (params, page, perPage) {
        return params.concat([
            new RequestParam_1.RequestParam('page', page.toString()),
            new RequestParam_1.RequestParam('per_page', perPage.toString())
        ]);
    };
    /**
     * Prepare search expression and filter non-empty and unique keywords
     * @param keywords original keywords
     */
    HeadHunterApi.prototype.prepareKeywords = function (keywords) {
        return keywords.filter(function (w) { return w; })
            .filter(function (value, index, self) { return self.indexOf(value) === index; })
            .join(' OR ');
    };
    /**
     * Get cacheable dictionary resource
     * @param noCache if true disable cache
     */
    HeadHunterApi.prototype.getDictionaries = function (noCache) {
        var _this = this;
        var resource = 'dictionaries';
        if (noCache || !this._dictionary)
            return new ApiRequest_1.ApiRequest(resource).run().then(function (d) {
                _this._dictionary = d;
                return _this._dictionary;
            });
        else
            return Promise.resolve(this._dictionary);
    };
    return HeadHunterApi;
}());
exports.HeadHunterApi = HeadHunterApi;
