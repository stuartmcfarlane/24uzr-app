var secretPath = __dirname + '/../../24uzr-config/24uzr-app';
var files = [ __dirname + '/global.json', __dirname + '/orm.json' ]
  , fs = require( 'fs' )
  , envConfigOverride = secretPath + '/' + (process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'local') + '.json';

if ( fs.existsSync( envConfigOverride ) ) {
	files.push( envConfigOverride );
} else {
	throw new Error( 'Error: No configuration for environment: ' + process.env.NODE_ENV );
}

module.exports = require( 'nconf' ).loadFilesSync( files );