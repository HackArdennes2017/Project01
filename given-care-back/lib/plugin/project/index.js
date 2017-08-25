'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id.route'));
    server.route(require('./route/list.route.js'));
    server.route(require('./route/rate.route'));

    return next();
};

register.attributes = {
    name: 'project'
};

module.exports = register;