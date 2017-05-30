import { ApiRequest } from '../src/ApiRequest';
import { RequestParam } from '../src/RequestParam';

const emptyJson = JSON.parse(`
    {
    "items":[],
    "found":0
    }            
`);

const fakeHttpErrorResponse = { 
    status: 404,
    statusText: 'Sample HTTP error',
    json() {
        return {};
    }
};

describe('class ApiRequest', () => {

    describe('The "run" method', () => {

        it('call fetch with correct URL', () => {
            spyOn(window, 'fetch').and.callFake( () => Promise.resolve(emptyJson) );
            const args = [ new RequestParam('name1', 'value1'), new RequestParam('name2', 'value2') ];
            new ApiRequest('resource', args).run();

            const fetch = window.fetch as jasmine.Spy;
            const fetchArg1 = fetch.calls.argsFor(0)[0];
            expect(fetchArg1).toEqual('https://api.hh.ru/resource?name1=value1&name2=value2');
        });

        it('call fetch with correct User Agent header', () => {
            spyOn(window, 'fetch').and.callFake( () => Promise.resolve(emptyJson) );
            const userAgent = 'Custom User Agent';
            const apiRequest = new ApiRequest('resource', []);
            apiRequest.userAgent = userAgent;
            apiRequest.run();

            const fetch = window.fetch as jasmine.Spy;
            const fetchArg2 = fetch.calls.argsFor(0)[1];
            expect(fetchArg2.headers['User-Agent']).toEqual(userAgent);
        });

        it('throw error if response status not equal 200 OK', (done) => {
            spyOn(window, 'fetch').and.callFake( () => Promise.resolve(fakeHttpErrorResponse));
            const apiRequest = new ApiRequest('resource', []);
            apiRequest.run()
                .catch(error => {
                    expect(error.message).toEqual(fakeHttpErrorResponse.statusText);
                    done();
                });
        });

        it('throw TimeoutError if request wait longer than timeout', (done) => {
            spyOn(window, 'fetch').and.callFake( () => new Promise( (resolve, reject) => setTimeout(resolve, 1000)));
            const apiRequest = new ApiRequest('resource', []);
            apiRequest.timeout = 50;
            apiRequest.run()
                .catch(error => {
                    expect(error.message).toEqual('Api request timeout expired');
                    done();
                });
        });        

    });
});