import {HeadHunterApi} from '../src/HeadHunterApi';
import {DictCurrencyConverter, CurrencyConverter} from '../src/CurrencyConverter';
import {ApiRequest} from '../src/ApiRequest';
import {VacancyStats} from '../src/VacancyStats';
import {RequestParam} from '../src/RequestParam';
import {AreaItem} from '../src/response/AreaResponse';
import {CurrencyItem, ExperienceItem} from '../src/response/DictionaryResponse';

const fakeStat = new VacancyStats(0, 0, 0, 0, 0);

const sampleResponseJson = JSON.parse(`
    {
    "items":[
        {
            "salary":{
                "to":90000,
                "from":10000,
                "currency":"RUR"
            }
        },
        {
            "salary":{
                "to":30000,
                "from":20000,
                "currency":"RUR"
            }
        }                
    ],
    "found":398618
    }            
`);

const sampleAreasJson = JSON.parse(`
[
   {
      "parent_id":null,
      "areas":[
         {
            "parent_id":"113",
            "areas":[
               {
                  "parent_id":"1620",
                  "areas":[

                  ],
                  "id":"4228",
                  "name":"Виловатово"
               }
            ],
            "id":"1620",
            "name":"Республика Марий Эл"
         }
        ],
        "id":"1",
        "name":"Тест"
    }
]
`);

const sampleDictionaryJson = JSON.parse(`
{
 "currency":[
      {
         "rate":1.0,
         "code":"RUR",
         "abbr":"руб.",
         "in_use":true,
         "default":true,
         "name":"Рубли"
      },
      {
         "rate":0.030012,
         "code":"AZN",
         "abbr":"AZN",
         "in_use":false,
         "default":false,
         "name":"Манаты"
      }
  ],
   "experience":[
      {
         "id":"noExperience",
         "name":"Нет опыта"
      },
      {
         "id":"between1And3",
         "name":"От 1 года до 3 лет"
      },
      {
         "id":"between3And6",
         "name":"От 3 до 6 лет"
      },
      {
         "id":"moreThan6",
         "name":"Более 6 лет"
      }
   ]      
}
`);

