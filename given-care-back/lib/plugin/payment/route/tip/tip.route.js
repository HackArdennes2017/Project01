'use strict';

const Joi = require('joi');
const Boom = require('boom');

const PaymentService = require('./../../payment.service.js');

module.exports = {
    method: 'POST',
    path: '/payments/totalAmount',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;

        const productId = request.payload.productId;
        const productNumber = request.payload.productNumber;
        const tip = request.payload.tip;

        PaymentService.computeTotalAmount(productId, productNumber, tip, (err, totalAmount) => {
            if(err) reply(Boom.wrap(err));

            return reply({ result: totalAmount});
        });
    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            payload : Joi.object({
                productId : Joi.string().required(),
                productNumber : Joi.number().required(),
                tip : Joi.number().required()
            })
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};