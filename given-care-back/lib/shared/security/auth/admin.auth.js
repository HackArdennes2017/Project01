'use strict';

const Boom = require('boom');
const async = require('async');
const cfgManager = require('node-config-manager');
const cfgSecurity = cfgManager.method.Security();


const UserService = require('../../../plugin/user/user.service');
const JWT = require('../JWT.class');

module.exports = function (server, options) { // jshint ignore:line
    return {
        authenticate: function (request, reply) {

            const headers = request.raw.req.headers;

            const adminPassword = headers['admin-password'];

            if(cfgSecurity.admin.password !== adminPassword)
                return reply(Boom.forbidden('Only admins'));

            return reply.continue({
                credentials: {
                    user: {}
                }
            });
        }
    };
};
