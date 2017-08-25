'use strict';

const Boom = require('boom');
const async = require('async');

const cfgManager = require('node-config-manager');


class Project {
    constructor(document) {
        Object.assign(this, document);
    }

}

module.exports = Project;
