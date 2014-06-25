'use strict';
/**
*
*/

var os = require('os'),
    fs = require('fs'),
    _ = require('underscore'),
    child_process = require('child_process');

var exec = child_process.exec,
    spawn = child_process.spawn;

////////////////////////////// functions //////////////////////////////

var setDoInterval = function (fn, time) {
    fn();
    return setInterval(fn, time);
};
/*
*   @usage
setFixInterval(function (done) {
    done(); // next work
    done(false); // stop
}, 1000);
*/
var setFixInterval = function (fn, diff, interval) {
    if (interval === undefined) {
        interval = diff;
    }
    setTimeout(function () {
        var start = new Date().getTime();

        fn(function (isNext) {
            if (isNext+'' !== 'false') {
                var diff = interval - (new Date().getTime() - start);
                diff = (diff < 0) ? 0 : diff;

                setFixInterval(fn, diff, interval);
            }
        });
    }, diff);
};
/*
*   @usage
setDoFixInterval(function (done) {
    done(); // next work
    done(false); // stop
}, 1000);
*/
var setDoFixInterval = function (fn, interval) {
    var start = new Date().getTime();

    fn(function (isNext) {
        if (isNext+'' !== 'false') {
            var diff = interval - (new Date().getTime() - start);
            diff = (diff < 0) ? 0 : diff;

            setTimeout(setFixInterval.bind(this, fn, interval), diff);
        }
    });
};

var readJSON = function (filepath, callback) {
    fs.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }

        var errParse;
        try {
            var json = JSON.parse(data);
        }
        catch (e) {
            errParse = e;
        }

        callback(errParse, json);
    });
};

var readJSONSync = function (filepath, callback) {
    var data = fs.readFileSync(filepath, 'utf8');

    return JSON.parse(data);
};

var runSpawn = function (command, args, callback) {
    if (typeof args === 'function') {
        callback = args;
        args = [];
    }

    var proc = spawn(command, args);
    var err = '';
    var out = '';

    proc.on('error', function (exception) {
        callback(exception);
        callback = function () {};
    });
    proc.stderr.on('data', function (data) {
        return err += data;
    });
    proc.stdout.on('data', function (data) {
        return out += data;
    });

    return proc.on('exit', function (code) {
        if (code === 0) {
            callback(null, out);
        } else {
            callback(err, null);
        }
    });
};

var isLocalIp = function (ip) {
    var ifaces = os.networkInterfaces();
    // { lo:
    //    [ { address: '127.0.0.1',
    //        family: 'IPv4',
    //        internal: true },
    //      { address: '::1',
    //        family: 'IPv6',
    //        internal: true } ],
    //   eth0:
    //    [ { address: '192.168.0.6',
    //        family: 'IPv4',
    //        internal: false },
    //      { address: 'fe80::a00:27ff:fe1a:e48c',
    //        family: 'IPv6',
    //        internal: false } ],
    //   eth1:
    //    [ { address: '192.168.56.105',
    //        family: 'IPv4',
    //        internal: false },
    //      { address: 'fe80::a00:27ff:feff:db9',
    //        family: 'IPv6',
    //        internal: false } ] }
    var aIfaces = _.flatten(_.values(ifaces), 0);

    return !!_.findWhere(aIfaces, { address: ip });
};

var replaceEnv = function (str) {
    var env = process.env;

    for (var key in env) {
        str = str.split('$'+key).join(env[key]);
    }

    return str;
};

// 차후 string 관련 메서드만 통합
var capitalize = function (str) {
    return str.replace(/\b([a-z])/g, function($1){
        return $1.toUpperCase();
    });
};

var err2str = function (err) {
    return err.stack || (_.isString(err)) ? err : JSON.stringify(err);
};

var extendEx = function (def, ext) {
    var rst = {};
    for (var k in def) {
        if (ext[k] === undefined) {
            rst[k] = def[k];
        }
        else if (typeof ext[k] === 'object') {
            // Recursive call
            rst[k] = _extendEx(def[k], ext[k]);
        }
        else {
            rst[k] = ext[k];
        }
    }
    return rst;
};

////////////////////////////// exports //////////////////////////////

exports.setDoInterval = setDoInterval;
exports.setFixInterval = setFixInterval;
exports.setDoFixInterval = setDoFixInterval;
exports.readJSON = readJSON;
exports.readJSONSync = readJSONSync;
exports.runSpawn = runSpawn;
exports.isLocalIp = isLocalIp;
exports.replaceEnv = replaceEnv;
exports.capitalize = capitalize;
exports.err2str = err2str;
exports.extendEx = extendEx;
