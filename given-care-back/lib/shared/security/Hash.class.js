'use strict';

const Boom = require('boom');
const Hoek = require('hoek');
const crypto = require('crypto');

const cfgManager = require('node-config-manager');
const cfgSecurity = cfgManager.method.Security();

const SALT = cfgSecurity.password && cfgSecurity.password.salt;

Hoek.assert(SALT, 'Security configuration must be contain password.salt value');

class Hash {
    constructor() {}

    static create(data, next) {
        crypto.pbkdf2(data, SALT, 4096, 32, 'sha256', (err, buffer) => {
            if (err) return next(Boom.wrap(err));

            return next(null, buffer.toString('base64'));
        });
    }
}

module.exports = Hash;