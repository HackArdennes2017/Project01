'use strict';

module.exports = function (request, reply) {
    const {
        response
    } = request;

    if (response.isBoom) {
        request.log(['error'], response);
    }

    return reply.continue();
};