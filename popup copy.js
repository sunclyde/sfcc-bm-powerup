/*
var domCache = {};
var lastTimeStep = 0;
var timeStep = 30000;
var totpValue, totpTimeLeft;
var secretKey = null;

function initDOM() {
    domCache.totpValue = document.querySelector("#totp-value");
    domCache.totpTimeLeft = document.querySelector("#totp-timeleft");
    domCache.inputKey = document.querySelector("#input-key");
    domCache.saveKey = document.querySelector("#save-key");
}

function loadKey() {
    chrome.storage.sync.get(['totpSecretKey'], function (result) {
        secretKey = result.totpSecretKey;
        console.log('Load key: ' + secretKey);
        loadTotpEvent();
    });
}

async function loadTotpEvent() {
    if (secretKey == null) {
        console.info('your secret key is empty.');
    } else {
        console.info('your secret key is loaded.');
        totpValue = await generateTOTP(secretKey);
        totpTimeLeft = getTOTPTimeLeft();
        showTOTP();
        
        console.log("totp: " + totpValue)
    }
}

async function initEvent() {
    loadKey();
    $('#save-key').on('click', function () {
        var inputKey = $('#input-key').val();
        if (inputKey !== null) {
            secretKey = inputKey;

            chrome.storage.sync.set({ totpSecretKey: secretKey }, function () {
                console.log('Value is set to ' + secretKey);
            });
        }
    });
}

function init() {
    initDOM();
    initEvent();
}

function padCounter(counter) {
    const buffer = new ArrayBuffer(8);
    const bView = new DataView(buffer);

    const byteString = '0'.repeat(64); // 8 bytes
    const bCounter = (byteString + counter.toString(2)).slice(-64);

    for (let byte = 0; byte < 64; byte += 8) {
        const byteValue = parseInt(bCounter.slice(byte, byte + 8), 2);
        bView.setUint8(byte / 8, byteValue);
    }

    return buffer;
}

function DT(HS) {
    // First we take the last byte of our generated HS and extract last 4 bits out of it.
    // This will be our _offset_, a number between 0 and 15.
    const offset = HS[19] & 0b1111;

    // Next we take 4 bytes out of the HS, starting at the offset
    const P = ((HS[offset] & 0x7f) << 24) | (HS[offset + 1] << 16) | (HS[offset + 2] << 8) | HS[offset + 3]

    // Finally, convert it into a binary string representation
    const pString = P.toString(2);

    return pString;
}

function truncate(uKey) {
    const Sbits = DT(uKey);
    const Snum = parseInt(Sbits, 2);
    return Snum;
}

async function generateHOTP(secret, counter) {
    const key = await generateKey(secret, counter);
    const uKey = new Uint8Array(key);
    const Snum = truncate(uKey);
    // Make sure we keep leading zeroes
    const padded = ('00000000' + (Snum % (10 ** 6))).slice(-8);

    return padded;
}

async function generateKey(secret, counter) {
    const Crypto = window.crypto.subtle;
    // const encoder = new TextEncoder('utf-8');
    const encoder = new TextEncoder('ASCII');
    const secretBytes = encoder.encode(secret);
    const counterArray = padCounter(counter);

    const key = await Crypto.importKey(
        'raw',
        secretBytes,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );

    const HS = await Crypto.sign('HMAC', key, counterArray);
    return HS;
}

function getTOTPTimeLeft() {
    const timeSinceStep = Date.now() - lastTimeStep * timeStep;
    const timeLeft = Math.ceil((timeStep - timeSinceStep) / 1000);
    console.log("timeLeft: " + timeLeft);
    return timeLeft;
}

//  * 12345678901234567890
//  * |  1111111109 |  2005-03-18  | 00000000023523EC | 07081804 |  SHA1  |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 68084774 | SHA256 |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 25091201 | SHA512 |
//   |             |   01:58:29   |                  |          |        |
function getTOTPCounter() {
    const time = Date.now();
    // const time = new Date(2005, 02, 18, 09, 58, 29);
    var counter = Math.floor(time / timeStep);
    console.log("time: " + time.toUTCString());
    console.log("counter: " + counter);
    return counter;
}

async function generateTOTP() {
    // var hotp = generateHOTP(secretKey, getTOTPCounter());
    var hotp = generateHOTP("12345678901234567890", getTOTPCounter());
    return hotp;
}

async function showTOTP() {
    domCache.totpValue.innerHTML = totpValue;
    domCache.totpTimeLeft.innerHTML = totpTimeLeft;
}

function tickCounter() {

    const timeSinceStep = Date.now() - lastTimeStep * stepWindow;
    const timeLeft = Math.ceil((timeStep - timeSinceStep) / 1000);

    updateTimer(timeLeft);

    if (timeLeft > 0) {
        return requestAnimationFrame(tickCounter);
    }

    lastTimeStep = getTOTPCounter();

    requestAnimationFrame(tickCounter);
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});
*/


//  * 12345678901234567890
//  * |  1111111109 |  2005-03-18  | 00000000023523EC | 07081804 |  SHA1  |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 68084774 | SHA256 |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 25091201 | SHA512 |
//   |             |   01:58:29   |                  |          |        |
$(function () {
    $("#tabs").tabs();

    var key = TOTP.randomKey();
    var totp = new TOTP(key);
    console.log(totp.genOTP());
});