var express = require('express');
var mongoose = require('mongoose');
var baucis = require('baucis');
var bouy = require('./models/bouy');

module.exports = function(app) {

    // Connect to the Mongo instance
    mongoose.connect('mongodb://localhost/24uzr');

    var Bouy = new mongoose.Schema(bouy);
    Bouy.pre('save', function (next) {
        console.log('A bouy was saved to Mongo: %s.', this.get('name'));
        next();
    });
    // Register the schema
    mongoose.model('bouy', Bouy);

    // Create the API routes
    baucis.rest('bouy');
    app.use('/api/v1', baucis());

    console.info('serving /api/v1');
};
