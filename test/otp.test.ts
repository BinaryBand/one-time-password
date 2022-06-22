import { generate, verify } from '../src/index';


const KEY: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234';
const DATE: number = 1655853187578;

test('Simple generate test', (): void => {
    const token: string = generate(KEY, undefined, undefined, DATE);
    expect(token).toBe('479559');
});

test('Simple verify test', (): void => {
    const token: string = generate(KEY, undefined, undefined, DATE);
    expect(verify(KEY, token, undefined, undefined, DATE)).toBe(true);
});