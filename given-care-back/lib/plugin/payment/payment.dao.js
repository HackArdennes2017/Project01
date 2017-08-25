'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'Account';

class PaymentDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            totalAmount : Joi.number().required(),
            tipAmount: Joi.number().default(0).optional(),
            status: Joi.string().valid(['created', 'proceeded']),
            debitorAccountId: Joi.string().required(),
            creditorAccountId: Joi.string().required()
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

module.exports = new PaymentDAO();
