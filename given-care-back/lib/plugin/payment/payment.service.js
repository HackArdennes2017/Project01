'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const PaymentDAO = require('./payment.dao.js');
const Hash = require('../../shared/security/Hash.class');

const ProductService = require('../product/product.service');

const events = require('events');

class PaymentService {


    constructor() {
    }

    /**
     * Create a new payment
     *
     * @param request
     * @param data
     * @param next
     *
     * @public
     */
    create(request, data, next) {

        request.log(['info'], `< PaymentService.create >`);

        PaymentDAO.insertOne(data, (err, payment) => {
            if (err && err.code === 11000) return next('error while creating payment');
            if (err) return next(Boom.wrap(err));

            return next(null, payment);
        });
    }

    /**
     * Get payment by its id
     *
     * @param {String} id
     *
     * @public
     */
    getPaymentById(id, next) {
        PaymentDAO.findOne({
            _id: PaymentDAO.createSafeMongoID(id)
        }, (err, payment) => {
            if (err) return next(Boom.wrap(err));
            if (!payment) return next();

            return next(null, payment);
        });
    }

    /**
     * Compute the amount with the defined tip
     *
     * @param {String} id
     *
     * @public
     */
    computeTotalAmount(productId, productNumber, tip, next) {
        ProductService.getProductById(productId, (err, product) => {
          if (err) return next(Boom.wrap(err));
          if(!product) return next(Boom.notFound(`Product ID ${productId} doesn't exist`))

          const {price} = product;
          const amount = productNumber * price;

          const decimal = 1 / tip;

          const totalAmount = Math.ceil(amount * decimal) / decimal;
          return next(null, totalAmount);
        });

    }


}

module.exports = new PaymentService();