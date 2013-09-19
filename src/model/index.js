var logger = require('../utils/logger');

module.exports = function( sequelize, config ) {
    var exports = {},
        m = {};

    // Add them to exports
    config.models.forEach( function(model, i) {
        logger('v', 'Importing '+model);
        m[model] = sequelize.import( __dirname + '/' + model );
    });

    // Define relationships
    config.models.forEach( function(modelName) {
        logger('v', 'Defining relationships for '+modelName);
        if ( typeof config.modelAssociations[modelName] !== 'undefined' ) {
            Object.keys( config.modelAssociations[modelName] ).forEach( function( assocType ) {
                var associatedWith = config.modelAssociations[modelName][assocType];
                if ( ! associatedWith instanceof Array ) {
                    associatedWith = [ associatedWith ];
                }

                associatedWith.forEach( function(assocTo) {
                    logger('v', modelName+' '+assocType+' of '+assocTo);
                    // Support second argument
                    if ( assocTo instanceof Array ) {
                        logger('v', [modelName, assocType, assocTo[0]].join(' '), assocTo[1]);
                        m[ modelName ][ assocType ]( m[ assocTo[0] ], assocTo[1] );
                    } else {
                        logger('v', [modelName, assocType, assocTo].join(' '));
                        m[ modelName ][ assocType ]( m[ assocTo ] );
                    }
                });
            });
        } else {
            throw modelName + ' cannot be found in modelAssocations scope';
        }
    });

    return m;
};
