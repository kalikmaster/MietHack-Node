const CryptoJS = require("crypto-js");

const verifyTelegramWebAppData = async (telegramInitData) => {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get("hash");
    let dataToCheck = [];

    initData.sort();
    initData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`));

    const secret = CryptoJS.HmacSHA256(process.env.API_TOKEN, "WebAppData");
    const _hash = CryptoJS.HmacSHA256(dataToCheck.join("\n"), secret).toString(CryptoJS.enc.Hex);

    return _hash === hash;
}

module.exports = verifyTelegramWebAppData