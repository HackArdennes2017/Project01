'use strict';

const register = function (server, options, next) {

    server.route(require('./route/login/basic.route'));
    server.route(require('./route/create.route'));
    server.route(require('./route/me/me.route'));
    server.route(require('./route/me/settings.route'));

    return next();
};

register.attributes = {
    name: 'user'
};

module.exports = register;