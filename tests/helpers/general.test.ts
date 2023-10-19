import {
    checkURLStatusCode,
    readCodeTemplate,
    readExecMain,
    saveBackendCode,
    saveAPIEndpoints,
} from '../../src/helpers/general';

describe('General', () => {
    test('readCodeTemplate', () => {
        const result = readCodeTemplate();
        expect(result).toContain('use actix');
    });

    test('readExecMain', () => {
        const result = readExecMain();
        expect(result).toContain('println!');
    });

    test('Get URL status code', async () => {
        const status = await checkURLStatusCode('http://www.google.com');
        expect(status).toEqual(200);
    });
});
