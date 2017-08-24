'use strict';

const Boom = require('boom');
const async = require('async');
const uuid = require('uuid');
const JsonWebToken = require('jsonwebtoken');

const AES = require('./AES');

class JWT {
    constructor(jwt) {
        this._jwt = jwt;
    }

    static create(request, userId, data, next) {
        request.log(['debug'], 'START < JWT.create >');

        data = data || {};

        if (!data.trackingNumber) data.trackingNumber = uuid.v4();

        async.auto({
            privateKeyDecrypted: ['getApplication', (results, callback) => {
                const application = results.getApplication;

                AES.decrypt(request, application.security.jwt.privateKey.buffer, callback);
            }]
        }, (err, results) => {
            if (err) return next(err);

            const privateKey = results.privateKeyDecrypted;
            const options = application.security.jwt.options;

            options.audience = appId;
            options.subject = `${application.name}|${userId}`;

            return next(null, JsonWebToken.sign({
                userId,
                provider: application.name,
                data
            }, privateKey, options));
        });
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