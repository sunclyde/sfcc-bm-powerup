var domCache = {};
var secretKey = null;
var totpValue, totpTimeLeft;

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
        console.info('your secret key is loaded: ' + secretKey);
        
        var totp = new TOTP(key);
        totpValue = totp.genOTP();
        console.log("totp: " + totpValue);
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

function showTOTP() {
    domCache.totpValue.innerHTML = totpValue;
    domCache.totpTimeLeft.innerHTML = totpTimeLeft;
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});


//  * 12345678901234567890
//  * |  1111111109 |  2005-03-18  | 00000000023523EC | 07081804 |  SHA1  |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 68084774 | SHA256 |
//   |             |   01:58:29   |                  |          |        |
//   |  1111111109 |  2005-03-18  | 00000000023523EC | 25091201 | SHA512 |
//   |             |   01:58:29   |                  |          |        |
$(function () {
    $("#tabs").tabs();
});