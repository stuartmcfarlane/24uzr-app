var BaseService = require('./BaseService');
var Q = require('q');

function resolve(deferred, theUser) {
    theUser.getRoles().success(function(theRoles) {
        var user = theUser.values;
        user.roles = theRoles.map(function(role) {
            return role.dataValues;
        });
        deferred.resolve(user);
    });
}

module.exports = function(db, models) {
    var UserService = BaseService.extend({
        authenticate: function(credentials) {
            var deferred = Q.defer();
            
            models.User.find({
                where: credentials
            })
            .success(resolve.bind(null, deferred))
            .error(deferred.reject);

            return deferred.promise;
        },
        findById: function(id) {
            var deferred = Q.defer();

            models.User.find({
                where: {id: id}
            })
            .success(resolve.bind(null, deferred))
            .error(deferred.reject);

            return deferred.promise;
        },
        hasRole: function(user, roleName) {
            return user.roles && user.roles.some(function(role) {
                return role.name === roleName;
            });
        }
    });

    UserService.Model = models.User;
    return new UserService(db);
};
