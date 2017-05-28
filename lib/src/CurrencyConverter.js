"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Simple currency converter based on list of currencies and rates
 */
var DictCurrencyConverter = (function () {
    /**
     *
     * @param dict list of currency code and rate
     */
    function DictCurrencyConverter(dict) {
        this.dict = dict;
        this.rates = Object.create(null);
        for (var _i = 0, dict_1 = dict; _i < dict_1.length; _i++) {
            var currency = dict_1[_i];
            this.rates[currency.code] = currency.rate;
        }
    }
    /**
     * Convert value from original currency to target currency
     * @param value value to convert
     * @param from original currency
     * @param to target currency
     */
    DictCurrencyConverter.prototype.convert = function (value, from, to) {
        if (from === to)
            return value;
        var fromRate = this.rates[from];
        if (!fromRate)
            throw new Error("Rate for currency " + from + " is not defined");
        var toRate = this.rates[to];
        if (!toRate)
            throw new Error("Rate for currency " + to + " is not defined");
        return value * toRate / fromRate;
    };
    return DictCurrencyConverter;
}());
exports.DictCurrencyConverter = DictCurrencyConverter;
