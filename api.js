var express = require('express');
var mongoose = require('mongoose');
var baucis = require('baucis');

module.exports = function(app, cb) {

    // Connect to the Mongo instance
    mongoose.connect('mongodb://localhost/aAa-BaUcIs-ExAmPlE-AaA');

    // Create a Mongoose schema
    var Vegetable = new mongoose.Schema({ name: String });

    // Note that Mongoose middleware will be executed as usual
    Vegetable.pre('save', function (next) {
        console.log('A vegetable was saved to Mongo: %s.', this.get('name'));
        next();
    });

    // Register the schema
    mongoose.model('vegetable', Vegetable);

    // Create dummy data
    var names = [ 'tomato', 'turnip', 'lovage', 'snap pea', 'carrot', 'zucchini' ];
    var vegetables = names.map(function (name) { return { name: name } });

    // Clear the database of old vegetables
    mongoose.model('vegetable').remove(function revomeOldVegetables(error) {
        if (error) cb(error);

        // Put the fresh vegetables in the database
        mongoose.model('vegetable').create(vegetables, function createNewVegetables(error) {
            if (error) return cb(error);

            // Create the API routes
            baucis.rest('vegetable');
            app.use('/api/v1', baucis());
            cb();
        });
    });
};
