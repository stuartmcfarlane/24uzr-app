var cluster = require('cluster');
var backgroundTasks = null;
var cp = require('child_process');
var config = require('./config');

function onExit( worker, code, signal ) {
    console.dir( arguments );
    cluster.fork();
}

function setupBackgroundTasks() {
    console.log('Setup background tasks...');

    backgroundTasks = cp.fork('./bin/backgroundTasks.js', [], {
        env: process.env
    });
    backgroundTasks.on('exit', setupBackgroundTasks);
}

if ( cluster.isMaster ) {
    cluster.on('exit', onExit);
    for ( var i=0; i<config.numChildren; ++i ) {
        cluster.fork();
    }

    // Setup the background tasks worker
    if ( process.env.NODE_ENV !== 'local' ) {
        setupBackgroundTasks();
    }

} else {
    require('./index.js');
}
