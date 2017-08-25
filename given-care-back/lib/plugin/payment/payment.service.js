'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const AccountDAO = require('./payment.dao.js');
const Hash = require('../../shared/security/Hash.class');

const events = require('events');

class PaymentService {

    
    constructor() {
    }

    /**
     * Create a new account for a given user
     *
     * @param request
     * @param data
     * @param next
     *
     * @public
     */
    create(request, data, next) {

        request.log(['info'], `< AccountService.create >`);

        AccountDAO.insertOne(data, (err, account) => {
            if (err && err.code === 11000) return next('error while creating account');
            if (err) return next(Boom.wrap(err));

            return next(null, account);
        });
    }

    /**
     * Get account by its id
     *
     * @param {String} id
     *
     * @public
     */
    getAccountById(id, next) {
        AccountDAO.findOne({
            _id: AccountDAO.createSafeMongoID(id)
        }, (err, account) => {
            if (err) return next(Boom.wrap(err));
            if (!account) return next();

            return next(null, account);
        });
    }


}

module.exports = new PaymentService();