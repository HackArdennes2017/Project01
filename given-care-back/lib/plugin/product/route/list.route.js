'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductService = require('./../product.service');

module.exports = {
    method: 'GET',
    path: '/products/',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        ProductService.listProducts((err, products) => {
            if(err) reply(Boom.wrap(err));

            return reply(products);
        });
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'NoAuthStrategy',
        response: {
            status: {
                200: Joi.array()
            }
        }
    }
};