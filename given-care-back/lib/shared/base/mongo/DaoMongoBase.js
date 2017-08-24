'use strict';

const Joi = require('joi');
const boom = require('boom');

const mongo = require('../../mongo');

class DaoMongoBase {

    constructor(collectionName, schema, indexes = []) {
        this._collectionName = collectionName;
        this._collection = mongo.db().collection(collectionName);
        this._schema = schema;
        this._indexes = indexes;

        mongo.registerDao(this);
    }

    createSafeMongoID(id) {
        if (typeof id === 'string') return mongo.ObjectID(id);

        return id;
    }

    get collectionName() {
        return this._collectionName;
    }

    get schema() {
        return this._schema;
    }

    get collection() {
        return this._collection;
    }

    /**
     * Get size of collection with query
     * @param query
     * @param options
     * @param next
     */
    count(query, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        this.collection.count(query, options, (err, count) => {
            if (err) return next(err);

            return next(null, count);
        });
    }

    /**
     * Create a new document
     * @param document
     * @param options (optional)
     * @param next
     */
    insertOne(document, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        Joi.validate(document, this.schema, (err, _document) => {
            if (err) return next(err);

            _document.created = new Date();
            _document.lastUpdated = new Date();

            this.collection.insertOne(_document, options, (err, res) => {
                if (err) return next(err);

                return next(null, res.ops ? res.ops[0] : null);
            });
        });
    }

    /**
     * Find one document
     * @param query
     * @param options
     * @param next
     */
    findOne(query, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        this.collection
            .find(query)
            .limit(1)
            .next((err, doc) => {
                if (err) return next(err);
                if (!doc) return (options.required ? next(boom.notFound(`${this.collectionName} not found`, query)) : next());

                return next(null, doc);
            });
    }

    /**
     * Find documents
     * @param query
     * @param options
     * @param next
     */
    find(query, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        this.collection
            .find(query)
            .limit(options.limit || 10)
            .skip(options.skip || 0)
            .toArray((err, docs) => {
                if (err) return next(err);

                return next(null, docs);
            });
    }


    /**
     * Update one document
     * @param query
     * @param update
     * @param options
     * @param next
     */
    updateOne(query, update, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        update.$set = update.$set || {};
        update.$set.lastUpdated = new Date();

        this.collection
            .updateOne(query, update, options, (err, res) => {

                if (err) return next(err);

                const result = res ? res.result : {};

                return next(null, !!(result.ok));
            });
    }

    /**
     * findOneAndUpdate
     * @param query
     * @param document
     * @param options
     * @param next
     */
    findOneAndUpdate(query, document, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        this.collection.findOneAndUpdate(query,
            document,
            options,
            (err, result) => {
                if (err)return next(err);

                return next(null, result.value);
            }
        );
    }
}

module.exports = DaoMongoBase;