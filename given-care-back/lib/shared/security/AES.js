'use strict';

const Buffer = require('buffer').Buffer;
const Boom = require('boom');
const crypto = require('crypto');

class AES {
    constructor(options = {}) {
        this._password = options.password || 'Y§CHfpAAgV§IB°_Z'; //TODO: update password from environment
        this._salt = options.salt || '8QGeMtw9H5JrxBqq'; //TODO: update salt from configuration
        this._iterations = options.iterations || 4096;
        this._keylen = options.keylen || 48;
        this._digest = options.digest || 'sha256';
        this._algorithm = options.algorithm || 'aes-256-cbc';
    }

    generateKey(request, next) {
        request.log(['debug'], 'START < AES.generateKey >');

        crypto.pbkdf2(this._password, this._salt, this._iterations, this._keylen, this._digest, (err, buffer) => {
            if (err) {
                request.log(['debug'], 'END < AES.generateKey > with error');
                return next(Boom.wrap(err));
            }

            const key = buffer.slice(0, 32).toString('hex');
            const iv = buffer.slice(32).toString('hex');

            request.log(['debug'], 'END < AES.generateKey >');

            return next(null, {
                key,
                iv
            });
        });
    }

    encrypt(request, data, next) {
        request.log(['debug'], 'START < AES.encrypt >');

        this.generateKey(request, (err, aes) => {
            const cipher = crypto.createCipheriv(this._algorithm, new Buffer(aes.key, 'hex'), new Buffer(aes.iv, 'hex'));
            const encryptedBuffer = cipher.update(new Buffer(data));
            const finalBuffer = cipher.final();
            const encrypted = finalBuffer ? Buffer.concat([encryptedBuffer, finalBuffer]).toString('base64') : encryptedBuffer.toString('base64');

            request.log(['debug'], `END < AES.encrypt > [buffer: ${encrypted}]`);

            return next(null, encrypted);
        });
    }

    decrypt(request, encrypted, next) {
        request.log(['debug'], 'START < AES.decrypt >');

        this.generateKey(request, (err, aes) => {
            if (err) return next(Boom.wrap(err));

            const cipher = crypto.createDecipheriv(this._algorithm, new Buffer(aes.key, 'hex'), new Buffer(aes.iv, 'hex'));
            const decryptedBuffer = cipher.update(new Buffer(encrypted));
            const finalBuffer = cipher.final();
            const decrypted = finalBuffer ? Buffer.concat([decryptedBuffer, finalBuffer]) : decryptedBuffer;

            request.log(['debug'], `END < AES.decrypt >`);

            return next(null, decrypted);
        });
    }
}

module.exports = new AES();
