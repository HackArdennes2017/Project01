'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user.service');

module.exports = {
    method: 'GET',
    path: '/users/me',
    handler: (request, reply) => {

        reply(request.auth.credentials);

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