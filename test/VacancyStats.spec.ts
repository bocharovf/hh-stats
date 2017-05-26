import { VacancyStats } from '../src/VacancyStats';
import { CurrencyConverter, DictCurrencyConverter } from '../src/CurrencyConverter';

const emptyJson = `
    {
    "items":[],
    "found":0
    }            
`;
const multipleFullSalaryJson = `
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
const multiplePartialSalaryJson = `
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
`;
const differentCurrencyJson = `
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
`;

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

});