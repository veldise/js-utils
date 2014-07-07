'use strict';
//////////////////////////////////////////////////
/**
*   @file logger 를 정의하는 파일
*   @fileOverview Logger (use winston module)
*   @author choiycdev(choiycdev@mobigen.com)
*   @since: 2012/11/29
*/
//////////////////////////////////////////////////
var util = require('util'),
    path = require('path'),
    winston = require('winston'),
    _ = require('underscore');

require('../pure/date.format');
/**
*   default
*/
var def_errPath = 'exceptions.log',
    def_outPath = 'out.log',
    def_level = 'notice',
    def_maxsize = 9999900, // 약 9.5 MB
    def_maxfiles = 10,
    STACK_DEPS = 3;
/**
*   @module logger
*/
var l_logger;

/**
*   exception log와 out log가 기록될 파일 경로를 설정하여 logger를 생성한다.
*   @param {string} errPath exception log가 기록될 파일 경로
*   @param {string} logPath 기본 log가 기록될 파일 경로
*/
exports.createLogger = _createLogger;

/**
*   winston logger 를 통해 debug level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.debug = function (values) { _putLog('debug', values); };
/**
*   winston logger 를 통해 info level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.info = function (values) { _putLog('info', values); };
/**
*   winston logger 를 통해 notice level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.notice = function (values) { _putLog('notice', values); };
/**
*   winston logger 를 통해 warning level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.warning = function (values) { _putLog('warning', values); };
/**
*   winston logger 를 통해 error level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.error = function (values) { _putLog('error', values); };
/**
*   winston logger 를 통해 crit level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.crit = function (values) { _putLog('crit', values); };
/**
*   winston logger 를 통해 alert level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.alert = function (values) { _putLog('alert', values); };
/**
*   winston logger 를 통해 emerg level의 log를 기록한다.
*   @param {string|object} value log에 기록할 값들
*/
exports.emerg = function (values) { _putLog('emerg', values); };


/**
*   winston 을 사용하는 logger를 생성한다.
*   @private
*/
function _createLogger (config) {
    var level = config.level || def_level,
        errPath = config.err || def_errPath,
        outPath = config.out || def_outPath,
        maxsize = config.maxsize || def_maxsize,
        maxfiles = config.maxfiles || def_maxfiles;

    // winston.Logger 객체를 생성
    l_logger = new (winston.Logger)({
        transports: [
            // Console transport 추가
            new (winston.transports.Console)({
                level: level,
                json: false,
                colorize: true,
                prettyPrint: true
            }),

            // File transport 추가
            new (winston.transports.File)({
                // filename property 지정
                level: level,
                filename: outPath,
                maxsize: maxsize,
                maxFiles: maxfiles,
                json: false,
                prettyPrint: false,
                timestamp: false
            })
        ],

        exceptionHandlers: [
            // File transport 추가
            new (winston.transports.File)({
                filename: errPath,
                maxsize: maxsize,
                maxFiles: maxfiles,
                json: false,
                prettyPrint: true
            })
        ]
    });

    var levels = _.clone(winston.config.syslog.levels);
    // invert number
    var num = _.size(levels);
    for (var k in levels) {
        levels[k] = --num;
    }

    l_logger.setLevels(levels);
    l_logger.on('error', function (err) {
        // case1: 하드 디스크 공간이 부족한 경우
        // case2: ...
        console.error(err);
    });

    return l_logger;
}
/**
*   winston 객체를 사용하여 log를 기록한다.
*   @private
*   @desc
<br> 다음과 같은 포맷으로 log를 기록한다.
<br> level: [time] pid, "fileName", lineNumber, in methodName() >> values
<br> log는 winston logger에 의해 console 과 file 에 기록된다.
*/
function _putLog (level, values) {
    if (!l_logger) {
        // console.log('logger: set default path');
        _createLogger(def_level, def_errPath, def_outPath);
    }

    var stack_line = (new Error()).stack.toString().split('\n')[STACK_DEPS];

    var m, re;
    if (stack_line.indexOf('(') === -1) {
        // ex) at /workspace/github/MUSE/server/routes/child.js:277:16
        re = /^\s*at\s()(?:.*\/)*(.*):(\d+):\d+.*/;
    }
    else {
        // ex) at REPLServer.self.eval (repl.js:110:21)
        re = /^\s*at\s(?:\w*\.)*(.*)\s\(?(?:.*\/)*(.*):(\d+):\d+.*\)?$/;
    }
    m = re.exec(stack_line).slice(1);

    var time = (new Date()).format('yyyy/mm/dd HH:MM:ss'),
        method = (m[0]) ? m[0] + '()' : '',
        source = path.basename(m[1]),
        line = m[2];

    var outStr = util.format('[%s] \"%s\", %d, in %s >> ', time, source, line, method);

    if (_.isObject(values)) {
        values = _.object(_.map(values, function (value, key) {
            return [ key, ((_.isString(value) && value.length > 100) ?
                           (value.slice(0, 100) + '...') : value) ];
        }));
    }
    else {
        outStr += values.toString();
        values = '';//undefined;
    }

    l_logger.log(level, outStr, values);
}

/*Object.defineProperty(global, '__stack', {
    get: function(){
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function(){
          return __stack[2].getLineNumber();
    }
});*/
