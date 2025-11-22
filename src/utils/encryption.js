import CryptoJS from "crypto-js";

const SECRET_KEY = "RestoScanSuperSecretKey123";  // IMPORTANT: Same in encrypt & decrypt

export function encryptData(data) {
  try {
    const jsonData = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption Failed:", error);
    return null;
  }
}

export function decryptData(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) return null;

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
