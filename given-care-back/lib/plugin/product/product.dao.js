'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'Product';

class ProductDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            description : Joi.string().optional(),
            price : Joi.number().min(0).required(),
            currency : Joi.string().default('EUR').required(),
            merchantId : Joi.string().required()
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

module.exports = new ProductDAO();
