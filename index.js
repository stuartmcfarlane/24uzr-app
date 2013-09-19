// Get everything ready
var config = require( './config' );
var express = require( 'express' );
var webPort = process.env.NODE_WWW_PORT || config.webPort || 8080;
var env = process.env.NODE_ENV || config.environmentName || 'development';
var initializeRoutes = require( './routes' );
var initializeApi = require( './src/api' );
var loader = require( './src/components/Loader.js' );
var Sequelize = require( 'sequelize' );
var Injector = require( './src/utils/injector' );
var passport = require( 'passport' );
var app = express();
var util = require('util');
var logger = require('./src/utils/logger');

var RedisStore = require( 'connect-redis' )( express );

// Setup ORM
var dbOptions = util._extend({
  logging: logger.bind(null, 'd')
}, config.db.options);

var sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  dbOptions);

// Get our models
// Note from richard: We have to do this for now, otherwise we cannot access other models inside a model
GLOBAL.models = require( './src/model' )( sequelize, config );

app.configure( function() {

    // static file delivery
    app.use( express[ 'static' ]( __dirname + '/public' ) );

    // application variables, part of a config block maybe?
    var injector = Injector(  __dirname + '/src/service', __dirname + '/src/controllers' );
    injector.instance( 'config', config );
    injector.instance( 'models', models );
    injector.instance( 'db', sequelize );
    app.set( 'port', webPort );
    app.set( 'injector', injector );

    // middleware stack
    app.use( express.bodyParser() );

    // session management
    app.use( express.cookieParser() );
    app.use( express.session({
      secret: config.secretKey,
      cookie: { secure: false, maxAge: 86400000 },
      store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        prefix: config.redis.prefix+process.env.NODE_ENV+"_",
        password: config.redis.key
      })
    }));

    // Enable CORS
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Headers", "x-requested-with, content-type");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Max-Age", "1000000000");
      // intercept OPTIONS method
      if ('OPTIONS' == req.method) {
        res.send(200);
      }
      else {
        next();
      }
    });

    app.use( express.logger('dev') );
    app.use( express.compress() );
    app.use( express.favicon() );
    app.use( express.methodOverride() );

    app.use( passport.initialize() );
    app.use( passport.session() );

    app.use( app.router );

    app.set( 'views', __dirname + '/src/views' );
    app.set( 'view engine', 'ejs' );
    app.set( 'view options', {
      layout: false
    });

    // error handler, outputs json since that's usually
    // what comes out of this thing
    app.use(function( err, req, res, next ) {
      logger('e', 'Express error catch', err);
      res.json(500, {
        error: err.toString()
      });
    });
  });

//

// register application routes
initializeRoutes( app );
initializeApi( app );

module.exports = app;

// if (require.main == module) {
  app.listen(webPort, function() {
    logger('v', 'Starting server on port ' + webPort + ' in ' + config.environmentName + ' mode');
  });
// }
