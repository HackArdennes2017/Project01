'use strict';

const Boom = require('boom');
const async = require('async');

const Project = require('./project.class');
const ProjectDAO = require('./project.dao');
const UserService = require('../user/user.service');
const UserDAO = require('../user/user.dao');

const cfgManager = require('node-config-manager');


class ProjectService {


    constructor() {
    }


    /**
     * Get project by id
     *
     * @param {String} projectId
     * @param {Function} next
     *
     * @public
     */
    getProjectById(projectId, next) {
        ProjectDAO.findOne({
            _id: ProjectDAO.createSafeMongoID(projectId)
        }, (err, project) => {
            if (err) return next(Boom.wrap(err));
            if (!project) return next(Boom.notFound(`Project ID ${projectId} doesn't exist`));

            return next(null, new Project(project));
        });
    }


    /**
     * Get all projects
     *
     * @param {Function} next
     *
     * @public
     */
    getAllProjects(next) {
        ProjectDAO.find({}, (err, projects) => {
            if (err) return next(Boom.wrap(err));

            const projectObjects = projects.map((project) => {
              return new Project(project);
            });

            return next(null, projectObjects);
        });
    }



    /**
    * Get distribution rate for a given project
    * @param {String} projectId
    */
    getDistribution(projectId, next){

      UserService.getTotalScore((err, total) => {

        if(err) return next(Boom.wrap(err));

        UserDAO.find({score: { $gt : 0 }, 'rates.projectId': {$exists : 1} },(err, users) => {

          if(err) return next(Boom.wrap(err));

          async.map(users, (user, callback) => {

            UserService.getBalancedRate(user._id, projectId, total, (err, rate) => {
              if(err) return callback(err);
              return callback(null, rate);
            });

          }, (err, rates) => {

            const rateTotal = rates.reduce(function(sum, rate) {
              return sum + rate;
            }, 0);

            return next(null, rateTotal);

          })

        });

      });

    }


}

module.exports = new ProjectService();