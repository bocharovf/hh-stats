import { VacancyStats } from '../src/VacancyStats';
import { CurrencyConverter, DictCurrencyConverter } from '../src/CurrencyConverter';

const emptyJson = JSON.parse(`
    {
    "items":[],
    "found":0
    }            
`);
const multipleFullSalaryJson = JSON.parse(`
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
const multiplePartialSalaryJson = JSON.parse(`
    {
    "items":[
        {
            "salary":{
                "to":100000,
                "from":null,
                "currency":"RUR"
            }
        },
        {
            "salary":{
                "to":null,
                "from":10000,
                "currency":"RUR"
            }
        },
        {
            "salary": null
        }
    ],
    "found":398618
    }            
`);
const differentCurrencyJson = JSON.parse(`
    {
    "items":[
        {
            "salary":{
                "to":20,
                "from":10,
                "currency":"EUR"
            }
        },
        {
            "salary":{
                "to":40,
                "from":30,
                "currency":"USD"
            }
        }
    ],
    "found":398618
    }            
`);

describe ("class VacancyStats",() => {

    describe("The 'parse' method", () => {
        let currencyConverter: CurrencyConverter;
        
        beforeEach(() => {
            currencyConverter = new DictCurrencyConverter([]);
            spyOn(currencyConverter, 'convert').and.callFake( (value:number, from:string, to:string) => value);
        });

        it('parse zero items response', () => {
            const stat = VacancyStats.parse(emptyJson, currencyConverter);
            expect(stat.amount).toBe(0, 'amount');
            expect(stat.used).toBe(0, 'used');
            expect(stat.minSalary).toBe(0, 'minSalary');
            expect(stat.avgSalary).toBe(0, 'avgSalary');
            expect(stat.maxSalary).toBe(0, 'maxSalary');
        });

        it('parse multiple items response with full salary', () => {
            const stat = VacancyStats.parse(multipleFullSalaryJson, currencyConverter);
            expect(stat.amount).toBe(398618, 'amount');
            expect(stat.used).toBe(2, 'used');
            expect(stat.minSalary).toBe(10000, 'minSalary');
            expect(stat.avgSalary).toBe(37500, 'avgSalary');
            expect(stat.maxSalary).toBe(90000, 'maxSalary');
        });

        it('parse multiple items response with partial salary', () => {
            const stat = VacancyStats.parse(multiplePartialSalaryJson, currencyConverter);
            expect(stat.amount).toBe(398618, 'amount');
            expect(stat.used).toBe(2, 'used');
            expect(stat.minSalary).toBe(10000, 'minSalary');
            expect(stat.avgSalary).toBe(55000, 'avgSalary');
            expect(stat.maxSalary).toBe(100000, 'maxSalary');
        });

        it('convert currency to rubles using CurrencyConverter', () => {
            const stat = VacancyStats.parse(differentCurrencyJson, currencyConverter);
            let convert = currencyConverter.convert as jasmine.Spy;
            expect(convert.calls.count()).toEqual(2 * 3, 'total call amount');
            expect(convert.calls.argsFor(0)).toEqual([10, 'EUR', 'RUR'], 'item #1 convert min salary');
            expect(convert.calls.argsFor(1)).toEqual([30, 'USD', 'RUR'], 'item #2 convert min salary');
            expect(convert.calls.argsFor(2)).toEqual([20, 'EUR', 'RUR'], 'item #1 convert max salary');
            expect(convert.calls.argsFor(3)).toEqual([40, 'USD', 'RUR'], 'item #2 convert max salary');
            expect(convert.calls.argsFor(4)).toEqual([15, 'EUR', 'RUR'], 'item #1 convert avg salary');
            expect(convert.calls.argsFor(5)).toEqual([35, 'USD', 'RUR'], 'item #2 convert avg salary');
        });         
    });

    describe('The "merge" method', () => {
        let stat1: VacancyStats;
        let stat2: VacancyStats;
        let emptyStat: VacancyStats;

        beforeEach(() => {
            stat1 = new VacancyStats(20,100,60,453,70);
            stat2 = new VacancyStats(10,130,70,503,30);
            emptyStat = new VacancyStats(0,0,0,0,0);
        });

        it('calc used as summary of used fields', () => {
            const merged = VacancyStats.merge(stat1, stat2);
            expect(merged.used).toEqual(100);
        });

        it('calc amount as max value among amounts', () => {
            const merged = VacancyStats.merge(stat1, stat2);
            expect(merged.amount).toEqual(503);
        });

        it('calc minSalary as min value among min salaries', () => {
            const merged = VacancyStats.merge(stat1, stat2);
            expect(merged.minSalary).toEqual(10);
        });        

        it('calc maxSalary as max value among max salaries', () => {
            const merged = VacancyStats.merge(stat1, stat2);
            expect(merged.maxSalary).toEqual(130);
        });

        it('calc avgSalary as average of average salaries', () => {
            const merged = VacancyStats.merge(stat1, stat2);
            expect(merged.avgSalary).toEqual(65);
        });

        it('ignore "empty" arguments with (where used <= 0)', () => {
            const merged = VacancyStats.merge(stat1, emptyStat, stat2);
            expect(merged.used).toEqual(100);
            expect(merged.amount).toEqual(503);
            expect(merged.minSalary).toEqual(10);
            expect(merged.maxSalary).toEqual(130);
            expect(merged.avgSalary).toEqual(65);
        });            

    });
});