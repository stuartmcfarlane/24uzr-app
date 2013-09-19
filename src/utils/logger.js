'use strict';

var options = require('../../config').log;

var verboseLogger = console.log.bind(undefined, '[info]');
var dataLogger = console.log.bind(undefined, '[data]');
var errorLogger = console.error.bind(undefined, '[error]');

var loggersByChannel = {
    v: verboseLogger,
    d: dataLogger,
    e: errorLogger
};

function mux(flags) {
    var channels = [];
    var i;
    for (i=0; i<flags.length; i++) {
        var f = flags[i];
        if (options[f] && loggersByChannel[f]) {
            channels.push(loggersByChannel[f]);
        }
    }
    return channels;
}

function log(flags, data) {
    mux(flags).forEach(function(channel) {
        channel(data);
    });
}

function logger() {
    var flags = arguments[0];
    var data = Array.prototype.slice.call(arguments, 1);
    log(flags, data);
}

module.exports = logger;
