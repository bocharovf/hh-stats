import {DictCurrencyConverter} from '../src/CurrencyConverter';

describe('class DictCurrencyConverter', () => {

    describe('The "convert" method', () => {

        it('convert from value between currencies', () => {
            const converter = new DictCurrencyConverter([
                {code: 'RUR', rate: 1},
                {code: 'USD', rate: 0.01}
            ]);
            let converted = converter.convert(2, 'USD', 'RUR');
            expect(converted).toEqual(200);
        });

        it('does not change value for same origin and target currency', () => {
            const converter = new DictCurrencyConverter([
                {code: 'USD', rate: 0.01}
            ]);
            let converted = converter.convert(2.45, 'USD', 'USD');
            expect(converted).toEqual(2.45);
        });

        it('throw error if rate for origin currency is not defined', () => {
            const converter = new DictCurrencyConverter([
                {code: 'USD', rate: 0.01}
            ]);
            expect(() => converter.convert(2.45, 'RUR', 'USD'))
                .toThrowError('Rate for currency RUR is not defined');
        });

        it('throw error if rate for target currency is not defined', () => {
            const converter = new DictCurrencyConverter([
                {code: 'USD', rate: 0.01}
            ]);
            expect(() => converter.convert(2.45, 'USD', 'EUR'))
                .toThrowError('Rate for currency EUR is not defined');
        });

    });
});