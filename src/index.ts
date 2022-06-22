import WordArray from 'crypto-js/lib-typedarrays';
import { decodeBaseX, BASE_32 } from './basex';
import { HmacSHA1 as hmac } from 'crypto-js';
import { Buffer } from 'safer-buffer';


type Endian = 'be' | 'le';

function numToArray(num: number, endian: Endian = 'be', size?: number): Uint8Array {
    let len: number = size || Math.ceil(Math.log2(num) / 8);
    const byteArray: Uint8Array = new Uint8Array(len);

    for (let index: number = 0; index < len; index++) {
        const curr: number = endian === 'le' ? index : len - (index + 1);
        const byte: number = num & 0xff;
        byteArray[curr] = byte;
        num = (num - byte) / 256;
    }

    return byteArray;
}

function sha1Hmac(msg: Uint8Array, key: Uint8Array): Uint8Array {
    const words: WordArray = WordArray.create(msg as unknown as number[]);
    const keyArray: WordArray = WordArray.create(key as unknown as number[]);
    const hash: WordArray = hmac(words, keyArray);
    return Buffer.from(hash.toString(), 'hex');
}

export function generate(key: string, len: number = 6, interval: number = 30, date?: number): string {
    const length: number = Math.ceil(key.length / 32) * 32;
    const normalizedKey: string = key.padEnd(length, 'A');
    const keyBytes: Uint8Array = decodeBaseX(normalizedKey, BASE_32);

    date = date || Date.now();
    const counter: number = ((date / 1000) / interval) | 0;

    // Convert 'counter' from integer to a 8-byte array and hash it.
    const counterBytes: Uint8Array = numToArray(counter, 'be', 8);
    const hash: Uint8Array = sha1Hmac(counterBytes, keyBytes);

    const offset: number = hash[19] & 0x0f;
    const n: number = (hash[offset] & 0x7f) << 24 |
        (hash[offset + 1] & 0xff) << 16 |
        (hash[offset + 2] & 0xff) << 8 |
        (hash[offset + 3] & 0xff);

    // Only return the last 'len' number of digits in key.
    const s: string = n.toString();
    return s.slice(-len);
};

export function verify(key: string, token: string, len: number = 6, interval: number = 30, date?: number): boolean {
    const target: string = generate(key, len, interval, date);
    return target === token;
}