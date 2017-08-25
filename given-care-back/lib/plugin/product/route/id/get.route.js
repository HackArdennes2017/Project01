'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductService = require('./../../product.service.js');

module.exports = {
    method: 'GET',
    path: '/products/{id}',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;
        const {id} = request.params;

        ProductService.getProductById(id, (err, account) => {
            if(err) reply(Boom.wrap(err));

            return reply(account);
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
            })
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};