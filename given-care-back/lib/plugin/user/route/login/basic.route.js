'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user.service');
const JWT = require('../../../../shared/security/JWT.class');

module.exports = {
    method: 'POST',
    path: '/users/login/basic',
    handler: (request, reply) => {
        const {
            payload
        } = request;

        UserService.loginByCredentials(payload.email, payload.password, (err, user) => {
            if (err) return reply(Boom.wrap(err));

            JWT.create(request, user._id.toString(), {credentials: true}, (err, jwt) => {
                if (err) return reply(Boom.wrap(err));

                request.log(['info'], `< controller.login.credentials > User connected [_id: ${user._id.toString()}]`);

                return reply({status: true})
                    .header('authorization', `Bearer ${jwt}`)
                    .code(200);
            });
        });
    },
    config: {
        tags: ['api', 'user', 'login'],
        auth: false,
        validate: {
            headers: Joi.object().options({allowUnknown: true}),
            payload: Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required()
            })
        },
        response: {
            status: {
                200: Joi.object().keys({
                    status: Joi.boolean()
                })
            }
        }
    }
};