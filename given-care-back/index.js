'use strict';

const cfgManager = require('node-config-manager');
const JsonWebToken = require('jsonwebtoken');

cfgManager.init({
    env: process.env.NODE_ENV || 'development',
    configDir: process.env.NODE_CONFIG_DIR || './config',
    camelCase: true
});

[
    'api',
    'good',
    'mongo',
    'security'
].forEach(config => {
    cfgManager.addConfig(config);
});

const cfgApi = cfgManager.method.Api();
const cfgGood = cfgManager.method.Good();
const cfgMongo = cfgManager.method.Mongo();

// extend Joi
const Joi = require('joi');
Joi.objectId = Joi.extend(require('@wegolook/joi-objectid')).objectId;
Joi.phone = require('joi-phone');

const async = require('async');
const Hapi = require('hapi');
const server = new Hapi.Server();
const mongo = require('./lib/shared/mongo');

server.log(['info'], 'test');

async.auto({
    mongo: (callback) => {
        mongo.connect(cfgMongo.uri, cfgMongo.options, callback);
    }
}, (err) => {
    if (err) throw err;

    // adding a new connection that can be listened on
    server.connection(cfgApi);

    // define strategies
    server.auth.scheme('user', require('./lib/shared/security/auth/user.auth'));
    server.auth.strategy('UserStrategy', 'user');

    server.auth.scheme('admin', require('./lib/shared/security/auth/admin.auth'));
    server.auth.strategy('AdminStrategy', 'admin');


    // global plugins
    server.register([
        require('inert'),
        require('vision'), {
            register: require('hapi-swagger'),
            options: {
                info: {
                    title: 'API Documentation',
                    version: '1.0.0'
                }
            }
        }, {
            register: require('good'),
            options: cfgGood
        }, {
            register: require('./lib/plugin/user'),
            options: {
                routes: {
                    prefix: '/api/v1/'
                }
            }
        }, {
            register: require('./lib/plugin/project'),
        },
        {
            register: require('./lib/plugin/account'),
            options: {
                routes: {
                    prefix: '/api/v1/'
                }
            }
        },
        {
            register: require('./lib/plugin/product'),
            options: {
                routes: {
                    prefix: '/api/v1/'
                }
            }
        }
    ], (err) => {
        if (err) throw err;

        mongo.createIndexes(server);

        server.ext('onRequest', (request, reply) => {
            const headers = request.raw.req.headers || {};
            let authorization = headers.authorization;

            const _oldRequestLog = request.log;

            if (authorization) {
                authorization = headers.authorization =
                    authorization.indexOf('Bearer') >= 0 ?
                        authorization.substring('Bearer '.length, authorization.length) : authorization;
            }

            request.log = function (tags, data, args) {
                data = data || {};

                if ('string' === typeof data) data = {message: data};

                if (authorization) data.trackingNumber = (JsonWebToken.decode(authorization) || {}).trackingNumber || 'unknown';

                if (args) {
                    data.message += ` [${
                        Object
                            .keys(args)
                            .map(key => {
                                return `${key}: ${typeof args[key] === 'object' ? JSON.stringify(args[key]) : args[key]}`;
                            })
                            .join(', ')
                        }]`;
                }

                _oldRequestLog.call(request, tags, data);
            };

            return reply.continue();
        });

        server.ext('onPreResponse', require('./lib/middleware/onPreResponse/errorHandler'));

        // starting the server
        server.start((err) => {
            // check if error occurred during server starting
            if (err) throw err;

            server.log(['info'], `< Server > Server started at: ${server.info.uri}`);
        });
    });
})
;
