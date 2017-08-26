'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const ReportDAO = require('./report.dao.js');
const Hash = require('../../shared/security/Hash.class');

const UserService = require('../user/user.service');
const events = require('events');

class ReportService {

    
    constructor() {
    }

    _convertTypeToXP(type){
        switch(type){
            case 'restroomFull' :
                return 30;
                break;
            case 'trashCanFull' :
                return 10;
                break;
            case 'medicalHelp' :
                return 20;
                break;
            case 'unknown' :
                return 5;
                break;
            default :
                return 1;
                break;
        }
    }

    /**
     * Create a new report
     *
     * @param request
     * @param merchant
     * @param data
     * @param next
     *
     * @public
     */
    create(request, user, data, next) {

        request.log(['info'], `< ReportService.create >`);

        Object.assign(data, {userId : user._id.toString()});

        ReportDAO.insertOne(data, (err, report) => {
            if (err && err.code === 11000) return next('error while creating report');
            if (err) return next(Boom.wrap(err));

            const newScore = (user.score ? user.score : 0) + this._convertTypeToXP(report.type);
            UserService.updateScore(user._id.toString(),newScore , (err, user) => {
                if(err) return callback(Boom.wrap(err));

                return next(null, {report, gain:this._convertTypeToXP(report.type), totalXP : newScore});
            });
        });
    }

    /**
     * Get report by its id
     *
     * @param {String} id
     *
     * @public
     */
    getReportById(id, next) {
        ReportDAO.findOne({
            _id: ProductDAO.createSafeMongoID(id)
        }, (err, report) => {
            if (err) return next(Boom.wrap(err));
            if (!report) return next();

            return next(null, report);
        });
    }


}

module.exports = new ReportService();