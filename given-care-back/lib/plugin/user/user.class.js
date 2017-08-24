'use strict';

const Boom = require('boom');
const async = require('async');

const cfgManager = require('node-config-manager');


class User {
    constructor(document) {
        Object.assign(this, document);
    }

    /**
     * getEmail
     * @returns {string}
     */
    getEmail() {
        return (
            this.authentication &&
            this.authentication.credentials &&
            this.authentication.credentials.login
        ) ?
            this.authentication.credentials.login :
            '';
    }
}

module.exports = User;
