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
     */
    function HeadHunterApi(currencyConverter) {
        this.currencyConverter = currencyConverter;
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
        var resource = 'vacancy';
        return Promise.all([
            new ApiRequest_1.ApiRequest(resource, this.addPaging(params, 1, Settings.PAGE_SIZE)).run(),
            new ApiRequest_1.ApiRequest(resource, this.addPaging(params, 2, Settings.PAGE_SIZE)).run(),
            new ApiRequest_1.ApiRequest(resource, this.addPaging(params, 3, Settings.PAGE_SIZE)).run(),
            new ApiRequest_1.ApiRequest(resource, this.addPaging(params, 4, Settings.PAGE_SIZE)).run()
        ]).then(function (results) {
            var stats = results.map(function (resp) { return VacancyStats_1.VacancyStats.parse(resp, _this.currencyConverter); });
            return VacancyStats_1.VacancyStats.merge.apply(VacancyStats_1.VacancyStats, stats);
        });
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
    return HeadHunterApi;
}());
exports.HeadHunterApi = HeadHunterApi;
