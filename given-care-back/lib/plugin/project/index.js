'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id.route'));
    server.route(require('./route/project.route'));
    server.route(require('./route/rate.route'));
    server.route(require('./route/distribution.route'));

    return next();
};

register.attributes = {
    name: 'project'
};

module.exports = register;