'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const User = require('./user.class');
const UserDAO = require('./user.dao');
const Hash = require('../../shared/security/Hash.class');

const AccountService = require('../account/account.service');

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
            createAccount: (callback) => {
                AccountService.create(request, {balance : 50}, callback);
            },
            createUser: ['createAccount', 'passwordEncrypted', (results, callback) => {

              const {createAccount, passwordEncrypted} = results;

                UserDAO.insertOne(userData.isMerchant ? {
                        accountNumber,
                        authentication: {
                            credentials: {
                                login: email.toLowerCase(),
                                password: passwordEncrypted
                            }
                        },
                        accountId: createAccount._id.toString(),
                        isMerchant : userData.isMerchant,
                        merchantDescription : userData.merchantDescription
                    } : {
                    accountNumber,
                    authentication: {
                        credentials: {
                            login: email.toLowerCase(),
                            password: passwordEncrypted
                        }
                    },
                    accountId: createAccount._id.toString(),
                    isMerchant : userData.isMerchant
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
     * @param {String} email
     * @param {Function} next
     *
     * @public
     */
    getUserByEmail(email, next) {
        UserDAO.findOne({
            'authentication.credentials.login': email
        }, (err, user) => {
            if (err) return next(Boom.wrap(err));
            if (!user) return next(Boom.notFound(`User Mail ${email} doesn't exist`));

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


    /**
     * Rate a project
     *
     * @param {String} userId
     * @param {String} projectId
     * @param {Int} rate
     * @param {Boolean} isNew
     * @param {Function} next
     *
     * @public
     */
    rateProject(userId, projectId, rate, isNew, next) {

        let query, update;

        if(isNew){

            query = { _id :UserDAO.createSafeMongoID(userId) };

            update = { $addToSet:
              {
                'rates': {
                  rate: rate,
                  projectId: projectId
                }
              }
            }

        } else {

          query = {
              _id: UserDAO.createSafeMongoID(userId),
              'rates.projectId': projectId
          }

          update = {
            $set: {
              'rates.$.rate': rate
            }
          }

        }

          UserDAO.findOneAndUpdate(query, update, { returnNewDocument: true }, (err, user) => {

              if (err) return next(Boom.wrap(err));
              if (!user) return next(Boom.notFound(`User ID ${userId} doesn't exist`));

              return next(null, new User(user));
          });


    }

    /**
     * Set score of a given user
     *
     * @param {String} userId
     * @param {Int} score
     * @param {Function} next
     *
     * @public
     */
    updateScore(userId, score, next) {

        UserDAO.findOneAndUpdate({
          _id: UserDAO.createSafeMongoID(userId)
        },{
          $set: {
            score: score
          }
        },{
          returnNewDocument: true
        }, (err, user) => {
            if (err) return next(Boom.wrap(err));
            if (!user) return next(Boom.notFound(`User ID ${userId} doesn't exist`));

            return next(null, new User(user));
        });

    }

    /**
    * Set settings
    * @param {String} userId
    * @param {Object} settings
    */
    updateSetting(userId, settings, next){
      UserDAO.findOneAndUpdate({
        _id: UserDAO.createSafeMongoID(userId)
      },{
        $set: {
          settings: settings
        }
      },{
        returnNewDocument: true
      }, (err, user) => {
          if (err) return next(Boom.wrap(err));
          if (!user) return next(Boom.notFound(`User ID ${userId} doesn't exist`));

          return next(null, new User(user));
      });
    }

    /**
    * Get a sum of all user score
    */
    getTotalScore(next){

      UserDAO.find({score: { $gt : 0 } },(err, users) => {

        if(err) return next(Boom.wrap(err));

        const total = users.reduce(function(sum, user) {
          return sum + user.score;
        }, 0);

        return next(null, total)

      });

    }

    /**
    * Get balanced rate for a given projectId and a given user
    * @param {String} userId
    * @param {String} projectId
    * @param {String} totalScore
    */
    getBalancedRate(userId, projectId, totalScore, next ){

        UserDAO.findOne({
          _id: UserDAO.createSafeMongoID(userId)
        }, (err, user) => {

          if (err) return next(Boom.wrap(err));
          if (!user) return next(Boom.notFound(`User ID ${userId} doesn't exist`));
          if (!user.rates) return next(Boom.notFound(`User ID ${userId} didn't rate project ID ${projectId} `));

          const rate = user.rates.find((rate) => {

            return rate.projectId == projectId;

          })

          if (!rate) return next(Boom.notFound(`User ID ${userId} didn't rate project ID ${projectId} `));

          const score = user.score;
          const balance = user.score / totalScore;
          
          return next(null, balance * rate.rate);

      });

    }

}

module.exports = new UserService();