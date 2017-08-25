'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ReportService = require('./../../report.service.js');

module.exports = {
    method: 'GET',
    path: '/reports/{id}',
    handler: (request, reply) => {
        const {user} = request.auth.credentials;
        const {id} = request.params;

        ReportService.getReportById(id, (err, report) => {
            if(err) reply(Boom.wrap(err));

            return reply(report);
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