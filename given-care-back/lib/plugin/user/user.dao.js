'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'User';

const JOI_REGEX_TOKEN_ID = /^[\d]{10}$/;

class UserDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            accountNumber: Joi.string(),
            authentication: {
                credentials: {
                    login: Joi.string().email().lowercase().required(),
                    password: Joi.binary().encoding('base64').required()
                }
            },
            accountId : Joi.string().required(),
            isMerchant : Joi.boolean().default(false).optional(),
            merchantDescription : Joi.object().keys({
                companyName : Joi.string().required(),
                description : Joi.string().optional()
            }).optional()
        }), [
            {
            name: '_id_',
            key: {
                _id: 1
            }
            }, {
            name : '_accountNumber_',
            key : {
                accountNumber : 1
                }
            }
    ]);
    }
}

module.exports = new UserDAO();
