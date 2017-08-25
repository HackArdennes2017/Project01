'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProjectService = require('../project.service');

module.exports = {
    method: 'GET',
    path: '/projects/{id}/distribution',
    handler: (request, reply) => {


        const {id} = request.params;

        ProjectService.getDistribution(id, (err, total) => {

          reply({total: total});

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