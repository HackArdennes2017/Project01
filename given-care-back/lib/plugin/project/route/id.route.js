'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProjectService = require('../project.service');

module.exports = {
    method: 'GET',
    path: '/projects/{id}',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        ProjectService.getProjectById(request.params.id, (err, project) => {
          if (err) return reply(Boom.wrap(err));
          reply(project);
        })
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