'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user.service');

module.exports = {
    method: 'PUT',
    path: '/users/me/projects/{id}/rate',
    handler: (request, reply) => {
        const rate = request.payload.rate;

        const isNew = request.payload.isNew

        console.log(isNew);

        const {id} = request.params;
        const {user} = request.auth.credentials;

        request.log(['debug'], `START < controller.projects.rate > Params => ${rate}`);

        UserService.rateProject(user._id, id, rate, isNew, (err, user) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.register > New rate [projectId: ${id}]`);

            return reply({status: true}).code(200);
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
                rate: Joi.number().required().min(1).max(3),
                isNew: Joi.boolean()
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