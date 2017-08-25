'use strict';

const Boom = require('boom');
const async = require('async');

const Project = require('./project.class');
const ProjectDAO = require('./project.dao');

const UserService = require('../user/user.service');
const UserDAO = require('../user/user.dao');

const AccountDAO = require('../account/account.dao');

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

      //get score sum
      UserService.getTotalScore((err, total) => {

        if(err) return next(Boom.wrap(err));

        // get all projects
        this.getAllProjects((err, projects) => {

            if (err) return next(Boom.wrap(err));

            // for each project get the users rate
            async.mapSeries(projects, (project, callback1) => {

              UserDAO.find({},  (err, users) => {

                if(err) return next(Boom.wrap(err));

                // for each user get the rates
                async.mapSeries(users, (user, callback2) => {

                  UserService.getBalancedRate(user._id, project._id, total, (err, rate) => {

                    if(err) return callback2(err);
                    if(!rate) return callback2(null, 0);
                    return callback2(null, rate);

                  });

                }, (err, rates) => {

                  const rateTotal = rates.reduce((sum, rate) => {
                    if(!rate) return sum;
                    return sum + rate;
                  }, 0);

                  return callback1(null, {rateTotal, projectId: project._id});

                });

              });

            }, (err, distributions) => {

              const projectDistribution = distributions.find((distribution) => {
                return distribution.projectId == projectId
              });

              const distributionTotal = distributions.reduce((sum, distribution) => {
                return sum + distribution.rateTotal;
              }, 0);

              const balance = projectDistribution.rateTotal / distributionTotal;

              AccountDAO.findOne({isGlobalPot: true}, (err, pot) => {

                if(err) return next(Boom.wrap(err));

                return next(null, pot.balance * balance);

              });

            });

        })

      });

    }


}

module.exports = new ProjectService();