import {RequestParam} from '../src/RequestParam';

describe('class RequestParam', () => {

    describe('The "query" getter', () => {

        it('return correct query segment', () => {
            const param = new RequestParam('val', 'test');
            expect(param.query).toEqual('val=test');
        });

        it('treat null values as empty string', () => {
            const param = new RequestParam('val', null);
            expect(param.query).toEqual('val=');
        });

        it('encode parameter values to be used in query string', () => {
            const param = new RequestParam('val', 'js OR javascript');
            expect(param.query).toEqual('val=js%20OR%20javascript');
        });        

    });
});