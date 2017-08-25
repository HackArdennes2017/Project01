'use strict';

const Boom = require('boom');
const async = require('async');

const Project = require('./project.class');
const ProjectDAO = require('./project.dao');

const cfgManager = require('node-config-manager');


class UserService {


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


}

module.exports = new UserService();