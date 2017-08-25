'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const User = require('./user.class');
const UserDAO = require('./user.dao');
const Hash = require('../../shared/security/Hash.class');

const cfgManager = require('node-config-manager');

const uuidv4 = require('uuid/v4');
const JWT = require('../../shared/security/JWT.class');

const events = require('events');

class UserService {

    
    constructor() {
    }

    _generateAccountNumber() {
        return (
            cryptiles.randomDigits(7)
        ).toUpperCase();
    }

    /**
     * Create a new user
     *
     * @param request
     * @param userData
     * @param next
     *
     * @public
     */
    create(request, userData, next) {
        const {
            email, password
        } = userData;

        const accountNumber = this._generateAccountNumber();

        request.log(['info'], `< UserService.create > Generate Account Number [accountNumber: ${accountNumber}]`);

        async.auto({
            passwordEncrypted: (callback) => {
                Hash.create(password, callback);
            },
            createUser: ['passwordEncrypted', (results, callback) => {

                const {passwordEncrypted} = results;

                UserDAO.insertOne({
                    accountNumber,
                    authentication: {
                        credentials: {
                            login: email.toLowerCase(),
                            password: passwordEncrypted
                        }
                    }
                }, (err, user) => {
                    if (err && err.code === 11000) return callback('email already exists');
                    if (err) return callback(Boom.wrap(err));

                    return callback(null, user);
                });
            }]
        }, (err, results) => {
            if (err) return next(Boom.wrap(err));

            return next(null, results.createUser);
        });
    }


    /**
     * Get user by email
     *
     * @param {String} appId
     * @param {String} email
     * @param {Function} next
     *
     * @public
     */
    getUserByEmail(appId, email, next) {
        UserDAO.findOne({
            'authentication.credentials.login': email
        }, (err, user) => {
            if (err) return next(Boom.wrap(err));
            if (!user) return next();

            return next(null, new User(user));
        });
    }

    /**
     * Get user by id
     *
     * @param {String} userId
     * @param {Function} next
     *
     * @public
     */
    getUserById(userId, next) {
        UserDAO.findOne({
            _id: UserDAO.createSafeMongoID(userId)
        }, (err, user) => {
            if (err) return next(Boom.wrap(err));
            if (!user) return next(Boom.notFound(`User ID ${userId} doesn't exist`));

            return next(null, new User(user));
        });
    }



    /**
     * Connect user with credentials
     * @param appId
     * @param email
     * @param password
     * @param next
     */
    loginByCredentials(email, password, next) {

        async.auto({
            passwordEncrypted: (callback) => {
                Hash.create(password, callback);
            },
            getUser: ['passwordEncrypted', (results, callback) => {
                UserDAO.findOne({
                    'authentication.credentials.login': email.toLowerCase()
                }, (err, user) => {
                    if (err) return callback(Boom.wrap(err));
                    if (!user) return callback(Boom.unauthorized('User not found'));
                    if (!new Buffer(results.passwordEncrypted, 'base64').equals(user.authentication.credentials.password.buffer))
                        return callback('bad credentials');

                    return callback(null, new User(user));
                });
            }]
        }, (err, results) => {
            if (err) return next(Boom.wrap(err));

            return next(null, results.getUser);
        });
    }

}

module.exports = new UserService();