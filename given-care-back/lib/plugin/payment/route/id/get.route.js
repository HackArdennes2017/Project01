'use strict';

const Joi = require('joi');
const Boom = require('boom');

const PaymentService = require('./../../payment.service.js');

module.exports = {
    method: 'GET',
    path: '/payments/{id}',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        PaymentService.getPaymentById(request.params.id, (err, payment) => {
            if(err) reply(Boom.wrap(err));

            return reply(payment);
        });
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            params : Joi.object({
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