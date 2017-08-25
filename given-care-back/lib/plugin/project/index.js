'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id.route'));
    server.route(require('./route/list.route.js'));
    server.route(require('./route/distribution.route'));

    return next();
};

register.attributes = {
    name: 'project'
};

module.exports = register;