'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProjectService = require('../project.service');

module.exports = {
    method: 'GET',
    path: '/projects',
    handler: (request, reply) => {
        ProjectService.getAllProjects((err, projects) => {
            if (err) return reply(Boom.wrap(err));
            reply({data: projects});
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