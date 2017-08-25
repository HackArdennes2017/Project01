'use strict';

const Joi = require('joi');
const Boom = require('boom');

const UserService = require('../../user.service');

module.exports = {
    method: 'PUT',
    path: '/users/me/settings',
    handler: (request, reply) => {
        const { user } = request.auth.credentials;
        const settings = request.payload;

        UserService.updateSetting(user._id, settings, (err, user) => {
          if (err) return reply(Boom.wrap(err));

          request.log(['info'], `< controller.register > New setting [userId: ${user._id}]`);

          return reply({status: true}).code(200);
        });

    },
    config: {
        tags: ['api', 'user', 'me'],
        auth: 'UserStrategy',
        validate: {
            headers: Joi.object({
                'authorization': Joi.string().required()
            }).options({allowUnknown: true}),
            payload: Joi.object().keys({
              autoTip: Joi.number().min(0)
            })
        },
        response: {
            status: {
                200: Joi.object()
            }
        }
    }
};