'use strict';

const Boom = require('boom');
const async = require('async');
const cfgManager = require('node-config-manager');

const UserService = require('../../../plugin/user/user.service');
const JWT = require('../JWT.class');

module.exports = function (server, options) { // jshint ignore:line
    return {
        authenticate: function (request, reply) {

            const headers = request.raw.req.headers;

            const authorization = headers['authorization'];

            async.auto({
                getJWTData: (callback) => {
                    if (authorization) {
                        return JWT.getData(request, callback);
                    }
                    else {
                        callback(null)
                    }
                },
                validateAuthenticationType: ['getJWTData', (results, callback) => {
                    if (authorization) {
                        const jwtData = results.getJWTData;

                        const data = (jwtData ? jwtData.data : null);

                        return callback(null, data);
                    }
                    else {
                        callback(null);
                    }
                }],
                getUser: ['getJWTData', (results, callback) => {
                    if (authorization) {
                        const {getJWTData} = results;

                        const userId = getJWTData.userId || '';

                        UserService.getUserById(userId.toString(), callback);
                    }
                    else {
                        callback(null);
                    }
                }]
            }, (err, results) => {
                if (err) return reply(Boom.wrap(err));

                const {getUser} = results;

                return reply.continue({
                    credentials: {
                        user: getUser
                    }
                });
            });
        },
        response: function (request, reply) {
            const headers = request.raw.req.headers;
            const authorization = headers['authorization'];

            async.auto({
                getJWTData: (callback) => {
                    if (authorization) {
                        return JWT.getData(request, callback);
                    }
                    else {
                        callback(null);
                    }
                },
                newJWT: ['getJWTData', (results, callback) => {
                    if (authorization) {
                        const {getJWTData} = results;
                        const userId = getJWTData.userId || '';
                        const data = getJWTData.data || {};

                        return JWT.create(request, userId.toString(), data, callback);
                    }
                    else {
                        callback (null);
                    }
                }]
            }, (err, results) => {
                if (err) {
                    console.log(err);
                    return reply(Boom.wrap(err));
                }

                if (authorization) {
                    request.response.header('Access-Control-Allow-Origin', '*');
                    request.response.header('Access-Control-Expose-Headers', 'authorization');
                    request.response.header('authorization', `Bearer ${results.newJWT}`);
                }
                reply.continue();
            });
        }
    };
};
