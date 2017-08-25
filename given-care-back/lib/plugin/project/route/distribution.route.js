'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user/user.service');

module.exports = {
    method: 'GET',
    path: '/projects/{id}/distribution',
    handler: (request, reply) => {


        const {id} = request.params;

        UserService.getTotalScore((err, total) => {
          
          reply({id, total});
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