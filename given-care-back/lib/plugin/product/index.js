'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id/get.route.js'));
    server.route(require('./route/create.route.js'));


    return next();
};

register.attributes = {
    name: 'product'
};

module.exports = register;