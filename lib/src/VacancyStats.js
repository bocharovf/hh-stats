"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Aggregated vacancy statistics
 */
var VacancyStats = /** @class */ (function () {
    /**
     *
     * @param minSalary Min salary
     * @param maxSalary Max salary
     * @param avgSalary Average salary
     * @param amount Amount of found vacancies
     * @param used Amount of vacancies used to calculate min, max and avg salary
     */
    function VacancyStats(minSalary, maxSalary, avgSalary, amount, used) {
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.avgSalary = avgSalary;
        this.amount = amount;
        this.used = used;
    }
    /**
     * Parse JSON response from HH service and return salary statistics
     * @param json JSON response from HH service
     * @param converter CurrencyConverter implementation to convert currency
     */
    VacancyStats.parse = function (json, converter) {
        var resp = json;
        var salaries = resp.items
            .map(function (i) { return i.salary; })
            .filter(function (s) { return s && (s.from || s.to) && s.currency; });
        var used = salaries.length;
        if (used === 0)
            return new VacancyStats(0, 0, 0, 0, 0);
        var minSalary = Math.min.apply(Math, salaries.map(function (s) { return converter.convert(s.from || s.to, s.currency, 'RUR'); }));
        var maxSalary = Math.max.apply(Math, salaries.map(function (s) { return converter.convert(s.to || s.from, s.currency, 'RUR'); }));
        var amount = resp.found;
        var avgSalary = salaries.map(function (s) { return s.from && s.to ?
            converter.convert((s.from + s.to) / 2.0, s.currency, 'RUR') :
            converter.convert(s.from || s.to, s.currency, 'RUR'); })
            .reduce(function (a, b) { return a + b; }, 0) / used;
        return new VacancyStats(minSalary, maxSalary, avgSalary, amount, used);
    };
    /**
     * Merge multiple VacancyStats instance to single instance
     * @param stats VacancyStats to merge
     */
    VacancyStats.merge = function () {
        var stats = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stats[_i] = arguments[_i];
        }
        var validStats = stats.filter(function (s) { return s.used > 0; });
        var minSalary = Math.min.apply(Math, validStats.map(function (s) { return s.minSalary; }));
        var maxSalary = Math.max.apply(Math, validStats.map(function (s) { return s.maxSalary; }));
        var avgSalary = validStats.map(function (s) { return s.avgSalary; }).reduce(function (a, b) { return a + b; }, 0) / validStats.length;
        var amount = Math.max.apply(Math, validStats.map(function (s) { return s.amount; }));
        var used = validStats.map(function (s) { return s.used; }).reduce(function (a, b) { return a + b; }, 0);
        return new VacancyStats(minSalary, maxSalary, avgSalary, amount, used);
    };
    return VacancyStats;
}());
exports.VacancyStats = VacancyStats;
