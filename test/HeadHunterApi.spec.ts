import {HeadHunterApi} from '../src/HeadHunterApi';
import {DictCurrencyConverter, CurrencyConverter} from '../src/CurrencyConverter';
import {ApiRequest} from '../src/ApiRequest';
import {VacancyStats} from '../src/VacancyStats';

describe('class HeadHunterApi', () => {

    describe('The "getCustomVacancy" method', () => {

        const sampleResponseJson = `
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
        `;

        let converter: CurrencyConverter;
        let api: HeadHunterApi;

        beforeEach(() => {
            converter = new DictCurrencyConverter([]);
            spyOn(converter, 'convert').and.callFake( (value:number, from:string, to:string) => value);
            api = new HeadHunterApi(converter);
            spyOn(ApiRequest.prototype, 'run').and.callFake(() => Promise.resolve(sampleResponseJson));
        });        

        it('requests 4 vacancy pages from api', (done) => {
            api.getCustomVacancy().then(stats => {
                expect(ApiRequest.prototype.run).toHaveBeenCalledTimes(4);
                done();
            });
        });

        it('parses 4 vacancy responses', (done) => {
            spyOn(VacancyStats, 'parse').and.callThrough();

            api.getCustomVacancy().then( stats => {
                expect(VacancyStats.parse).toHaveBeenCalledTimes(4);
                let parse = VacancyStats.parse as jasmine.Spy;
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
            spyOn(VacancyStats, 'merge').and.callThrough();

            api.getCustomVacancy().then( stats => {
                expect(VacancyStats.merge).toHaveBeenCalledTimes(1);
                let merge = VacancyStats.merge as jasmine.Spy;
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
});