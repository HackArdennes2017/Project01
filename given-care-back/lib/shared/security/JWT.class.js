'use strict';

const Boom = require('boom');
const async = require('async');
const uuid = require('uuid');
const JsonWebToken = require('jsonwebtoken');
const cfgManager = require('node-config-manager');

const cfgSecurity = cfgManager.method.Security();


const AES = require('./AES');

class JWT {
    constructor(jwt) {
        this._jwt = jwt;
    }

    static create(request, userId, data, next) {
        request.log(['debug'], 'START < JWT.create >');

        data = data || {};

        if (!data.trackingNumber) data.trackingNumber = uuid.v4();

        const privateKey = cfgSecurity.jwt && cfgSecurity.jwt.secret;
        const options = {};

        options.audience = 'given-care';
        options.subject = `given-care|${userId}`;

        return next(null, JsonWebToken.sign({
            userId,
            provider: 'given-care',
            data
        }, privateKey, options));

    }

    static getData(request, next) {
        const headers = request.raw.req.headers || {};
        const authorization = headers.authorization;

        if (authorization) {
            let data, err;

            try {
                data = JsonWebToken.decode(authorization);
            } catch (e) {
                err = e;
            }

            return next(err, data);
        } else {
            return next(Boom.internal("No data found in JWT"));
        }

    }
}

module.exports = JWT;