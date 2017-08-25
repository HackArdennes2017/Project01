'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ReportService = require('../report.service.js');

module.exports = {
    method: 'POST',
    path: '/reports',
    handler: (request, reply) => {
        const payload = request.payload;
        const {user} = request.auth.credentials;

        request.log(['debug'], `START < controller.users.create > Params => ${JSON.stringify(payload)}`);

        ReportService.create(request, user, payload, (err, report) => {
            if (err) return reply(Boom.wrap(err));

            request.log(['info'], `< controller.product > New product [id: ${report._id}]`);

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
                type : Joi.string().valid(['restroomFull', 'trashCanFull', 'medicalHelp', 'unknown']).default('unknown').optional(),
                comment : Joi.string().optional(),
                image : Joi.any().optional(),
                gps : Joi.object().keys({
                    latitude : Joi.number().required(),
                    longitude : Joi.number().required()
                }).optional()
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