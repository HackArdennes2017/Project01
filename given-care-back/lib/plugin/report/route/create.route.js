'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductService = require('../report.service.js');

module.exports = {
    method: 'POST',
    path: '/products',
    handler: (request, reply) => {
        const payload = request.payload;
        const {user} = request.auth.credentials;

        request.log(['debug'], `START < controller.users.create > Params => ${JSON.stringify(payload)}`);

        ProductService.create(request, user, payload, (err, product) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.product > New product [id: ${product._id}]`);

            return reply({status: true}).code(201);
        });
    },
    config: {
        tags: ['api', 'user'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object().keys({
                'authorization' : Joi.string().required()
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