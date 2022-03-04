var key = TOTP.randomKey();
var totp = new TOTP(key);
console.log(totp.genOTP());