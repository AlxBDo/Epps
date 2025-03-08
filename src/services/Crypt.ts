import CryptoJS from "crypto-js";

const logStyleOptions = { bgColor: 'black', icon: '🧮' }


export default class Crypt {
    private _key: any;
    private _iv: any;

    constructor(key: string, iv: string) {
        this._key = CryptoJS.enc.Utf8.parse(key);
        this._iv = CryptoJS.enc.Utf8.parse(iv);
    }

    /**
     * Decrypt string passed in parameter
     * @param {string} item - encrypted string
     * @returns {string} decrypted item
     */
    decrypt(item: string): string {
        let cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(item) });
        let decryptedFromText = CryptoJS.AES.decrypt(cipherParams, this._key, { iv: this._iv });
        return decryptedFromText.toString(CryptoJS.enc.Utf8)
    }

    /**
     * Encrypt string passed in parameter
     * @param {string} item
     * @returns {string} encrypted item
     */
    encrypt(item: string): string {
        let encryptedCP = CryptoJS.AES.encrypt(item, this._key, { iv: this._iv });
        let cryptText = encryptedCP.toString();
        return cryptText
    }
}