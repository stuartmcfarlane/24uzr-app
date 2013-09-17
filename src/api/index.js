var express = require('express');
var mongoose = require('mongoose');
var baucis = require('baucis');
var bouy = require('./models/bouy');
var leg = require('./models/leg');
var ship = require('./models/ship');

var API_BASE = '/api/v1';

module.exports = function(app) {

    function registerModel(model, name,  middleware) {
        var Model = new mongoose.Schema(model);
        // Register the schema
        mongoose.model(name, Model);
        // Create the API routes
        Model.pre('save', function (next) {
            console.log('A ' + model + ' was saved to Mongo: %s.', this.get('name'));
            next();
        });
        console.info('Adding REST api for ' + name);
        baucis
        .rest(name)
        .use(middleware);

        console.log('middleware', middleware);
    }

    var injector = app.get('injector');

    injector.inject(function (UserController) {

        // Connect to the Mongo instance
        mongoose.connect('mongodb://localhost/24uzr');

        function middleware(req, res, next) {
            console.log('auth', typeof req.method);
            var auth = {
                head: UserController.requiresLogin,
                get: UserController.requiresLogin,
                post: UserController.requiresRole('admin'),
                put: UserController.requiresRole('admin'),
                del: UserController.requiresRole('admin'),
            };
            auth[req.method.toLowerCase()](req, res, next);
        }

        registerModel(bouy, 'bouy', middleware);
        registerModel(leg, 'leg', middleware);
        registerModel(ship, 'ship', middleware);

        app.use(API_BASE, baucis({
            version: 1
        }));

        console.info('serving ' + API_BASE);
    });
};
