'use strict';

const Boom = require('boom');
const async = require('async');
const cfgManager = require('node-config-manager');

const JWT = require('../JWT.class');

module.exports = function (server, options) { // jshint ignore:line
    return {
        authenticate: function (request, reply) {
                return reply.continue({
                    credentials: {}
                });
        },
        response: function (request, reply) {

            request.response.header('Access-Control-Expose-Headers', 'authorization');

            reply.continue();
        }
    };
};
