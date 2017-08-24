'use strict';

const mongodb = require('mongodb');
const {ObjectID, MongoClient} =  mongodb;
const async = require('async');
const Boom = require('boom');

class Mongo {
    constructor() {
        this.connected = false;
        this._registry = {};
    }

    ObjectID(id) {
        return ObjectID(id);
    }

    connect(uri, options, next) {
        if (options instanceof Function) {
            next = options;
            options = {};
        }

        MongoClient.connect(uri, options, (err, database) => {
            if (err) return next(err);

            this.database = database;
            this.connected = true;

            return next();
        });
    }

    db() {
        return this.database;
    }

    close() {
        if (!(this.connected && this.database)) return;

        this.database.close();
    }

    registerDao(dao) {
        this._registry[dao._collectionName] = dao;
    }

    createIndexes(server, next = () => {
    }) {
        if (!(this.connected && this.database)) return;

        async.each(
            Object.keys(this._registry),
            (daoName, callback) => {
                const dao = this._registry[daoName];

                dao._collection.createIndexes(dao._indexes, (err) => {
                    if (err) server.log(['error'], {error: Boom.wrap(err), collection: daoName});

                    return callback();
                });
            },
            next
        );
    }
}

module.exports = new Mongo();