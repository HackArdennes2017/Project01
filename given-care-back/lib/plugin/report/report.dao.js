'use strict';

const Joi = require('joi');
const DaoMongoBase = require('../../shared/base/mongo/DaoMongoBase');
const COLLECTION_NAME = 'Report';

class ReportDAO extends DaoMongoBase {
    constructor() {
        super(COLLECTION_NAME, Joi.object().keys({
            type : Joi.string().valid(['restroomFull', 'trashCanFull', 'medicalHelp', 'unknown']).default('unknown').optional(),
            comment : Joi.string().optional(),
            image : Joi.any(),
            gps : Joi.object().keys({
                latitude : Joi.number().required(),
                longitude : Joi.number().required()
            }).optional(),
            userId : Joi.string().required()
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

module.exports = new ReportDAO();
