// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Generates Hex Hash out of given string
 * @param message
 */
export async function digestMessageToHexHash(message: string) {
    // encode as (utf-8) Uint8Array
    const msgUint8 = new TextEncoder().encode(message);
    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    // convert buffer to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
