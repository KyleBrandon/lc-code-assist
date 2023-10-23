import {
    checkURLStatusCode,
    readCodeTemplate,
    readExecMain,
} from '../../src/helpers/general';

describe('General', () => {
    test('readCodeTemplate', () => {
        const result = readCodeTemplate();
        expect(result).toContain('use actix');
    });

    test('readExecMain', () => {
        const result = readExecMain();
        expect(result).toContain('async fn main');
    });

    test('Get URL status code', async () => {
        const status = await checkURLStatusCode('http://www.google.com');
        expect(status).toEqual(200);
    });
});
