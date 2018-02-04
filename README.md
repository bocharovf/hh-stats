[![Build Status](https://travis-ci.org/bocharovf/hh-stats.svg?branch=master)](https://travis-ci.org/bocharovf/hh-stats)
# HeadHunter salary statistics
A tiny library to agregate vacancy information from HeadHunter API.

Key feachures are:
* Search vacancies with given keywords 
* Calculate total found items, min, max and average salary for given filters
* Support keyword synonyms (eg. 'javascript' and 'js') 
* Support filters for area, experience and any custom filter supported by API

# Installation
```bash
npm install --save hh-stats
```

# Usage
Library is written in TypeScipt so typings are supported.
It's isomorphic so you can use it both from Node.js and browser. 
To use it in browser bundler which understands CommonJS modules (like Webpack) is required.

# Dependencies
There is no dependencies but it assumes that promises and fetch API are available.
To use it in environment that has no Promise or fetch various polyfills could be used.

For promises and fetch API one could use [es6-promise](https://github.com/stefanpenner/es6-promise) polyfill and 
[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) packages:
```bash
npm install --save isomorphic-fetch es6-promise
```

# Example

```js
// polyfills to bring Promise and fetch to our environment
require('es6-promise').polyfill();
let { fetch } = require('isomorphic-fetch');

let { HeadHunterApi, DictCurrencyConverter, RequestParam } = require('hh-stats');

// create an instance of API client
// first parameter is User-Agent to be used in requests
// second parameter is timeout in ms
const api = new HeadHunterApi('My API client', 1500);

// alternatively you could set them later via fields
api.timeout = 25000;
api.userAgent = 'My API client';

let converter;
// salaries are in different currencies so we need currency rates first
api.getCurrencies().then(cur => {
    // create instance of currency converter
    converter = new DictCurrencyConverter(cur);
    // query vacancy statistics both for 'javascript' and 'js' (keyword synonyms)
    return api.getVacancy(converter, ['javascript', 'js'], null, null);
}).then(stat => {
    console.log(`Found ${stat.amount} vacancies`);
    console.log(`${stat.used} used to calculate salary`);
    console.log(`Max salary is ${stat.maxSalary} RUR`);
    console.log(`Average salary is ${stat.avgSalary} RUR`);
    console.log(`Min salary is ${stat.minSalary} RUR`);
    
    // salary calculates in RUR (Russian Rubles) by default
    // you could easially convert it from currencies using converter
    let avgSalaryUSD = converter.convert(stat.avgSalary, 'RUR', 'USD');
    console.log(`Average salary in USD is ${avgSalaryUSD}`);
});

```
