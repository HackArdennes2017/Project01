'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'Account';

class AccountDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            balance : Joi.number().default(50).optional(),
            isGlobalPot : Joi.boolean().default(false).optional() //définit la cagnotte
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

module.exports = new AccountDAO();
