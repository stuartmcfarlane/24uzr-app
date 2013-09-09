var express = require('express');
var mongoose = require('mongoose');
var baucis = require('baucis');
var bouy = require('./models/bouy');
var leg = require('./models/leg');
var ship = require('./models/ship');

module.exports = function(app) {

    function registerModel(model, name) {
        var Model = new mongoose.Schema(model);
        // Register the schema
        mongoose.model(name, Model);
        // Create the API routes
        Model.pre('save', function (next) {
            console.log('A ' + model + ' was saved to Mongo: %s.', this.get('name'));
            next();
        });
        baucis.rest(name);
    };

    // Connect to the Mongo instance
    mongoose.connect('mongodb://localhost/24uzr');

    registerModel(bouy, 'bouy');
    registerModel(leg, 'leg');
    registerModel(ship, 'ship');

    app.use('/api/v1', baucis());

    console.info('serving /api/v1');
};
