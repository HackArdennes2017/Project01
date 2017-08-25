'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user/user.service');

module.exports = {
    method: 'PUT',
    path: '/projects/{id}/rate',
    handler: (request, reply) => {
        const {rate} = request.payload;

        const {id} = request.params;
        const {user} = request.auth.credentials;

        request.log(['debug'], `START < controller.projects.rate > Params => ${rate}`);

        UserService.rateProject(user._id, id, rate, (err, user) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.register > New rate [projectId: ${id}]`);

            return reply({status: true}).code(201);
        });
    },
    config: {
        tags: ['api', 'user'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            payload: {
                rate: Joi.number().required().min(1).max(3)
            },
            params: Joi.object({
              'id': Joi.string().required()
            })
        },
        response: {
            status: {
                200: Joi.object({
                    status: Joi.boolean()
                })
            }
        }
    }
};