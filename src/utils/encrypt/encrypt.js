import CryptoJS from "crypto-js";

// Hàm mã hóa email và password
export const encryptLoginData = (email, password) => {
    const secretKey = process.env.REACT_APP_HASH_SECRET_KEY;
    if (!secretKey) {
        throw new Error("Secret key is not defined");
    }

    const encryptedEmail = CryptoJS.AES.encrypt(email, secretKey).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

    return { encryptedEmail, encryptedPassword };
};

// Hàm giải mã email và password
export const decryptLoginData = (encryptedEmail, encryptedPassword) => {
    const secretKey = process.env.REACT_APP_HASH_SECRET_KEY;
    if (!secretKey) {
        throw new Error("Secret key is not defined");
    }

    const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, secretKey).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, secretKey).toString(CryptoJS.enc.Utf8);

    return { decryptedEmail, decryptedPassword };
};
