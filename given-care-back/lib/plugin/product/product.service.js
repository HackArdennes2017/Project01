'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const ProductDAO = require('./product.dao.js');
const Hash = require('../../shared/security/Hash.class');
const PaymentService = require('../payment/payment.service');
const AccountService = require('../account/account.service');

const UserService = require('../user/user.service');
const events = require('events');

class ProductService {


    constructor() {
    }

    /**
     * Create a new product
     *
     * @param request
     * @param merchant
     * @param data
     * @param next
     *
     * @public
     */
    create(request, merchant, data, next) {

        request.log(['info'], `< AccountService.create >`);

        Object.assign(data, {merchantId : merchant._id.toString()});

        ProductDAO.insertOne(data, (err, product) => {
            if (err && err.code === 11000) return next('error while creating product');
            if (err) return next(Boom.wrap(err));

            return next(null, product);
        });
    }

    /**
     * Get product by its id
     *
     * @param {String} id
     * @public
     */
    getProductById(id, next) {
        ProductDAO.findOne({
            _id: ProductDAO.createSafeMongoID(id)
        }, (err, product) => {
            if (err) return next(Boom.wrap(err));
            if (!product) return next();

            return next(null, product);
        });
    }

    /**
     * Pay for a product
     *
     * @param id
     * @param next
     */
    payProduct(request, id, user, data, next){

        async.auto({
            product : (callback) => {
                this.getProductById(id, callback);
            },
            merchant : ['product', (results, callback) => {
                const {product} = results;
                const {merchantId} = product;

                UserService.getUserById(merchantId, callback);
            }],
            payment : ['merchant', (results, callback) => {
                const {product, merchant} = results;
                const {price} = product;
                const {tip} = data;

                const payment = {
                    totalAmount : price + tip,
                    tipAmount: tip ? tip : 0,
                    status: 'created',
                    debitorAccountId: user.accountId,
                    creditorAccountId: merchant.accountId
                };

                return callback(null, payment);
            }],
            processDebit : ['payment', (results, callback) => {
                const debitorAccountId = user.accountId;
                const {payment} = results;

                AccountService.getAccountById(debitorAccountId, (err, account) => {
                    if(err) return callback(Boom.wrap(err));
                    if(!account) return callback(Boom.badData('debitor not found'));

                    const balance = account.balance - payment.totalAmount;

                    if(balance < 0 )
                        return callback(Boom.forbidden('Insufficient funds'));

                    console.log("balance debitor : " + balance);

                    AccountService.updateAccountById(debitorAccountId, {balance}, callback);
                })
            }],
            processCreditMerchant : ['payment', (results, callback) => {
                const {merchant} = results;
                const creditorAccountId = merchant.accountId;
                const {payment} = results;

                AccountService.getAccountById(creditorAccountId, (err, account) => {
                    if(err) return callback(Boom.wrap(err));
                    if(!account) return callback(Boom.badData('creditor not found'));

                    const balance = account.balance + payment.totalAmount - (payment.tipAmount ? payment.tipAmount : 0);

                    console.log("balance creditor : " + balance);

                    AccountService.updateAccountById(creditorAccountId, {balance}, callback);
                })
            }],
            processCreditGlobalPot : ['payment', (results, callback) => {
                const {payment} = results;

                if(payment.tipAmount) {
                    AccountService.getGlobalPot((err, account) => {
                        if (err) return callback(Boom.wrap(err));
                        if (!account) return callback(Boom.badData('creditor not found'));

                        const balance = account.balance + payment.totalAmount;

                        console.log("balance pot : " + balance);

                        AccountService.updateAccountById(account._id.toString(), {balance}, callback);
                    });
                } else
                    return callback();

            }],
            insertPayment : ['processDebit', 'processCreditMerchant', 'processCreditGlobalPot', (results, callback) => {

                const {payment} = results;
                payment.status = 'proceeded';

                PaymentService.create(request, payment, callback);
            }]
        }, (err, results) => {
            if(err) return next(Boom.wrap(err));

            return next(null, results.insertPayment);
        })

    }


    listProducts(next){
        ProductDAO.find({},{},next);
    }
}

module.exports = new ProductService();