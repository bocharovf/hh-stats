"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VacancyStats_1 = require("./VacancyStats");
var RequestParam_1 = require("./RequestParam");
var ApiRequest_1 = require("./ApiRequest");
var Settings = require("./settings");
/**
 *
 */
var HeadHunterApi = (function () {
    function HeadHunterApi(currencyConverter) {
        this.currencyConverter = currencyConverter;
    }
    /**
     *
     * @param keywords
     * @param area
     * @param experience
     * @param params
     */
    HeadHunterApi.prototype.getVacancy = function (keywords, area, experience) {
        var textParam = new RequestParam_1.RequestParam('text', this.prepareKeywords(keywords));
        var areaParam = new RequestParam_1.RequestParam('area', area);
        var experienceParam = new RequestParam_1.RequestParam('experience', experience);
        return this.getCustomVacancy(textParam, areaParam, experienceParam);
    };
    /**
     *
     * @param params
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
     *
     * @param params
     * @param page
     * @param perPage
     */
    HeadHunterApi.prototype.addPaging = function (params, page, perPage) {
        return params.concat([
            new RequestParam_1.RequestParam('page', page.toString()),
            new RequestParam_1.RequestParam('per_page', perPage.toString())
        ]);
    };
    /**
     *
     * @param keywords
     */
    HeadHunterApi.prototype.prepareKeywords = function (keywords) {
        return keywords.filter(function (w) { return w; })
            .filter(function (value, index, self) { return self.indexOf(value) === index; })
            .join(' OR ');
    };
    return HeadHunterApi;
}());
exports.HeadHunterApi = HeadHunterApi;
