"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base HH service URL
 */
exports.HH_API_BASE_URL = 'https://api.hh.ru';
/**
 * Default timeout for quering HH service
 */
exports.DEFAULT_REQUEST_TIMEOUT = 8000; // ms
/**
 * Max page size for quering HH service
 */
exports.PAGE_SIZE = 100; // ms
/**
 * Max amount of vacancies that could be retrieved from HH API
 */
exports.MAX_VACANCIES_AMOUNT = 2000;
exports.DEFAULT_USER_AGENT = 'hh-stats npm package';
