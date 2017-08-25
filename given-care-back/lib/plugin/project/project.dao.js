'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'Project';

const JOI_REGEX_TOKEN_ID = /^[\d]{10}$/;

class ProjectDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            name: Joi.string().required(),
            description: Joi.string().required(),
            icon: Joi.string()
        }), [
            {
              name: '_id_',
              key: {
                  _id: 1
              }
            }
    ]);
    }
}

module.exports = new ProjectDAO();
