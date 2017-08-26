'use strict';

const Joi = require('joi');
const Boom = require('boom');

const AccountService = require('./../account.service');

module.exports = {
    method: 'GET',
    path: '/accounts/',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        AccountService.getAccountById(user.accountId.toString(), (err, account) => {
            if(err) reply(Boom.wrap(err));

            return reply(account);
        });
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true})
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};