var should = require('should'),
    sinon = require('sinon'),
    request = require('request'),
    bouy = require('../../../src/api/models/bouy');

describe('api.v1.bouy', function () {

    describe('.properties', function () {
        it('should have a name', function (done) {
            bouy.name.should.beDefined;
            done();
        });

        it('should have a location', function (done) {
            bouy.location.should.beDefined;
            done();
        });

        describe('.location', function(done) {
            it('should have an x', function (done) {
                bouy.location.x.should.beDefined;
                done();
            });

            it('should have a y', function (done) {
                bouy.location.y.should.beDefined;
                done();
            });
        });
    });

    describe('baucis api', function() {
        var added;
        it('should respond to post bouy with 201', function(done) {
            request({
                url: 'http://localhost:8080/api/v1/bouies',
                method: 'POST',
                // headers: {
                //     'Accept': 'application/json'
                // },
                json: {
                    name:'test-a',
                    location: {x: 0, y: 0}
                }
            }, function(err, response, bouy) {
                added = bouy;
                response.statusCode.should.equal(201);
                done();
            });
        });   

        it('should respond to get bouy with 200', function(done) {
            request.get('http://localhost:8080/api/v1/bouies/' + added._id, function(err, response, bouy) {
                response.statusCode.should.equal(200);
                done();
            });
        });   

        it('should respond to get bouy with an object containing a name', function(done) {
            request.get('http://localhost:8080/api/v1/bouies/' + added._id, function(err, response, body) {
                bouy = JSON.parse(body);
                bouy.name.should.equal('test-a');
                done();
            });
        });   

        it('should respond to delete bouy with 200', function(done) {
            request.del('http://localhost:8080/api/v1/bouies/' + added._id, function(err, response) {
                response.statusCode.should.equal(200);
                done();
            });
        });   

        it('should respond to get bouy with 404 after it is deleted', function(done) {
            request.get('http://localhost:8080/api/v1/bouies/' + added._id, function(err, response) {
                response.statusCode.should.equal(404);
                done();
            });
        });   

    });
});
