'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user.service');

module.exports = {
    method: 'GET',
    path: '/users/me/projects/{id}/rate',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        if(!user.rates) return reply({status: false}).code(404);

        const rate = user.rates.find((rate) => {
          return rate.projectId == request.params.id;
        });

        if(!rate) return reply({status: false}).code(404);

        reply(rate).code(200);
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object({
              'id': Joi.string().required()
            })
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};