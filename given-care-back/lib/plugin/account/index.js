'use strict';

const register = function (server, options, next) {

    server.route(require('./route/get.route'));

    return next();
};

register.attributes = {
    name: 'account'
};

module.exports = register;