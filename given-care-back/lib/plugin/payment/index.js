'use strict';

const register = function (server, options, next) {

    server.route(require('./route/id/get.route.js'));
    server.route(require('./route/tip/tip.route.js'));

    return next();
};

register.attributes = {
    name: 'payment'
};

module.exports = register;