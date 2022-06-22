import assert from 'assert';


export const BASE_32: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export const BASE_58: string = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function encodingSize(msg: Uint8Array, base: number): [number, number] {
    let zeroes: number = 0;
    while (zeroes < msg.length && msg[zeroes] === 0) zeroes++;

    const factor: number = Math.log(256) / Math.log(base);
    const size: number = ((msg.length - zeroes) * factor + 1) >>> 0;

    return [size, zeroes];
}

/**
 * Convert byte array to text.
 * @param {Uint8Array} msg The byte array to be encoded.
 * @param {string} charMap Each byte will map to the 'charMap' alphabet.
 * @returns {string} Encoded byte array.
 */
export function encodeBaseX(msg: Uint8Array, charMap: string): string {
    const BASE: number = charMap.length;

    // We won't know the exact length of our output until we finish calculating 'out', but we can
    // calculate its theoretical size limit.
    const [maxSize, leadingZeroes] = encodingSize(msg, BASE);
    
    // Each entry of 'revOut' represents its respective 'charMap' character in reverse order.
    const revOut: Uint8Array = new Uint8Array(maxSize);

    let len: number = 0;
    for (let i: number = leadingZeroes; i < msg.length; i++) {
        let carry: number = msg[i];

        // Add 'msg[i]' to 'revOut'. Each entry exceeding the base limit will be added to the
        // following array entry.
        let j: number = 0;
        for (; j < len || carry; j++) {
            const n: number = revOut[j] * 256 + carry;
            carry = n / BASE | 0;
            revOut[j] = n % BASE;
        }

        // Now we know our output length must be at least 'j'.
        len = j;
    }

    // Leading zeros from 'msg' must be represented by our output string even if they do not
    // technically change its numeric value.
    let out: string = charMap[0].repeat(leadingZeroes);

    // Reverse 'revOut' and append the each character to 'out'.
    while (len--) {
        const charIndex: number = revOut[len];
        out += charMap[charIndex];
    }

    return out;
}

function decodingSize(str: string, leadingChar: string, base: number): [number, number] {
    let zeroes: number = 0;
    while (str[zeroes] === leadingChar) zeroes++;

    const factor: number = Math.log(base) / Math.log(256);
    const size: number = ((str.length - zeroes) * factor + 1) >>> 0;

    return [size, zeroes];
}

/**
 * Convert text to byte array.
 * @param {string} str The text to be decoded.
 * @param {string} charMap Each byte will map to the 'charMap' alphabet.
 * @returns {Uint8Array} Decoded string.
 */
export function decodeBaseX(str: string, charMap: string): Uint8Array {
    const BASE: number = charMap.length;
    const [maxSize, leadingZeroes] = decodingSize(str, charMap[0], BASE);

    // Each entry of 'revOut' represents its respective 'charMap' index in reverse order.
    const revOut: Uint8Array = new Uint8Array(maxSize);

    let len: number = 0;
    for (let i: number = leadingZeroes; i < str.length; i++) {
        let carry: number = charMap.indexOf(str[i]);

        // Make sure each character in 'str' is in 'charMap'.
        assert(carry !== -1, `Char '${str[i]}' is invalid.`);

        // Add 'str[i]' to 'revOut'. Any value exceeding 32 bits will be added to the following
        // array entry.
        let j: number = 0;
        for (; j < len || carry; j++) {
            const n: number = (revOut[j] || 0) * BASE + carry;
            carry = n >> 8;
            revOut[j] = n % 256;
        }

        len = j;
    }

    const out: Uint8Array = new Uint8Array(len + leadingZeroes);
    for (let i: number = leadingZeroes; len--; i++) {
        const index: number = revOut[len];
        out[i] = index;
    }

    return out;
}