describe('class HeadHunterApi', () => {

    let converter: CurrencyConverter;
    let api: HeadHunterApi;
    let convert: jasmine.Spy;        
    let run: jasmine.Spy; 

    beforeEach(() => {
        converter = new DictCurrencyConverter([]);
        convert = spyOn(converter, 'convert').and.callFake( (value:number, from:string, to:string) => value);
        api = new HeadHunterApi(converter);
    });       

    describe('The "getCustomVacancy" method', () => {

        beforeEach(() => {
            run = spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleResponseJson));
        });    

        it('requests 4 vacancy pages from api', (done) => {
            api.getCustomVacancy().then(stats => {
                expect(run).toHaveBeenCalledTimes(4);
                done();
            });
        });

        it('parses 4 vacancy responses', (done) => {
            const parse = spyOn(VacancyStats, 'parse').and.callThrough();
            api.getCustomVacancy().then( stats => {
                expect(parse).toHaveBeenCalledTimes(4);
                expect(parse.calls.allArgs()).toEqual([
                    [sampleResponseJson, converter], 
                    [sampleResponseJson, converter], 
                    [sampleResponseJson, converter], 
                    [sampleResponseJson, converter]
                ]);
                done();
            });
        });

        it('merges 4 api responses to single', (done) => {
            const merge = spyOn(VacancyStats, 'merge').and.callThrough();
            api.getCustomVacancy().then( stats => {
                expect(merge).toHaveBeenCalledTimes(1);
                expect(merge.calls.argsFor(0).length).toEqual(4);
                done();
            });
        });        
   
        it('process and merges result correctly', (done) => {
            api.getCustomVacancy().then(stats => {
                expect(stats.amount).toEqual(398618);
                expect(stats.used).toEqual(8);
                expect(stats.minSalary).toEqual(10000);
                expect(stats.maxSalary).toEqual(90000);
                expect(stats.avgSalary).toEqual(37500);
                done();
            });            
        });

    });

    describe('the "getVacancy" method', () => {

        beforeEach(() => {
            run = spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleResponseJson));
        });

        it('call "getCustomVacancy" method with keywords, area and experience paramters', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            api.getVacancy(['js'], '113', 'noExperience');
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js'),
                new RequestParam('area', '113'),
                new RequestParam('experience', 'noExperience')
            );
        });

        it('do not pass null argumetns to "getCustomVacancy"', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            api.getVacancy(['js'], null, null);
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js')
            );
        });

        it('join keywords with "OR" separator for "text" parameter', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            api.getVacancy(['js', 'javascript', 'es6'], null, null);
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js OR javascript OR es6')
            );
        });

        it('takes only unique keywords for "text" parameter', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            api.getVacancy(['js', 'javascript', 'js'], null, null);
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js OR javascript')
            );
        });

        it('skip empty keywords for "text" parameter', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            api.getVacancy(['js', '', 'javascript', null], null, null);
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js OR javascript')
            );
        });

        it('pass additional parameters to "getCustomVacancy"', () => {
            const getCustomVacancy = spyOn(api, 'getCustomVacancy').and.callFake( () => Promise.resolve(fakeStat) );
            const additionalParam = new RequestParam('add', 'yes');
            api.getVacancy(['js', 'javascript'], null, null, additionalParam);
            
            expect(getCustomVacancy).toHaveBeenCalledWith(
                new RequestParam('text', 'js OR javascript'),
                additionalParam
            );
        });        
    });

    describe('the "getAreas" method', () => {        

        beforeEach(() => {
            run = spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleAreasJson));
        });

        it('use cached area result if noCache = false', () => {
            let areas1, areas2: AreaItem[];
            api.getAreas(false) // fill cache
                .then(areas => {
                    areas1 = areas;
                    return api.getAreas(false);
                })
                .then(areas => {
                    areas2 = areas;
                    expect(run).toHaveBeenCalledTimes(1);
                    expect(areas1).toEqual(sampleAreasJson);
                    expect(areas2).toEqual(sampleAreasJson);
                });
        });

        it('ignore cached area result if noCache = true', () => {
            let areas1: AreaItem[], areas2: AreaItem[];
            api.getAreas(true) // fill cache
                .then(areas => {
                    areas1 = areas;
                    return api.getAreas(true);
                })
                .then(areas => {
                    areas2 = areas;
                    expect(run).toHaveBeenCalledTimes(2);
                    expect(areas1).toEqual(sampleAreasJson);
                    expect(areas2).toEqual(sampleAreasJson);
                });
        });     
    });

    describe('the "getExperincies" method', () => {
        
        beforeEach(() => {
            run = spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleDictionaryJson));
        });

        it('use cached dictionary result if noCache = false', () => {
            let exp1: ExperienceItem[], exp2: ExperienceItem[];
            api.getExperincies(false) // fill cache
                .then(exp => {
                    exp1 = exp;
                    return api.getExperincies(false);
                })
                .then(exp => {
                    exp2 = exp;
                    expect(run).toHaveBeenCalledTimes(1);
                    expect(exp1).toEqual(sampleDictionaryJson.experience);
                    expect(exp2).toEqual(sampleDictionaryJson.experience);
                });
        });

        it('use cached dictionary result if noCache = false', () => {
            let exp1: ExperienceItem[], exp2: ExperienceItem[];
            api.getExperincies(true) // fill cache
                .then(exp => {
                    exp1 = exp;
                    return api.getExperincies(true);
                })
                .then(exp => {
                    exp2 = exp;
                    expect(run).toHaveBeenCalledTimes(2);
                    expect(exp1).toEqual(sampleDictionaryJson.experience);
                    expect(exp2).toEqual(sampleDictionaryJson.experience);
                });
        });

        it('share same dictionary cache with "getCurrencies" method', () => {
            let cur1: CurrencyItem[], exp2: ExperienceItem[];
            api.getCurrencies(false) // fill cache
                .then(cur => {
                    cur1 = cur;
                    return api.getExperincies(false);
                })
                .then(exp => {
                    exp2 = exp;
                    expect(run).toHaveBeenCalledTimes(1);
                    expect(cur1).toEqual(sampleDictionaryJson.currency);
                    expect(exp2).toEqual(sampleDictionaryJson.experience);
                });
        });        

    });

    describe('the "getCurrencies" method', () => {
        
        beforeEach(() => {
            run = spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleDictionaryJson));
        });

        it('use cached dictionary result if noCache = false', () => {
            let cur1: CurrencyItem[], cur2: CurrencyItem[];
            api.getCurrencies(false) // fill cache
                .then(exp => {
                    cur1 = exp;
                    return api.getCurrencies(false);
                })
                .then(exp => {
                    cur2 = exp;
                    expect(run).toHaveBeenCalledTimes(1);
                    expect(cur1).toEqual(sampleDictionaryJson.currency);
                    expect(cur2).toEqual(sampleDictionaryJson.currency);
                });
        });

        it('use cached dictionary result if noCache = false', () => {
            let cur1: CurrencyItem[], cur2: CurrencyItem[];
            api.getCurrencies(true) // fill cache
                .then(exp => {
                    cur1 = exp;
                    return api.getCurrencies(true);
                })
                .then(exp => {
                    cur2 = exp;
                    expect(run).toHaveBeenCalledTimes(2);
                    expect(cur1).toEqual(sampleDictionaryJson.currency);
                    expect(cur2).toEqual(sampleDictionaryJson.currency);
                });
        });

        it('share same dictionary cache with "getExperence" method', () => {
            let exp1: ExperienceItem[], cur2: CurrencyItem[];
            api.getExperincies(false) // fill cache
                .then(exp => {
                    exp1 = exp;
                    return api.getCurrencies(false);
                })
                .then(cur => {
                    cur2 = cur;
                    expect(run).toHaveBeenCalledTimes(1);
                    expect(exp1).toEqual(sampleDictionaryJson.experience);
                    expect(cur2).toEqual(sampleDictionaryJson.currency);
                });
        });

    });        
});