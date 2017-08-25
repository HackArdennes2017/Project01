'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProjectService = require('../project.service');

module.exports = {
    method: 'GET',
    path: '/projects/:id',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        reply(ProjectService.getProjectById(request.path.id));
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