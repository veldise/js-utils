'use strict';

var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');

var LENGTH_BYTE = 4,
    MAX_BYTE_LENGTH = 0xFFFFF,
    endian = 'LE',
    writeMethodName = 'writeUInt' + (LENGTH_BYTE*8) + endian,
    readMethodName = 'readUInt' + (LENGTH_BYTE*8) + endian;

/**
*
*/
var parse = function (chunk) {
    return JSON.parse(chunk.toString());
};
/**
*
*/
var serialize = function (data) {
    if (_.isObject(data) && !Buffer.isBuffer(data)) {
        data = JSON.stringify(data);
    }
    var strData = data.toString(),
        dataLen = (new Buffer(strData)).length;

    if (dataLen > MAX_BYTE_LENGTH) {
        var strMaxLen = '0x' + MAX_BYTE_LENGTH.toString(16).toUpperCase();
        throw new Error('data is too big(' + dataLen + ') > ' + strMaxLen);
    }

    var len = dataLen;
    var buf = new Buffer(LENGTH_BYTE+len);

    buf[writeMethodName](len, 0);
    buf.write(strData, LENGTH_BYTE);

    return buf;
};

module.exports.parse = parse;
module.exports.serialize = serialize;

var off = function (event, listener) {
    if (arguments.length === 2) {
        this.removeListener(event, listener);
    }
    else {
        this.removeAllListeners(event);
    }
};

var send = function (packet, callback) {
    if (this.debug) {
        this._log('send', packet);
    }

    var buf, err;
    try {
        buf = this._serialize(packet);
    }
    catch (e) {
        err = e;
    }

    // send error
    if (!buf || !buf.length) {
        err = err || ('serialize fail: ' + JSON.stringify(packet));
    }
    if (err) {
        if (callback) {
            callback(err);
        }
        else {
            this.emit('error', err);
        }
        return;
    }

    // send ok
    if (callback) {
        this._enqueue(buf, callback);
    }
    else {
        return this.write(buf);
    }
};

/**
*
*/
var _onread = function (source) {
    source = source || this;

    if (!this._len) {
        var lenBuf = source.read(LENGTH_BYTE);

        if (lenBuf) {
            var len = lenBuf[readMethodName](0);

            if (len > 0) {
                this._len = len;
            }
        }
    }

    if (this._len) {
        var rawBuf = source.read(this._len);

        if (rawBuf) {
            this._len = 0;

            this._queuing(rawBuf);
        }
    }
};

var _queuing = function (chunk) {
    var packet = null;
    var err = null;

    try {
        packet = this._parse(chunk);
    }
    catch (e) {
        err = e;
    }

    if (this.debug) {
        this._log('_queuing', packet);
    }

    // parse error
    if (!packet) {
        err = err || 'parse failed.';
    }

    if (this._queue.length) {
        var delegate = this._queue[0].delegate;
        if (delegate) {
            delegate(err, packet);
        }
        else {
            this._trigger(packet);
        }

        this._dequeue();
    }
    else {
        if (err) {
            this.emit('error', err);
        }
        else {
            this._trigger(packet);
        }
    }
};

var _trigger = function (packet) {
    if (packet.type && this.listeners(packet.type).length) {
        this.emit(packet.type, packet);
    }
    else {
        this.emit('packet', packet);
    }
};

