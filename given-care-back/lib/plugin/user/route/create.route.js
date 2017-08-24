'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../user.service');

module.exports = {
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
        const payload = request.payload;

        request.log(['debug'], `START < controller.users.create > Params => ${JSON.stringify(payload)}`);

        UserService.create(request, payload, (err, user) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.register > New user [id: ${user._id}]`);

            return reply({status: true}).code(201);
        });
    },
    config: {
        tags: ['api', 'user'],
        auth: false,
        validate: {
            headers: Joi.object().options({allowUnknown: true}),
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            }
        },
        response: {
            status: {
                201: Joi.object({
                    status: Joi.boolean()
                })
            }
        }
    }
};