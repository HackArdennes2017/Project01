'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductService = require('../product.service');

module.exports = {
    method: 'POST',
    path: '/products',
    handler: (request, reply) => {
        const payload = request.payload;

        request.log(['debug'], `START < controller.users.create > Params => ${JSON.stringify(payload)}`);

        ProductService.create(request, payload, (err, product) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.product > New product [id: ${product._id}]`);

            return reply({status: true}).code(201);
        });
    },
    config: {
        tags: ['api', 'user'],
        auth: 'AdminStrategy',
        validate: {
            headers: Joi.object().keys({
                'admin-password' : Joi.string().required()
            }).options({allowUnknown: true}),
            payload: {
                description : Joi.string().optional(),
                price : Joi.number().min(0).required(),
                currency : Joi.string().default('EUR').required()
            }
        },
        response: {
            status: {
                201: Joi.object({
                    status: Joi.boolean()
                })
            }
        }
    }
};