/**
*   queue에 전송할 메세지와 메세지를 받은 후 실행할 callback을 추가한다.
*   @param {string|Buffer} buf 전송할 메세지
*   @param {function} delegate 데이터를 받았을 때 수행할 작업. 주로 수신받을 데이터를 처리하는 함수를 지정.
*/
var _enqueue = function (buf, delegate) {
    this._queue.push({ buf: buf, delegate: delegate });
    if (this._queue.length === 1) {
        this.write(this._queue[0].buf);
    }
};
/**
*   queue에서 작업을 하나 제거하고 다음 작업을 수행한다.
*/
var _dequeue = function () {
    this._queue.shift();
    if (this._queue.length) {
        this.write(this._queue[0].buf);
    }
};
/**
*
*/
var _initLogger = function (logpath) {
    var filename = path.basename(require.main.filename, '.js'),
        logPath = logpath || (filename + '.log');

    this._logger = fs.createWriteStream(logPath, { flags: 'a' });
};
/**
*   file stream을 이용하여 로깅을 수행한다.
*/
var _log = function () {
    var args = _.toArray(arguments);
    var callback;
    if (_.isFunction(_.last(args))) {
        callback = _.last(args);
        args = args.slice(0, -1);
    }

    var now = (new Date()).format('[yyyy/mm/dd HH:MM:ss]');
    var strArgs = _.map(args, function (arg) {
        return JSON.stringify(arg, null, 2);
    });

    if (this._logger) {
        this._logger.write([
            now,
            this.className,
            strArgs.join(' '),
            '\n\n'
        ].join(' '), callback);
    }
};

////////////////////////////// JSON Stream //////////////////////////////

var Duplex = require('stream').Duplex;

/**
*
*/
function JSONStream (options) {
    options = options || {};

    Duplex.call(this);

    this._len = 0;
    this._queue = [];

    this.className = 'JSONStream';
    this.debug = options.debug;
    if (this.debug || options.createLogger) {
        this._initLogger(options.logpath);
    }

    // this._writable = null; // subclass member
}
util.inherits(JSONStream, Duplex);
module.exports.JSONStream = JSONStream;

JSONStream.prototype.init = function () {
    this.on('readable', this._onread.bind(this));
};

JSONStream.prototype.off = off;
JSONStream.prototype.send = send;

JSONStream.prototype._parse = parse;
JSONStream.prototype._serialize = serialize;

JSONStream.prototype._onread = _onread;
JSONStream.prototype._queuing = _queuing;
JSONStream.prototype._trigger = _trigger;

JSONStream.prototype._enqueue = _enqueue;
JSONStream.prototype._dequeue = _dequeue;

JSONStream.prototype._initLogger = _initLogger;
JSONStream.prototype._log = _log;

////////////////////////////// override //////////////////////////////

/**
*
*/
JSONStream.prototype._read = function (n) {
    if (this._readable) {
        this._readable.resume();
    }
};
/**
*
*/
JSONStream.prototype._write = function (chunk, encoding, callback) {
    try {
        this._writable.write(chunk, encoding);
    }
    catch (e) {
        this.emit('error', e);
    }

    callback();
};

////////////////////////////// string protocol //////////////////////////////

var StrProtocol = {};
StrProtocol.parse = function (chunk) {
    var lines = chunk.toString().trim().split('\n');
    var rst = {};

    _.each(lines, function (line) {
        var sp1 = line.split(':'),
            key = sp1[0],
            value = sp1[1];

        // [1,2,3]
        if (value[0] === '[' && value[value.length-1] === ']') {
            value = value.slice(1, -1).split(',');
        }
        rst[key] = value;
    });

    return rst;
};
StrProtocol.serialize = function (data) {
    if (_.isString(data)) {
        data = { data: data };
    }
    // ex) { type: 'get', arr: [ 1, 2, 3 ] }
    // => "type:get\narr:[1,2,3]\n\n"
    return _.map(data, function (value, key) {
        return key + ':' + ((_.isArray(value)) ? ('[' + value.join(',') + ']') : value);
    }).join('\n') + '\n\n';
};
exports.StrProtocol = StrProtocol;

////////////////////////////// test //////////////////////////////

if (require.main === module) {
    var buf = StrProtocol.serialize({ type: 'get', arr: [ 1, 2, 3 ] });
    console.log(JSON.stringify(buf));
    var parsed = StrProtocol.parse(buf);
    console.log(JSON.stringify(parsed, null, 2));
}

