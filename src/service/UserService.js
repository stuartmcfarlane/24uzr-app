var BaseService = require('./BaseService');
var Q = require('q');

module.exports = function(db, models) {
    var UserService = BaseService.extend({
        authenticate: function(credentials) {
            var deferred = Q.defer();
            
            models.User.find({
                where: credentials
            })
            .success(function(theUser) {
                theUser.getRoles().success(function(theRoles) {
                    var user = theUser.values;
                    user.roles = theRoles.map(function(role) {
                        return role.dataValues;
                    });
                    deferred.resolve(user);
                });
            })
            .error(deferred.reject);

            return deferred.promise;
        }
    });

    UserService.Model = models.User;
    return new UserService(db);
};
