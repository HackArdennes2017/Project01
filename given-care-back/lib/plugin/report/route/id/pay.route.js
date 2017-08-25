'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductService = require('./../../report.service.js');

module.exports = {
    method: 'POST',
    path: '/products/{id}/pay',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;
        const {id} = request.params;

        ProductService.payProduct(request, id, user, request.payload, (err, res) => {
            if(err) reply(Boom.wrap(err));

            return reply({status : true});
        });
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object().keys({
                id : Joi.string().required()
            }),
            payload :  Joi.object().keys({
                tip : Joi.number().optional()
            })
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};