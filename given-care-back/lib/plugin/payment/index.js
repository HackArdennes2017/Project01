'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id/get.route.js'));

    return next();
};

register.attributes = {
    name: 'payment'
};

module.exports = register;