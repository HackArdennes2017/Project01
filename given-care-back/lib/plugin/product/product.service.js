'use strict';

const Boom = require('boom');
const async = require('async');
const cryptiles = require('cryptiles');

const ProductDAO = require('./product.dao.js');
const Hash = require('../../shared/security/Hash.class');

const events = require('events');

class ProductService {

    
    constructor() {
    }

    /**
     * Create a new product
     *
     * @param request
     * @param data
     * @param next
     *
     * @public
     */
    create(request, data, next) {

        request.log(['info'], `< AccountService.create >`);

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
     *
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


}

module.exports = new ProductService();