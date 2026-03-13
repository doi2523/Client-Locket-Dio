const CryptoJS = require("crypto-js");
const { logInfo, logError } = require("../logger.service.js");

const decryptLoginData = (encryptedEmail, encryptedPassword) => {
    try {
        logInfo("decryptLoginData", "Start decrypting login data");

        const secretKey = process.env.HASH_SECRET_KEY;
        const decryptedEmail = CryptoJS.AES.decrypt(
            encryptedEmail,
            secretKey
        ).toString(CryptoJS.enc.Utf8);

        const decryptedPassword = CryptoJS.AES.decrypt(
            encryptedPassword,
            secretKey
        ).toString(CryptoJS.enc.Utf8);

        logInfo("decryptLoginData", "Decrypted login data successfully");
        return { decryptedEmail, decryptedPassword };
    } catch (error) {
        logError("decryptLoginData", error.message);
        throw error;
    }
};

module.exports = {
    decryptLoginData,
};
